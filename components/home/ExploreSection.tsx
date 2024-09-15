// components/ExploreSection.tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Footer from "../layout/Footer";

interface ExploreSectionProps {
  isActive?: boolean;
}

export default function ExploreSection({ isActive = false }: ExploreSectionProps) {
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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white flex flex-col justify-between"
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold mb-6">Empowering AI Development with Blockchain</h2>
            <p className="max-w-2xl mx-auto text-gray-300 mb-12">
              Our blockchain-powered platform revolutionizes the AI data marketplace by ensuring 
              security, transparency, and fair value exchange. We enable AI developers and businesses 
              to collaborate in a decentralized ecosystem, accelerating innovation while maintaining 
              data integrity and ownership rights.
            </p>
            <motion.button 
              className=" bg-gradient-to-r from-red-500 to-pink-500 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Blockchain Solution <ArrowRight className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.section>
  );
}