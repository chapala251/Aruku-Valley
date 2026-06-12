import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ArakuNavTabs from '../components/ArakuNavTabs';
import PackageCard, { cardVariants } from '../components/packages/PackageCard';
import SectionHeader from '../components/shared/SectionHeader';
import CustomBookingModal from '../components/shared/CustomBookingModal';
import BookingModal from '../components/shared/BookingModal';
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
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: '', duration: 2 });

  const stored    = localStorage.getItem('user');
  const user      = stored ? JSON.parse(stored) : null;
  const isAdmin   = user?.email === 'arakuecostays@gmail.com';

  useEffect(() => {
    supabase.from('packages').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPackages(data || []); setLoading(false); });
  }, []);

  const filtered = activeType === 'All'
    ? packages
    : packages.filter((p) => p.type === activeType);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-8 md:pt-36"
    >
      <ArakuNavTabs />
      {/* Header */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="packages-header">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '80rem', margin: '0 auto',
        }}>
          <div>
            <p className="text-[#2D6A4F] font-bold text-sm mb-2 tracking-wider">— TOUR PACKAGES —</p>
            <h1 className="font-playfair font-bold text-[#1C1C1E] text-3xl md:text-4xl">Araku Valley Tour Packages</h1>
            <p className="text-[#6B7280] mt-3 max-w-xl">From budget day trips to luxury extended tours — find the perfect Araku experience for you.</p>
          </div>

          {/* Admin button — right side, same row as title */}
          {isAdmin && (
            <Link to="/admin/package/new" style={{
              backgroundColor: '#C4622D', color: '#fff',
              padding: '10px 20px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '13px', fontWeight: '600',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              + Add Package
            </Link>
          )}
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
          <div style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h3 style={{ color: 'white', fontFamily: 'Playfair Display', fontSize: '1.3rem', margin: 0 }}>Can't find what you're looking for?</h3>
              <p style={{ color: '#b7e4c7', margin: '4px 0 0', fontSize: '0.9rem' }}>Build your own custom Araku experience</p>
            </div>
            <button onClick={() => setCustomOpen(true)} style={{ background: 'white', color: '#2D6A4F', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Enquire Custom Package
            </button>
          </div>

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
                <div key={pkg.id} style={{ position: 'relative' }}>
                  <PackageCard
                    pkg={pkg}
                    isAdmin={isAdmin}
                    onBookNow={() => {
                      setSelectedPackage({ name: pkg.title, duration: pkg.duration || 2 });
                      setBookingOpen(true);
                    }}
                  />
                </div>
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

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageName={selectedPackage.name}
        packageDuration={selectedPackage.duration}
      />
      <CustomBookingModal isOpen={customOpen} onClose={() => setCustomOpen(false)} />
    </motion.div>
  );
}
