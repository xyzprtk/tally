"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  sectionKey: string;
}

export function SectionTransition({ children, sectionKey }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sectionKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
