"use client";

/* Unified study-data store.
   - Anonymous: reads/writes the prototype's localStorage keys (bgaii_*).
   - Signed in: reads/writes Supabase (RLS-guarded, per-user rows).
   - First sign-in on a device: adopts existing local state into the account
     (merge — never clobbers newer server rows), then clears the local copies.
   Components consume this via useStudy(); they never touch storage directly. */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

const LS = {
  bookmarks: "bgaii_bookmarks_v1",
  highlights: "bgaii_highlights_v1",
  notes: "bgaii_notes_v1",
  lastRead: "bgaii_lastread_v1",
  course: "bgaii_course_v1",
  plan: "bgaii_plan_v1",
  profile: "bgaii_profile_v1",
  adopted: "bgaii_adopted_v1",
};

function loadLS<T>(k: string, fallback: T): T {
  try {
    return (JSON.parse(localStorage.getItem(k) ?? "null") as T) ?? fallback;
  } catch {
    return fallback;
  }
}
const saveLS = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

export interface CourseState {
  enrolled: boolean;
  done: Record<string, boolean>;
  quiz: number | null;
}

interface StudyData {
  bookmarks: string[];
  highlights: string[];
  notes: Record<string, string>;
  lastRead: { ref: string; when: number } | null;
  course: CourseState;
  plan: string | null;
  name: string;
}

interface StudyContextValue extends StudyData {
  ready: boolean;
  user: { id: string; email: string } | null;
  toggleBookmark: (ref: string) => boolean;
  toggleHighlight: (ref: string) => boolean;
  removeBookmark: (ref: string) => void;
  saveNote: (ref: string, body: string) => void;
  deleteNote: (ref: string) => void;
  setLastRead: (ref: string) => void;
  enroll: () => void;
  toggleLesson: (id: string) => void;
  setQuizScore: (n: number) => void;
  setPlan: (plan: string) => void;
  setName: (name: string) => void;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const EMPTY: StudyData = {
  bookmarks: [],
  highlights: [],
  notes: {},
  lastRead: null,
  course: { enrolled: false, done: {}, quiz: null },
  plan: null,
  name: "",
};

const StudyContext = createContext<StudyContextValue | null>(null);

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside <StudyProvider>");
  return ctx;
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [data, setData] = useState<StudyData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);
  sessionRef.current = session;

  const loadLocal = useCallback((): StudyData => {
    const profile = loadLS<{ name?: string }>(LS.profile, {});
    return {
      bookmarks: loadLS<string[]>(LS.bookmarks, []),
      highlights: loadLS<string[]>(LS.highlights, []),
      notes: loadLS<Record<string, string>>(LS.notes, {}),
      lastRead: loadLS<{ ref: string; when: number } | null>(LS.lastRead, null),
      course: loadLS<CourseState>(LS.course, EMPTY.course),
      plan: loadLS<string | null>(LS.plan, null),
      name: profile.name ?? "",
    };
  }, []);

  const loadRemote = useCallback(async (): Promise<StudyData> => {
    const [bm, hl, nt, lr, cp, pr] = await Promise.all([
      supabase.from("bookmarks").select("verse_ref").order("created_at"),
      supabase.from("highlights").select("verse_ref"),
      supabase.from("notes").select("verse_ref, body"),
      supabase.from("last_read").select("verse_ref, read_at").maybeSingle(),
      supabase.from("course_progress").select("lesson_id"),
      supabase.from("profiles").select("name, reading_plan, enrolled, quiz_m1_score").maybeSingle(),
    ]);
    const notes: Record<string, string> = {};
    (nt.data ?? []).forEach((r) => { notes[r.verse_ref] = r.body; });
    const done: Record<string, boolean> = {};
    (cp.data ?? []).forEach((r) => { done[r.lesson_id] = true; });
    return {
      bookmarks: (bm.data ?? []).map((r) => r.verse_ref),
      highlights: (hl.data ?? []).map((r) => r.verse_ref),
      notes,
      lastRead: lr.data ? { ref: lr.data.verse_ref, when: Date.parse(lr.data.read_at) } : null,
      course: {
        enrolled: pr.data?.enrolled ?? Object.keys(done).length > 0,
        done,
        quiz: pr.data?.quiz_m1_score ?? null,
      },
      plan: pr.data?.reading_plan ?? null,
      name: pr.data?.name ?? "",
    };
  }, [supabase]);

  /* One-time adoption of device state into the account. Merge semantics:
     inserts fill gaps, existing server rows always win. */
  const adoptLocal = useCallback(async (userId: string) => {
    if (loadLS<number>(LS.adopted, 0)) return;
    const local = loadLocal();
    const rows = (refs: string[]) => refs.map((verse_ref) => ({ user_id: userId, verse_ref }));
    try {
      if (local.bookmarks.length)
        await supabase.from("bookmarks").upsert(rows(local.bookmarks), { onConflict: "user_id,verse_ref", ignoreDuplicates: true });
      if (local.highlights.length)
        await supabase.from("highlights").upsert(rows(local.highlights), { onConflict: "user_id,verse_ref", ignoreDuplicates: true });
      const noteRows = Object.entries(local.notes).map(([verse_ref, body]) => ({ user_id: userId, verse_ref, body }));
      if (noteRows.length)
        await supabase.from("notes").upsert(noteRows, { onConflict: "user_id,verse_ref", ignoreDuplicates: true });
      if (local.lastRead)
        await supabase.from("last_read").upsert(
          { user_id: userId, verse_ref: local.lastRead.ref, read_at: new Date(local.lastRead.when).toISOString() },
          { onConflict: "user_id", ignoreDuplicates: true }
        );
      const lessonRows = Object.entries(local.course.done).filter(([, v]) => v)
        .map(([lesson_id]) => ({ user_id: userId, lesson_id }));
      if (lessonRows.length)
        await supabase.from("course_progress").upsert(lessonRows, { onConflict: "user_id,lesson_id", ignoreDuplicates: true });
      const { data: existing } = await supabase.from("profiles").select("user_id").maybeSingle();
      if (!existing)
        await supabase.from("profiles").insert({
          user_id: userId,
          name: local.name || null,
          reading_plan: local.plan,
          enrolled: local.course.enrolled,
          quiz_m1_score: local.course.quiz,
        });
      // Adopted — clear device copies (cart is commerce, not study; untouched).
      [LS.bookmarks, LS.highlights, LS.notes, LS.lastRead, LS.course, LS.plan, LS.profile]
        .forEach((k) => localStorage.removeItem(k));
      saveLS(LS.adopted, 1);
      const hadAnything = local.bookmarks.length || Object.keys(local.notes).length ||
        Object.keys(local.course.done).length;
      if (hadAnything) toast("Your study from this device now lives in your account.");
    } catch {
      toast("Some device data could not sync — it is safe locally; try again later.");
    }
  }, [supabase, loadLocal, toast]);

  // Session bootstrap + auth changes.
  useEffect(() => {
    let cancelled = false;

    const applyFor = async (s: Session | null) => {
      if (s?.user) {
        await adoptLocal(s.user.id);
        const remote = await loadRemote();
        if (!cancelled) { setData(remote); setReady(true); }
      } else {
        if (!cancelled) { setData(loadLocal()); setReady(true); }
      }
    };

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      applyFor(s);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (cancelled) return;
      const hadUser = !!sessionRef.current?.user;
      setSession(s);
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(LS.adopted);
        setData(loadLocal());
      } else if (s?.user && !hadUser) {
        applyFor(s);
      }
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [supabase, adoptLocal, loadRemote, loadLocal]);

  /* ------------- persistence helper: optimistic + backend write ------------- */

  const persist = useCallback((updater: (d: StudyData) => StudyData, remote: (userId: string) => PromiseLike<unknown>, localWrite: (d: StudyData) => void) => {
    setData((prev) => {
      const next = updater(prev);
      const user = sessionRef.current?.user;
      if (user) {
        Promise.resolve(remote(user.id)).then((res) => {
          const err = (res as { error?: { message?: string } } | undefined)?.error;
          if (err) toast("Could not sync that change — check your connection.");
        });
      } else {
        localWrite(next);
      }
      return next;
    });
  }, [toast]);

  /* ------------------------------- mutators ------------------------------- */

  const toggleBookmark = useCallback((ref: string) => {
    const adding = !data.bookmarks.includes(ref);
    persist(
      (d) => ({ ...d, bookmarks: adding ? [...d.bookmarks, ref] : d.bookmarks.filter((r) => r !== ref) }),
      (uid) => adding
        ? supabase.from("bookmarks").upsert({ user_id: uid, verse_ref: ref }, { onConflict: "user_id,verse_ref", ignoreDuplicates: true })
        : supabase.from("bookmarks").delete().eq("user_id", uid).eq("verse_ref", ref),
      (d) => saveLS(LS.bookmarks, d.bookmarks)
    );
    return adding;
  }, [data.bookmarks, persist, supabase]);

  const removeBookmark = useCallback((ref: string) => {
    persist(
      (d) => ({ ...d, bookmarks: d.bookmarks.filter((r) => r !== ref) }),
      (uid) => supabase.from("bookmarks").delete().eq("user_id", uid).eq("verse_ref", ref),
      (d) => saveLS(LS.bookmarks, d.bookmarks)
    );
  }, [persist, supabase]);

  const toggleHighlight = useCallback((ref: string) => {
    const adding = !data.highlights.includes(ref);
    persist(
      (d) => ({ ...d, highlights: adding ? [...d.highlights, ref] : d.highlights.filter((r) => r !== ref) }),
      (uid) => adding
        ? supabase.from("highlights").upsert({ user_id: uid, verse_ref: ref }, { onConflict: "user_id,verse_ref", ignoreDuplicates: true })
        : supabase.from("highlights").delete().eq("user_id", uid).eq("verse_ref", ref),
      (d) => saveLS(LS.highlights, d.highlights)
    );
    return adding;
  }, [data.highlights, persist, supabase]);

  const saveNote = useCallback((ref: string, body: string) => {
    persist(
      (d) => ({ ...d, notes: { ...d.notes, [ref]: body } }),
      (uid) => supabase.from("notes").upsert({ user_id: uid, verse_ref: ref, body, updated_at: new Date().toISOString() }, { onConflict: "user_id,verse_ref" }),
      (d) => saveLS(LS.notes, d.notes)
    );
  }, [persist, supabase]);

  const deleteNote = useCallback((ref: string) => {
    persist(
      (d) => {
        const notes = { ...d.notes };
        delete notes[ref];
        return { ...d, notes };
      },
      (uid) => supabase.from("notes").delete().eq("user_id", uid).eq("verse_ref", ref),
      (d) => saveLS(LS.notes, d.notes)
    );
  }, [persist, supabase]);

  const setLastRead = useCallback((ref: string) => {
    const when = Date.now();
    persist(
      (d) => ({ ...d, lastRead: { ref, when } }),
      (uid) => supabase.from("last_read").upsert({ user_id: uid, verse_ref: ref, read_at: new Date(when).toISOString() }, { onConflict: "user_id" }),
      (d) => saveLS(LS.lastRead, d.lastRead)
    );
  }, [persist, supabase]);

  const upsertProfile = useCallback((uid: string, patch: Record<string, unknown>) =>
    supabase.from("profiles").upsert({ user_id: uid, ...patch, updated_at: new Date().toISOString() }, { onConflict: "user_id" }),
  [supabase]);

  const enroll = useCallback(() => {
    persist(
      (d) => ({ ...d, course: { ...d.course, enrolled: true } }),
      (uid) => upsertProfile(uid, { enrolled: true }),
      (d) => saveLS(LS.course, d.course)
    );
  }, [persist, upsertProfile]);

  const toggleLesson = useCallback((id: string) => {
    const nowDone = !data.course.done[id];
    persist(
      (d) => ({ ...d, course: { ...d.course, enrolled: true, done: { ...d.course.done, [id]: nowDone } } }),
      async (uid) => {
        await upsertProfile(uid, { enrolled: true });
        return nowDone
          ? supabase.from("course_progress").upsert({ user_id: uid, lesson_id: id }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true })
          : supabase.from("course_progress").delete().eq("user_id", uid).eq("lesson_id", id);
      },
      (d) => saveLS(LS.course, d.course)
    );
  }, [data.course.done, persist, supabase, upsertProfile]);

  const setQuizScore = useCallback((n: number) => {
    persist(
      (d) => ({ ...d, course: { ...d.course, quiz: n } }),
      (uid) => upsertProfile(uid, { quiz_m1_score: n }),
      (d) => saveLS(LS.course, d.course)
    );
  }, [persist, upsertProfile]);

  const setPlan = useCallback((plan: string) => {
    persist(
      (d) => ({ ...d, plan }),
      (uid) => upsertProfile(uid, { reading_plan: plan }),
      (d) => saveLS(LS.plan, d.plan)
    );
  }, [persist, upsertProfile]);

  const setName = useCallback((name: string) => {
    persist(
      (d) => ({ ...d, name }),
      (uid) => upsertProfile(uid, { name: name || null }),
      (d) => saveLS(LS.profile, { name: d.name })
    );
  }, [persist, upsertProfile]);

  /* --------------------------------- auth --------------------------------- */

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=/account` },
    });
    return error ? { error: error.message } : {};
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const value: StudyContextValue = {
    ...data,
    ready,
    user: session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null,
    toggleBookmark, toggleHighlight, removeBookmark,
    saveNote, deleteNote, setLastRead,
    enroll, toggleLesson, setQuizScore,
    setPlan, setName,
    signInWithEmail, signOut,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}
