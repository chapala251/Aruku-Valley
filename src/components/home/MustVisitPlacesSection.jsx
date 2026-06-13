import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SectionHeader from '../shared/SectionHeader';

const FALLBACK_IMAGE = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png';

export default function MustVisitPlacesSection() {
  const [places, setPlaces] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    supabase
      .from('must_visit_places')
      .select('*')
      .eq('published', true)
      .order('rank', { ascending: true })
      .then(({ data }) => setPlaces(data || []));
  }, []);

  if (places.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-5 md:px-8 bg-[#EFF7F2]" id="must-visit">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SectionHeader
            badge="Must Visit"
            title="Places in Araku Valley"
            subtitle="Discover the most beautiful spots — from ancient caves to misty hilltops."
          />
        </motion.div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1.5px solid #2D6A4F', backgroundColor: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#2D6A4F',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '1.5px solid #2D6A4F', backgroundColor: '#2D6A4F',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="horizontal-scroll"
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              padding: '8px 4px 16px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {places.map((place) => (
              <div
                key={place.id}
                style={{
                  minWidth: '220px',
                  maxWidth: '220px',
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                }}
                className="card-image-zoom"
              >
                <img
                  src={place.image}
                  alt={place.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 55%)',
                  borderRadius: '16px',
                }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                  <p style={{
                    color: '#FAF7F2',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {place.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
