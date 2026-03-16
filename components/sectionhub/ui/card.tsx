import type { ReactNode } from "react";
import { cn } from "./cn";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("sectionhub-card", className)}>{children}</div>;
}
