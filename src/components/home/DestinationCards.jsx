import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const destinations = [
  {
    name: 'Vanjangi Hills',
    tagline: 'Sea of Clouds at Sunrise',
    image: '/vanajangi.jpg',
    to: '/vanjangi',
    id: 'dest-vanjangi',
    color: '#2D6A4F',
  },
  {
    name: 'Lambasingi',
    tagline: 'Kashmir of Andhra Pradesh',
    image: '/lambasingi.jpg',
    to: '/lambasingi',
    id: 'dest-lambasingi',
    color: '#7C4F2F',
  },
  {
    name: 'Borra Caves',
    tagline: 'Ancient Limestone Caverns',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=600',
    to: '/packages',
    id: 'dest-borra',
    color: '#52B788',
  },
  {
    name: 'Araku Valley',
    tagline: 'Coffee, Tribes & Waterfalls',
    image: 'https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=600',
    to: '/packages',
    id: 'dest-araku',
    color: '#E9A84C',
  },
];

export default function DestinationCards() {
  return (
    <section className="py-20 px-5 md:px-8 bg-[#EFF7F2]" id="destinations">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader
            badge="Destinations"
            title="Explore the Eastern Ghats"
            subtitle="Each destination tells a different story — from misty hilltops to ancient caves."
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                to={dest.to}
                id={dest.id}
                className="group relative block rounded-[16px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ height: '280px', cursor: 'pointer' }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="group-hover:scale-105 transition-transform duration-500"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    zIndex: 0,
                  }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/visakhapatnam-araku-valley.jpg';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0) 100%)',
                  borderRadius: 'inherit',
                  zIndex: 1,
                }} />
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ zIndex: 2 }}>
                  <h3 className="font-playfair font-bold text-white text-lg leading-tight">{dest.name}</h3>
                  <p className="text-white/80 text-xs mt-1">{dest.tagline}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
