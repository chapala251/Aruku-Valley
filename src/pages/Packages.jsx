import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { packages } from '../data/packages';
import PackageCard, { cardVariants } from '../components/packages/PackageCard';
import SectionHeader from '../components/shared/SectionHeader';
import { Filter } from 'lucide-react';

const types = ['All', 'Day Trip', 'Overnight', 'Extended Tour', 'Summer Special'];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

export default function Packages() {
  const [activeType, setActiveType] = useState('All');

  const filtered = activeType === 'All'
    ? packages
    : packages.filter((p) => p.type === activeType);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-28 md:pt-36"
    >
      {/* Header */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="packages-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Tour Packages"
            title="Araku Valley Tour Packages"
            subtitle="From budget day trips to luxury extended tours — find the perfect Araku experience for you."
          />
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 px-5 md:px-8 bg-[#FFFBF4] border-b border-[#F4E9D8] sticky top-16 z-40 shadow-sm" id="packages-filter">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter size={16} className="text-[#6B7280] shrink-0" />
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              id={`filter-${type.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-5 md:px-8 py-2 rounded-full text-sm font-semibold transition-all ${activeType === type
                  ? 'bg-[#2D6A4F] text-white shadow-md'
                  : 'bg-[#EFF7F2] text-[#6B7280] hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]'
                }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-sm text-[#6B7280]">{filtered.length} packages</span>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#FFFBF4]" id="packages-grid">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#6B7280]">
              <p className="text-2xl mb-2">🌿</p>
              <p className="text-lg font-medium">No packages found for this filter.</p>
            </div>
          ) : (
            <motion.div
              key={activeType}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
            >
              {filtered.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#2D6A4F]" id="packages-cta">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-playfair font-bold text-white text-2xl mb-3">Can't find what you're looking for?</h3>
          <p className="text-white/80 mb-6">We create custom packages too! Tell us your dates and group size on WhatsApp.</p>
          <a
            href="https://wa.me/919573112302"
            target="_blank"
            rel="noopener noreferrer"
            id="packages-whatsapp-cta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            💬 Get Custom Package Quote
          </a>
        </div>
      </section>
    </motion.div>
  );
}
