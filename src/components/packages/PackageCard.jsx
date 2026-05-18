import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import Badge from '../shared/Badge';
import StarRating from '../shared/StarRating';

const badgeColorMap = {
  'Most Popular': 'gold',
  'Best Value': 'sage',
  'Premium': 'brown',
};

function getBadgeColor(badge) {
  return badgeColorMap[badge] || 'gray';
}

export const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PackageCard({ pkg }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#FFFBF4] rounded-2xl overflow-hidden shadow-sm border border-[#F4E9D8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col card-image-zoom"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={pkg.image}
          alt={pkg.title}
          onError={(e) => {
            e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png';
          }}
          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {pkg.badge && <Badge color={getBadgeColor(pkg.badge)}>{pkg.badge}</Badge>}
          <Badge color="gray">{pkg.type}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
          <Clock size={12} />
          {pkg.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.8em',
          lineHeight: '1.4',
          marginBottom: '8px',
          color: '#1C1C1E',
          fontFamily: 'var(--font-playfair)'
        }}>
          {pkg.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={pkg.rating} size={14} />
          <span className="text-sm text-[#6B7280]">{pkg.rating} ({pkg.reviewCount} reviews)</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mb-3">
          <MapPin size={14} className="text-[#2D6A4F] shrink-0" />
          <span>{pkg.location}</span>
        </div>

        {/* Includes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pkg.includes?.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 text-xs bg-[#EFF7F2] text-[#2D6A4F] px-2.5 py-1 rounded-full font-medium"
            >
              <CheckCircle size={10} />
              {item}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-5 border-t border-[#F4E9D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#6B7280] mb-0.5">Starting from</p>
            {pkg.price ? (
              <p className="font-playfair font-bold text-[#1C1C1E] text-xl">
                ₹{pkg.price.toLocaleString('en-IN')}
                <span className="text-xs text-[#6B7280] font-normal ml-1">/{pkg.priceLabel}</span>
              </p>
            ) : (
              <p className="font-playfair font-bold text-[#E9A84C] text-lg">{pkg.priceLabel}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <a
              href={pkg.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              id={`enquiry-${pkg.id}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 md:px-8 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <MessageCircle size={14} />
              Enquire
            </a>
            <Link
              to={`/packages/${pkg.slug}`}
              id={`view-${pkg.id}`}
              className="flex-1 sm:flex-none flex items-center justify-center px-5 md:px-8 py-2.5 bg-[#2D6A4F] text-white rounded-xl text-xs font-semibold hover:bg-[#245a41] transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
