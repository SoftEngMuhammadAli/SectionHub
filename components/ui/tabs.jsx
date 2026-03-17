"use client";

import React, { useState } from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Tabs = ({ defaultValue, className, children, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (val) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange: handleTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ className, children, activeTab, onTabChange }) => (
  <div
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--surface-soft)] p-1 text-[var(--text-secondary)]",
      className,
    )}
  >
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          activeTab,
          onTabChange,
        });
      }
      return child;
    })}
  </div>
);

const TabsTrigger = ({
  className,
  value,
  children,
  activeTab,
  onTabChange,
  disabled,
}) => {
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onTabChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-[var(--surface-card)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]"
          : "hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
        className,
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ className, value, children, activeTab }) => {
  if (value !== activeTab) return null;
  return (
    <div
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
