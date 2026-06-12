import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ResortBookingModal from '../components/shared/ResortBookingModal';
import { Star, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function parseArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export default function ResortDetail() {
  const { slug } = useParams();
  const [resort, setResort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const isAdmin = user?.email === 'arakuecostays@gmail.com';

  useEffect(() => {
    supabase.from('resorts').select('*').eq('slug', slug).single()
      .then(({ data }) => { setResort(data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280' }}>Loading...</p>
    </div>
  );

  if (!resort) return <Navigate to="/resorts" replace />;

  const highlights = parseArr(resort.highlights);
  const amenities = parseArr(resort.amenities);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', backgroundColor: '#FFFBF4', paddingTop: '64px' }}
    >
      {/* Hero */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src={resort.image}
          alt={resort.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px' }}>
          <Link to="/resorts" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', textDecoration: 'none', marginBottom: '10px' }}>
            <ArrowLeft size={15} /> Back to Resorts
          </Link>
          <div>
            <span style={{ display: 'inline-block', backgroundColor: '#2D6A4F', color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 12px', borderRadius: '100px', marginBottom: '8px' }}>
              {resort.category}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: 'white', fontSize: '1.8rem', margin: '0 0 4px' }}>{resort.name}</h1>
          <p style={{ color: '#E9A84C', fontWeight: '500', margin: 0, fontSize: '14px' }}>{resort.tagline}</p>
        </div>
        {isAdmin && (
          <Link to={`/admin/resort/edit/${resort.id}`} style={{
            position: 'absolute', top: '12px', right: '12px',
            backgroundColor: '#C4622D', color: '#fff',
            padding: '5px 12px', borderRadius: '100px',
            fontSize: '12px', fontWeight: '600', textDecoration: 'none', zIndex: 10
          }}>✏️ Edit Resort</Link>
        )}
      </div>

      {/* Content */}
      <div style={{ backgroundColor: '#FFFBF4', width: '100%' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '40px 32px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '40px',
          alignItems: 'start'
        }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Rating + Location */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #F4E9D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={15} fill="#E9A84C" stroke="none" />
                <span style={{ fontWeight: '700', color: '#1C1C1E', fontSize: '14px' }}>{resort.rating}</span>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>({resort.review_count} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6B7280' }}>
                <MapPin size={13} color="#2D6A4F" /> {resort.location}
              </div>
            </div>

            {/* About */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: '#1C1C1E', fontSize: '1.2rem', marginBottom: '10px' }}>About the Resort</h2>
              <p style={{ color: '#6B7280', lineHeight: '1.7', margin: 0, fontSize: '14px' }}>{resort.description}</p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: '#1C1C1E', fontSize: '1.2rem', marginBottom: '12px' }}>Highlights</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1C1C1E' }}>
                      <CheckCircle size={15} color="#2D6A4F" style={{ flexShrink: 0 }} /> {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: '#1C1C1E', fontSize: '1.2rem', marginBottom: '12px' }}>Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {amenities.map((a, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', backgroundColor: '#EFF7F2', color: '#2D6A4F', padding: '8px 10px', borderRadius: '8px' }}>
                      <CheckCircle size={12} /> {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '84px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F4E9D8', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 4px' }}>Price per night</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', fontSize: '2rem', color: '#1C1C1E', margin: '0 0 4px' }}>
                ₹{resort.price_per_night?.toLocaleString('en-IN')}
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 20px' }}>Taxes included · Free cancellation</p>
              <button
                onClick={() => setBookingOpen(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '10px', backgroundColor: '#2D6A4F', color: 'white', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer' }}
              >
                🏨 Book Now
              </button>
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', margin: '10px 0 0' }}>
                By booking you agree to our{' '}
                <span
                  onClick={() => setShowTerms(true)}
                  style={{ color: '#2D6A4F', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Terms & Conditions
                </span>
              </p>
            </div>
          </div>

        </div>
      </div>

      <ResortBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        resortName={resort.name}
      />

      {showTerms && (
        <div onClick={() => setShowTerms(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ backgroundColor: '#2D6A4F', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', margin: 0 }}>Terms & Conditions</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '4px 0 0' }}>Please read carefully before booking</p>
              </div>
              <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '💰', title: 'Pre-booking Confirmation', desc: 'A 30% advance payment is required to confirm your booking.' },
                { icon: '🔄', title: 'Refund Policy', desc: 'The pre-booking amount is non-refundable under any circumstances.' },
                { icon: '📅', title: 'Check-in / Check-out', desc: 'Standard check-in is 12 PM and check-out is 11 AM. Early/late subject to availability.' },
                { icon: '👥', title: 'Guest Policy', desc: 'Room allocation is based on the number of guests at time of booking.' },
                { icon: '🏨', title: 'Accommodation', desc: 'Room type is subject to availability. Upgrades may be available on request.' },
              ].map((term, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '10px', borderLeft: '3px solid #2D6A4F' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{term.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '13px', color: '#1C1C1E' }}>{term.title}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>{term.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 24px 20px' }}>
              <button onClick={() => setShowTerms(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}