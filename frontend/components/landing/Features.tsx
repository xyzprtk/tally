"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  BarChart3,
  LineChart,
  Filter,
  SearchCheck,
  MessageSquareCode,
} from "lucide-react";
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
    icon: Upload,
    illustration: IsoUpload,
    title: "Upload Anything",
    description:
      "Drag and drop CSV or JSON files. No setup, no schema definitions. Tally parses it in-memory and you're ready to go.",
    span: "lg:col-span-3",
  },
  {
    icon: BarChart3,
    illustration: IsoStats,
    title: "Descriptive Stats",
    description:
      "Mean, median, std, quartiles — one click, zero code. Get a full statistical summary of any numeric column instantly.",
    span: "lg:col-span-2",
  },
  {
    icon: LineChart,
    illustration: IsoVisualizations,
    title: "Visualizations",
    description:
      "Scatter plots, histograms, correlation heatmaps. Generated instantly with Matplotlib and served as crisp PNGs.",
    span: "lg:col-span-1",
  },
  {
    icon: Filter,
    illustration: IsoDataOps,
    title: "Data Operations",
    description:
      "Filter, sort, and group-by with aggregation. All through the UI. No pandas syntax to memorize.",
    span: "lg:col-span-1",
  },
  {
    icon: SearchCheck,
    illustration: IsoEDA,
    title: "EDA Suite",
    description:
      "Dtype conversion, missing value analysis, outlier detection, distribution checks, and duplicate handling — all in one tab.",
    span: "lg:col-span-1",
  },
  {
    icon: MessageSquareCode,
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
            const Icon = feature.icon;
            const Illustration = feature.illustration;
            const isLarge = feature.span.includes("col-span-3") || feature.span.includes("col-span-2");
            const isHovered = hoveredCard === feature.title;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                onHoverStart={() => setHoveredCard(feature.title)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`group relative rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-[#C05C46]/30 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(192,92,70,0.12)] overflow-hidden ${feature.span}`}
              >
                {/* Isometric illustration - top right */}
                <motion.div
                  className={`absolute top-3 right-3 md:top-4 md:right-4 pointer-events-none ${
                    isLarge ? "w-24 h-24 md:w-28 md:h-28" : "w-20 h-20 md:w-24 md:h-24"
                  }`}
                  animate={
                    isHovered
                      ? { y: -6, opacity: 0.9, scale: 1.04 }
                      : { y: 0, opacity: 0.55, scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ color: "#C05C46" }}
                >
                  <Illustration className="w-full h-full" />
                </motion.div>

                <div className="relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C05C46]/10 text-[#C05C46] mb-5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[90%]">
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
