import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/* Default config: no incremental cache binding yet.

   Consequence: `revalidateTag` (used by the admin inventory editor to push
   price edits live) works per-isolate rather than globally, and ISR pages fall
   back to their 5-minute revalidate window across isolates. Fine at launch
   volume — worst case a price edit takes up to 5 minutes to reach every edge
   isolate instead of being instant everywhere.

   To make it instant globally, add an R2 incremental cache + queue here.
   Documented in docs/DEPLOY.md under "Post-launch". */
export default defineCloudflareConfig();
