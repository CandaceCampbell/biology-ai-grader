"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
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

    checkUser();

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
        <div className="text-center">
          <div className="text-sm font-semibold tracking-[0.3em] text-cyan-400">
            BIOLOGY
          </div>

          <p className="mt-4 text-slate-400">
            Checking your teacher account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-8">

        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.3em] text-cyan-400">
              BIOLOGY
            </div>

            <h1 className="mt-1 text-3xl font-bold">
              Teacher Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
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

        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back!
            </h2>

            <p className="mt-2 text-slate-400">
              Manage your Biology classes, assignments, and student grades.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <DashboardCard
  icon="🏫"
  title="Classes"
  description="Create and manage your Biology classes."
  onClick={() => router.push("/dashboard/classes")}
/>

            <DashboardCard
              icon="📝"
              title="Assignments"
              description="Create questions, rubrics, and assignments."
            />

            <DashboardCard
              icon="📊"
              title="Gradebook"
              description="Review submissions and student performance."
            />

          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            Getting Started
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your teacher account is working. The next step is connecting
            your classes, assignments, and AI grading tools to this dashboard.
          </p>
        </section>

      </div>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
  type="button"
  onClick={onClick}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-cyan-900 hover:bg-slate-800"
    >
      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </button>
  );
}
