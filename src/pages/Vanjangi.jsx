import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { packages } from '../data/packages';
import PackageCard from '../components/packages/PackageCard';
import { Cloud, Thermometer, Clock, MapPin } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const related = packages.filter((p) => p.id === '3n4d-mega' || p.id === '1n2d-vizag-araku');

export default function Vanjangi() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-24 md:pt-32">
      {/* Hero */}
      <section
        className="relative h-96 md:h-[500px] flex items-end"
        style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2D6A4F 100%)' }}
        id="vanjangi-hero"
      >
        <img
          src="/Vanjangi_land.jpg"
          alt="Vanjangi Hills sea of clouds"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <span className="inline-block bg-[#E9A84C] text-[#1C1C1E] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            ☁️ Sea of Clouds
          </span>
          <h1 className="font-playfair font-bold text-white text-4xl md:text-6xl mb-3">Vanjangi Hills</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl">
            Where the clouds sleep below your feet. Experience the most surreal sunrise in Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#EFF7F2]" id="vanjangi-info">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Cloud, label: 'Best Time', value: 'Oct – Jan', desc: 'Sea of Clouds season' },
            { icon: Thermometer, label: 'Temperature', value: '8–22°C', desc: 'Cool & misty' },
            { icon: MapPin, label: 'Altitude', value: '~3,000 ft', desc: 'Above sea level' },
            { icon: Clock, label: 'Best Time', value: '5:30–8 AM', desc: 'Sunrise window' },
          ].map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="bg-[#FFFBF4] rounded-2xl p-5 border border-[#F4E9D8] text-center shadow-sm">
              <Icon size={24} className="text-[#2D6A4F] mx-auto mb-2" />
              <p className="text-xs text-[#6B7280] mb-1">{label}</p>
              <p className="font-playfair font-bold text-[#1C1C1E] text-xl">{value}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#FFFBF4]" id="vanjangi-about">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-3xl mb-6">About Vanjangi Hills</h2>
          <div className="prose text-[#6B7280] leading-relaxed space-y-4">
            <p>
              Vanjangi Hills, perched at approximately 3,000 feet above sea level in the Eastern Ghats of Andhra Pradesh, is one of India's best-kept secrets for sunrise seekers. Located around 45–50 km from Araku Valley, this remote hilltop offers a phenomenon that draws photographers and nature lovers from across the country: a stunning "sea of clouds" that fills the valleys below at sunrise.
            </p>
            <p>
              From October to January, the overnight cold causes dense fog to settle in the valleys below. When the sun rises over the peaks, it illuminates a vast carpet of white clouds stretching to the horizon — with only the hilltops visible like islands in a white ocean. The experience lasts just 2–3 hours before the clouds dissipate.
            </p>
            <p>
              The roads to Vanjangi are narrow and winding, passing through dense forest. An overnight stay in or near Vanjangi village is essential to witness the sunrise clouds. The journey itself, through tribal villages and coffee estates, is part of the adventure.
            </p>
          </div>

          <div className="mt-8 bg-[#EFF7F2] rounded-2xl p-6 border border-[#F4E9D8]">
            <h3 className="font-playfair font-semibold text-[#1C1C1E] text-xl mb-4">🗺️ How to Reach Vanjangi</h3>
            <div className="space-y-3 text-sm text-[#6B7280]">
              <p>📍 <strong className="text-[#1C1C1E]">From Vizag:</strong> ~130 km, approximately 4–5 hours by road</p>
              <p>📍 <strong className="text-[#1C1C1E]">From Araku:</strong> ~45–50 km, approximately 1.5–2 hours</p>
              <p>🚗 <strong className="text-[#1C1C1E]">Vehicle:</strong> SUV or local jeep recommended (roads not suitable for sedans)</p>
              <p>⚠️ <strong className="text-[#1C1C1E]">Note:</strong> Roads close during heavy monsoon rain</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="vanjangi-packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">Packages Including Vanjangi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {related.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
