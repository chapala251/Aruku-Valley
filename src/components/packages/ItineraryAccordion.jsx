import React, { useState } from 'react';

export default function ItineraryAccordion({ itinerary }) {
  // Handle itinerary in multiple formats
  let parsedItinerary = itinerary;
  
  // If it's a string, try to parse it
  if (typeof itinerary === 'string' && itinerary.length > 0) {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(itinerary);
      if (Array.isArray(parsed)) {
        parsedItinerary = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        parsedItinerary = [parsed];
      }
    } catch (e) {
      console.warn('Failed to parse itinerary JSON:', e);
      parsedItinerary = [{ title: 'Itinerary', description: itinerary }];
    }
  }

  // Ensure it's an array
  if (!Array.isArray(parsedItinerary)) {
    if (typeof parsedItinerary === 'object' && parsedItinerary !== null) {
      parsedItinerary = [parsedItinerary];
    } else {
      parsedItinerary = [];
    }
  }

  console.log('Parsed itinerary:', parsedItinerary);

  return (
    <div>
      {(parsedItinerary || []).map((stop, index) => (
        <ItineraryItem key={index} index={index} stop={stop} />
      ))}
    </div>
  );
}

function ItineraryItem({ index, stop }) {
  const [open, setOpen] = useState(index === 0);

  // Handle different data formats
  let stopData = stop;
  
  // If stop is a string, try to parse it as JSON
  if (typeof stop === 'string') {
    try {
      stopData = JSON.parse(stop);
    } catch (e) {
      // It's just a plain string
      stopData = { title: stop, description: '' };
    }
  }

  // Extract title and description
  let stopTitle = 'Day ' + (index + 1);
  let stopDesc = '';

  if (typeof stopData === 'object' && stopData !== null) {
    stopTitle = stopData.title || stopData.name || `Day ${stopData.day || index + 1}`;
    stopDesc = stopData.description || '';
    
    // If no description, create a default one
    if (!stopDesc) {
      stopDesc = `Explore ${stopTitle} — one of the highlights of the Araku Valley tour experience.`;
    }
  }

  return (
    <div style={{
      border: '1px solid #E8DDD4',
      borderRadius: '12px',
      marginBottom: '8px',
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      {/* Header — clickable */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 18px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: '#2D6A4F', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', flexShrink: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {index + 1}
          </span>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px', fontWeight: '500', color: '#1A120B',
          }}>
            {stopTitle}
          </span>
        </div>
        <span style={{ color: '#9E8B7B', fontSize: '18px' }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: '0 18px 14px 58px' }}>
          <p style={{
            fontSize: '13px', color: '#6B5744', lineHeight: 1.6,
            fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {stopDesc}
          </p>
        </div>
      )}
    </div>
  );
}
