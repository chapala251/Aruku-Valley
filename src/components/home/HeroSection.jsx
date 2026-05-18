import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from '../shared/Button';

const containerVariants = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32"
    >
      {/* Background Image */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(26,18,11,0.68) 0%, rgba(61,90,62,0.42) 100%), url('/visakhapatnam-araku-valley.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-5 md:px-8 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center gap-5"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-5 py-2 text-sm font-medium">
              🌿 Eastern Ghats, Andhra Pradesh
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-title font-playfair font-bold text-white"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            Discover Araku Valley
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subtitle text-white/90 max-w-2xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            Lush greenery · Tribal culture · Coffee plantations · Waterfalls
          </motion.p>

          <motion.div variants={itemVariants} className="hero-cta-group mt-6">
            <Link to="/packages">
              <Button variant="primary" size="lg">
                Explore Packages
              </Button>
            </Link>
            <a href="https://wa.me/919573112302" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Plan My Trip ↗
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
