import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { packages } from '../../data/packages';
import PackageCard, { cardVariants } from '../packages/PackageCard';
import SectionHeader from '../shared/SectionHeader';

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function FeaturedPackages() {
  const featured = packages.slice(0, 3);

  return (
    <section className="py-20 px-5 md:px-8 bg-[#FFFBF4]" id="featured-packages">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader
            badge="Tour Packages"
            title="Handpicked Araku Experiences"
            subtitle="From quick day trips to immersive multi-day journeys — curated for every kind of traveller."
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10"
        >
          {featured.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </motion.div>

        <div className="text-center">
          <Link
            to="/packages"
            id="view-all-packages"
            className="inline-flex items-center gap-2 text-[#2D6A4F] font-semibold text-base hover:underline transition-all"
          >
            View All Packages →
          </Link>
        </div>
      </div>
    </section>
  );
}
