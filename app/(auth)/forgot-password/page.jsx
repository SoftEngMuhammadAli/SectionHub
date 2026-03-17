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
      footer={
        <div className="space-y-2">
          <div>© 2024 SectionHub Inc. All rights reserved.</div>
          <div className="flex items-center justify-center gap-6 text-[13px] text-[var(--text-tertiary)]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      }
    >
      <form action={forgotPasswordAction} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">
            Email address
          </span>
          <div className="relative">
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              required
              className="sectionhub-input pl-10"
            />
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          </div>
        </label>
        <button
          type="submit"
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Send Reset Link <ArrowRight className="h-4 w-4" />
        </button>
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>

        {sent ? (
          <div className="rounded-[8px] bg-[var(--primary-light)] p-3 text-[13px] text-[var(--primary-light-text)]">
            Reset token generated locally:{" "}
            <span className="font-mono-ui">{token}</span>
          </div>
        ) : null}
      </form>
    </AuthShell>
  );
}
