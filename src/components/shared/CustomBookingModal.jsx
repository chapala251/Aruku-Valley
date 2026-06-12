import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const customBookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().regex(/^[0-9]{10}$/, "Must be exactly 10 digits"),
  whatsapp: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), {
    message: "Must be exactly 10 digits",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  destinations: z.array(z.string()).min(1, "Select at least one destination"),
  numberOfPeople: z.coerce.number().min(1, "Must be at least 1 person").max(50, "Max 50 people"),
  vehicle: z.string().min(1, "Please select a vehicle"),
  accommodation: z.string().min(1, "Please select an accommodation"),
  specialRequests: z.string().optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

const DESTINATION_OPTIONS = [
  "Araku Valley", "Borra Caves", "Katika Waterfall",
  "Chaparai Waterfall", "Vanjangi Hills", "Coffee Plantation Tour",
  "Tribal Museum", "Padmapuram Gardens"
];

export default function CustomBookingModal({ isOpen, onClose }) {
  const [sameAsContact, setSameAsContact] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(customBookingSchema),
    defaultValues: {
      fullName: '',
      contact: '',
      whatsapp: '',
      email: '',
      startDate: '',
      endDate: '',
      destinations: [],
      numberOfPeople: 1,
      vehicle: '',
      accommodation: '',
      specialRequests: ''
    }
  });

  const contact = watch('contact');
  const destinations = watch('destinations') || [];

  useEffect(() => {
    if (sameAsContact) {
      setValue('whatsapp', contact);
    }
  }, [sameAsContact, contact, setValue]);

  const handleDestinationChange = (dest) => {
    const current = [...destinations];
    if (current.includes(dest)) {
      setValue('destinations', current.filter(d => d !== dest), { shouldValidate: true });
    } else {
      setValue('destinations', [...current, dest], { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    await supabase.from('travel_bookings').insert({
      full_name: data.fullName,
      contact: data.contact,
      whatsapp: data.whatsapp || data.contact,
      email: data.email || null,
      travel_date: data.startDate,
      vehicle: data.vehicle,
      passengers: Number(data.numberOfPeople),
      special_requests: data.specialRequests || null,
    });

    const msg = `Custom Package Request!
Name: ${data.fullName}
Contact: ${data.contact}${data.whatsapp ? ` (WA: ${data.whatsapp})` : ''}
Dates: ${data.startDate} to ${data.endDate}
People: ${data.numberOfPeople}
Destinations: ${data.destinations.join(', ')}
Vehicle: ${data.vehicle}
Accommodation: ${data.accommodation}
${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}`;
    
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success("Custom booking request sent! We'll contact you shortly.");
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
                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#FFF' }}>Enquire Custom Package</h2>
                <p style={{ margin: '4px 0 0', color: '#b7e4c7', fontSize: '0.85rem' }}>Fill in details and we'll confirm shortly</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#FFF' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'grid', gap: '16px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input {...register('startDate')} className="booking-input" style={inputStyle} type="date" min={getToday()} />
                  {errors.startDate && <div style={errorStyle}>{errors.startDate.message}</div>}
                </div>
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input {...register('endDate')} className="booking-input" style={inputStyle} type="date" min={getToday()} />
                  {errors.endDate && <div style={errorStyle}>{errors.endDate.message}</div>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Number of People *</label>
                <input {...register('numberOfPeople')} className="booking-input" style={inputStyle} type="number" min="1" max="50" />
                {errors.numberOfPeople && <div style={errorStyle}>{errors.numberOfPeople.message}</div>}
              </div>

              <div>
                <label style={{ ...labelStyle, marginBottom: '8px' }}>Destinations of Interest *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {DESTINATION_OPTIONS.map(dest => (
                    <label key={dest} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <input 
                        type="checkbox" 
                        checked={destinations.includes(dest)}
                        onChange={() => handleDestinationChange(dest)}
                        style={{ accentColor: '#2D6A4F' }}
                      />
                      {dest}
                    </label>
                  ))}
                </div>
                {errors.destinations && <div style={errorStyle}>{errors.destinations.message}</div>}
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
                {isSubmitting ? 'Sending...' : 'Submit Custom Enquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
