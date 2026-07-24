/** Defensive JSON body reading for public API routes.

    Every route already wrapped `request.json()` in try/catch, which covers
    malformed input — but `json()` *succeeds* on the literal `null`, on a bare
    string, on a number and on an array. The routes then read `body.email` off
    that value and a junk request became a 500 rather than a 400. Anything that
    is not a plain object is rejected here so each route can answer cleanly.

    The size cap is checked before parsing: these endpoints are unauthenticated,
    and there is no legitimate reason for a checkout or signup payload to run to
    kilobytes. Content-Length is advisory (absent under chunked encoding), so
    the decoded text is measured as well. */
const DEFAULT_MAX_BYTES = 16_384; // 16 KB — a full gift order is well under 2 KB

export async function readJsonObject<T = Record<string, unknown>>(
  request: Request,
  maxBytes: number = DEFAULT_MAX_BYTES
): Promise<T | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;

  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (text.length > maxBytes) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  return parsed as T;
}
