import React from 'react';

const colorMap = {
  gold: 'bg-[#E9A84C] text-[#1C1C1E]',
  brown: 'bg-[#7C4F2F] text-white',
  sage: 'bg-[#52B788] text-white',
  gray: 'bg-[#6B7280] text-white',
  green: 'bg-[#2D6A4F] text-white',
  sky: 'bg-[#EFF7F2] text-[#2D6A4F]',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span
      className={`
        inline-block px-3 py-1 text-xs font-semibold rounded-full
        tracking-wider uppercase
        ${colorMap[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
