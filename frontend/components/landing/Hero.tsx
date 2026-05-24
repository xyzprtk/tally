"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { DataVisual } from "./DataVisual";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground"
            >
              Skip the{" "}
              <span className="text-[#C05C46]">boilerplate</span>.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              Tally handles your descriptive stats, plots, and EDA — so you can
              focus on the model.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-[#C05C46] text-[#F9F8F6] hover:bg-[#D4715A] transition-all active:scale-[0.98] shadow-[0_4px_20px_-4px_rgba(192,92,70,0.35)]"
              >
                Launch Tally
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-full border border-border bg-background hover:bg-muted transition-colors active:scale-[0.98]"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm text-muted-foreground/60"
            >
              Open source. Free forever. No signup required.
            </motion.p>
          </motion.div>

          {/* Right: Abstract Data Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-border bg-card/30 overflow-hidden">
              <DataVisual />
            </div>
            {/* Subtle glow behind */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl blur-3xl opacity-20"
              style={{ background: "#C05C46" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
