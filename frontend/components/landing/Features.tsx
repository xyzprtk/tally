"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IsoUpload,
  IsoStats,
  IsoVisualizations,
  IsoDataOps,
  IsoEDA,
  IsoLLMChat,
} from "./isometric";

const features = [
  {
    illustration: IsoUpload,
    title: "Upload Anything",
    description:
      "Drag and drop CSV or JSON files. No setup, no schema definitions. Tally parses it in-memory and you're ready to go.",
    span: "lg:col-span-3",
  },
  {
    illustration: IsoStats,
    title: "Descriptive Stats",
    description:
      "Mean, median, std, quartiles — one click, zero code. Get a full statistical summary of any numeric column instantly.",
    span: "lg:col-span-2",
  },
  {
    illustration: IsoVisualizations,
    title: "Visualizations",
    description:
      "Scatter plots, histograms, correlation heatmaps. Generated instantly with Matplotlib and served as crisp PNGs.",
    span: "lg:col-span-1",
  },
  {
    illustration: IsoDataOps,
    title: "Data Operations",
    description:
      "Filter, sort, and group-by with aggregation. All through the UI. No pandas syntax to memorize.",
    span: "lg:col-span-1",
  },
  {
    illustration: IsoEDA,
    title: "EDA Suite",
    description:
      "Dtype conversion, missing value analysis, outlier detection, distribution checks, and duplicate handling — all in one tab.",
    span: "lg:col-span-1",
  },
  {
    illustration: IsoLLMChat,
    title: "LLM Chat",
    description:
      "Ask questions in plain English. Tally writes the pandas code, runs it in a sandbox, and returns the results with plots.",
    span: "lg:col-span-3",
  },
];

const containerVariants = {
  hidden: {},
  visible: {},
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Everything you need, nothing you don&apos;t.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Tally is a focused toolkit for the repetitive parts of data
            exploration. No notebooks. No imports. Just answers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => {
            const Illustration = feature.illustration;
            const isLarge = feature.span.includes("col-span-3") || feature.span.includes("col-span-2");
            const isSmall = feature.span === "lg:col-span-1";
            const isHovered = hoveredCard === feature.title;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                onHoverStart={() => setHoveredCard(feature.title)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`group relative rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-[#C05C46]/30 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(192,92,70,0.12)] overflow-hidden ${feature.span}`}
              >
                {/* Isometric illustration - top right, scaled up */}
                <motion.div
                  className={`absolute top-2 right-2 md:top-3 md:right-3 pointer-events-none ${
                    isLarge
                      ? "w-32 h-32 md:w-36 md:h-36"
                      : isSmall
                        ? "w-24 h-24 md:w-28 md:h-28"
                        : "w-28 h-28 md:w-32 md:h-32"
                  }`}
                  animate={
                    isHovered
                      ? { y: -8, opacity: 1, scale: 1.05 }
                      : { y: 0, opacity: 0.7, scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ color: "#C05C46" }}
                >
                  <Illustration className="w-full h-full" />
                </motion.div>

                {/* Text content - left aligned with padding to avoid SVG collision */}
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-foreground mb-2 pr-20 md:pr-24">
                    {feature.title}
                  </h3>
                  <p className={`text-sm text-muted-foreground leading-relaxed ${
                    isLarge ? "max-w-[65%] md:max-w-[60%]" : "max-w-[60%] md:max-w-[55%]"
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
