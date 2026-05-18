import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { packages } from '../data/packages';
import ItineraryAccordion from '../components/packages/ItineraryAccordion';
import PackageCard from '../components/packages/PackageCard';
import StarRating from '../components/shared/StarRating';
import Badge from '../components/shared/Badge';
import { MapPin, Clock, CheckCircle, ArrowLeft, MessageCircle, Users } from 'lucide-react';

const badgeColorMap = { 'Most Popular': 'gold', 'Best Value': 'sage', 'Premium': 'brown' };

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function PackageDetail() {
  const { slug } = useParams();
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) return <Navigate to="/packages" replace />;

  const related = packages.filter((p) => p.id !== pkg.id).slice(0, 3);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 md:pt-32"
    >
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
          <div className="flex gap-2 mb-3">
            {pkg.badge && <Badge color={badgeColorMap[pkg.badge] || 'gray'}>{pkg.badge}</Badge>}
            <Badge color="gray">{pkg.type}</Badge>
          </div>
          <h1 className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight max-w-3xl">{pkg.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 items-center pb-6 border-b border-[#F4E9D8]">
            <div className="flex items-center gap-2">
              <StarRating rating={pkg.rating} showCount count={pkg.reviewCount} />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <MapPin size={15} className="text-[#2D6A4F]" /> {pkg.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Clock size={15} className="text-[#2D6A4F]" /> {pkg.duration}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Users size={15} className="text-[#2D6A4F]" /> {pkg.priceLabel}
            </div>
          </div>

          {/* Includes */}
          {pkg.includes && (
            <div>
              <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">What's Included</h2>
              <div className="flex flex-wrap gap-3">
                {pkg.includes.map((item) => (
                  <span key={item} className="flex items-center gap-2 bg-[#EFF7F2] text-[#2D6A4F] px-5 md:px-8 py-2 rounded-xl text-sm font-medium">
                    <CheckCircle size={16} /> {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {pkg.highlights && (
            <div>
              <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Trip Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pkg.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-[#1C1C1E] bg-[#F4E9D8] px-3 py-2 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#E9A84C] shrink-0" /> {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Day-by-Day Itinerary</h2>
            <ItineraryAccordion itinerary={pkg.itinerary} />
          </div>
        </div>

        {/* Right: Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#FFFBF4] rounded-2xl border border-[#F4E9D8] shadow-xl p-6">
            <div className="mb-5 pb-5 border-b border-[#F4E9D8]">
              {pkg.price ? (
                <>
                  <p className="text-sm text-[#6B7280] mb-1">Starting from</p>
                  <p className="font-playfair font-bold text-[#1C1C1E] text-3xl">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-[#6B7280]">{pkg.priceLabel}</p>
                </>
              ) : (
                <p className="font-playfair font-bold text-[#E9A84C] text-2xl">{pkg.priceLabel}</p>
              )}
            </div>

            <div className="space-y-3">
              <a
                href={pkg.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                id={`book-whatsapp-${pkg.id}`}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={20} /> Book via WhatsApp
              </a>
              <p className="text-center text-xs text-[#6B7280]">Instant confirmation · No booking fees</p>
            </div>

            <div className="mt-6 space-y-3 pt-5 border-t border-[#F4E9D8]">
              {[
                ['Duration', pkg.duration],
                ['Type', pkg.type],
                ['Price for', pkg.priceLabel],
                ['Pickup', 'Visakhapatnam (Vizag)'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">{label}</span>
                  <span className="font-medium text-[#1C1C1E]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="related-packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {related.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
