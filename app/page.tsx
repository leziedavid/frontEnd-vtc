
'use client';

import { HowItWorks } from "@/components/home/HowItWorks";
import AppDownload from "@/components/home/pages/AppDownload";
import Footer from "@/components/home/pages/Footer";
import HeroSection from "@/components/home/pages/HeroSection";
import { Navbar } from "@/components/navbar";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <AppDownload />
      <Footer />
    </main>
  );
}