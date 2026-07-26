/* Keeps the Supabase project awake.

   Supabase pauses free-tier projects after one week with no activity. Nothing
   on this site touches the database unless somebody visits — the catalogue is
   cached — so a genuinely quiet week would put the database to sleep and the
   shop would stop loading its products. This runs daily and makes one trivial
   read, which counts as activity.

   Deliberately a SEPARATE Worker from the site. The site's Worker is generated
   by OpenNext, and adding a scheduled handler to it would mean modifying
   generated output — risking the thing that actually takes money. This has no
   route, serves no traffic, and cannot affect the shop.

   It queries Supabase directly rather than hitting the site, because a page
   request can be answered from cache without ever reaching the database, which
   would defeat the point. */

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

async function ping(env: Env): Promise<{ ok: boolean; status: number; detail: string }> {
  // The lightest possible real read: one id from the public catalogue. RLS
  // already allows this for anonymous callers, so no privileged key is needed.
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
    },
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, detail: body.slice(0, 120) };
}

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      ping(env).then((r) => {
        // Cloudflare keeps these in `wrangler tail`; a failure here means the
        // database is unreachable, which is worth seeing.
        if (r.ok) console.log(`db-keepalive ok (${r.status})`);
        else console.error(`db-keepalive FAILED ${r.status}: ${r.detail}`);
      })
    );
  },

  /* Manual check: `curl https://<worker>.workers.dev` runs the same query and
     reports the result, so the ping can be verified without waiting a day. No
     secrets are returned. */
  async fetch(_req: Request, env: Env): Promise<Response> {
    const r = await ping(env);
    return Response.json(
      { service: "db-keepalive", databaseReachable: r.ok, status: r.status },
      { status: r.ok ? 200 : 503 }
    );
  },
};
