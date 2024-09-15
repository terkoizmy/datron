"use client";
// app/page.tsx
import Header from "@/components/layout/Header"
import HeroSection from "@/components/home/HeroSection"
import AboutSection from "@/components/home/AboutSection";
import ExploreSection from "@/components/home/ExploreSection";
import FullPageScroll from "@/components/home/FullPageScroll";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white h-full relative overflow-hidden">
      <div className="h-[80px] fixed inset-x-0 top-0 z-10 pt-5 px-5">
        <Header />
      </div>
      <FullPageScroll>
        <HeroSection />
        <AboutSection />
        <ExploreSection />
      </FullPageScroll>
    </div>
  )
}