import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      {/* Placeholder for upcoming sections */}
      <div id="how-it-works" className="py-24" />
      <div id="faq" className="py-24" />
    </main>
  );
}
