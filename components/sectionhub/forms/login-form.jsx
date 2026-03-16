"use client";
import Link from "next/link";
import { useActionState } from "react";
import { loginActionState } from "@/app/actions";
const initialState = {
  error: "",
};
export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginActionState,
    initialState,
  );
  return (
    <form action={formAction} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-[12px] font-medium">Email address</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          required
          className="sectionhub-input"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[12px] font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          className="sectionhub-input"
        />
      </label>
      <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="rememberMe" defaultChecked /> Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-[var(--primary)]"
        >
          Forgot password
        </Link>
      </div>
      {state.error ? (
        <div className="rounded-[10px] border border-[var(--danger)]/15 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
          {state.error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <div className="flex items-center justify-between text-[12px] text-[var(--text-tertiary)]">
        <span>2FA protected note</span>
        <span>Admin only</span>
      </div>
    </form>
  );
}
