import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ArakuNavTabs from '../components/ArakuNavTabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Users, ShoppingBag, CheckCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../components/shared/SectionHeader';
import { supabase } from '../lib/supabase';
import { vehicles } from '../data/vehicles';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  pickupLocation: z.string().min(2, 'Pickup location required'),
  dropLocation: z.string().min(2, 'Drop location required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  vehicleType: z.string().min(1, 'Select a vehicle'),
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600';

export default function Travels() {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', pickupLocation: '', dropLocation: '', startDate: '', endDate: '', vehicleType: '' }
  });

  function safeParseArray(data) {
    if (Array.isArray(data)) return data;
    try { const p = typeof data === 'string' ? JSON.parse(data) : data; return Array.isArray(p) ? p : []; }
    catch { return []; }
  }

  const carsScrollRef = useRef(null);
  const scrollCars = (dir) => { carsScrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' }); };

  const handleVehicleSelect = (vehicleName) => {
    setValue('vehicleType', vehicleName);
    document.getElementById('cab-booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedVehicle = watch('vehicleType');

  const onSubmit = async (data) => {
    await supabase.from('travel_bookings').insert({
      full_name: data.name, contact: data.phone,
      pickup_location: data.pickupLocation, drop_location: data.dropLocation,
      travel_date: data.startDate, vehicle: data.vehicleType, passengers: 1, special_requests: null,
    });
    const message = `Hi! I want to book a cab.\nName: ${data.name}\nPhone: ${data.phone}\nPickup: ${data.pickupLocation}\nDrop: ${data.dropLocation}\nStart Date: ${data.startDate}\nEnd Date: ${data.endDate}\nVehicle: ${data.vehicleType}`;
    window.open(`https://wa.me/917780739851?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Booking request sent!');
    reset();
  };

  const renderBookingForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Your Name *</label>
        <input {...register('name')} placeholder="Full name" className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Phone Number *</label>
        <input {...register('phone')} placeholder="+91 98765 43210" className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Pickup Location *</label>
        <input {...register('pickupLocation')} placeholder="e.g. Vizag Airport" className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Drop Location *</label>
        <input {...register('dropLocation')} placeholder="e.g. Araku Valley" className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.dropLocation && <p className="text-red-500 text-xs mt-1">{errors.dropLocation.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Start Date *</label>
        <input type="date" min={new Date().toISOString().split('T')[0]} {...register('startDate')} onChange={e => { setValue('startDate', e.target.value); setValue('endDate', ''); }} className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">End Date *</label>
        <input type="date" min={startDate || new Date().toISOString().split('T')[0]} {...register('endDate')} onChange={e => { setValue('endDate', e.target.value); }} className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2" />
        {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
      </div>
      {startDate && endDate && (
        <div className="sm:col-span-2">
          <p style={{ fontSize: '13px', color: '#2D6A4F', fontWeight: '600', backgroundColor: '#E8F0E9', padding: '8px 14px', borderRadius: '8px', margin: 0 }}>
            📅 {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1)} day(s) selected
          </p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Vehicle Type *</label>
        <select {...register('vehicleType')} className="w-full px-5 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2">
          <option value="">Select vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </select>
        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>}
      </div>
      <div className="sm:col-span-2 mt-2">
        <button type="submit" className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{ backgroundColor: '#25D366' }}>
          <Phone size={18} /> Book via WhatsApp
        </button>
      </div>
    </form>
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-8 md:pt-36">
      <ArakuNavTabs />
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="travels-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="Travels & Cabs" title="Comfortable Cabs to Araku Valley" subtitle="Book a private cab from Vizag to Araku. AC vehicles, experienced drivers, transparent pricing." />
        </div>
      </section>

      <section className="py-12 px-5 md:px-8 bg-[#FFFBF4]" id="vehicles-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">Choose Your Vehicle</h2>

          {/* DESKTOP */}
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 30%) 1fr', gap: '24px', alignItems: 'start' }}>
              <div
                className="vehicle-list-scroll"
                style={{
                  maxHeight: '700px',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  paddingRight: '4px',
                }}
              >
                {vehicles.map((v) => {
                  const isSelected = selectedVehicle === v.name;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setValue('vehicleType', v.name)}
                      style={{
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #2D6A4F' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#EFF7F2' : '#FFFBF4',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '10px',
                        minHeight: '220px',
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2, backgroundColor: '#2D6A4F', color: 'white', borderRadius: '100px', padding: '2px 8px', fontSize: '10px', fontWeight: '700' }}>
                          ✓ Selected
                        </div>
                      )}
                      <div style={{ height: '140px', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                        <img
                          src={v.image}
                          alt={v.name}
                          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', maxHeight: '140px' }}
                          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                        />
                      </div>
                      <div style={{
                        padding: '14px 14px 16px',
                        backgroundColor: isSelected ? '#EFF7F2' : '#FFFBF4',
                        flexShrink: 0,
                        flexGrow: 1,
                      }}>
                        <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', fontSize: '0.85rem', color: '#1C1C1E', margin: '0 0 3px', lineHeight: 1.3 }}>
                          {v.name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                          👥 {v.capacity} · 💼 {v.luggage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: booking form */}
              <div style={{ backgroundColor: '#FFFBF4', borderRadius: '16px', border: '1px solid #F4E9D8', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '32px', position: 'sticky', top: '100px' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', color: '#1C1C1E', fontSize: '1.5rem', marginBottom: '24px' }}>Book a Cab</h2>
                {renderBookingForm()}
              </div>
            </div>
          )}

          {/* MOBILE */}
          {isMobile && (
            <div>
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <button onClick={() => scrollCars(-1)} style={{ position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #E8DDD4', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronLeft size={18} color="#C4622D" />
                </button>
                <div ref={carsScrollRef} style={{ display: 'flex', overflowX: 'auto', gap: '16px', padding: '8px 4px 16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
                  {vehicles.map(v => (
                    <div key={v.id} className="vehicle-mobile-card" onClick={() => handleVehicleSelect(v.name)} style={{ minWidth: '280px', maxWidth: '280px', minHeight: '340px', backgroundColor: selectedVehicle === v.name ? '#E8F0E9' : '#fff', borderRadius: '14px', border: selectedVehicle === v.name ? '2px solid #2D6A4F' : '1px solid #E8DDD4', overflow: 'hidden', flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                      {selectedVehicle === v.name && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2, backgroundColor: '#2D6A4F', color: 'white', borderRadius: '100px', padding: '2px 8px', fontSize: '10px', fontWeight: '700' }}>✓ Selected</div>
                      )}
                      <div style={{ height: '150px', flexShrink: 0, overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                        <img src={v.image} alt={v.name} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} onError={e => { e.target.src = FALLBACK_IMAGE; }} />
                      </div>
                      <div style={{ padding: '16px 16px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: '700', fontSize: '1rem', color: '#1C1C1E', margin: '0 0 6px' }}>{v.name}</h3>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px' }}>👥 {v.capacity} · 💼 {v.luggage}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                          {safeParseArray(v.features).slice(0, 3).map(f => (
                            <span key={f} style={{ fontSize: '10px', backgroundColor: '#EFF7F2', color: '#2D6A4F', padding: '2px 6px', borderRadius: '100px' }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollCars(1)} style={{ position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #E8DDD4', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronRight size={18} color="#C4622D" />
                </button>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E8DDD4', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} id="cab-booking-form">
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '20px' }}>Book a Cab</h2>
                {renderBookingForm()}
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}