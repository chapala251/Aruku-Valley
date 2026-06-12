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

export default function PackageCard({ pkg, isAdmin, onBookNow }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative bg-[#FFFBF4] rounded-2xl overflow-hidden shadow-sm border border-[#F4E9D8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col card-image-zoom"
    >
      {isAdmin && (
        <Link to={`/admin/package/edit/${pkg.id}`} style={{
          position: 'absolute', top: '12px', right: '12px',
          backgroundColor: '#C4622D', color: '#fff',
          fontSize: '11px', fontWeight: '600',
          padding: '4px 10px', borderRadius: '100px',
          textDecoration: 'none', zIndex: 10,
        }}>
          ✏️ Edit
        </Link>
      )}
      {/* Image */}
      <div className="relative overflow-hidden h-36">
        <img
          src={pkg.image}
          alt={pkg.title}
          onError={(e) => {
            e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png';
          }}
          style={{ width: '100%', height: '144px', objectFit: 'cover', display: 'block' }}
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
      <div className="p-3 flex flex-col flex-1">
        <h3 style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.4em',
          lineHeight: '1.4',
          marginBottom: '6px',
          color: '#1C1C1E',
          fontFamily: 'var(--font-playfair)'
        }}>
          {pkg.title}
        </h3>

        <div className="flex items-center gap-1 mb-1">
          <StarRating rating={pkg.rating} size={11} />
          <span className="text-xs text-[#6B7280]">{pkg.rating} ({pkg.reviewCount} reviews)</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-2">
          <MapPin size={14} className="text-[#2D6A4F] shrink-0" />
          <span>{pkg.location}</span>
        </div>

        {/* Includes & Excludes */}
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
          {pkg.excludes?.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 text-xs bg-[#FFF5F5] text-[#C53030] px-2.5 py-1 rounded-full font-medium"
            >
              <span style={{ fontSize: '9px' }}>❌</span>
              {item}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-[#F4E9D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs text-[#6B7280] mb-0.5">Starting from</p>
            {pkg.price ? (
              <div className="flex flex-col">
                {pkg.mrp && pkg.mrp > pkg.price && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-[#9ca3af] line-through">₹{pkg.mrp.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-[#16a34a] bg-[#dcfce7] px-1.5 py-0.5 rounded">
                      Save {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}%
                    </span>
                  </div>
                )}
                <p className="font-playfair font-bold text-[#1C1C1E] text-xl">
                  ₹{pkg.price.toLocaleString('en-IN')}
                  <span className="text-xs text-[#6B7280] font-normal ml-1">/{pkg.priceLabel || pkg.price_label}</span>
                </p>
              </div>
            ) : (
              <p className="font-playfair font-bold text-[#E9A84C] text-lg">{pkg.priceLabel || pkg.price_label}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onBookNow) onBookNow();
              }}
              style={{
                backgroundColor: '#C4622D',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A04E22'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C4622D'}
            >
              Book Now
            </button>
            <Link
              to={`/packages/${pkg.slug}`}
              id={`view-${pkg.id}`}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-1.5 bg-[#2D6A4F] text-white rounded-xl text-xs font-semibold hover:bg-[#245a41] transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
