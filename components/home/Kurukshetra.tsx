/* The chariot at Kurukṣetra — an original vector illustration.

   Deliberately not calendar art. The scene is built from geometry: a spoked
   wheel that doubles as the dharma-cakra, horses reduced to line and motion,
   the two figures held as silhouettes. Rendered in the site's own flame-and-
   gold palette on the midnight surface, so it belongs to the page rather than
   sitting on it like a stock image.

   Authored here rather than sourced: no licence question, it scales to any
   width, and it needs no external request (the CSP would block one anyway).

   Everything is stroked in currentColor or explicit palette hex so it reads
   correctly on the night surface it lives on. */

export default function Kurukshetra() {
  return (
    <svg
      className="kurukshetra"
      viewBox="0 0 840 560"
      role="img"
      aria-labelledby="ks-title ks-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="ks-title">Kṛṣṇa and Arjuna on the chariot at Kurukṣetra</title>
      <desc id="ks-desc">
        A line illustration: a war chariot drawn by four horses stands between two armies,
        beneath a radiating sun. Kṛṣṇa holds the reins; Arjuna sits behind him with his bow
        set down.
      </desc>

      <defs>
        <linearGradient id="ks-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#201c33" />
          <stop offset="100%" stopColor="#100e1c" />
        </linearGradient>
        <radialGradient id="ks-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9a3" stopOpacity="0.30" />
          <stop offset="55%" stopColor="#eda75c" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#9c4610" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ks-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9c4610" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#9c4610" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="840" height="560" rx="18" fill="url(#ks-sky)" />

      {/* ---- the sun: rays, then disc, then concentric rings ---- */}
      <g stroke="#eda75c" strokeWidth="1" opacity="0.30">
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 36;
          const x = 420 + Math.cos(a) * 128;
          const y = 236 + Math.sin(a) * 128;
          const x2 = 420 + Math.cos(a) * (i % 3 === 0 ? 196 : 158);
          const y2 = 236 + Math.sin(a) * (i % 3 === 0 ? 196 : 158);
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="420" cy="236" r="200" fill="url(#ks-sun)" />
      <circle cx="420" cy="236" r="120" fill="none" stroke="#ffd9a3" strokeWidth="1.4" opacity="0.55" />
      <circle cx="420" cy="236" r="104" fill="none" stroke="#eda75c" strokeWidth="0.8" opacity="0.35" />
      <circle cx="420" cy="236" r="86" fill="none" stroke="#eda75c" strokeWidth="0.5" opacity="0.22" />

      {/* ---- the two armies: standards receding to either side ---- */}
      <g stroke="#b3a68f" strokeLinecap="round">
        {Array.from({ length: 26 }).map((_, i) => {
          const left = i < 13;
          const k = left ? i : i - 13;
          const x = left ? 40 + k * 21 : 800 - k * 21;
          const h = 34 + ((k * 7) % 26);
          const o = 0.10 + (13 - k) * 0.022;
          return (
            <g key={i} opacity={o}>
              <line x1={x} y1={392} x2={x} y2={392 - h} strokeWidth="1.4" />
              {k % 3 === 0 && (
                <path
                  d={`M${x} ${392 - h} l${left ? 13 : -13} 5 l${left ? -13 : 13} 5 z`}
                  fill="#9c4610"
                  stroke="none"
                  opacity="0.75"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* ---- ground ---- */}
      <rect x="0" y="392" width="840" height="168" fill="url(#ks-ground)" />
      <line x1="0" y1="392" x2="840" y2="392" stroke="#eda75c" strokeWidth="1" opacity="0.35" />

      {/* ---- four horses, reduced to arcs of motion ---- */}
      <g stroke="#f7f0e2" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        {[0, 1, 2, 3].map((i) => {
          const x = 150 + i * 26;
          const y = 392 - i * 5;
          return (
            <g key={i} opacity={1 - i * 0.16}>
              {/* body */}
              <path d={`M${x} ${y - 62} c26 -16 54 -14 72 4 c8 8 10 18 6 26`} />
              {/* neck + head */}
              <path d={`M${x} ${y - 62} c-14 -10 -20 -26 -16 -42 c2 -8 10 -12 16 -8 l10 8`} />
              {/* mane */}
              <path d={`M${x - 12} ${y - 100} c8 -6 18 -4 24 4`} strokeWidth="1.4" opacity="0.7" />
              {/* fore + hind legs, mid-stride */}
              <path d={`M${x + 8} ${y - 36} l-10 22 l6 14`} />
              <path d={`M${x + 34} ${y - 32} l4 24 l-6 14`} />
              <path d={`M${x + 62} ${y - 34} l10 22 l-4 14`} />
              {/* tail */}
              <path d={`M${x + 78} ${y - 56} c14 6 20 20 16 34`} strokeWidth="1.4" opacity="0.75" />
            </g>
          );
        })}
      </g>

      {/* ---- yoke and reins running back to the driver ---- */}
      <g stroke="#eda75c" strokeWidth="1.6" fill="none" opacity="0.8">
        <path d="M232 316 C300 300 360 300 424 316" />
        <path d="M236 330 C304 318 366 318 424 330" opacity="0.6" />
      </g>

      {/* ---- chariot ---- */}
      <g>
        {/* shaft */}
        <path d="M228 352 L470 352" stroke="#d9cdb9" strokeWidth="3" strokeLinecap="round" />
        {/* body */}
        <path
          d="M456 352 L560 352 L574 300 C574 292 568 286 560 286 L470 286 C462 286 456 292 456 300 Z"
          fill="#171425"
          stroke="#f7f0e2"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* rail detail */}
        <path d="M470 300 L562 300" stroke="#eda75c" strokeWidth="1.2" opacity="0.55" />
        <path d="M470 314 L566 314" stroke="#eda75c" strokeWidth="1" opacity="0.35" />

        {/* the wheel — also the cakra */}
        <g transform="translate(516 372)">
          <circle r="56" fill="none" stroke="#ffd9a3" strokeWidth="2.6" />
          <circle r="46" fill="none" stroke="#eda75c" strokeWidth="1" opacity="0.6" />
          <circle r="9" fill="none" stroke="#ffd9a3" strokeWidth="2.2" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 16;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 9}
                y1={Math.sin(a) * 9}
                x2={Math.cos(a) * 46}
                y2={Math.sin(a) * 46}
                stroke="#eda75c"
                strokeWidth="1.2"
                opacity="0.75"
              />
            );
          })}
        </g>

        {/* banner rising from the chariot */}
        <path d="M566 286 L566 176" stroke="#d9cdb9" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M566 182 C596 190 616 182 634 190 C620 204 604 210 566 214 Z"
          fill="#9c4610"
          stroke="#eda75c"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>

      {/* ---- Kṛṣṇa: standing at the reins, peacock plume ---- */}
      <g stroke="#ffd9a3" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="486" cy="238" r="15" fill="#171425" />
        {/* plume */}
        <path d="M486 223 C482 210 486 199 496 194" strokeWidth="1.8" />
        <path d="M496 194 c6 -3 10 1 8 7 c-2 5 -8 6 -12 2" strokeWidth="1.6" />
        {/* torso */}
        <path d="M486 253 L486 288" />
        {/* arms holding the reins forward */}
        <path d="M486 262 C470 266 452 288 428 316" />
        <path d="M486 268 C472 274 458 296 430 330" strokeWidth="2" opacity="0.85" />
        {/* dhoti */}
        <path d="M472 288 L500 288 L494 300 L478 300 Z" fill="#9c4610" stroke="#eda75c" strokeWidth="1.4" />
      </g>

      {/* ---- Arjuna: seated behind, bow set down ---- */}
      <g stroke="#f7f0e2" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
        <circle cx="536" cy="250" r="13" fill="#171425" />
        {/* bowed head + shoulders */}
        <path d="M536 263 C534 274 532 280 530 290" />
        <path d="M522 274 C532 270 544 270 552 276" />
        {/* the bow, lowered across the chariot floor */}
        <path d="M508 296 C528 282 556 282 574 298" stroke="#eda75c" strokeWidth="2" />
        <path d="M508 296 L574 298" stroke="#eda75c" strokeWidth="0.9" opacity="0.6" />
      </g>

      {/* ---- dust ---- */}
      <g fill="#eda75c" opacity="0.28">
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 60 + ((i * 137) % 720);
          const y = 400 + ((i * 53) % 130);
          return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 2 : 1.2} />;
        })}
      </g>
    </svg>
  );
}
