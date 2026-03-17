import { cn } from "./cn";
export function Card({ children, className = "" }) {
  return <div className={cn("sectionhub-card", className)}>{children}</div>;
}
