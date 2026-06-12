import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ItineraryAccordion from '../components/packages/ItineraryAccordion';
import PackageCard from '../components/packages/PackageCard';
import StarRating from '../components/shared/StarRating';
import Badge from '../components/shared/Badge';
import BookingModal from '../components/shared/BookingModal';
import CustomBookingModal from '../components/shared/CustomBookingModal';
import { MapPin, Clock, CheckCircle, ArrowLeft, Users } from 'lucide-react';

const badgeColorMap = { 'Most Popular': 'gold', 'Best Value': 'sage', 'Premium': 'brown' };

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const PriceCardSidebar = ({ pkg, setBookingOpen, setCustomOpen, setShowTerms }) => (
  <div className="sticky top-24 bg-[#FFFBF4] rounded-2xl border border-[#F4E9D8] shadow-xl p-6">
    <div className="mb-5 pb-5 border-b border-[#F4E9D8]">
      {pkg.price ? (
        <>
          <p className="text-sm text-[#6B7280] mb-1">Starting from</p>
          {pkg.mrp && pkg.mrp > pkg.price && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base text-[#9ca3af] line-through">₹{pkg.mrp.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-1 rounded">
                Save {Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100)}%
              </span>
            </div>
          )}
          <p className="font-playfair font-bold text-[#1C1C1E] text-3xl">
            ₹{pkg.price.toLocaleString('en-IN')}
          </p>
          {pkg.price_label && (
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px' }}>
              per {pkg.price_label}
            </p>
          )}
        </>
      ) : (
        <p className="font-playfair font-bold text-[#E9A84C] text-2xl">{pkg.price_label}</p>
      )}
    </div>

    <div className="space-y-3">
      <button
        onClick={() => setBookingOpen(true)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '100px',
          backgroundColor: '#C4622D',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '700',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginTop: '16px',
        }}
      >
        Book Now
      </button>
      <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '10px', lineHeight: '1.5' }}>
        By booking you agree to our{' '}
        <span
          onClick={() => setShowTerms(true)}
          style={{ color: '#2D6A4F', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px' }}
        >
          Terms & Conditions
        </span>
      </p>
    </div>

    <div className="mt-6 space-y-3 pt-5 border-t border-[#F4E9D8]">
      {[
        ['Duration', pkg.duration],
        ['Type', pkg.type],
        ['Price for', pkg.price_label],
        ['Pickup', 'Visakhapatnam (Vizag)'],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between text-sm">
          <span className="text-[#6B7280]">{label}</span>
          <span className="font-medium text-[#1C1C1E]">{value}</span>
        </div>
      ))}
    </div>

    {/* Reviews Section */}
    {(pkg.rating || pkg.reviewCount) && (
      <div style={{ borderTop: '1px solid #F4E9D8', marginTop: '16px', paddingTop: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1C1C1E', marginBottom: '4px' }}>
            {pkg.rating ? pkg.rating.toFixed(1) : '0'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < Math.floor(pkg.rating || 0) ? '#E9A84C' : '#d1d5db', fontSize: '16px' }}>
                ★
              </span>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            {pkg.reviewCount || 0} verified reviews
          </div>
        </div>
      </div>
    )}

    <div style={{ borderTop: '1px solid #F4E9D8', marginTop: '16px', paddingTop: '16px' }}>
      <button
        onClick={() => setCustomOpen(true)}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          backgroundColor: '#E9A84C', color: '#1a3a2a',
          border: 'none', fontWeight: '700',
          fontSize: '14px', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: '0 4px 12px rgba(233, 168, 76, 0.3)',
          transition: 'all 0.3s ease',
          transform: 'none',
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(233, 168, 76, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(233, 168, 76, 0.3)';
        }}
      >
        🧩 Enquire Custom Package
      </button>
    </div>
  </div>
);

export default function PackageDetail() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [showAllItinerary, setShowAllItinerary] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.from('packages').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        setPkg(data);
        if (data) {
          supabase.from('packages').select('*').neq('id', data.id).limit(3)
            .then(({ data: rData }) => {
              setRelated(rData || []);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-[#6B7280]">Loading package details...</div>;
  if (!pkg) return <Navigate to="/packages" replace />;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 md:pt-32"
    >
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
          <div className="flex gap-2 mb-3">
            {pkg.badge && <Badge color={badgeColorMap[pkg.badge] || 'gray'}>{pkg.badge}</Badge>}
            <Badge color="gray">{pkg.type}</Badge>
          </div>
          <h1 className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight max-w-3xl">{pkg.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10" style={{
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: isMobile ? 'unset' : '1fr 340px',
        gap: '32px', alignItems: 'start',
      }}>
        {/* Left: Details */}
        <div className="space-y-8">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 items-center pb-6 border-b border-[#F4E9D8]">
            <div className="flex items-center gap-2">
              <StarRating rating={pkg.rating} showCount count={pkg.reviewCount} />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <MapPin size={15} className="text-[#2D6A4F]" /> {pkg.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Clock size={15} className="text-[#2D6A4F]" /> {pkg.duration}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Users size={15} className="text-[#2D6A4F]" /> {pkg.price_label}
            </div>
          </div>

          {/* Includes & Excludes */}
          {(pkg.includes?.length > 0 || pkg.excludes?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {pkg.includes?.length > 0 && (
                <div>
                  <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">What's Included</h2>
                  <div className="flex flex-col gap-3">
                    {pkg.includes.map((item) => (
                      <span key={item} className="flex items-start gap-2 text-[#2D6A4F] text-sm font-medium">
                        <CheckCircle size={18} className="mt-0.5 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pkg.excludes?.length > 0 && (
                <div>
                  <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Not Included</h2>
                  <div className="flex flex-col gap-3">
                    {pkg.excludes.map((item) => (
                      <span key={item} className="flex items-start gap-2 text-[#dc2626] text-sm font-medium">
                        <span style={{ fontSize: '14px', lineHeight: '1.2' }} className="mt-0.5 shrink-0">❌</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Highlights */}
          {pkg.highlights && (
            <div>
              <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Trip Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pkg.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-[#1C1C1E] bg-[#F4E9D8] px-3 py-2 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-[#E9A84C] shrink-0" /> {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          <div>
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl mb-4">Day-by-Day Itinerary</h2>
            <ItineraryAccordion itinerary={showAllItinerary ? pkg.itinerary : (pkg.itinerary || []).slice(0, 4)} />
            {(pkg.itinerary || []).length > 4 && (
              <button
                onClick={() => setShowAllItinerary(!showAllItinerary)}
                style={{
                  width: '100%', padding: '12px',
                  backgroundColor: '#EFF7F2', color: '#2D6A4F',
                  border: '1px dashed #2D6A4F', borderRadius: '10px',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  marginTop: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {showAllItinerary ? '▲ Show Less' : `▼ View All ${pkg.itinerary.length} Days`}
              </button>
            )}
          </div>

          {/* MOBILE ONLY - Price Card */}
          {isMobile && (
            <div className="mt-8 mb-8">
              <PriceCardSidebar pkg={pkg} setBookingOpen={setBookingOpen} setCustomOpen={setCustomOpen} setShowTerms={setShowTerms} />
            </div>
          )}

          {/* Reviews section */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem', fontWeight: 600, color: '#1A120B',
              marginBottom: '16px',
            }}>
              What Travellers Say
            </h3>

            {/* Review cards */}
            {[
              { name: 'Priya Sharma',    location: 'Hyderabad', rating: 5, pkg: '1N/2D Package', text: 'Absolutely breathtaking experience! The package was perfectly organized. Our driver was knowledgeable and the resort was cozy. Borra Caves left us speechless.' },
              { name: 'Rajesh & Sunita', location: 'Bangalore',  rating: 5, pkg: '3N/4D Premium Package', text: 'The 3N/4D mega tour to Vanjangi and Lambasingi was life-changing. Watching the sea of clouds at Vanjangi at sunrise — words can\'t describe it. 10/10 recommend!' },
              { name: 'Aditya Reddy',    location: 'Chennai',    rating: 5, pkg: 'Day Trip',    text: 'Booked the 1-day trip for our office group. Smooth coordination, punctual, and the itinerary was jam-packed in the best way. Katiki Waterfalls was our favorite!' },
            ].map((review, i) => (
              <div key={i} style={{
                backgroundColor: '#fff', borderRadius: '14px',
                border: '1px solid #E8DDD4', padding: '18px',
                marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(100,50,20,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: '#C4622D', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px', fontWeight: '700', flexShrink: 0,
                    }}>
                      {review.name[0]}
                    </div>
                    <div>
                      <p style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '14px', fontWeight: '600', color: '#1A120B', margin: 0,
                      }}>{review.name}</p>
                      <p style={{
                        fontSize: '12px', color: '#9E8B7B', margin: 0,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>{review.location}</p>
                    </div>
                  </div>
                  {/* Stars */}
                  <span style={{ color: '#C9963A', fontSize: '14px', letterSpacing: '2px' }}>
                    {'★'.repeat(review.rating)}
                  </span>
                </div>

                <p style={{
                  fontSize: '13px', color: '#4A3728', lineHeight: 1.7,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 8px',
                  fontStyle: 'italic',
                }}>
                  "{review.text}"
                </p>

                <span style={{
                  fontSize: '11px', color: '#C4622D', fontWeight: '600',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: '#F2E0D4', padding: '3px 10px', borderRadius: '100px',
                }}>
                  {review.pkg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Sidebar */}
        {!isMobile && (
          <div>
            <PriceCardSidebar pkg={pkg} setBookingOpen={setBookingOpen} setCustomOpen={setCustomOpen} setShowTerms={setShowTerms} />
          </div>
        )}
      </div>

      {/* Related Packages */}
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="related-packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {related.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        packageName={pkg.title} 
        packageDuration={pkg.duration ? parseInt(pkg.duration) || 2 : 2} 
      />
      <CustomBookingModal isOpen={customOpen} onClose={() => setCustomOpen(false)} />

      {showTerms && (
        <div
          onClick={() => setShowTerms(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white', borderRadius: '16px',
              width: '100%', maxWidth: '420px',
              maxHeight: '80vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ backgroundColor: '#2D6A4F', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', margin: 0 }}>Terms & Conditions</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '4px 0 0' }}>Please read carefully before booking</p>
              </div>
              <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '💰', title: 'Pre-booking Confirmation', desc: 'A 30% advance payment is required to confirm your booking.' },
                { icon: '🔄', title: 'Refund Policy', desc: 'The pre-booking amount is non-refundable under any circumstances.' },
                { icon: '📅', title: 'Date Modification', desc: 'Change of travel dates is not allowed once the booking is confirmed.' },
                { icon: '👥', title: 'Group Size', desc: 'Package prices are based on the group size mentioned. Extra members will be charged additionally.' },
                { icon: '🏨', title: 'Accommodation', desc: 'Room allocation is subject to availability at the time of booking.' },
                { icon: '🚗', title: 'Transportation', desc: 'Pick-up and drop-off timings are fixed and cannot be changed last minute.' },
              ].map((term, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '10px', borderLeft: '3px solid #2D6A4F' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{term.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '13px', color: '#1C1C1E' }}>{term.title}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>{term.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 24px 20px' }}>
              <button onClick={() => setShowTerms(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#2D6A4F', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
