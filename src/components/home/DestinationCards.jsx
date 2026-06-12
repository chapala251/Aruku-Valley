import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

        {isMobile ? (
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '14px',
            padding: '8px 16px 16px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }} className="horizontal-scroll">
            {destinations.map(dest => (
              <div key={dest.name} style={{
                minWidth: '220px',
                maxWidth: '220px',
                height: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                cursor: 'pointer',
              }}>
                <img src={dest.image} alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 55%)',
                  borderRadius: '16px',
                }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                  <p style={{
                    color: '#FAF7F2', fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem', fontWeight: 600, margin: '0 0 4px',
                  }}>{dest.name}</p>
                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '12px', margin: '0 0 8px',
                  }}>{dest.tagline}</p>
                  <Link to={dest.to} style={{
                    color: '#FAF7F2', fontSize: '12px', fontWeight: '600',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {destinations.map(dest => (
              <div key={dest.name} style={{
                height: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
              }} className="card-image-zoom">
                <img src={dest.image} alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 55%)',
                  borderRadius: '16px',
                }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                  <p style={{
                    color: '#FAF7F2', fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem', fontWeight: 600, margin: '0 0 4px',
                  }}>{dest.name}</p>
                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '12px', margin: '0 0 8px',
                  }}>{dest.tagline}</p>
                  <Link to={dest.to} style={{
                    color: '#FAF7F2', fontSize: '12px', fontWeight: '600',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
