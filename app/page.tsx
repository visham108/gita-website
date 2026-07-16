import Link from "next/link";
import { GITA_CHAPTERS } from "@/lib/data";
import VerseOfTheDay from "@/components/home/VerseOfTheDay";
import Anatomy from "@/components/home/Anatomy";
import EditionsGrid from "@/components/EditionsGrid";
import DemoForm from "@/components/DemoForm";

const SPREADS = [
  {
    ref: "2.47 · On action",
    iast: "karmaṇy evādhikāras te mā phaleṣu kadācana",
    translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
    flip: false,
  },
  {
    ref: "9.22 · On protection",
    iast: "ananyāś cintayanto māṁ ye janāḥ paryupāsate",
    translation: "To those who worship Me with exclusive devotion — I carry what they lack, and I preserve what they have.",
    flip: true,
  },
  {
    ref: "18.66 · The final word",
    iast: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja",
    translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    flip: false,
  },
];

const VOICES = [
  {
    quote: "In the morning I bathe my intellect in the stupendous and cosmogonal philosophy of the Bhagvat Geeta… in comparison with which our modern world and its literature seem puny and trivial.",
    name: "Henry David Thoreau",
    source: "Walden, 1854",
  },
  {
    quote: "I owed a magnificent day to the Bhagavat Geeta. It was the first of books; it was as if an empire spake to us.",
    name: "Ralph Waldo Emerson",
    source: "Journals, 1831",
  },
  {
    quote: "When doubts haunt me, when disappointments stare me in the face, and I see not one ray of hope on the horizon, I turn to Bhagavad-gītā and find a verse to comfort me.",
    name: "Mohandas K. Gandhi",
    source: "Young India, 1925",
  },
];

const TIMELINE = [
  { year: "1896 · Calcutta", text: "Born Abhay Charan De, on the day after Janmāṣṭamī, the appearance day of Lord Kṛṣṇa." },
  { year: "1922 · First Meeting", text: "Meets his spiritual master, Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura, who requests him to spread Kṛṣṇa's message in English." },
  { year: "1965 · The Crossing", text: "At age 69, sails alone to New York aboard the steamship Jaladuta, suffering two heart attacks en route." },
  { year: "1968 · The Gītā Published", text: "Macmillan publishes Bhagavad-gītā As It Is; the complete edition follows in 1972. It becomes the best-selling edition of the Gītā in the Western world." },
  { year: "1966–1977 · A World Movement", text: "Founds ISKCON, circles the globe fourteen times, and writes seventy volumes — translating the Gītā's wisdom into a living, worldwide culture of devotion." },
];

function Mandala() {
  const petals = Array.from({ length: 11 }, (_, i) => (i + 1) * 30);
  return (
    <svg className="hero__mandala" viewBox="0 0 400 400" aria-hidden="true" fill="none" stroke="currentColor">
      <g strokeWidth="0.8">
        <circle cx="200" cy="200" r="196" opacity="0.5" />
        <circle cx="200" cy="200" r="168" />
        <circle cx="200" cy="200" r="118" opacity="0.7" />
        <circle cx="200" cy="200" r="64" opacity="0.6" />
        <g id="petals">
          <path d="M200 32 C 228 92, 228 148, 200 200 C 172 148, 172 92, 200 32 Z" />
        </g>
        {petals.map((deg) => (
          <use key={deg} href="#petals" transform={`rotate(${deg} 200 200)`} />
        ))}
      </g>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <div className="hero__bg" aria-hidden="true" />
        <Mandala />
        <div className="container hero__inner">
          <div>
            <p className="hero__sanskrit">श्रीमद्भगवद्गीता · धर्मक्षेत्रे कुरुक्षेत्रे</p>
            <h1 className="hero__title">
              <span className="line"><span>The song of the Divine,</span></span>
              <span className="line"><span><em>presented as it is.</em></span></span>
            </h1>
            <p className="hero__lede">
              Five thousand years ago, on a battlefield at the crossroads of history, Śrī Kṛṣṇa spoke
              seven hundred verses that changed the world. <strong>Bhagavad-gītā As It Is</strong> by
              His Divine Grace A.C.&nbsp;Bhaktivedanta Swami Prabhupāda delivers that conversation
              undiluted — as it was spoken, as it has been carried, as it is.
            </p>
            <div className="hero__ctas">
              <Link className="btn btn--gold btn--lg" href="/book#editions">Get the Book</Link>
              <Link className="btn btn--ghost-dark btn--lg" href="/explorer">Begin Reading — Free</Link>
            </div>
            <div className="hero__proof">
              <div className="proof-item"><strong>700</strong><span>Sanskrit verses</span></div>
              <div className="proof-item"><strong>80+</strong><span>Languages</span></div>
              <div className="proof-item"><strong>30M+</strong><span>Copies in print</span></div>
              <div className="proof-item"><strong>5,000</strong><span>Years of wisdom</span></div>
            </div>
          </div>
          <VerseOfTheDay />
        </div>
      </section>

      {/* ============ MANIFESTO + CHAPTER RIBBON ============ */}
      <section className="section" id="about">
        <div className="container">
          <div className="manifesto reveal">
            <p className="eyebrow">A Timeless Conversation</p>
            <h2>Eighteen chapters, spoken between two armies, that answer the questions <em>every life eventually asks.</em></h2>
            <div className="manifesto__cols">
              <p>The Bhagavad-gītā — &ldquo;The Song of God&rdquo; — is the essence of India&rsquo;s Vedic wisdom. It is a
                dialogue between Śrī Kṛṣṇa and His friend Arjuna, spoken in the moments before a world
                war, when Arjuna&rsquo;s courage dissolves into despair. In answering Arjuna&rsquo;s crisis, Kṛṣṇa
                answers ours: Who am I? Why do I suffer? What is my duty? What happens at death?</p>
              <div>
                <p>The Gītā moves from the yoga of action, to the yoga of knowledge, to its crowning
                  teaching — the yoga of devotion, <em>bhakti</em>. It is not a book of abstract
                  philosophy. It is a call to live with clarity, courage, and love for the Divine — in
                  the middle of the battlefield of life.</p>
                <Link className="link-arrow" href="/explorer">Explore all 18 chapters <span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
          <nav className="ribbon reveal" aria-label="The eighteen chapters">
            <div className="ribbon__scroll">
              {GITA_CHAPTERS.map((ch) => (
                <Link key={ch.n} href={`/explorer#ch${ch.n}`}>
                  <i>{ch.n}</i>
                  <b>{ch.en}<span className="muted-row">{ch.verses} verses</span></b>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* ============ ANATOMY OF A VERSE + VERSE SPREADS ============ */}
      <section className="section section--night" id="verses">
        <div className="container">
          <div className="anatomy-head reveal">
            <p className="eyebrow">Why &ldquo;As It Is&rdquo;</p>
            <h2>Every verse, in five layers</h2>
            <p className="lede">Most editions give you a paraphrase. This one gives you the whole text —
              the original Sanskrit, its transliteration, every word&rsquo;s meaning, a faithful translation,
              and a purport that connects it to your life. Nothing added, nothing hidden.</p>
          </div>
          <Anatomy />
          <div className="anatomy-foot reveal">
            <div><b>Complete &amp; unabridged</b>All 700 verses carry all five layers — no verse skipped, no purport trimmed.</div>
            <div><b>In the line of teachers</b>Presented through the paramparā, the unbroken succession descending from Kṛṣṇa Himself.</div>
            <div><b>The global standard</b>Translated into 80+ languages; the most widely distributed edition of the Gītā in history.</div>
          </div>

          {SPREADS.map((s) => (
            <article key={s.ref} className={"spread reveal" + (s.flip ? " spread--flip" : "")}>
              <div className="spread__grid">
                <p className="spread__ref">{s.ref}</p>
                <div>
                  <p className="iast">{s.iast}</p>
                  <p className="spread__translation">{s.translation}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="night-cta reveal">
            <Link className="btn btn--ghost-dark" href="/explorer">Open the Verse Explorer</Link>
          </div>
        </div>
      </section>

      {/* ============ THE AUTHOR ============ */}
      <section className="section" id="author">
        <div className="container">
          <div className="grid-2" style={{ gap: "var(--space-8)", alignItems: "start" }}>
            <div className="reveal">
              <p className="eyebrow">His Divine Grace</p>
              <h2 className="display-md">A.C. Bhaktivedanta Swami Prabhupāda</h2>
              <p className="lede mb-4">
                Founder-ācārya of the International Society for Krishna Consciousness, Śrīla Prabhupāda
                is the world&rsquo;s foremost ambassador of the Bhagavad-gītā&rsquo;s teachings in the modern age.
              </p>
              <p className="mb-4" style={{ color: "var(--ink-soft)" }}>
                At the age of sixty-nine, carrying little more than a trunk of books and forty rupees,
                he crossed the Atlantic on a cargo ship to fulfill his spiritual master&rsquo;s request:
                carry the message of the Gītā to the English-speaking world. In the twelve years that
                followed he circled the globe fourteen times, opened more than a hundred temples, and
                wrote some seventy volumes of translation and commentary — works now translated into
                dozens of languages and honored by scholars worldwide.
              </p>
              <blockquote style={{ borderLeft: "3px solid var(--gold)", margin: "0 0 var(--space-5)", padding: "var(--space-2) 0 var(--space-2) var(--space-5)", fontFamily: "var(--font-display)", fontSize: "var(--text-md)", color: "var(--ink)" }}>
                &ldquo;The purpose of Bhagavad-gītā is to deliver mankind from the nescience of material existence.&rdquo;
                <footer className="muted" style={{ marginTop: ".6rem", fontFamily: "var(--font-ui)" }}>— Śrīla Prabhupāda, from the Preface</footer>
              </blockquote>
              <Link className="link-arrow" href="/book">About the book he called his heart <span aria-hidden="true">→</span></Link>
            </div>
            <div className="reveal" data-delay="1">
              <p className="eyebrow">A Life in Brief</p>
              <div className="timeline">
                {TIMELINE.map((t) => (
                  <div className="timeline__item" key={t.year}>
                    <div className="timeline__year">{t.year}</div>
                    <p>{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VOICES ACROSS TIME ============ */}
      <section className="section section--cream" id="voices">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Voices Across Time</p>
            <h2 className="display-md">What readers have always known</h2>
          </div>
          <div className="voices">
            {VOICES.map((v) => (
              <figure className="voice reveal" key={v.name}>
                <blockquote>{v.quote}</blockquote>
                <figcaption><strong>{v.name}</strong><span>{v.source}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EDITIONS ============ */}
      <section className="section" id="editions-home">
        <div className="container">
          <div className="center mb-7 reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Bring the Gītā Home</p>
            <h2 className="display-md">Choose your edition</h2>
            <p className="lede">Every format contains the complete, unabridged text — original Sanskrit,
              transliteration, word meanings, translation and purports.</p>
          </div>
          <EditionsGrid />
          <p className="center muted mt-6">Online ordering opens soon — your cart is saved on this device.
            Gifting? Add a personal inscription at checkout.</p>
        </div>
      </section>

      {/* ============ CTA + NEWSLETTER ============ */}
      <section className="section section--tight" id="begin">
        <div className="container">
          <div className="cta-band reveal">
            <p className="eyebrow" style={{ justifyContent: "center" }}>Your Journey Begins Here</p>
            <h2>Don&rsquo;t just read about the Gītā.<br />Read the Gītā.</h2>
            <p className="lede">Join the free 18-week guided course, explore the verses, or open your own
              copy tonight. Five thousand years of wisdom is waiting for one decision.</p>
            <div className="cta-band__btns">
              <Link className="btn btn--gold btn--lg" href="/course">Start the Free Course</Link>
              <Link className="btn btn--ghost-dark btn--lg" href="/book#editions">Get Your Copy</Link>
            </div>
            <DemoForm
              idPrefix="nl"
              placeholder="Email — a weekly verse & reflection"
              message="Welcome! Your first reflection arrives this week."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
