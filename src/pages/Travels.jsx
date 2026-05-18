import React from 'react';
import { motion } from 'framer-motion';
import { vehicles } from '../data/vehicles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Users, ShoppingBag, CheckCircle, Phone } from 'lucide-react';
import SectionHeader from '../components/shared/SectionHeader';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  from: z.string().min(2, 'Pickup location required'),
  to: z.string().min(2, 'Drop location required'),
  date: z.string().min(1, 'Date required'),
  vehicle: z.string().min(1, 'Select a vehicle'),
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function Travels() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    const msg = `Hi! I'd like to book a cab.%0AName: ${data.name}%0APhone: ${data.phone}%0AFrom: ${data.from}%0ATo: ${data.to}%0ADate: ${data.date}%0AVehicle: ${data.vehicle}`;
    window.open(`https://wa.me/919573112302?text=${msg}`, '_blank');
    toast.success('Opening WhatsApp for booking!');
    reset();
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-28 md:pt-36">
      {/* Header */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="travels-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Travels & Cabs"
            title="Comfortable Cabs to Araku Valley"
            subtitle="Book a private cab from Vizag to Araku. AC vehicles, experienced drivers, transparent pricing."
          />
        </div>
      </section>

      {/* Vehicles */}
      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#FFFBF4]" id="vehicles-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">Choose Your Vehicle</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
            marginBottom: '56px'
          }}>
            {vehicles.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  backgroundColor: '#FFFBF4',
                }}
              >
                <div style={{ height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={v.image || 'https://araku-valley.com/wp-content/uploads/2024/08/sedan-cab-vizag-to-araku-300x200.jpg'}
                    alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-1">{v.name}</h3>
                  <p className="text-[#2D6A4F] font-bold text-lg mb-4">{v.pricePerKm}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Users size={15} className="text-[#2D6A4F]" /> {v.capacity}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <ShoppingBag size={15} className="text-[#2D6A4F]" /> {v.luggage}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5" style={{ marginTop: 'auto' }}>
                    {v.features.map((f) => (
                      <span key={f} className="flex items-center gap-1 text-xs bg-[#EFF7F2] text-[#2D6A4F] px-2 py-1 rounded-full">
                        <CheckCircle size={10} /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="max-w-2xl mx-auto bg-[#FFFBF4] rounded-2xl border border-[#F4E9D8] shadow-xl p-8" id="cab-booking-form">
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-6">Book a Cab</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Your Name *</label>
                  <input
                    {...register('name')}
                    id="cab-name"
                    placeholder="Full name"
                    className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-[#1C1C1E] text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Phone Number *</label>
                  <input
                    {...register('phone')}
                    id="cab-phone"
                    placeholder="+91 98765 43210"
                    className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-[#1C1C1E] text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Pickup Location *</label>
                  <input {...register('from')} id="cab-from" placeholder="e.g. Vizag Airport" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                  {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Drop Location *</label>
                  <input {...register('to')} id="cab-to" placeholder="e.g. Araku Valley" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                  {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Travel Date *</label>
                  <input {...register('date')} id="cab-date" type="date" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Vehicle Type *</label>
                  <select {...register('vehicle')} id="cab-vehicle" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition">
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => <option key={v.id} value={v.name}>{v.name} ({v.pricePerKm})</option>)}
                  </select>
                  {errors.vehicle && <p className="text-red-500 text-xs mt-1">{errors.vehicle.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                id="cab-submit"
                className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ backgroundColor: '#25D366' }}
              >
                <Phone size={18} /> Book via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
