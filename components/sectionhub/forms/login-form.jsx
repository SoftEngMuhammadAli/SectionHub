"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Eye, ShieldCheck } from "lucide-react";
import { loginActionState } from "@/app/actions";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginActionState,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="mb-1">
        <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Sign In
        </h1>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Access the SectionHub admin workspace.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-[12px] font-semibold text-[var(--text-primary)]">
          Email address
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@sectionhub.io"
          required
          className="sectionhub-input h-[40px]"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-[12px] font-semibold text-[var(--text-primary)]">
          Password
        </span>
        <div className="relative">
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="sectionhub-input h-[40px] pr-10"
          />
          <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
        </div>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[var(--text-secondary)]">
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="rememberMe"
            className="sectionhub-checkbox"
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-[var(--primary)]"
        >
          Forgot password?
        </Link>
      </div>

      {state.error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(90deg,var(--color-primary)_0%,#7b5dff_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(109,76,255,0.18)] transition-colors hover:brightness-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
        {!pending ? <ArrowRight className="h-4 w-4" /> : null}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
        2FA Protected
      </div>
    </form>
  );
}
