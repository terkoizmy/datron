// components/home/HeroSection.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative h-[100vh] flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <p className="text-red-500 mb-4 font-extrabold">Empower AI with the Right Data</p>
        <h1 className="text-5xl font-bold mb-6">
          Datron marketplace for AI developers and businesses {" "}
          <span className="text-red-500">enabling the future of AI development.</span>
        </h1>
        <div className="flex justify-center space-x-4 ">
          <Link href={"/marketplace"}>
            <Button  className="text-red-500 hover:text-red-700 bg-zinc-800 hover:bg-zinc-700">
              Go to marketplace
            </Button>
          </Link>
          
        </div>
      </div>
    </section>
  )
}