import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resorts } from '../data/resorts';
import { Star, MapPin, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function ResortDetail() {
  const { slug } = useParams();
  const resort = resorts.find((r) => r.slug === slug);

  if (!resort) return <Navigate to="/resorts" replace />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-24 md:pt-32">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img
          src={resort.image}
          alt={resort.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/resorts" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Resorts
          </Link>
          <span className="inline-block bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">{resort.category}</span>
          <h1 className="font-playfair font-bold text-white text-2xl md:text-4xl">{resort.name}</h1>
          <p className="text-[#E9A84C] font-medium mt-1">{resort.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-[#F4E9D8]">
            <div className="flex items-center gap-1">
              <Star size={16} fill="#E9A84C" stroke="none" />
              <span className="font-bold text-[#1C1C1E]">{resort.rating}</span>
              <span className="text-[#6B7280] text-sm">({resort.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <MapPin size={14} className="text-[#2D6A4F]" /> {resort.location}
            </div>
          </div>

          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-3">About the Resort</h2>
            <p className="text-[#6B7280] leading-relaxed">{resort.description}</p>
          </div>

          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Highlights</h2>
            <div className="space-y-2">
              {resort.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 text-sm text-[#1C1C1E]">
                  <CheckCircle size={16} className="text-[#2D6A4F] shrink-0" /> {h}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {resort.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm bg-[#EFF7F2] text-[#2D6A4F] px-3 py-2 rounded-lg">
                  <CheckCircle size={14} /> {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="sticky top-24 bg-[#FFFBF4] rounded-2xl border border-[#F4E9D8] shadow-xl p-6">
            <p className="text-sm text-[#6B7280] mb-1">Price per night</p>
            <p className="font-playfair font-bold text-3xl text-[#1C1C1E] mb-1">₹{resort.pricePerNight.toLocaleString('en-IN')}</p>
            <p className="text-xs text-[#6B7280] mb-6">Taxes included · Free cancellation</p>
            <a
              href={resort.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              id={`book-resort-detail-${resort.id}`}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={20} /> Book via WhatsApp
            </a>
            <p className="text-center text-xs text-[#6B7280] mt-3">No booking fees · Instant confirmation</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
