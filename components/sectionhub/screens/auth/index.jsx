import Link from "next/link";
import { Button, Card, Field, Icon } from "@/components/sectionhub/ui";
export function LoginScreen() {
    return (<div className="space-y-5">
      <Field label="Email address">
        <input className="sectionhub-input" placeholder="admin@sectionhub.com"/>
      </Field>
      <Field label="Password">
        <input type="password" className="sectionhub-input" placeholder="Enter your password"/>
      </Field>
      <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked/> Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-[var(--primary)]">
          Forgot password
        </Link>
      </div>
      <div className="rounded-[10px] border border-[var(--danger)]/15 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
        Invalid credentials example state. Use admin access only.
      </div>
      <Button className="w-full">Sign in</Button>
      <div className="flex items-center justify-between text-[12px] text-[var(--text-tertiary)]">
        <span>2FA protected</span>
        <span>Secure internal session</span>
      </div>
    </div>);
}
export function ForgotPasswordScreen() {
    return (<div className="space-y-5">
      <Link href="/login" className="inline-flex items-center gap-2 text-[12px] font-medium text-[var(--primary)]">
        Back to login
      </Link>
      <div className="rounded-[12px] bg-[var(--primary-light)] p-3 text-[var(--primary-light-text)]">
        <Icon name="help" className="h-5 w-5"/>
      </div>
      <Field label="Email address" helper="We'll send a reset link to your admin inbox.">
        <input className="sectionhub-input" placeholder="admin@sectionhub.com"/>
      </Field>
      <div className="rounded-[10px] border border-[var(--warning)]/15 bg-[var(--warning-light)] px-3 py-2 text-[12px] text-[var(--warning)]">
        Invalid email state is supported here.
      </div>
      <Button className="w-full">Send reset link</Button>
      <Card className="bg-[var(--soft-surface)] p-4">
        <div className="text-[13px] font-medium">Success variant</div>
        <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
          Reset link sent to a****@sectionhub.com and resend in 00:42.
        </div>
      </Card>
    </div>);
}
export function ResetPasswordScreen() {
    return (<div className="space-y-5">
      <div className="rounded-[12px] bg-[var(--primary-light)] p-3 text-[var(--primary-light-text)]">
        <Icon name="settings" className="h-5 w-5"/>
      </div>
      <Field label="New password">
        <input type="password" className="sectionhub-input" placeholder="Minimum 12 characters"/>
      </Field>
      <Field label="Confirm password">
        <input type="password" className="sectionhub-input" placeholder="Re-enter password"/>
      </Field>
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-[var(--border)]">
          <div className="h-2 w-3/4 rounded-full bg-[var(--success)]"/>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px] text-[var(--text-secondary)]">
          <span>Yes 12+ chars</span>
          <span>Yes mixed case</span>
          <span>Yes number</span>
          <span>Yes special char</span>
        </div>
      </div>
      <div className="rounded-[10px] border border-[var(--success)]/15 bg-[var(--success-light)] px-3 py-2 text-[12px] text-[var(--success)]">
        Passwords match. Submit is ready.
      </div>
      <Button className="w-full">Update password</Button>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <div className="text-[13px] font-medium">Success state</div>
          <div className="mt-1 text-[12px] text-[var(--text-secondary)]">Password updated. Return to login.</div>
        </Card>
        <Card className="p-4">
          <div className="text-[13px] font-medium">Expired state</div>
          <div className="mt-1 text-[12px] text-[var(--text-secondary)]">Reset token expired. Request a new link.</div>
        </Card>
      </div>
    </div>);
}
