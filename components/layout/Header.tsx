// components/layout/Header.jsx
import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import TronLinkAuth from '@/components/auth/TronLinkAuth'

const routesPage = [
  { label: "Home", href: "0" },
  { label: "Marketplace", href: "2" },
]

export default function Header({ activeSection, setActiveSection }: any) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: any, href: any) => {
    e.preventDefault();
    setActiveSection(Number(href));
  }

  console.log(activeSection)

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 py-4 px-6 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-blue-900 bg-opacity-80 backdrop-filter backdrop-blur-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a onClick={(e) => handleNavClick(e, "0")} className="flex items-center cursor-pointer">
        <Image src="/images/datron-logo.svg" alt="DATRON Logo" width={40} height={40} />
        {/* <span className="ml-2 text-xl font-bold text-white">Datron</span> */}
      </a>

      <nav className="hidden md:flex space-x-6">
        {routesPage.map((route, index) => (
          <a 
            key={index} 
            onClick={(e) => handleNavClick(e, route.href)}
            className={`text-white transition-colors duration-200 cursor-pointer ${
              activeSection === Number(route.href) ? 'text-red-400' : 'hover:text-red-400'
            }`}
          >
            {route.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <TronLinkAuth />
      </div>

    </motion.header>
  )
}