import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { AuthShell } from "@/components/shared/layout/auth-shell";
import { forgotPasswordAction } from "@/app/actions";

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const sent = params.sent === "1";

  return (
    <AuthShell
      mode="framed"
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      heroIcon="help"
      footer={
        <div className="space-y-2">
          <div>© 2024 SectionHub Inc. All rights reserved.</div>
          <div className="flex items-center justify-center gap-6 text-[12px] text-[var(--text-tertiary)]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      }
    >
      <form action={forgotPasswordAction} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">
            Email address
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-[var(--text-tertiary)]">
              <Mail className="h-4 w-4" />
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              required
              className="sectionhub-input h-[40px] pl-11 pr-4 text-[12px]"
            />
          </div>
        </label>
        <button
          type="submit"
          className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(90deg,var(--color-primary)_0%,#7b5dff_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(109,76,255,0.18)] transition-colors hover:brightness-[1.02]"
        >
          Send Reset Link <ArrowRight className="h-4 w-4" />
        </button>
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {sent ? (
          <div className="rounded-[8px] bg-[var(--primary-light)] p-3 text-[12px] text-[var(--primary-light-text)]">
            Reset token generated locally:{" "}
            <span className="font-mono-ui">{token}</span>
          </div>
        ) : null}
      </form>
    </AuthShell>
  );
}
