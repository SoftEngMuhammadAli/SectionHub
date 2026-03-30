import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { AuthShell } from "@/components/shared/layout/auth-shell";
import { resetPasswordAction } from "@/app/actions";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const success = params.success === "1";
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Regain access by setting a secure new password for your account."
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      }
    >
      <form action={resetPasswordAction} className="space-y-5">
        <input type="hidden" name="token" value={token} />

        {!token ? (
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold text-[var(--text-primary)]">
              Reset token
            </span>
            <input
              name="token"
              className="sectionhub-input font-mono-ui"
              placeholder="Paste reset token"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">
            New Password
          </span>
          <div className="relative">
            <input
              name="password"
              type="password"
              className="sectionhub-input h-[40px] pr-10"
            />
            <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">
            Confirm Password
          </span>
          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              className="sectionhub-input h-[40px] pr-10"
            />
            <Eye className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          </div>
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            <span>Password Strength</span>
            <span className="rounded-[6px] bg-[var(--primary-light)] px-2 py-1 text-[10px] font-semibold text-[var(--primary-light-text)]">
              Strong (75%)
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--border-default)]">
            <div className="h-1.5 w-3/4 rounded-full bg-[var(--primary)]" />
          </div>

          <div className="rounded-[8px] bg-[var(--surface-soft)] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
            <div>✓ Minimum 12 characters</div>
            <div className="mt-2">✓ At least one number</div>
            <div className="mt-2 text-[var(--text-tertiary)]">
              ○ Includes a special character (!@#)
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-3 py-2 text-[12px] text-[var(--success)]">
            Password updated. Return to login.
          </div>
        ) : null}

        <button
          type="submit"
          className="inline-flex h-[42px] w-full items-center justify-center rounded-[8px] bg-[linear-gradient(90deg,var(--color-primary)_0%,#7b5dff_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(109,76,255,0.18)]"
        >
          Update Password
        </button>
      </form>
    </AuthShell>
  );
}
