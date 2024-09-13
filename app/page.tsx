"use client";
// app/page.tsx
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import HeroSection from "@/components/home/HeroSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white h-full">
      <div className="h-[80px] fixed inset-y-0 w-full z-50 pt-5 px-5">
        <Header />
      </div>
      <main className="h-full">
        <HeroSection />
        {/* Add other sections here */}
      </main>
    </div>
  )
}