/* The supplied Kurukṣetra painting, served responsively.

   Next's image optimizer is unavailable on this deployment (/_next/image 404s
   on Workers), so the derivatives are pre-generated into public/images and
   offered through srcset instead — WebP for anything modern, JPEG as the
   fallback. The source PNG was 1.87 MB; the widest WebP is 78 KB.

   width/height are declared so the browser reserves the right box before the
   file arrives and the page doesn't shift. object-position sits right of centre
   because the chariot and figures occupy the right of the frame — as the band
   narrows, they are what must stay in view. */

const WIDTHS = [640, 960, 1280, 1672] as const;

const srcSet = (ext: "webp" | "jpg") =>
  WIDTHS.map((w) => `/images/kurukshetra-scene-${w}.${ext} ${w}w`).join(", ");

export default function Kurukshetra() {
  return (
    <picture>
      <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
      <img
        src="/images/kurukshetra-scene-1280.jpg"
        srcSet={srcSet("jpg")}
        sizes="100vw"
        width={1672}
        height={941}
        loading="lazy"
        decoding="async"
        alt="Kṛṣṇa, standing at the front of the chariot with one hand raised, speaks to Arjuna, who sits beside him in armour. Behind them a saffron banner; below, the armies of Kurukṣetra spread across the plain at sunrise."
      />
    </picture>
  );
}
