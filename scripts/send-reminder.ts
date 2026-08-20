/* Same-day reminder to everyone signed up for the live session.

   Sends INDIVIDUALLY rather than by BCC, deliberately: each person needs their
   own unsubscribe link, and their own List-Unsubscribe header, so Gmail shows
   its native unsubscribe control instead of people reaching for "report spam".
   That matters here — this list shares a sending domain with order
   confirmations, and complaints against it would damage those too.

   DRY RUN BY DEFAULT. Nothing sends without --send. Run it first without the
   flag to see exactly who would be mailed.

     npx tsx scripts/send-reminder.ts            # preview only
     npx tsx scripts/send-reminder.ts --send     # actually send

   Resend's free tier allows 100 emails/day; this sends one per signup, so the
   ceiling is 100 recipients in a day. The script stops short of that rather
   than half-sending a batch.
*/

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/* .env.local is not loaded automatically outside Next, and these values must
   never be echoed — only their presence is reported. */
function loadEnv(): void {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

const DAILY_CAP = 100;

async function main(): Promise<void> {
  loadEnv();
  const send = process.argv.includes("--send");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  for (const [k, v] of Object.entries({
    NEXT_PUBLIC_SUPABASE_URL: url,
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
    RESEND_API_KEY: resendKey,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
  })) {
    if (!v) {
      console.error(`Missing ${k} in .env.local — aborting.`);
      process.exit(1);
    }
  }

  /* Imported AFTER loadEnv so SITE_URL and FROM read the real values. */
  const { courseReminderEmail, unsubscribeUrl, unsubscribePostUrl, sendEmail } = await import(
    "../lib/email"
  );

  const res = await fetch(
    `${url}/rest/v1/signups?kind=eq.course&select=id,email,name&order=created_at.asc`,
    { headers: { apikey: serviceKey!, Authorization: `Bearer ${serviceKey}` } }
  );
  if (!res.ok) {
    console.error(`Supabase query failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const rows = (await res.json()) as { id: string; email: string; name: string | null }[];

  console.log(`\n${rows.length} people signed up.\n`);
  rows.forEach((r, i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${r.email}${r.name ? `  (${r.name})` : ""}`)
  );

  const sample = courseReminderEmail("https://example.invalid/unsub", rows[0]?.name);
  console.log(`\nSubject: ${sample.subject}`);

  if (rows.length > DAILY_CAP) {
    console.error(
      `\n${rows.length} recipients exceeds the ${DAILY_CAP}/day Resend free tier. ` +
        `Sending would fail partway and leave some people un-mailed. Upgrade Resend first.`
    );
    process.exit(1);
  }

  if (!send) {
    console.log(`\nDRY RUN — nothing sent. Re-run with --send to actually send.\n`);
    return;
  }

  console.log(`\nSending…\n`);
  let ok = 0;
  const failed: string[] = [];

  for (const r of rows) {
    const mail = courseReminderEmail(unsubscribeUrl(r.id), r.name);
    const sent = await sendEmail(r.email, mail.subject, mail.html, {
      "List-Unsubscribe": `<${unsubscribePostUrl(r.id)}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
    if (sent) {
      ok++;
      console.log(`  sent   ${r.email}`);
    } else {
      failed.push(r.email);
      console.log(`  FAILED ${r.email}`);
    }
    /* Resend allows 2 requests/second on the free tier. */
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\n${ok} sent, ${failed.length} failed.`);
  if (failed.length) console.log(`Failed: ${failed.join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
