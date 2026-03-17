import { AuthShell } from "@/components/shared/layout/auth-shell";
import { resetPasswordAction } from "@/app/actions";
export default async function ResetPasswordPage({ searchParams, }) {
    const params = await searchParams;
    const error = typeof params.error === "string" ? params.error : "";
    const success = params.success === "1";
    return (<AuthShell title="Reset Password" subtitle="Choose a strong password and restore access securely.">
      <form action={resetPasswordAction} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-[12px] font-medium">Reset token</span>
          <input name="token" className="sectionhub-input font-mono" placeholder="Paste token from forgot-password"/>
        </label>
        <label className="block space-y-2">
          <span className="text-[12px] font-medium">New password</span>
          <input name="password" type="password" className="sectionhub-input"/>
        </label>
        <label className="block space-y-2">
          <span className="text-[12px] font-medium">Confirm password</span>
          <input name="confirmPassword" type="password" className="sectionhub-input"/>
        </label>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-[var(--border)]">
            <div className="h-2 w-3/4 rounded-full bg-[var(--success)]"/>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[12px] text-[var(--text-secondary)]">
            <span>? 8+ chars</span>
            <span>? confirmation match</span>
            <span>? reset token</span>
            <span>? admin safe</span>
          </div>
        </div>
        {error ? (<div className="rounded-[10px] border border-[var(--danger)]/15 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
            {error}
          </div>) : null}
        {success ? (<div className="rounded-[10px] border border-[var(--success)]/15 bg-[var(--success-light)] px-3 py-2 text-[12px] text-[var(--success)]">
            Password updated. Return to login.
          </div>) : null}
        <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">
          Update password
        </button>
      </form>
    </AuthShell>);
}
