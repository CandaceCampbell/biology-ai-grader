"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setEmail(user.email ?? null);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">

        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.3em] text-cyan-400">
              BIOLOGY
            </div>

            <h1 className="text-3xl font-bold">
              Teacher Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Signed in as {email}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Sign Out
          </button>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">🏫</div>
            <h2 className="mt-4 text-xl font-bold">
              Classes
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Create and manage your Biology classes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">📝</div>
            <h2 className="mt-4 text-xl font-bold">
              Assignments
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Create Biology questions and rubrics.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl">📊</div>
            <h2 className="mt-4 text-xl font-bold">
              Gradebook
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Review student submissions and grades.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}
