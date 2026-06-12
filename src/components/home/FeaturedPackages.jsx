import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import PackageCard, { cardVariants } from '../packages/PackageCard';
import SectionHeader from '../shared/SectionHeader';

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function FeaturedPackages({ onBookNow }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.from('packages').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPackages(data || []));
  }, []);

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
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: isMobile ? '12px' : '24px',
            padding: isMobile ? '0 16px' : '0',
          }}
          className="mb-10"
        >
          {(isMobile && !showAllPackages ? packages.slice(0, 2) : packages)
            .map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onBookNow={() => onBookNow && onBookNow(pkg)}
              />
            ))}
        </motion.div>

        {isMobile && !showAllPackages && packages.length > 2 && (
          <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 16px' }}>
            <button
              onClick={() => setShowAllPackages(true)}
              style={{
                padding: '10px 32px', borderRadius: '100px',
                backgroundColor: 'transparent', color: '#C4622D',
                border: '1.5px solid #C4622D', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              View All Packages →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
