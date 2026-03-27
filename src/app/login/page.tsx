"use client";

import { useActionState, useState } from "react";
import { signIn, signUp } from "./actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [state, formAction, pending] = useActionState(
    mode === "sign-in" ? signIn : signUp,
    initialState
  );

  return (
    <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Budget App v2
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            {mode === "sign-in" ? "Welcome back" : "Create your account"}
          </h1>

          <p className="text-sm leading-6 text-slate-300">
            {mode === "sign-in"
              ? "Sign in to access your dashboard, add expenses, and track your spending."
              : "Create an account to save expenses and unlock your personal finance dashboard."}
          </p>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="mike@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="Enter your password"
            />
          </div>

          {state.error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
              {state.error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? mode === "sign-in"
                ? "Signing in..."
                : "Creating account..."
              : mode === "sign-in"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-300">
          {mode === "sign-in" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((current) =>
                current === "sign-in" ? "sign-up" : "sign-in"
              )
            }
            className="font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            {mode === "sign-in" ? "Create one" : "Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}