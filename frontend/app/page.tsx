import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
    </main>
  );
}
