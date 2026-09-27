"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
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

            <h3 className="text-2xl font-bold">
              Teacher Dashboard
            </h3>

            <p className="mt-2 text-slate-400">
              Teacher accounts and secure authentication are coming next.
            </p>

            <button
              onClick={() => setShowLogin(false)}
              className="mt-6 w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
            >
              Close
            </button>

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
