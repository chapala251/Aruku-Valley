import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, max = 5, size = 16, showCount = false, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? '#E9A84C' : 'none'}
          stroke={i < Math.round(rating) ? '#E9A84C' : '#D1D5DB'}
          strokeWidth={1.5}
        />
      ))}
      {showCount && count > 0 && (
        <span className="text-sm text-[#6B7280] ml-1">({count})</span>
      )}
    </div>
  );
}
