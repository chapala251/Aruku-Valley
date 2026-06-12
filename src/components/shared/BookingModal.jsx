import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const bookingSchema = z.object({
  packageName: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().regex(/^[0-9]{10}$/, "Must be exactly 10 digits"),
  whatsapp: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Must be exactly 10 digits",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  vehicle: z.string().min(1, "Please select a vehicle"),
  accommodation: z.string().min(1, "Please select an accommodation"),
  specialRequests: z.string().optional()
});

export default function BookingModal({ isOpen, onClose, packageName, packageDuration }) {
  const [sameAsContact, setSameAsContact] = useState(false);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageName: packageName || '',
      fullName: '',
      contact: '',
      whatsapp: '',
      email: '',
      startDate: '',
      endDate: '',
      vehicle: '',
      accommodation: '',
      specialRequests: ''
    }
  });

  // Reset form with current packageName every time modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        packageName: packageName || '',
        fullName: '',
        contact: '',
        whatsapp: '',
        email: '',
        startDate: '',
        endDate: '',
        vehicle: '',
        accommodation: '',
        specialRequests: ''
      });
      setSameAsContact(false);
    }
  }, [isOpen, packageName, reset]);

  const startDate = watch('startDate');
  const contact = watch('contact');

  useEffect(() => {
    if (sameAsContact) {
      setValue('whatsapp', contact);
    }
  }, [sameAsContact, contact, setValue]);

  useEffect(() => {
    if (startDate) {
      const date = new Date(startDate);
      const duration = packageDuration ? parseInt(packageDuration, 10) : 2;
      date.setDate(date.getDate() + duration);
      setValue('endDate', date.toISOString().split('T')[0]);
    }
  }, [startDate, packageDuration, setValue]);

  const onSubmit = async (data) => {
    // 1. Save to Supabase
    await supabase.from('package_bookings').insert({
      package_name: packageName,
      full_name: data.fullName,
      contact: data.contact,
      whatsapp: data.whatsapp || data.contact,
      email: data.email || null,
      start_date: data.startDate,
      end_date: data.endDate,
      vehicle: data.vehicle,
      accommodation: data.accommodation,
      special_requests: data.specialRequests || null,
    });

    // 2. Open WhatsApp
    const msg = `🌿 New Package Booking!\nPackage: ${packageName}\nName: ${data.fullName}\nContact: ${data.contact}\nDates: ${data.startDate} to ${data.endDate}\nVehicle: ${data.vehicle}\nAccommodation: ${data.accommodation}`;
    window.open(`https://wa.me/919573112302?text=${encodeURIComponent(msg)}`, '_blank');

    // 3. Show toast and close
    toast.success('Booking request sent!');
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
                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#FFF' }}>Book Your Trip</h2>
                <p style={{ margin: '4px 0 0', color: '#b7e4c7', fontSize: '0.85rem' }}>Fill in details and we'll confirm shortly</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#FFF' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Package Name</label>
                <input {...register('packageName')} className="booking-input" style={{ ...inputStyle, backgroundColor: '#f5f0e8', color: '#666', cursor: 'not-allowed' }} readOnly />
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
                  <label style={labelStyle}>Start Date *</label>
                  <input {...register('startDate')} className="booking-input" style={inputStyle} type="date" min={getToday()} />
                  {errors.startDate && <div style={errorStyle}>{errors.startDate.message}</div>}
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input {...register('endDate')} className="booking-input" style={{ ...inputStyle, backgroundColor: '#f5f0e8', color: '#666', cursor: 'not-allowed' }} type="date" readOnly />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Vehicle Preference *</label>
                  <select {...register('vehicle')} className="booking-input" style={inputStyle}>
                    <option value="" disabled>Select Vehicle</option>
                    <option value="Sedan (4 Seater)">Sedan (4 Seater)</option>
                    <option value="SUV (6 Seater)">SUV (6 Seater)</option>
                    <option value="Tempo Traveller (12 Seater)">Tempo Traveller (12 Seater)</option>
                    <option value="Luxury SUV (4 Seater)">Luxury SUV (4 Seater)</option>
                    <option value="Mini Bus (20 Seater)">Mini Bus (20 Seater)</option>
                  </select>
                  {errors.vehicle && <div style={errorStyle}>{errors.vehicle.message}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Accommodation Type *</label>
                  <select {...register('accommodation')} className="booking-input" style={inputStyle}>
                    <option value="" disabled>Select Accommodation</option>
                    <option value="Budget (Non-AC Room)">Budget (Non-AC Room)</option>
                    <option value="Standard (AC Room)">Standard (AC Room)</option>
                    <option value="Deluxe (AC Room with View)">Deluxe (AC Room with View)</option>
                    <option value="Premium Cottage (AC)">Premium Cottage (AC)</option>
                    <option value="Luxury Resort (AC + Amenities)">Luxury Resort (AC + Amenities)</option>
                    <option value="Camping / Tent Stay">Camping / Tent Stay</option>
                  </select>
                  {errors.accommodation && <div style={errorStyle}>{errors.accommodation.message}</div>}
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
