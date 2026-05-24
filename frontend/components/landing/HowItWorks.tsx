"use client";

import { motion } from "framer-motion";
import { Upload, BarChart3, MessageSquareCode, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    description: "Drop your CSV or JSON. Tally parses it in-memory and shows you the schema instantly.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Explore",
    description: "Run stats, charts, and EDA with zero code. Every widget is one click away.",
  },
  {
    number: "03",
    icon: MessageSquareCode,
    title: "Ask",
    description: "Chat with an LLM. It writes pandas for you, runs it safely, and returns plots.",
  },
  {
    number: "04",
    icon: Download,
    title: "Export",
    description: "Download your cleaned, transformed dataset as CSV when you're done.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            How it works.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            From raw data to insight in four steps. No setup, no dependencies, no friction.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative"
              >
                <span className="text-5xl font-bold text-muted/60 tracking-tighter">
                  {step.number}
                </span>
                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C05C46]/10 text-[#C05C46]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
