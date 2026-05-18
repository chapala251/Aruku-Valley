import React from 'react';
import { motion } from 'framer-motion';
import { packages } from '../data/packages';
import PackageCard from '../components/packages/PackageCard';
import { Snowflake, Thermometer, Clock, MapPin, Apple } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const related = packages.filter((p) => p.id === '3n4d-mega' || p.id === 'summer-vizag-araku-2');

export default function Lambasingi() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-24 md:pt-32">
      {/* Hero */}
      <section
        className="relative h-96 md:h-[500px] flex items-end"
        style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #7C4F2F 100%)' }}
        id="lambasingi-hero"
      >
        <img
          src="/Lambasinghi-land.jpg"
          alt="Lambasingi Hills — misty winter landscape"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <span className="inline-block bg-[#E9A84C] text-[#1C1C1E] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            ❄️ Kashmir of Andhra Pradesh
          </span>
          <h1 className="font-playfair font-bold text-white text-4xl md:text-6xl mb-3">Lambasingi Hills</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl">
            AP's coldest hill station — apple orchards, strawberry farms, and frost-kissed mornings await.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#F4E9D8]" id="lambasingi-info">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Snowflake, label: 'Coldest Temp', value: 'Near 0°C', desc: 'December – January' },
            { icon: Thermometer, label: 'Summer Temp', value: '18–28°C', desc: 'March – May' },
            { icon: MapPin, label: 'Altitude', value: '~1,000m', desc: 'Above sea level' },
            { icon: Apple, label: 'Harvest Season', value: 'Dec – Feb', desc: 'Strawberry farms' },
          ].map(({ icon: Icon, label, value, desc }) => (
            <div key={label} className="bg-[#FFFBF4] rounded-2xl p-5 border border-[#F4E9D8] text-center shadow-sm">
              <Icon size={24} className="text-[#7C4F2F] mx-auto mb-2" />
              <p className="text-xs text-[#6B7280] mb-1">{label}</p>
              <p className="font-playfair font-bold text-[#1C1C1E] text-xl">{value}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#FFFBF4]" id="lambasingi-about">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-3xl mb-6">About Lambasingi</h2>
          <div className="space-y-4 text-[#6B7280] leading-relaxed">
            <p>
              Lambasingi — often called the "Kashmir of Andhra Pradesh" — is a small hill station in the Chintapalli mandal of Visakhapatnam district. Situated at around 1,000 metres above sea level, it is the coldest place in Andhra Pradesh, with temperatures sometimes dropping below 0°C in December and January.
            </p>
            <p>
              Unlike most hill stations in peninsular India, Lambasingi experiences frost and near-freezing temperatures during winter, making it genuinely unique. The surrounding hills are covered with apple orchards, strawberry farms, and misty pine groves that create a landscape entirely unlike the rest of AP.
            </p>
            <p>
              The Thajangi Reservoir nearby is another highlight — a serene, vast water body surrounded by hills, perfect for sunrise photography. The local tribal market sells fresh strawberries, apples, and honey during the harvest season.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: '🍓', title: 'Strawberry Farms', desc: 'Pick fresh strawberries Dec–Feb' },
              { emoji: '💧', title: 'Thajangi Reservoir', desc: 'Sunrise photography spot' },
              { emoji: '🌫️', title: 'Frost Mornings', desc: 'Near-zero temps in winter' },
            ].map((h) => (
              <div key={h.title} className="bg-[#EFF7F2] rounded-2xl p-5 border border-[#F4E9D8]">
                <span className="text-3xl block mb-2">{h.emoji}</span>
                <h3 className="font-playfair font-semibold text-[#1C1C1E] mb-1">{h.title}</h3>
                <p className="text-sm text-[#6B7280]">{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#F4E9D8] rounded-2xl p-6">
            <h3 className="font-playfair font-semibold text-[#1C1C1E] text-xl mb-4">🗺️ How to Reach Lambasingi</h3>
            <div className="space-y-3 text-sm text-[#6B7280]">
              <p>📍 <strong className="text-[#1C1C1E]">From Vizag:</strong> ~100 km, approximately 3–3.5 hours</p>
              <p>📍 <strong className="text-[#1C1C1E]">From Araku:</strong> ~65 km, approximately 2 hours</p>
              <p>🌡️ <strong className="text-[#1C1C1E]">Carry:</strong> Very warm clothes if visiting Dec–Jan (near-zero at night)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="lambasingi-packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">Packages Including Lambasingi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {related.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
