import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TallyLogo from "./TallyLogo";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <TallyLogo variant="icon" size={28} />
              <span className="text-base font-semibold tracking-tight text-foreground">
                Tally
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Built for data scientists who&apos;d rather build models than write
              boilerplate.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Tally. Open source under MIT.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Crafted for analysts, by analysts.
          </p>
        </div>
      </div>
    </footer>
  );
}
