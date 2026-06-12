import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopThingsSection() {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    supabase.from('top_things').select('*')
      .eq('published', true)
      .order('rank', { ascending: true })
      .then(({ data }) => setItems(data || []));
  }, []);

  if (items.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '48px 0', backgroundColor: '#FFF8E7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: '800',
            fontSize: '1.6rem', color: '#1C1C1E', margin: 0
          }}>
            Top Things To Do
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => scroll('left')} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '1.5px solid #2D6A4F', backgroundColor: 'white',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#2D6A4F'
            }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '1.5px solid #2D6A4F', backgroundColor: '#2D6A4F',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white'
            }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '16px',
            overflowX: 'auto', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            paddingBottom: '4px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                minWidth: '110px', maxWidth: '110px',
                flexShrink: 0, scrollSnapAlign: 'start',
              }}
            >
              {/* Square image with rank badge */}
              <div style={{
                position: 'relative', width: '110px', height: '110px',
                borderRadius: '14px', overflow: 'hidden',
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
                />
                {/* Gold pennant badge */}
                <div style={{
                  position: 'absolute', top: 0, left: '10px',
                  width: '28px',
                  background: 'linear-gradient(135deg, #F5A623, #E9A84C)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
                  paddingTop: '5px', paddingBottom: '10px',
                  textAlign: 'center',
                  color: 'white', fontWeight: '800', fontSize: '13px',
                  lineHeight: '1',
                }}>
                  {item.rank}
                </div>
              </div>
              {/* Title below image */}
              <p style={{
                marginTop: '10px', marginBottom: 0,
                fontWeight: '600', fontSize: '14px',
                color: '#1C1C1E', lineHeight: '1.35',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
