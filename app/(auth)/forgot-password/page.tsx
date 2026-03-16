import Link from "next/link";
import { AuthShell } from "@/components/sectionhub/layout";
import { forgotPasswordAction } from "@/app/actions";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const sent = params.sent === "1";
  return (
    <AuthShell title="Forgot Password" subtitle="Recover admin access with a time-limited reset link.">
      <form action={forgotPasswordAction} className="space-y-5">
        <Link href="/login" className="inline-flex items-center gap-2 text-[12px] font-medium text-[var(--primary)]">? Back to login</Link>
        <label className="block space-y-2"><span className="text-[12px] font-medium">Email address</span><input name="email" defaultValue="admin@sectionhub.com" className="sectionhub-input" /></label>
        <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">Send reset link</button>
        {sent ? <div className="rounded-[10px] bg-[var(--primary-light)] p-4 text-[12px] text-[var(--primary-light-text)]">Reset token generated locally. Use <span className="font-mono">{token}</span> on the reset screen.</div> : null}
      </form>
    </AuthShell>
  );
}
