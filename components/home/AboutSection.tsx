import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from "framer-motion"
import { ArrowRight, Database, ShieldCheck, Zap, Link as ChainLink, Globe } from "lucide-react"

const features = [
  {
    icon: <Database className="w-12 h-12 text-blue-400" />,
    title: "Decentralized Data Storage",
    description: "Securely store AI datasets on our blockchain-powered decentralized network."
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-green-400" />,
    title: "Data Integrity & Verification",
    description: "Leverage blockchain to ensure data authenticity and immutable audit trails."
  },
  {
    icon: <Zap className="w-12 h-12 text-yellow-400" />,
    title: "Smart Contract Matching",
    description: "Utilize smart contracts for automated, secure, and transparent data transactions."
  },
  {
    icon: <ChainLink className="w-12 h-12 text-purple-400" />,
    title: "Interoperable AI Ecosystems",
    description: "Connect various AI projects and datasets through our blockchain network."
  },
  {
    icon: <Globe className="w-12 h-12 text-red-400" />,
    title: "Global Accessibility",
    description: "Access a worldwide marketplace of AI datasets with transparent pricing and ownership."
  }
]

interface AboutSectionProps {
  isActive?: boolean;
}

export default function AboutSection({ isActive = false }: AboutSectionProps) {
  const controls = useAnimation()
  const sectionRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [isActive, controls])

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.section
      className="py-20 bg-gradient-to-b from-blue-900 to-purple-900 text-white min-h-screen flex items-center"
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center"
          variants={itemVariants}
        >
          How Datron's Blockchain-Powered AI Marketplace Works
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}