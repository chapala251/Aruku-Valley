import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function SitePopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    supabase.from('popup_config').select('*').eq('id', 'main').single()
      .then(({ data }) => {
        if (data && data.enabled && data.image) {
          setPopup(data);
          // Show popup after 1.5 seconds
          setTimeout(() => setVisible(true), 1500);
        }
      });
  }, []);

  const handleImageClick = () => {
    if (popup?.target_url) {
      window.open(popup.target_url, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {visible && popup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ position: 'relative', maxWidth: '520px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setVisible(false)}
              style={{
                position: 'absolute', top: '-14px', right: '-14px', zIndex: 10,
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'white', border: 'none', cursor: 'pointer',
                fontSize: '18px', fontWeight: '700', color: '#1C1C1E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >×</button>
            {/* Popup image */}
            <img
              src={popup.image}
              alt="Promotion"
              onClick={handleImageClick}
              style={{
                width: '100%', borderRadius: '16px', display: 'block',
                cursor: popup.target_url ? 'pointer' : 'default',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
