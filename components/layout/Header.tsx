"use client";

import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'
import TronLinkAuth from '@/components/auth/TronLinkAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

const routesPage = [
  { label: "Home", href: "/", link: "/" },
  { label: "Marketplace", href: "/marketplace", link: "/marketplace" },
]

export default function Header({ activeSection }: { activeSection?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-blue-800 shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/datron-logo.svg" alt="DATRON Logo" width={40} height={40} />
          <span className="text-xl font-bold text-white">Datron</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          {routesPage.map((route) => (
            <Link 
              key={route.href} 
              href={route.link}
              className={`text-white transition-colors duration-200 hover:text-blue-300 ${
                activeSection === route.href ? 'font-semibold' : ''
              }`}
            >
              {route.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link 
              href="/profile"
              className="text-white transition-colors duration-200 hover:text-blue-300"
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <TronLinkAuth />
        </div>
      </div>
    </motion.header>
  )
}