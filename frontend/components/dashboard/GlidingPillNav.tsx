"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Pill {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface Props {
  pills: Pill[];
  active: string;
  onSelect: (key: string) => void;
}

export function GlidingPillNav({ pills, active, onSelect }: Props) {
  return (
    <div className="relative inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border">
      {pills.map((pill) => (
        <button
          key={pill.key}
          onClick={() => onSelect(pill.key)}
          className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
            active === pill.key
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {pill.icon}
          <span>{pill.label}</span>
          {active === pill.key && (
            <motion.div
              layoutId="gliding-pill"
              className="absolute inset-0 bg-primary rounded-full -z-10"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
