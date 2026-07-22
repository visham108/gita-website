import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import EditionsGrid from "@/components/EditionsGrid";

export const metadata: Metadata = {
  title: "The Book — Editions, Sample & Reading Guide",
  description:
    "Everything inside Bhagavad-gītā As It Is: original Sanskrit, word-for-word meanings, translations and purports. Complete hardcover edition, shipped across India.",
};

const LAYERS = [
  { badge: "Layer 1", title: "Devanagari Text", body: <>The original Sanskrit as it has been chanted for millennia — beautiful, precise, and sonorous. <span className="sanskrit" style={{ color: "var(--ink)" }}>धर्मक्षेत्रे कुरुक्षेत्रे…</span></> },
  { badge: "Layer 2", title: "Roman Transliteration", body: <>Standard diacritics let you pronounce and even chant every verse — <em>dharma-kṣetre kuru-kṣetre</em> — no Sanskrit background needed.</> },
  { badge: "Layer 3", title: "Word-for-Word Meanings", body: <>Every Sanskrit word glossed individually, so you can verify the translation yourself. Total transparency — rare among Gītā editions.</> },
  { badge: "Layer 4", title: "Translation", body: <>Clear, dignified English that stays faithful to the text — trusted by universities and seekers alike for over fifty years.</> },
  { badge: "Layer 5", title: "Purport", body: <>Śrīla Prabhupāda&rsquo;s commentary — drawing on the great ācāryas before him — unfolds each verse&rsquo;s meaning and shows how to live it today.</> },
];

const FAQ = [
  { q: "Do I need any background in Hinduism or Sanskrit to read this book?", a: "None at all. The book was written expressly for readers meeting this wisdom for the first time. Every Sanskrit term is translated and explained, an introduction sets the scene, and the purports assume no prior knowledge — only sincere curiosity.", open: true },
  { q: "How is this edition different from other Bhagavad-gītās?", a: "Most editions present the translator's own philosophy through the Gītā. Bhagavad-gītā As It Is presents the Gītā through its own tradition — the unbroken line of teachers descending from Kṛṣṇa Himself. It is also unusually complete: original Sanskrit, transliteration, word-for-word meanings, translation, and full commentary for all 700 verses." },
  { q: "Is this a religious book? I'm not looking to convert to anything.", a: "The Gītā is a book of knowledge — about consciousness, action, time, death, and love. It asks for your attention, not your allegiance. Millions read it as philosophy, as literature, as a manual for living. What you do with its conclusions remains entirely, and deliberately, up to you." },
  { q: "Which edition do you sell?", a: "The complete hardcover — the edition readers overwhelmingly choose for study. It lies flat, lasts decades, and holds up to a lifetime of underlining. Sewn binding, colour plates, and all 700 verses unabridged." },
  { q: "How long does it take to read?", a: "Cover to cover at a steady pace, most first-time readers take three to six months with the purports. Our 18-week guided course paces the whole book with lessons and discussion. But the honest answer is: a lifetime — the Gītā is a book one rereads forever, and it reads differently at every stage of life." },
  { q: "Can I order the book from this site?", a: "Yes. Order the hardcover here and pay securely by UPI, card or netbanking. We ship across India, and you receive an order number and email confirmation straight away. The book has been in continuous print for over fifty years and is also available worldwide through BBT centers and major booksellers." },
];

export default function BookPage() {
  return (
    <main id="main">
      {/* ============ PAGE HERO ============ */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">The Book</li>
            </ol>
          </nav>
          <div className="grid-2" style={{ alignItems: "center", gap: "var(--space-8)" }}>
            <div>
              <p className="eyebrow">The Complete Edition</p>
              <h1>A library of wisdom<br />in a single volume</h1>
              <p className="lede mb-5">
                More than a translation, Bhagavad-gītā As It Is is a complete apparatus for
                understanding: every verse in the original Sanskrit, rendered word by word,
                translated with precision, and illuminated by purports that speak directly
                to your life.
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <a className="btn btn--gold btn--lg" href="#editions">Choose an Edition</a>
                <a className="btn btn--ghost-dark btn--lg" href="#sample">Read a Sample</a>
              </div>
            </div>
            <div className="book-scene">
              <div className="book book--static">
                <Image
                  src="/images/bgaii-cover.jpg"
                  alt="Bhagavad-gītā As It Is — original cover painting of Lord Kṛṣṇa driving Arjuna's chariot at Kurukṣetra"
                  width={241}
                  height={413}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT'S INSIDE ============ */}
      <section className="section" id="inside">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow">Anatomy of a Verse</p>
            <h2 className="display-md">Five layers of understanding</h2>
            <p className="lede">Each of the 700 verses is presented in five parts, so that nothing stands
              between you and Kṛṣṇa&rsquo;s words — yet nothing is left unexplained.</p>
          </div>
          <div className="grid-3">
            {LAYERS.map((layer, i) => (
              <article className="card reveal" data-delay={i % 3 || undefined} key={layer.badge}>
                <span className="badge mb-4">{layer.badge}</span>
                <h3>{layer.title}</h3>
                <p>{layer.body}</p>
              </article>
            ))}
            <article className="card card--night reveal" data-delay="2">
              <span className="badge mb-4" style={{ background: "rgba(255,217,163,.16)", color: "var(--gold-bright)" }}>Plus</span>
              <h3>Complete Apparatus</h3>
              <p>Setting-the-scene introduction, 48 color plates, glossary, Sanskrit pronunciation guide, and indexes of verses and subjects.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ SAMPLE READING ============ */}
      <section className="section section--night-deep" id="sample">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="center mb-6 reveal">
            <p className="eyebrow">Read a Sample</p>
            <h2 className="display-md">Taste the nectar first</h2>
            <p className="lede">Here is how a single verse unfolds inside the book — sampled from Chapter 2,
              the heart of the Gītā&rsquo;s teaching on the eternal soul.</p>
          </div>
          <article className="verse-card reveal" style={{ padding: "clamp(1.8rem, 4vw, 3rem)" }}>
            <span className="verse-card__ref">Bhagavad-gītā 2.20</span>
            <p className="sanskrit" style={{ fontSize: "var(--text-lg)", textAlign: "center" }}>
              न जायते म्रियते वा कदाचिन्<br />नायं भूत्वा भविता वा न भूयः ।<br />
              अजो नित्यः शाश्वतोऽयं पुराणो<br />न हन्यते हन्यमाने शरीरे ॥
            </p>
            <p className="iast" style={{ textAlign: "center" }}>
              na jāyate mriyate vā kadācin<br />nāyaṁ bhūtvā bhavitā vā na bhūyaḥ<br />
              ajo nityaḥ śāśvato &rsquo;yaṁ purāṇo<br />na hanyate hanyamāne śarīre
            </p>
            <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--moon-faint)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>Word for word</p>
            <p className="iast" style={{ fontSize: "var(--text-sm)", textAlign: "center", color: "var(--moon-soft)" }}>
              na — never; jāyate — takes birth; mriyate — dies; vā — either; kadācit — at any time;
              na — never; ayam — this; bhūtvā — having come into being; bhavitā — will come to be;
              vā — or; na — not; bhūyaḥ — again; ajaḥ — unborn; nityaḥ — eternal; śāśvataḥ — permanent;
              ayam — this; purāṇaḥ — the oldest; na — never; hanyate — is killed; hanyamāne — being killed;
              śarīre — the body.
            </p>
            <hr style={{ border: "none", borderTop: "1px solid var(--line-dark)", margin: "var(--space-5) 0" }} />
            <p className="verse-card__translation" style={{ textAlign: "center" }}>
              For the soul there is never birth nor death. It has not come into being, does not come
              into being, and will not come into being. It is unborn, eternal, ever-existing and
              primeval. It is not slain when the body is slain.
            </p>
            <p className="mt-5" style={{ color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
              <strong style={{ color: "var(--gold-bright)", letterSpacing: ".14em", textTransform: "uppercase", fontSize: "var(--text-xs)" }}>From the purport&nbsp;·&nbsp;</strong>
              The purport to this verse spans several pages, drawing on the Kaṭha and Śvetāśvatara
              Upaniṣads to establish the soul&rsquo;s nature: an atomic, conscious particle of spirit,
              measurable by no material instrument, situated within the heart and spreading
              consciousness throughout the body. In the full edition, every such purport is present,
              unabridged. <em>(Sample paraphrased — the complete text awaits you in the book.)</em>
            </p>
          </article>
          <div className="center mt-6 reveal">
            <a className="btn btn--gold btn--lg" href="#editions">Continue Reading — Get the Book</a>
          </div>
        </div>
      </section>

      {/* ============ EDITIONS / SHOP ============ */}
      <section className="section" id="editions">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow">The Edition</p>
            <h2 className="display-md">Bring the Gītā home</h2>
            <p className="lede">The complete hardcover — all 700 verses unabridged, with the original
              Sanskrit, word-for-word meanings and full purports. Shipped across India.</p>
          </div>
          <EditionsGrid />
          <div className="grid-3 mt-7">
            <div className="card reveal" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "var(--text-md)" }}>🎁 Give the Gītā</h3>
              <p>Add gift wrap and a handwritten inscription card at checkout. A gift measured in lifetimes, not pages.</p>
            </div>
            <div className="card reveal" data-delay="1" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "var(--text-md)" }}>📦 Bulk &amp; Sponsorship</h3>
              <p>Sponsor sets for schools, libraries, prisons and hotels — from 10 to 10,000 copies. Contact us for distribution pricing.</p>
            </div>
            <div className="card reveal" data-delay="2" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "var(--text-md)" }}>🌍 89 Languages</h3>
              <p>Looking for Hindi, Spanish, Russian, Chinese or another language? International editions ship from regional BBT centers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ READING GUIDE ============ */}
      <section className="section section--cream" id="guide">
        <div className="container">
          <div className="grid-2" style={{ gap: "var(--space-8)", alignItems: "start" }}>
            <div className="reveal">
              <p className="eyebrow">How to Read It</p>
              <h2 className="display-md">A guide for your first journey</h2>
              <p className="lede mb-5">The Gītā rewards every kind of reader — but fifty years of readers
                have found some paths smoother than others. Three suggested approaches:</p>
              <div className="stack-4">
                <div className="card">
                  <h3 style={{ fontSize: "var(--text-md)" }}>1 · The Pilgrim&rsquo;s Path <span className="badge badge--sage" style={{ marginLeft: ".5em" }}>18 weeks</span></h3>
                  <p>One chapter per week, reading translation and purports together. Pairs perfectly with our <Link href="/course" style={{ color: "var(--gold-deep)", fontWeight: 600 }}>free guided course</Link>. The most complete first reading.</p>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: "var(--text-md)" }}>2 · The Essence First <span className="badge" style={{ marginLeft: ".5em" }}>2 weeks</span></h3>
                  <p>Begin with Chapters 2, 9, and 18 — the summary, the king of knowledge, and the conclusion — then return to the beginning with the destination in view.</p>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: "var(--text-md)" }}>3 · A Verse a Day <span className="badge badge--night" style={{ marginLeft: ".5em", color: "var(--moon)" }}>Daily practice</span></h3>
                  <p>One verse with its purport each morning — under ten minutes. Two years later, you will have read the entire Gītā slowly, deeply, and twice.</p>
                </div>
              </div>
            </div>
            <div className="reveal" data-delay="1">
              <div className="card card--night" style={{ padding: "var(--space-7)" }}>
                <p className="eyebrow" style={{ color: "var(--gold-bright)" }}>Wisdom for Reading Wisdom</p>
                <h3 style={{ fontSize: "var(--text-lg)" }}>Before you open the book</h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-4)", color: "var(--moon-soft)", fontSize: "var(--text-sm)" }}>
                  <li style={{ display: "flex", gap: ".8em" }}><span style={{ color: "var(--gold-bright)" }}>✦</span> Read a little every day rather than a lot occasionally. The Gītā is a practice, not a sprint.</li>
                  <li style={{ display: "flex", gap: ".8em" }}><span style={{ color: "var(--gold-bright)" }}>✦</span> Read the purports. They are where the book becomes a teacher.</li>
                  <li style={{ display: "flex", gap: ".8em" }}><span style={{ color: "var(--gold-bright)" }}>✦</span> Try reading the transliteration aloud. The sound of the Gītā is part of the Gītā.</li>
                  <li style={{ display: "flex", gap: ".8em" }}><span style={{ color: "var(--gold-bright)" }}>✦</span> Keep a notebook — or use the <Link href="/explorer" style={{ color: "var(--gold-bright)" }}>Verse Explorer</Link> to bookmark and annotate as you go.</li>
                  <li style={{ display: "flex", gap: ".8em" }}><span style={{ color: "var(--gold-bright)" }}>✦</span> Ask questions. Join a local or online study group; the Gītā was spoken in dialogue and is best studied in one.</li>
                </ul>
                <Link className="btn btn--gold btn--block mt-6" href="/course">Study With Guidance — Free</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="center mb-6 reveal">
            <p className="eyebrow">Questions, Answered</p>
            <h2 className="display-md">Frequently asked questions</h2>
          </div>
          <div className="accordion reveal">
            {FAQ.map((item) => (
              <details className="accordion__item" key={item.q} open={item.open}>
                <summary>{item.q}</summary>
                <div className="accordion__body">{item.a}</div>
              </details>
            ))}
          </div>
          <div className="center mt-7 reveal">
            <div className="cta-band">
              <h2 style={{ fontSize: "var(--text-xl)" }}>Still deciding? Let the book decide.</h2>
              <p className="lede">Open the Verse Explorer, read three verses, and notice what happens.</p>
              <Link className="btn btn--gold btn--lg" href="/explorer">Open the Verse Explorer</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
