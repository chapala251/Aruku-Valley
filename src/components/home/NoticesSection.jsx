import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function NoticesSection() {
  const [notices, setNotices] = useState([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    supabase.from('popup_config').select('notices_enabled').eq('id', 'main').single()
      .then(({ data }) => { if (data) setEnabled(data.notices_enabled ?? true); });

    supabase.from('notices').select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setNotices(data || []));
  }, []);

  if (!enabled || notices.length === 0) return null;

  return (
    <section style={{ padding: '40px 24px', backgroundColor: '#FAF7F2' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section label */}
        <p style={{
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#C4622D', marginBottom: '8px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>— NOTICES —</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 600, color: '#1A120B', marginBottom: '24px',
        }}>Notices & Updates</h2>

        {/* Notice cards — full width row */}
        {notices.map((notice, i) => (
          <div key={i} className="notice-row" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '32px',
            padding: '16px 0',
            borderBottom: i < notices.length - 1 ? '1px solid #E8DDD4' : 'none',
          }}>
            {/* IMAGE — bigger, ~45% width */}
            {notice.image && (
              <div className="notice-img" style={{
                flex: '0 0 42%',
                maxWidth: '42%',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <img
                  src={notice.image}
                  alt={notice.title}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
                />
              </div>
            )}

            {/* TEXT — remaining 58% */}
            <div style={{ flex: 1, paddingTop: '8px' }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem', fontWeight: 600,
                color: '#1A120B', margin: '0 0 14px',
              }}>📢 {notice.title}</h3>
              <p style={{
                fontSize: '15px', color: '#4A3728', lineHeight: 1.8,
                fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 16px',
                whiteSpace: 'pre-line',
              }}>{notice.description}</p>
              <span style={{
                fontSize: '13px', color: '#9E8B7B',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>Last Update: {new Date(notice.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
