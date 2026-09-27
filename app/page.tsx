"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
export default function Home() {
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setLoading(true);
  setMessage("");

  if (!email || !password) {
    setMessage("Please enter your email and password.");
    setLoading(false);
    return;
  }

  if (password.length < 8) {
    setMessage("Your password must be at least 8 characters.");
    setLoading(false);
    return;
  }

  try {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        return;
      }

      setMessage(
        "Account created! Check your email to confirm your account, then come back and sign in."
      );
      return;
    }

    const signInRequest = supabase.auth.signInWithPassword({
      email,
      password,
    });

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "The sign-in request timed out. Please try again."
          )
        );
      }, 10000);
    });

    const { error } = await Promise.race([
      signInRequest,
      timeout,
    ]);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
  } catch (error) {
    if (error instanceof Error) {
      setMessage(error.message);
    } else {
      setMessage("Something went wrong while signing in.");
    }
  } finally {
    setLoading(false);
  }
}

  function closeLogin() {
    setShowLogin(false);
    setMessage("");
    setEmail("");
    setPassword("");
    setIsSignUp(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">

        <header className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-[0.3em] text-cyan-400">
              BIOLOGY
            </div>

            <h1 className="text-2xl font-bold">
              AI Grader
            </h1>
          </div>

          <button
            onClick={() => setShowLogin(true)}
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Teacher Login
          </button>
        </header>

        <section className="flex flex-1 items-center py-20">
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex rounded-full border border-cyan-900 bg-cyan-950/40 px-4 py-2 text-sm text-cyan-300">
              🧬 Your Biology classroom, organized.
            </div>

            <h2 className="text-5xl font-bold leading-tight md:text-7xl">
              Spend less time grading.

              <span className="block text-cyan-400">
                Spend more time teaching.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              A private classroom platform where students submit Biology
              responses and AI evaluates their answers using the rubric you
              create.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() => setShowLogin(true)}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Teacher Dashboard
              </button>

              <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800">
                Student Login
              </button>

            </div>
          </div>
        </section>

        <section className="grid gap-5 pb-10 md:grid-cols-3">

          <Feature
            icon="🤖"
            title="AI-assisted grading"
            text="AI evaluates student responses against your Biology rubric."
          />

          <Feature
            icon="📊"
            title="Automatic percentages"
            text="Scores are automatically converted into assignment percentages."
          />

          <Feature
            icon="👩‍🏫"
            title="Teacher controlled"
            text="Review and change every AI-generated score before it becomes final."
          />

        </section>

        <footer className="border-t border-slate-800 pt-5 text-sm text-slate-500">
          Biology AI Grader • Teacher-controlled assessment
        </footer>

      </div>

      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 px-6">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {isSignUp ? "Create Teacher Account" : "Teacher Login"}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {isSignUp
                    ? "Create your secure Biology AI Grader account."
                    : "Sign in to your teacher dashboard."}
                </p>
              </div>

              <button
                onClick={closeLogin}
                className="text-xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuth} className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teacher@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  required
                  minLength={8}
                />
              </div>

              {message && (
                <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </button>

            </form>

            <div className="mt-5 text-center text-sm text-slate-400">
              {isSignUp
                ? "Already have an account?"
                : "Don't have a teacher account?"}

              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage("");
                }}
                className="ml-1 font-medium text-cyan-400 hover:text-cyan-300"
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>

    </div>
  );
}
