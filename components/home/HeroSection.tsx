import { useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { loadSlim } from "@tsparticles/slim"
import Particles, { initParticlesEngine } from "@tsparticles/react";

export default function HeroSection() {
  const [ init, setInit ] = useState(false);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine)
  }, [])

  const floatingAnimation = {
    y: [0, -20, 0],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      },
      rotate: {
        repeat: Infinity,
        duration: 10,
        ease: "easeInOut"
      }
    }
  }

  useEffect(() => {
    initParticlesEngine(async (engine) => {
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadAll(engine);
        //await loadFull(engine);
        await loadSlim(engine);
        //await loadBasic(engine);
    }).then(() => {
        setInit(true);
      });
  }, []);

  const particlesLoaded = (container: any) => {
    console.log(container);
};

  return (
    <section className="relative h-screen flex bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/images/hero-background2.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-blue-900 bg-opacity-10 backdrop-filter backdrop-blur-sm" />
      
      {/* Particles */}
      <Particles
        className="absolute inset-0"
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              // @ts-ignore
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                // @ts-ignore
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex w-full items-center">
        {/* Left side - Text content */}
        <motion.div 
          className="w-1/2 p-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
            Datron marketplace for 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              {" "}AI developers
            </span>
            {" "}and businesses
          </h1>
          <p className="text-xl mb-8 text-gray-300 font-medium">
            Empower AI with the Right Data, enabling the future of AI development.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Explore Marketplace
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side - Robot image */}
        <motion.div 
          className="w-1/2 relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative w-[500px] h-[500px] mt-[50px]"
            animate={floatingAnimation}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/robot-with-tablet.png"
              alt="AI Robot"
              layout="fill"
              objectFit="contain"
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}