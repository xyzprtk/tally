"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Settings, LayoutDashboard, BarChart3, Image, Wrench, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import TallyLogo from "@/components/landing/TallyLogo";

export type DashboardSection = "preview" | "stats" | "viz" | "ops" | "eda";

interface Props {
  active: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onOpenSettings: () => void;
}

const navItems: { key: DashboardSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "preview", label: "Data Preview", icon: LayoutDashboard },
  { key: "stats", label: "Stats", icon: BarChart3 },
  { key: "viz", label: "Viz", icon: Image },
  { key: "ops", label: "Ops", icon: Wrench },
  { key: "eda", label: "EDA", icon: Search },
];

export function DashboardNavbar({ active, onNavigate, onOpenSettings }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="flex items-center gap-2 px-2 py-1.5 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-lg shadow-black/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors">
          <TallyLogo variant="icon" size={24} className="shrink-0" />
          <span className="text-sm font-semibold hidden sm:inline">Tally</span>
        </Link>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = active === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
