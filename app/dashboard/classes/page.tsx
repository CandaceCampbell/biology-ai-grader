"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type ClassItem = {
  id: string;
  name: string;
  period: string | null;
  join_code: string;
  created_at: string;
};

export default function ClassesPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/");
      return;
    }

    const { data, error } = await supabase
      .from("classes")
      .select("id, name, period, join_code, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setClasses(data ?? []);
    setLoading(false);
  }

  async function handleCreateClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter a class name.");
      return;
    }

    setCreating(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/");
      return;
    }

    const { data, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: user.id,
        name: name.trim(),
        period: period.trim() || null,
      })
      .select("id, name, period, join_code, created_at")
      .single();

    if (error) {
      setMessage(error.message);
      setCreating(false);
      return;
    }

    setClasses((current) => [data, ...current]);
    setName("");
    setPeriod("");
    setMessage("Class created successfully!");
    setCreating(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">

        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Dashboard
            </button>

            <div className="mt-3 text-sm font-semibold tracking-[0.3em] text-cyan-400">
              BIOLOGY
            </div>

            <h1 className="mt-1 text-3xl font-bold">
              My Classes
            </h1>

            <p className="mt-2 text-slate-400">
              Create and manage your Biology classes.
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* CREATE CLASS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Create a Class
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Make a class for a period, course section, or group of students.
            </p>

            <form
              onSubmit={handleCreateClass}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Class Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Honors Biology"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Period
                </label>

                <input
                  type="text"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  placeholder="1st Period"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              {message && (
                <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Class"}
              </button>
            </form>
          </div>

          {/* CLASS LIST */}
          <div>
            <h2 className="text-xl font-bold">
              Your Classes
            </h2>

            {loading ? (
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                Loading your classes...
              </div>
            ) : classes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
                <div className="text-4xl">🏫</div>

                <h3 className="mt-4 text-lg font-bold">
                  No classes yet
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Create your first Biology class using the form.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-xl font-bold">
                          {classItem.name}
                        </h3>

                        {classItem.period && (
                          <p className="mt-1 text-sm text-slate-400">
                            {classItem.period}
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-cyan-900 bg-cyan-950/40 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                          Join Code
                        </p>

                        <p className="mt-1 font-mono text-lg font-bold text-white">
                          {classItem.join_code}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}
