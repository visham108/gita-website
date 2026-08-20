/* The free live session, and the series it leads into.

   Shaped as a single one-hour evening rather than an eight-week commitment: a
   first session is a small ask for the visitor and a small risk for us, it can
   carry a firm date, and it repeats. The longer series is introduced during it,
   to a room that has already chosen to be there. */

export const SESSION = {
  title: "The Bhagavad-gītā in the Modern World",
  dayLabel: "Saturday 22 August",
  timeLabel: "8:00–9:00 pm IST",
  duration: "One hour",
  /* Recorded here so the page, the email and the schema all read from one
     place. ISO in IST (+05:30). */
  startsAt: "2026-08-22T20:00:00+05:30",
  endsAt: "2026-08-22T21:00:00+05:30",

  /* The meeting link, sent in the confirmation email the moment someone signs
     up — so nobody has to be emailed by hand the day before.

     Left EMPTY until the meeting actually exists. The email checks this and
     falls back to "we'll send the link nearer the time", so an empty value can
     never go out as a broken or blank button. Paste the URL here, redeploy, and
     every subsequent sign-up gets it automatically.

     Anyone who signed up BEFORE this is filled in will not have received it —
     they need one manual email.

     This link belongs to the calendar event on visham.rawat@gmail.com for
     22 Aug 2026, 8–9pm IST. If that event is deleted the link dies with it, so
     move the date on the existing event rather than making a new one. */
  joinUrl: "https://meet.google.com/kja-weev-hjs",
};

/* Śrī Caitanya Mahāprabhu's instruction, recorded by Kṛṣṇadāsa Kavirāja
   Gosvāmī. The Bengali and its transliteration are 16th-century and public
   domain; the English here is our own rendering, not the BBT translation.

   It is on the page as the reason the session is free — para-upakāra is the
   teacher's duty, not a debt placed on the reader. Framed deliberately that way,
   because a verse about birth in Bhārata could otherwise read as an entry
   requirement on a page that says everyone is welcome. */
export const MAHAVANI = {
  bengali: "ভারত–ভূমিতে হৈল মনুষ্য–জন্ম যার ।\nজন্ম সার্থক করি’ কর পর–উপকার ॥",
  iast: "bhārata-bhūmite haila manuṣya janma yāra\njanma sārthaka kari’ kara para-upakāra",
  rendering:
    "Whoever has been given a human birth in the land of Bhārata — make that birth count for something, and then work for the good of others.",
  attribution: "Śrī Caitanya Mahāprabhu · Caitanya-caritāmṛta, Ādi-līlā 9.41",
};

export interface AgendaItem {
  minutes: string;
  title: string;
  body: string;
}

/* The hour as actually delivered, matched to the session-1 deck rather than to
   a rough sketch of it. Runs about 55 minutes of content plus questions, which
   also keeps it inside the 60-minute cap on a free Google Meet call. */
export const AGENDA: AgendaItem[] = [
  {
    minutes: "5 min",
    title: "Gītā, or Google?",
    body:
      "Five quotes; you decide which ones are actually in the book. Most rooms get at least two wrong — and the ones that turn out not to be in it are usually the ones everybody has seen shared.",
  },
  {
    minutes: "10 min",
    title: "What this book actually is",
    body:
      "Seven hundred verses, spoken in about forty-five minutes, in the middle of a battlefield — to a capable man who came apart minutes before the biggest moment of his life. Kṛṣṇa could have chosen a sage. He chose someone with a job, a family and a crisis.",
  },
  {
    minutes: "15 min",
    title: "The whole book in five subjects",
    body:
      "Everything across those seven hundred verses maps to five things: the Supreme, you, nature, time, and action. Once the frame is visible the book stops being intimidating and starts being navigable.",
  },
  {
    minutes: "10 min",
    title: "The verse everyone half-knows",
    body:
      "2.47 — your right is to the work, never to its fruits. Including the line at the end that almost nobody quotes, which rules out using detachment as a cover for not trying.",
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
      "The six sessions that follow, and a thirty-day experiment small enough that you can start it on Monday.",
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

/* The seven-session series.

   Session 1 is the free live session itself — the deck closes on "Session 1 of
   7" — so this is not a separate course sold afterwards; it is the arc the
   first hour begins. Sessions 2–6 follow the Gītā's own five subjects (īśvara,
   jīva, prakṛti, kāla, karma) plus the yoga it teaches, and 7 lands all of it
   on an ordinary week.

   No BBT translations here: verse references only, plus our own plain-English
   framing. */
export const SESSIONS: CourseSession[] = [
  {
    n: 1,
    title: "The life manual",
    question: "What is this book, and why should it matter to me?",
    body:
      "Seven hundred verses, spoken in about forty-five minutes, in the middle of a battlefield — to a capable man whose nerve had failed him minutes before the biggest moment of his life. Not to a renunciant in a cave. Kṛṣṇa could have chosen sages; he chose a married professional in the middle of a crisis at work.",
    verses: "Chapter 1 · 2.13 · 2.47 · 18.66",
    takeaway: "A clear map of what the Gītā actually contains — and why it was spoken to someone with a job, a family, and a problem.",
  },
  {
    n: 2,
    title: "Who is actually speaking",
    question: "Who is Kṛṣṇa, and why does that change the book?",
    body:
      "The Gītā is a conversation, and conversations happen between persons. Not a vague energy or a cosmic force — someone with character, humour and intent, who after seven hundred verses of analysis asks for a relationship rather than compliance.",
    verses: "4.6–4.8 · 7.7 · 9.10 · 10.8",
    takeaway: "Why the book reads completely differently once you notice it is addressed to you by someone, rather than about something.",
  },
  {
    n: 3,
    title: "What you are underneath",
    question: "What stays the same when everything about me changes?",
    body:
      "The self that occupied your childhood body still reads this sentence. The Gītā starts here because every other question depends on who is asking it — and because the fear underneath most of our decisions is a fear about the body, not about us.",
    verses: "2.13 · 2.17 · 2.20 · 2.22",
    takeaway: "A working distinction between what you have and what you are, and what it does to the fear of losing either.",
  },
  {
    n: 4,
    title: "Saṁsāra and karma",
    question: "Why does the same kind of trouble keep finding me?",
    body:
      "Karma is not instant justice and not a lightning bolt. It is closer to an accounting system: every action posts an entry, and the balance carries forward — across a lifetime, and past the end of one.",
    verses: "2.22 · 3.9 · 4.17 · 8.6",
    takeaway: "A way to read your own patterns as a ledger you are still writing, rather than luck happening to you.",
  },
  {
    n: 5,
    title: "Nature and time",
    question: "Why can I never hold on to anything good?",
    body:
      "Two of the Gītā's five subjects describe the setting rather than the players — the machinery you are entangled in, and the clock nobody pauses. Everything material degrades, on a schedule. Knowing that changes what you agree to build on.",
    verses: "7.4–7.5 · 8.17 · 11.32 · 14.5",
    takeaway: "Clear eyes about what is temporary by design, so that losing it stops feeling like a personal failure.",
  },
  {
    n: 6,
    title: "The yoga ladder",
    question: "There are so many paths — which one is actually mine?",
    body:
      "Yoga in the Gītā is not flexibility. Its own definition is evenness — samatvaṁ yoga ucyate. Four rungs: act and offer the results, know the self, still the mind, love the Person. Each one includes the rung below it rather than replacing it.",
    verses: "2.48 · 6.5–6.6 · 6.47 · 12.6–12.8",
    takeaway: "Where you actually stand on that ladder, and the next rung — not the top one.",
  },
  {
    n: 7,
    title: "On an ordinary Monday",
    question: "How does any of this survive contact with my real week?",
    body:
      "Effort without burnout. A mind that is a friend rather than an enemy — the Gītā is blunt that it is both, and that nobody else holds the position. Equal vision toward the people in front of you. An anchor that holds in a crisis.",
    verses: "2.47 · 5.18 · 6.5–6.6 · 2.22",
    takeaway: "A thirty-day experiment small enough that you will still be running it in a month.",
  },
];
