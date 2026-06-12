import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Outdoors', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400' },
  { name: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  { name: 'Culture', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400' },
  { name: 'Water', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400' },
  { name: 'Adventure', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400' },
  { name: 'Travel Tips', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' },
];

export default function ExploreCategorySection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const handleClick = (cat) => {
    navigate(`/blog?category=${encodeURIComponent(cat.name)}`);
  };

  return (
    <section style={{ padding: '48px 0 56px', backgroundColor: '#FAF7F2' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            color: '#2D6A4F',
            marginBottom: '24px',
          }}
        >
          Explore by Category
        </motion.h2>

        {isMobile ? (
          /* MOBILE: 2×2 grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.name} cat={cat} onClick={() => handleClick(cat)} />
            ))}
          </div>
        ) : (
          /* DESKTOP: scrollable row */
          <div style={{ position: 'relative' }}>
            <button onClick={() => scroll(-1)} style={arrowStyle('left')}><ChevronLeft size={20} color="#C4622D" /></button>
            <div
              ref={scrollRef}
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                padding: '4px 4px 16px',
              }}
            >
              {categories.map((cat) => (
                <div key={cat.name} style={{ minWidth: '200px', maxWidth: '200px', flexShrink: 0, scrollSnapAlign: 'start' }}>
                  <CategoryCard cat={cat} onClick={() => handleClick(cat)} />
                </div>
              ))}
            </div>
            <button onClick={() => scroll(1)} style={arrowStyle('right')}><ChevronRight size={20} color="#C4622D" /></button>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({ cat, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '1/1',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img
        src={cat.image}
        alt={cat.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
      }} />
      <span style={{
        position: 'absolute', bottom: '14px', left: '14px',
        color: '#fff', fontWeight: 700, fontSize: '1rem',
        fontFamily: "'Playfair Display', serif",
        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }}>
        {cat.name}
      </span>
    </div>
  );
}

const arrowStyle = (side) => ({
  position: 'absolute',
  [side]: '-12px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  width: '36px', height: '36px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  border: '1px solid #E8DDD4',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
});
