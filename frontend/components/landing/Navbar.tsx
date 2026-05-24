"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import TallyLogo from "./TallyLogo";
import { GithubIcon } from "./GithubIcon";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="flex items-center gap-6 rounded-full border border-border bg-background/80 backdrop-blur-md px-5 py-2.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <TallyLogo variant="icon" size={28} className="shrink-0" />
          <span className="text-base font-semibold tracking-tight text-foreground">
            Tally
          </span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-border shrink-0" />

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <div className="h-5 w-px bg-border" />
          <a
            href="https://github.com/xyzprtk/tally"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link
            href="/app"
            className="px-4 py-1.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            Launch Tally
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
