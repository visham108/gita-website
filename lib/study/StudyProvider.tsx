"use client";

/* Account store: who is signed in, and what they'd like to be called.

   This used to be a full study-data layer — bookmarks, highlights, per-verse
   notes, last-read position, lesson progress and a chosen reading plan, each
   mirrored between localStorage and Postgres with a one-time adoption on first
   sign-in. All of it existed to serve the Verse Explorer and the self-study
   reading plan. Both are gone (vedabase.io serves the text better, and the
   site now teaches through the live course instead of tracking solo progress),
   so the tables were dropped and the sync machinery with them.

   What remains is deliberately small: magic-link auth, and a display name kept
   on the profile row. The cart is untouched — that is commerce, not study, and
   lives in lib/cart.ts. */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";

const LS_PROFILE = "bgaii_profile_v1";

function loadName(): string {
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROFILE) ?? "null") as { name?: string } | null;
    return p?.name ?? "";
  } catch {
    return "";
  }
}

interface StudyContextValue {
  ready: boolean;
  user: { id: string; email: string } | null;
  name: string;
  setName: (name: string) => void;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside <StudyProvider>");
  return ctx;
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [name, setNameState] = useState("");
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);
  sessionRef.current = session;

  // Session bootstrap. Signed in, the name comes from the profile row; signed
  // out, from this device.
  useEffect(() => {
    let cancelled = false;

    const applyFor = async (s: Session | null) => {
      if (s?.user) {
        const { data } = await supabase.from("profiles").select("name").maybeSingle();
        if (!cancelled) {
          setNameState(data?.name ?? loadName());
          setReady(true);
        }
      } else if (!cancelled) {
        setNameState(loadName());
        setReady(true);
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
      if (event === "SIGNED_OUT") setNameState(loadName());
      else if (s?.user && !hadUser) applyFor(s);
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [supabase]);

  /** Optimistic: update the UI, then write wherever this visitor's data lives. */
  const setName = useCallback((next: string) => {
    setNameState(next);
    const uid = sessionRef.current?.user?.id;
    if (uid) {
      void supabase
        .from("profiles")
        .upsert({ user_id: uid, name: next || null }, { onConflict: "user_id" });
    } else {
      localStorage.setItem(LS_PROFILE, JSON.stringify({ name: next }));
    }
  }, [supabase]);

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
    ready,
    user: session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null,
    name,
    setName,
    signInWithEmail,
    signOut,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}
