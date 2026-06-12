import React from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import SectionHeader from '../components/shared/SectionHeader';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

    if (error) {
      setErrorMsg('Something went wrong. Please try WhatsApp instead.');
      toast.error('Something went wrong.');
    } else {
      setSuccess(true);
      reset();
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-28 md:pt-36">
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="contact-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Get in Touch"
            title="Contact Araku Valley Team"
            subtitle="Have questions? We typically respond within 30 minutes on WhatsApp."
          />
        </div>
      </section>

      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#FFFBF4]" id="contact-content">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Form */}
          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-6">Send a Message</h2>
            {success ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#1A120B' }}>
                  Message sent!
                </h3>
                <p style={{ color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  We'll get back to you within 30 minutes on WhatsApp.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    marginTop: '16px', backgroundColor: '#C4622D', color: '#fff',
                    border: 'none', borderRadius: '100px', padding: '10px 24px',
                    cursor: 'pointer', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="contact-form">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Full Name *</label>
                  <input {...register('name')} id="contact-name" placeholder="Your full name" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Email *</label>
                    <input {...register('email')} id="contact-email" type="email" placeholder="you@example.com" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Phone (optional)</label>
                    <input {...register('phone')} id="contact-phone" placeholder="+91 98XXX XXX32" className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">Message *</label>
                  <textarea {...register('message')} id="contact-message" rows={5} placeholder="Tell us your travel dates, group size, and what you're looking for..." className="w-full px-5 md:px-8 py-3 rounded-xl border border-[#F4E9D8] bg-white text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition resize-none" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {errorMsg && <p style={{ fontSize: '13px', color: '#DC2626' }}>{errorMsg}</p>}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#2D6A4F] text-white font-bold text-base hover:bg-[#245a41] disabled:opacity-60 transition-all hover:shadow-lg"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: 'Phone / WhatsApp', value: '+91 95731 12302', href: 'tel:+919573112302' },
                  { icon: Mail, label: 'Email', value: 'info@araku-valley.com', href: 'mailto:info@araku-valley.com' },
                  { icon: MapPin, label: 'Location', value: 'Araku Valley, Visakhapatnam Dist., Andhra Pradesh — 531151', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF7F2] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#2D6A4F]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-[#1C1C1E] font-medium hover:text-[#2D6A4F] transition-colors text-sm">{value}</a>
                      ) : (
                        <p className="text-[#1C1C1E] font-medium text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-playfair font-semibold text-[#1C1C1E] text-lg mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="https://wa.me/919573112302" target="_blank" rel="noopener noreferrer" id="contact-wa"
                  className="flex items-center gap-2 px-5 md:px-8 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#25D366' }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="https://facebook.com/share/1Ez8XKHMUE/" target="_blank" rel="noopener noreferrer" id="contact-fb"
                  className="flex items-center gap-2 px-5 md:px-8 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#1877F2' }}>
                  <FacebookIcon />
                </a>
                <a href="https://instagram.com/araku_eco_stays" target="_blank" rel="noopener noreferrer" id="contact-ig"
                  className="flex items-center gap-2 px-5 md:px-8 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #bc1888)' }}>
                  <InstagramIcon />
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#F4E9D8] shadow-sm h-64" id="google-map">
              <iframe
                title="Araku Valley Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30432.79!2d82.8723!3d18.3273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be5adf8b5b5a1%3A0x5c3a0a78e53c1c1!2sAraku%20Valley%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1715500000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
