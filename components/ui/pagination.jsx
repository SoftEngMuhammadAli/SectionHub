import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";
import { Button } from "@/components/ui/button";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <PaginationItem>
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className, isActive ? "bg-[var(--surface-soft)]/50" : "")}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = "PaginationLink";

export { Pagination, PaginationContent, PaginationItem, PaginationLink };
