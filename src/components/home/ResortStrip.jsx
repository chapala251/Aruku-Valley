import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resorts } from '../../data/resorts';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

export default function ResortStrip({ onBookNow }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="py-20 px-5 md:px-8 bg-[#FFFBF4]" id="resort-strip">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader
              badge="Where to Stay"
              title="Top Resorts & Hotels"
              subtitle="Handpicked stays that complement your Araku experience."
              centered={false}
            />
            <Link to="/resorts" id="view-all-resorts" className="text-[#2D6A4F] font-semibold text-sm hover:underline flex items-center gap-1 shrink-0">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {isMobile ? (
          <div style={{
            display: 'flex', overflowX: 'auto', gap: '14px',
            padding: '4px 16px 16px', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory',
          }} className="horizontal-scroll">
            {resorts.map(resort => (
              <div key={resort.id} style={{
                minWidth: '260px', maxWidth: '260px',
                backgroundColor: '#fff', borderRadius: '14px',
                overflow: 'hidden', border: '1px solid #E8DDD4',
                boxShadow: '0 2px 10px rgba(100,50,20,0.08)',
                scrollSnapAlign: 'start', flexShrink: 0,
              }}>
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img src={resort.image} alt={resort.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.1rem', fontWeight: 600,
                    color: '#1A120B', margin: '0 0 4px',
                  }}>{resort.name}</h3>
                  <p style={{
                    fontSize: '12px', color: '#9E8B7B',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 10px',
                  }}>{resort.location}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.1rem', fontWeight: 700, color: '#3D5A3E',
                    }}>₹{resort.pricePerNight}<span style={{ fontSize: '11px', color: '#9E8B7B' }}>/night</span></span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onBookNow && onBookNow(resort);
                      }}
                      style={{
                        backgroundColor: '#C4622D', color: '#fff',
                        padding: '6px 14px', borderRadius: '100px',
                        border: 'none', fontSize: '12px', fontWeight: '600',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        cursor: 'pointer',
                      }}
                    >Book →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {resorts.map(resort => (
              <div key={resort.id} style={{
                backgroundColor: '#fff', borderRadius: '14px',
                overflow: 'hidden', border: '1px solid #E8DDD4',
                boxShadow: '0 2px 10px rgba(100,50,20,0.08)',
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }} className="card-image-zoom"
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img src={resort.image} alt={resort.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.1rem', fontWeight: 600,
                    color: '#1A120B', margin: '0 0 4px',
                  }}>{resort.name}</h3>
                  <p style={{
                    fontSize: '12px', color: '#9E8B7B',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 10px',
                  }}>{resort.location}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.1rem', fontWeight: 700, color: '#3D5A3E',
                    }}>₹{resort.pricePerNight}<span style={{ fontSize: '11px', color: '#9E8B7B' }}>/night</span></span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onBookNow && onBookNow(resort);
                      }}
                      style={{
                        backgroundColor: '#C4622D', color: '#fff',
                        padding: '6px 14px', borderRadius: '100px',
                        border: 'none', fontSize: '12px', fontWeight: '600',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        cursor: 'pointer',
                      }}
                    >Book →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
