import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resorts } from '../data/resorts';
import ArakuNavTabs from '../components/ArakuNavTabs';
import { Star, MapPin, Wifi, Coffee, Car, Flame, MessageCircle } from 'lucide-react';
import SectionHeader from '../components/shared/SectionHeader';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Coffee Lounge': Coffee,
  'Parking': Car,
  'Bonfire': Flame,
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function Resorts() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-8 md:pt-36">
      <ArakuNavTabs />
      {/* Header */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="resorts-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Where to Stay"
            title="Resorts & Hotels in Araku Valley"
            subtitle="Handpicked stays that bring you closer to the magic of the Eastern Ghats."
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#FFFBF4]" id="resorts-grid">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {resorts.map((resort, i) => (
            <motion.div
              key={resort.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-[#FFFBF4] rounded-2xl overflow-hidden shadow-sm border border-[#F4E9D8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-400"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {resort.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  ₹{resort.pricePerNight.toLocaleString('en-IN')}<span className="text-xs font-normal">/night</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl">{resort.name}</h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={14} fill="#E9A84C" stroke="none" />
                    <span className="text-sm font-bold text-[#1C1C1E]">{resort.rating}</span>
                    <span className="text-xs text-[#6B7280]">({resort.reviewCount})</span>
                  </div>
                </div>
                <p className="text-sm text-[#E9A84C] font-medium mb-2">{resort.tagline}</p>
                <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mb-4">
                  <MapPin size={13} className="text-[#2D6A4F]" /> {resort.location}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-5 line-clamp-2">{resort.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {resort.amenities.slice(0, 5).map((a) => (
                    <span key={a} className="text-xs bg-[#EFF7F2] text-[#2D6A4F] px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                  {resort.amenities.length > 5 && (
                    <span className="text-xs bg-[#F4E9D8] text-[#6B7280] px-2.5 py-1 rounded-full">+{resort.amenities.length - 5} more</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <a
                    href={resort.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`book-resort-${resort.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={16} /> Book Now
                  </a>
                  <Link
                    to={`/resorts/${resort.slug}`}
                    id={`view-resort-${resort.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#245a41] transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
