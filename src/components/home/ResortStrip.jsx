import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resorts } from '../../data/resorts';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

export default function ResortStrip() {
  return (
    <section className="py-20 px-5 md:px-8 bg-[#FFFBF4]" id="resort-strip">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader
              badge="Where to Stay"
              title="Top Resorts & Hotels"
              subtitle="Handpicked stays that complement your Araku experience."
              centered={false}
            />
            <Link to="/resorts" id="view-all-resorts" className="text-[#2D6A4F] font-semibold text-sm hover:underline flex items-center gap-1 shrink-0">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {resorts.map((resort, i) => (
            <motion.div
              key={resort.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to={`/resorts/${resort.slug}`}
                id={`resort-card-${resort.id}`}
                className="group block bg-[#FFFBF4] rounded-2xl overflow-hidden shadow-sm border border-[#F4E9D8] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    onError={(e) => {
                      e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png';
                    }}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                    {resort.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-playfair font-bold text-[#1C1C1E] text-base leading-snug mb-1">{resort.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} fill="#E9A84C" stroke="none" />
                    <span className="text-xs font-semibold text-[#1C1C1E]">{resort.rating}</span>
                    <span className="text-xs text-[#6B7280]">({resort.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
                    <MapPin size={11} className="text-[#2D6A4F]" />
                    {resort.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#6B7280]">From <span className="font-bold text-[#1C1C1E] text-sm">₹{resort.pricePerNight.toLocaleString('en-IN')}</span>/night</p>
                    <span className="text-[#2D6A4F] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Book →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
