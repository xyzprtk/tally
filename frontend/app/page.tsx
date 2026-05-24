import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      {/* Placeholder for upcoming sections */}
      <div id="features" className="py-24" />
      <div id="how-it-works" className="py-24" />
      <div id="faq" className="py-24" />
    </main>
  );
}
