"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  IsoHowUpload,
  IsoHowExplore,
  IsoHowAsk,
  IsoHowExport,
} from "./isometric";

const steps = [
  {
    number: "01",
    illustration: IsoHowUpload,
    title: "Upload",
    description: "Drop your CSV or JSON. Tally parses it in-memory and shows you the schema instantly.",
  },
  {
    number: "02",
    illustration: IsoHowExplore,
    title: "Explore",
    description: "Run stats, charts, and EDA with zero code. Every widget is one click away.",
  },
  {
    number: "03",
    illustration: IsoHowAsk,
    title: "Ask",
    description: "Chat with an LLM. It writes pandas for you, runs it safely, and returns plots.",
  },
  {
    number: "04",
    illustration: IsoHowExport,
    title: "Export",
    description: "Download your cleaned, transformed dataset as CSV when you're done.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {},
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const arrowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

export function HowItWorks() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {steps.map((step, index) => {
            const Illustration = step.illustration;
            const isHovered = hoveredCard === step.number;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.number}
                variants={stepVariants}
                onHoverStart={() => setHoveredCard(step.number)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <div className="group relative rounded-2xl border border-border bg-card p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                  {/* Step number watermark */}
                  <span className="absolute top-2 left-3 text-5xl md:text-6xl font-bold text-muted/15 tracking-tighter leading-none select-none pointer-events-none">
                    {step.number}
                  </span>

                  {/* Isometric illustration - top right */}
                  <motion.div
                    className="absolute top-3 right-3 md:top-4 md:right-4 w-20 h-20 md:w-24 md:h-24 pointer-events-none"
                    animate={
                      isHovered
                        ? { y: -6, opacity: 1, scale: 1.04 }
                        : { y: 0, opacity: 0.7, scale: 1 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ color: "#C05C46" }}
                  >
                    <Illustration className="w-full h-full" />
                  </motion.div>

                  {/* Text content */}
                  <div className="relative z-10 pt-12">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector arrow - desktop only, not on last item */}
                {!isLast && (
                  <motion.div
                    variants={arrowVariants}
                    className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-card border border-border text-muted-foreground/40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
