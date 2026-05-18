import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import StarRating from '../shared/StarRating';
import SectionHeader from '../shared/SectionHeader';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-20 px-5 md:px-8 bg-[#2D6A4F]" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader
            badge="Testimonials"
            title={<span className="text-white">What Travellers Say</span>}
            subtitle={<span className="text-white/70">Real stories from people who explored Araku with us.</span>}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {visible.map((t, i) => (
            <motion.div
              key={`${t.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="bg-[#FFFBF4] rounded-2xl p-6 shadow-sm"
            >
              <Quote size={28} className="text-[#E9A84C] mb-3" />
              <p className="text-[#1C1C1E] text-sm leading-relaxed mb-5 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#1C1C1E] text-sm">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.location} · {t.date}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={t.rating} size={12} />
                </div>
              </div>
              <p className="text-xs text-[#52B788] mt-3 font-medium">{t.package}</p>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            id="testimonial-prev"
            className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#E9A84C] w-6' : 'bg-white/40'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            id="testimonial-next"
            className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
