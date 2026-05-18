import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItineraryAccordion({ itinerary }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {itinerary.map((item, i) => (
        <div key={i} className="border border-[#F4E9D8] rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            id={`itinerary-item-${i}`}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-[#FFFBF4] hover:bg-[#EFF7F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-[#1C1C1E] text-sm">{item.place}</p>
                <p className="text-xs text-[#6B7280]">{item.time}</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-[#6B7280]" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 bg-[#EFF7F2] text-sm text-[#6B7280] border-t border-[#F4E9D8]">
                  {item.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
