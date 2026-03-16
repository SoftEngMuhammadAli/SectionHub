import Link from "next/link";
import { AuthShell } from "@/components/sectionhub/layout";
import { loginAction } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  return (
    <AuthShell title="Login" subtitle="Sign in to access the internal admin workspace.">
      <form action={loginAction} className="space-y-5">
        <label className="block space-y-2"><span className="text-[12px] font-medium">Email address</span><input name="email" defaultValue="admin@sectionhub.com" className="sectionhub-input" /></label>
        <label className="block space-y-2"><span className="text-[12px] font-medium">Password</span><input name="password" type="password" defaultValue="admin12345" className="sectionhub-input" /></label>
        <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Remember me</label><Link href="/forgot-password" className="font-medium text-[var(--primary)]">Forgot password</Link></div>
        {error ? <div className="rounded-[10px] border border-[var(--danger)]/15 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">{error}</div> : null}
        <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">Sign in</button>
        <div className="flex items-center justify-between text-[12px] text-[var(--text-tertiary)]"><span>2FA protected note</span><span>Admin only</span></div>
      </form>
    </AuthShell>
  );
}
