import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const resortBookingSchema = z.object({
  resortName: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().regex(/^[0-9]{10}$/, "Must be exactly 10 digits"),
  whatsapp: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Must be exactly 10 digits",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  checkin: z.string().min(1, "Check-in date is required"),
  checkout: z.string().min(1, "Check-out date is required"),
  guests: z.coerce.number().min(1, "Must be at least 1 guest").max(20, "Max 20 guests"),
  roomType: z.string().min(1, "Please select a room type"),
  specialRequests: z.string().optional()
}).refine(data => {
  if (data.checkin && data.checkout) {
    return new Date(data.checkout) > new Date(data.checkin);
  }
  return true;
}, {
  message: "Check-out must be after check-in",
  path: ["checkout"]
});

export default function ResortBookingModal({ isOpen, onClose, resortName }) {
  const [sameAsContact, setSameAsContact] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(resortBookingSchema),
    defaultValues: {
      resortName: resortName || '',
      fullName: '',
      contact: '',
      whatsapp: '',
      email: '',
      checkin: '',
      checkout: '',
      guests: 2,
      roomType: '',
      specialRequests: ''
    }
  });

  const contact = watch('contact');

  // Reset form with current resortName every time modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        resortName: resortName || '',
        fullName: '',
        contact: '',
        whatsapp: '',
        email: '',
        checkin: '',
        checkout: '',
        guests: 2,
        roomType: '',
        specialRequests: ''
      });
      setSameAsContact(false);
    }
  }, [isOpen, resortName, reset]);

  useEffect(() => {
    if (sameAsContact) {
      setValue('whatsapp', contact);
    }
  }, [sameAsContact, contact, setValue]);

  const onSubmit = async (data) => {
    await supabase.from('resort_bookings').insert({
      resort_name: resortName,
      full_name: data.fullName,
      contact: data.contact,
      whatsapp: data.whatsapp || data.contact,
      email: data.email || null,
      checkin_date: data.checkin,
      checkout_date: data.checkout,
      guests: Number(data.guests),
      room_type: data.roomType,
      special_requests: data.specialRequests || null,
    });

    const msg = `Resort Booking Request!
Resort: ${data.resortName}
Name: ${data.fullName}
Contact: ${data.contact}${data.whatsapp ? ` (WA: ${data.whatsapp})` : ''}
Check-in: ${data.checkin}
Check-out: ${data.checkout}
Guests: ${data.guests}
Room Type: ${data.roomType}
${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}`;
    
    window.open(`https://wa.me/919573112302?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success("Resort booking request sent! We'll contact you shortly.");
    reset();
    onClose();
  };

  const getToday = () => new Date().toISOString().split('T')[0];

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1.5px solid #e2d9cc', backgroundColor: '#fff',
    fontSize: '0.95rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A120B', outline: 'none', boxSizing: 'border-box',
    marginTop: '6px', transition: 'all 0.2s'
  };

  const labelStyle = {
    fontSize: '0.8rem', fontWeight: '600', color: '#4a5568', display: 'block',
    fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const errorStyle = {
    color: '#e53e3e', fontSize: '0.78rem', marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <style>{`
            .booking-input:focus {
              border-color: #2D6A4F !important;
              outline: none !important;
              box-shadow: 0 0 0 3px rgba(45,106,79,0.1) !important;
            }
          `}</style>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: '#FFF', borderRadius: '16px',
              maxWidth: '540px', width: '100%', maxHeight: '90vh',
              overflowY: 'auto', position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#2D6A4F', padding: '20px 24px', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderRadius: '16px 16px 0 0' }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#FFF' }}>Book Resort Stay</h2>
                <p style={{ margin: '4px 0 0', color: '#b7e4c7', fontSize: '0.85rem' }}>Fill in details and we'll confirm shortly</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#FFF' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Resort Name</label>
                <input {...register('resortName')} className="booking-input" style={{ ...inputStyle, backgroundColor: '#f5f0e8', color: '#666', cursor: 'not-allowed' }} readOnly />
              </div>

              <div>
                <label style={labelStyle}>Full Name *</label>
                <input {...register('fullName')} className="booking-input" style={inputStyle} placeholder="John Doe" />
                {errors.fullName && <div style={errorStyle}>{errors.fullName.message}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Contact Number *</label>
                  <input {...register('contact')} className="booking-input" style={inputStyle} placeholder="10-digit number" type="tel" />
                  {errors.contact && <div style={errorStyle}>{errors.contact.message}</div>}
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp Number</label>
                  <input {...register('whatsapp')} className="booking-input" style={inputStyle} placeholder="Optional" type="tel" disabled={sameAsContact} />
                  {errors.whatsapp && <div style={errorStyle}>{errors.whatsapp.message}</div>}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: '#4a5568', cursor: 'pointer' }}>
                    <input type="checkbox" checked={sameAsContact} onChange={e => setSameAsContact(e.target.checked)} />
                    Same as contact
                  </label>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email (Optional)</label>
                <input {...register('email')} className="booking-input" style={inputStyle} placeholder="john@example.com" type="email" />
                {errors.email && <div style={errorStyle}>{errors.email.message}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Check-in Date *</label>
                  <input {...register('checkin')} className="booking-input" style={inputStyle} type="date" min={getToday()} />
                  {errors.checkin && <div style={errorStyle}>{errors.checkin.message}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Check-out Date *</label>
                  <input {...register('checkout')} className="booking-input" style={inputStyle} type="date" min={getToday()} />
                  {errors.checkout && <div style={errorStyle}>{errors.checkout.message}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Number of Guests *</label>
                  <input {...register('guests')} className="booking-input" style={inputStyle} type="number" min="1" max="20" />
                  {errors.guests && <div style={errorStyle}>{errors.guests.message}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Room Type *</label>
                  <select {...register('roomType')} className="booking-input" style={inputStyle}>
                    <option value="" disabled>Select Room</option>
                    <option value="Standard Room (Non-AC)">Standard Room (Non-AC)</option>
                    <option value="Standard Room (AC)">Standard Room (AC)</option>
                    <option value="Deluxe Room (AC)">Deluxe Room (AC)</option>
                    <option value="Suite (AC)">Suite (AC)</option>
                    <option value="Cottage / Villa">Cottage / Villa</option>
                    <option value="Tent / Camping Stay">Tent / Camping Stay</option>
                  </select>
                  {errors.roomType && <div style={errorStyle}>{errors.roomType.message}</div>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Special Requests (Optional)</label>
                <textarea {...register('specialRequests')} className="booking-input" style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Any specific requirements..." />
              </div>

              <button type="submit" disabled={isSubmitting} style={{
                width: '100%', padding: '14px', borderRadius: '8px',
                backgroundColor: isSubmitting ? '#40916C' : '#2D6A4F', color: '#fff', border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: '600',
                fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: '8px',
                transition: 'background-color 0.2s'
              }} onMouseOver={(e) => { if(!isSubmitting) e.target.style.backgroundColor = '#40916C' }} onMouseOut={(e) => { if(!isSubmitting) e.target.style.backgroundColor = '#2D6A4F' }}>
                {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
