/* The free live session, and the series it leads into.

   Shaped as a single one-hour evening rather than an eight-week commitment: a
   first session is a small ask for the visitor and a small risk for us, it can
   carry a firm date, and it repeats. The longer series is introduced during it,
   to a room that has already chosen to be there. */

export const SESSION = {
  title: "The Bhagavad-gītā in the Modern World",
  dayLabel: "Saturday 15 August",
  timeLabel: "8:00–9:00 pm IST",
  duration: "One hour",
  /* Recorded here so the page, the email and the schema all read from one
     place. ISO in IST (+05:30). */
  startsAt: "2026-08-15T20:00:00+05:30",
  endsAt: "2026-08-15T21:00:00+05:30",
};

export interface AgendaItem {
  minutes: string;
  title: string;
  body: string;
}

/* Sixty minutes, honestly budgeted — including time for questions, which is the
   part people actually come for. */
export const AGENDA: AgendaItem[] = [
  {
    minutes: "10 min",
    title: "Why this book, still",
    body:
      "Five thousand years old, and the questions it opens with are the ones you had this week. What the Gītā actually is, and why it has outlasted almost everything written since.",
  },
  {
    minutes: "10 min",
    title: "A breakdown on a battlefield",
    body:
      "The Gītā does not begin with a sermon. It begins with a capable man whose nerve fails him, in the last moments before he has to act. We start where the book starts.",
  },
  {
    minutes: "25 min",
    title: "Three ideas you can use this week",
    body:
      "Doing your work without being wrecked by how it lands. The exact sequence that runs from a stray thought to a decision you regret. And who you are when the roles fall away.",
  },
  {
    minutes: "10 min",
    title: "Your questions",
    body:
      "Live, so ask the thing you actually want to ask. Nothing is too basic — most people in the room will be meeting this book for the first time.",
  },
  {
    minutes: "5 min",
    title: "Where this goes next",
    body:
      "A look at the fuller course we run from here, for anyone who wants to keep going. No obligation, and no cost to that either.",
  },
];

export const AUDIENCE = [
  {
    title: "If you've never opened it",
    body: "Start here. Nothing is assumed — not Sanskrit, not scripture, not any background at all.",
  },
  {
    title: "If you've started and stalled",
    body: "Very common, and usually a question of how the book is approached rather than effort. That is most of what this hour is about.",
  },
  {
    title: "If you're carrying something heavy",
    body: "Pressure at work, a decision you keep avoiding, a loss. The Gītā was spoken to someone in exactly that position, on the day it mattered.",
  },
];

export const FORMAT = [
  { label: "One hour, one evening", body: "8:00 to 9:00 pm. No preparation, and nothing to read beforehand." },
  { label: "Live, not recorded", body: "Taught in real time, so you can ask the question you actually have." },
  { label: "Completely free", body: "No fee, no upsell, and you do not need to own the book to attend." },
  { label: "Runs every month", body: "If this date does not suit you, sign up anyway and we'll tell you about the next one." },
];

export interface CourseSession {
  n: number;
  title: string;
  question: string;
  body: string;
  verses: string;
  takeaway: string;
}

/* The fuller course, introduced in the closing minutes of the free session.
   Shown on the page as a roadmap — what this leads to — not as the thing being
   signed up for. */
export const SESSIONS: CourseSession[] = [
  {
    n: 1,
    title: "When you don't know what's right",
    question: "How do I decide when every option costs something?",
    body:
      "The Gītā opens with a capable man whose competence runs out. Arjuna is not confused about what he wants — he is confused about what is right, and the difference matters.",
    verses: "Chapter 1 · 2.6–2.8",
    takeaway: "Telling apart a problem of information from a problem of principle — and knowing which one you're in.",
  },
  {
    n: 2,
    title: "You are not your results",
    question: "Why does one bad quarter feel like a verdict on me?",
    body:
      "The first teaching Kṛṣṇa gives is about identity: the self that occupied your childhood body still reads this sentence. Outcomes touch what you have; they do not touch what you are.",
    verses: "2.13 · 2.20 · 2.22",
    takeaway: "A working separation between your performance and your worth, and the language to hold it under pressure.",
  },
  {
    n: 3,
    title: "Work without the anxiety",
    question: "How do I care about my work without being wrecked by how it lands?",
    body:
      "The most quoted verse in the book is a working instruction: your claim is on the action, never on the fruit. Not indifference — obsessing over the result actively degrades the work, because attention leaks from the task to the scoreboard.",
    verses: "2.47 · 3.9 · 5.10",
    takeaway: "A way to give full effort and genuinely let go of the outcome, tested against a real deadline in your own week.",
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
      "Better to do your own duty imperfectly than another's well. The clearest answer to comparison in the book — the question stops being \"is this impressive?\" and becomes \"is this mine?\"",
    verses: "3.35 · 18.45–18.47",
    takeaway: "A way to weigh an opportunity by fit rather than prestige, and to stop running someone else's race.",
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
      "Arjuna asks how such a person walks and speaks. The answer describes someone undisturbed by gain and loss — not because they feel nothing, but because their centre isn't outside them.",
    verses: "2.54–2.72 · 12.13–12.19",
    takeaway: "Composure as something you practise, not a temperament you were or weren't born with.",
  },
  {
    n: 8,
    title: "What it's all for",
    question: "Where does this actually lead?",
    body:
      "The book's conclusion is not a technique but a relationship. After chapters of philosophy and discipline, the path named as most accessible is devotion — an offering of the heart rather than an intellectual or athletic feat.",
    verses: "9.22 · 12.6–12.8 · 18.65–18.66",
    takeaway: "An honest look at what the Gītā is finally asking of you — and why it asks it last, not first.",
  },
];
