import { Card } from "@/components/ui/card";
import { Icon } from "@/components/sectionhub/ui";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  mode = "centered",
}) {
  if (mode === "framed") {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background-app)]">
        <header className="border-b border-[var(--border-default)] bg-white">
          <div className="mx-auto flex h-[56px] w-full max-w-[1440px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white">
                <Icon name="grid" className="h-4 w-4" />
              </div>
              <div className="text-[38px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                SectionHub
              </div>
            </div>
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              Help Center
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center bg-gradient-to-r from-[#f7f7fb] to-[#f1f0ff] px-4 py-10">
          <Card className="w-full max-w-[480px] rounded-[16px] border border-[var(--border-default)] p-8 shadow-[var(--shadow-soft)]">
            {title ? (
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Icon name="help" className="h-7 w-7" />
                </div>
                <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                  {title}
                </h1>
                <p className="mt-2 text-[14px] leading-6 text-[var(--text-secondary)]">
                  {subtitle}
                </p>
              </div>
            ) : null}
            {children}
          </Card>
        </main>

        <footer className="border-t border-[var(--border-default)] bg-white px-4 py-6 text-center text-[14px] text-[var(--text-secondary)]">
          {footer ?? "Â© 2024 SectionHub Inc. All rights reserved."}
        </footer>
      </div>
    );
  }

  return (
    <div className="sectionhub-dot-grid flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <Card className="rounded-[16px] border border-[var(--border-default)] p-8 shadow-[var(--shadow-soft)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white">
              <Icon name="grid" className="h-4 w-4" />
            </div>
            <div className="text-[38px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
              SectionHub
            </div>
            <div className="mt-1 text-[14px] text-[var(--text-secondary)]">
              Restricted access Â· Admin only
            </div>
          </div>

          {title ? (
            <div className="mb-5">
              <h1 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                {title}
              </h1>
              <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                {subtitle}
              </p>
            </div>
          ) : null}

          {children}
        </Card>
        <div className="mt-8 text-center font-mono-ui text-[11px] text-[var(--text-tertiary)]">
          {footer ?? "SECTIONHUB V1.0 | INTERNAL USE ONLY | Â© 2026"}
        </div>
      </div>
    </div>
  );
}

