/* The free live course — curriculum shown on /course.

   Each session is built around a problem someone actually has, then answered
   from the Gītā. The verse references are anchors for the teacher, not a
   reading list; the wording throughout is our own. */

export interface CourseSession {
  n: number;
  title: string;
  /** The question a person arrives with. */
  question: string;
  body: string;
  verses: string;
  /** What they leave the session able to do. */
  takeaway: string;
}

export const SESSIONS: CourseSession[] = [
  {
    n: 1,
    title: "When you don't know what's right",
    question: "How do I decide when every option costs something?",
    body:
      "The Gītā opens with a capable man whose competence runs out. Arjuna is not confused about what he wants — he is confused about what is right, and the difference matters. We start where the book starts: with an honest account of being stuck.",
    verses: "Chapter 1 · 2.6–2.8",
    takeaway: "Telling apart a problem of information from a problem of principle — and knowing which one you're actually in.",
  },
  {
    n: 2,
    title: "You are not your results",
    question: "Why does one bad quarter feel like a verdict on me?",
    body:
      "The first teaching Kṛṣṇa gives is about identity: the self that occupied your childhood body still reads this sentence. Outcomes touch what you have; they do not touch what you are. This is the ground everything else in the course stands on.",
    verses: "2.13 · 2.20 · 2.22",
    takeaway: "A working separation between your performance and your worth, and the language to hold it under pressure.",
  },
  {
    n: 3,
    title: "Work without the anxiety",
    question: "How do I care about my work without being wrecked by how it lands?",
    body:
      "The most quoted verse in the book is a working instruction: your claim is on the action, never on the fruit. Not indifference — most people misread it that way. Obsessing over the result actively degrades the work, because attention leaks from the task to the scoreboard.",
    verses: "2.47 · 3.9 · 5.10",
    takeaway: "A way to give full effort and genuinely let go of the outcome — tested against a real deadline in your own week.",
  },
  {
    n: 4,
    title: "The anatomy of anger",
    question: "Why do I lose it over things that don't matter?",
    body:
      "Two verses lay out a precise sequence: dwelling on something, then attachment, then desire, then anger when it's blocked, then confusion, then a decision you regret. Every blow-up you've apologised for climbed those rungs in order.",
    verses: "2.62–2.63",
    takeaway: "Catching the sequence at the first rung, where it costs nothing, instead of the fifth, where it costs a relationship.",
  },
  {
    n: 5,
    title: "Your work, not theirs",
    question: "Why does everyone else's career look better than mine?",
    body:
      "Better to do your own duty imperfectly than another's well. It is the clearest answer to comparison in the book — the question stops being \"is this impressive?\" and becomes \"is this mine?\" We look at what that changes about the choices in front of you.",
    verses: "3.35 · 18.45–18.47",
    takeaway: "A way to evaluate an opportunity by fit rather than prestige, and to stop running someone else's race.",
  },
  {
    n: 6,
    title: "A mind you can live with",
    question: "Why can't I keep any discipline going?",
    body:
      "The Gītā is blunt: the mind is your closest friend or your worst enemy, and nobody else holds that position. Then it gets practical — not for one who eats too much or too little, sleeps too much or too little. Most burnout is a moderation failure dressed up as dedication.",
    verses: "6.5–6.6 · 6.16–6.17 · 6.35",
    takeaway: "One discipline small enough that you will actually still be doing it in a month.",
  },
  {
    n: 7,
    title: "Steady when it goes wrong",
    question: "How do some people stay level when everything shakes?",
    body:
      "Arjuna asks how such a person walks and speaks. The answer describes someone undisturbed by gain and loss — not because they feel nothing, but because their centre isn't outside them. We read the character list in Chapter 12 as a description, not a demand.",
    verses: "2.54–2.72 · 12.13–12.19",
    takeaway: "Composure as something you practise, not a temperament you were or weren't born with.",
  },
  {
    n: 8,
    title: "What it's all for",
    question: "Where does this actually lead?",
    body:
      "The book's conclusion is not a technique but a relationship. After chapters of philosophy and discipline, the path named as most accessible is devotion — an offering of the heart rather than an intellectual or athletic feat. This is where the course lands.",
    verses: "9.22 · 12.6–12.8 · 18.65–18.66",
    takeaway: "An honest look at what the Gītā is finally asking of you — and why it asks it last, not first.",
  },
];

export const AUDIENCE = [
  {
    title: "Students",
    body: "Exams, comparison, and a sense of worth that rises and falls with results. Chapter 2 was written for this.",
  },
  {
    title: "Working professionals",
    body: "Deadlines, appraisals, office politics, and the suspicion that your job and your inner life are separate things. They aren't.",
  },
  {
    title: "Anyone running a household",
    body: "The Gītā was not spoken in a monastery. It was spoken to a man in the middle of an unavoidable, messy obligation.",
  },
];

export const FORMAT = [
  { label: "Live, not recorded", body: "Taught in real time, so you can ask the question you actually have." },
  { label: "Completely free", body: "No fee, no upsell. You will need a copy of the book to follow along." },
  { label: "Online", body: "Join from anywhere in India — or anywhere at all." },
  { label: "No background needed", body: "Every Sanskrit term is explained. Prior study is welcome but not assumed." },
];
