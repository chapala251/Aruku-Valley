import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ArakuNavTabs from '../components/ArakuNavTabs';
import FeaturedPackages from '../components/home/FeaturedPackages';
import DestinationCards from '../components/home/DestinationCards';
import ResortStrip from '../components/home/ResortStrip';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

// CTA Banner
function CTABanner() {
  return (
    <section className="py-24 md:py-32 px-5 md:px-8 bg-[#F4E9D8]" id="cta-banner">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-4xl mb-4">🌿</span>
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-3xl md:text-4xl mb-4">
            Ready to Explore Araku Valley?
          </h2>
          <p className="text-[#6B7280] text-lg mb-8">
            Chat with our local experts on WhatsApp and get a personalised itinerary in minutes — free of charge.
          </p>
          <a
            href="https://wa.me/919573112302"
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            style={{ backgroundColor: '#25D366' }}
          >
            <span className="text-2xl">💬</span>
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ArakuNavTabs />
      <HeroSection />
      <FeaturedPackages />
      <DestinationCards />
      <WhyChooseUs />
      <ResortStrip />
      <Testimonials />
      <CTABanner />
    </motion.div>
  );
}
