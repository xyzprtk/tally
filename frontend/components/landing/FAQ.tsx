"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What file formats does Tally support?",
    answer:
      "CSV and JSON for now. Excel and Parquet are on the roadmap. Tally reads everything as strings first, then infers types — so encoding issues are handled gracefully.",
  },
  {
    question: "Is my data stored on a server?",
    answer:
      "No. Tally stores your dataset in-memory only. It disappears when the server restarts. There is no database, no persistence, and no data leaves your machine if you run Tally locally.",
  },
  {
    question: "Which LLM providers can I use?",
    answer:
      "OpenRouter and Groq. You bring your own API key — Tally never stores it. The key is sent with each request and kept only in your browser's local storage.",
  },
  {
    question: "Is Tally free?",
    answer:
      "Yes. Tally is open source and free to use under the MIT license. You only pay for your own LLM API usage if you use the chat feature.",
  },
  {
    question: "Can I run Tally locally?",
    answer:
      "Absolutely. Clone the repo, install the Python backend dependencies, run the FastAPI server, and start the Next.js frontend. Both run on localhost with zero external dependencies.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Frequently asked questions.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know before diving in.
          </p>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between py-5 text-left group"
              >
                <span className="text-base font-medium text-foreground group-hover:text-[#C05C46] transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="ml-4 shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
