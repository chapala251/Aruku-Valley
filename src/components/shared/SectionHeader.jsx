import React from 'react';

export default function SectionHeader({ badge, title, subtitle, centered = true, className = '' }) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {badge && (
        <div className="flex items-center gap-2 mb-3 justify-center">
          <span className="w-8 h-0.5 bg-[#52B788]" />
          <span className="text-[#2D6A4F] text-sm font-semibold tracking-widest uppercase">{badge}</span>
          <span className="w-8 h-0.5 bg-[#52B788]" />
        </div>
      )}
      {title && (
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1C1C1E] mb-3 leading-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
