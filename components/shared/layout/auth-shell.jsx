import { Card } from "@/components/ui/card";
import { Icon } from "@/components/sectionhub/ui";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  mode = "centered",
  heroIcon = "help",
}) {
  if (mode === "framed") {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background-app)]">
        <header className="border-b border-[var(--border-default)] bg-white">
          <div className="mx-auto flex h-[52px] w-full max-w-[1440px] items-center justify-between px-5 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white">
                <Icon name="grid" className="h-4 w-4" />
              </div>
              <div className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                SectionHub
              </div>
            </div>
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              Help Center
            </span>
          </div>
        </header>

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(109,76,255,0.1),transparent_34%),radial-gradient(circle_at_right,rgba(109,76,255,0.08),transparent_32%)]" />
          <Card className="relative z-10 w-full max-w-[420px] rounded-[12px] border border-[var(--border-default)] p-7 shadow-[var(--shadow-strong)]">
            {title ? (
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Icon name={heroIcon} className="h-6 w-6" />
                </div>
                <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  {title}
                </h1>
                <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-6 text-[var(--text-secondary)]">
                  {subtitle}
                </p>
              </div>
            ) : null}
            {children}
          </Card>
        </main>

        <footer className="border-t border-[var(--border-default)] bg-white px-4 py-5 text-center text-[12px] text-[var(--text-secondary)]">
          {footer ?? "© 2024 SectionHub Inc. All rights reserved."}
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background-app)] px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex items-center justify-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-white">
            <Icon name="grid" className="h-4 w-4" />
          </div>
          <div className="text-[15px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            SectionHub
          </div>
        </div>

        <Card className="rounded-[12px] border border-[var(--border-default)] p-6 shadow-[var(--shadow-strong)]">
          {title ? (
            <div className="mb-5">
              <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {title}
              </h1>
              <p className="mt-2 max-w-[280px] text-[13px] leading-6 text-[var(--text-secondary)]">
                {subtitle}
              </p>
            </div>
          ) : null}
          {children}
        </Card>

        {footer ? (
          <div className="mt-6 text-center text-[12px] text-[var(--text-secondary)]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
