import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TermsConditionsModal = ({ isOpen, onClose }) => {
  const termsData = [
    {
      icon: '💰',
      title: 'Pre-booking Confirmation',
      description: 'A 30% advance payment is required to confirm your booking.',
    },
    {
      icon: '🔃',
      title: 'Refund Policy',
      description: 'The pre-booking amount is non-refundable under any circumstances.',
    },
    {
      icon: '📆',
      title: 'Date Modification',
      description: 'Change of travel dates is not allowed once the booking is confirmed.',
    },
    {
      icon: '🧑‍🤝‍🧑',
      title: 'Additional Guests',
      description: 'If any extra person joins the trip, additional charges will be applied.',
    },
    {
      icon: '🚘',
      title: 'Vehicle Usage',
      description: 'The vehicle will operate strictly as per the confirmed itinerary and route map.',
    },
    {
      icon: '❄️',
      title: 'AC Usage on Ghat Roads',
      description: 'For better vehicle performance and safety on ghat roads, the air conditioning (AC) may be turned off during uphill driving.',
    },
    {
      icon: '🔖',
      title: 'Additional Sightseeing',
      description: 'Any additional sightseeing or extra locations will be chargeable separately.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFBF4',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{
              backgroundColor: '#2D6A4F',
              color: 'white',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  Terms & Conditions
                </h2>
                <p style={{
                  fontSize: '12px',
                  opacity: 0.9,
                  margin: 0,
                }}>
                  Please read carefully before booking
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {termsData.map((term, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderLeft: '3px solid #2D6A4F',
                      padding: '12px',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '18px', lineHeight: '1.4', flexShrink: 0 }}>{term.icon}</span>
                      <div>
                        <h3 style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1C1C1E',
                          margin: '0 0 4px 0',
                        }}>
                          {term.title}
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          lineHeight: '1.5',
                          margin: 0,
                        }}>
                          {term.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #F4E9D8',
              }}>
                <button
                  onClick={onClose}
                  style={{
                    width: '100%',
                    backgroundColor: '#2D6A4F',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsConditionsModal;
