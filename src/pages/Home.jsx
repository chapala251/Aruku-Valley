import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ArakuNavTabs from '../components/ArakuNavTabs';
import FeaturedPackages from '../components/home/FeaturedPackages';
import ExploreCategorySection from '../components/home/ExploreCategorySection';

import ResortStrip from '../components/home/ResortStrip';
import TopThingsSection from '../components/home/TopThingsSection';
import MustVisitPlacesSection from '../components/home/MustVisitPlacesSection';
import NoticesSection from '../components/home/NoticesSection';
import DestinationCards from '../components/home/DestinationCards';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import BookingModal from '../components/shared/BookingModal';
import ResortBookingModal from '../components/shared/ResortBookingModal';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function CTABanner() {
  return (
    <section className="py-24 md:py-32 px-5 md:px-8 bg-[#F4E9D8]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block text-4xl mb-4">🌿</span>
          <h2 className="font-playfair font-bold text-[#1C1C1E] text-3xl md:text-4xl mb-4">Ready to Explore Araku Valley?</h2>
          <p className="text-[#6B7280] text-lg mb-8">Chat with our local experts on WhatsApp and get a personalised itinerary in minutes.</p>
          <a href="https://wa.me/919573112302" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ backgroundColor: '#25D366' }}>
            <span className="text-2xl">💬</span> Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: '', duration: 2 });
  const [resortBookingOpen, setResortBookingOpen] = useState(false);
  const [selectedResort, setSelectedResort] = useState({ name: '' });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ArakuNavTabs />
      <HeroSection />
      <FeaturedPackages
        onBookNow={(pkg) => {
          setSelectedPackage({ name: pkg.title, duration: pkg.duration || 2 });
          setBookingOpen(true);
        }}
      />
      <ResortStrip
        onBookNow={(resort) => {
          setSelectedResort({ name: resort.name });
          setResortBookingOpen(true);
        }}
      />
      <TopThingsSection />
      <MustVisitPlacesSection />
      <ExploreCategorySection />
      <DestinationCards />
      <NoticesSection />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageName={selectedPackage.name}
        packageDuration={selectedPackage.duration}
      />
      <ResortBookingModal
        isOpen={resortBookingOpen}
        onClose={() => setResortBookingOpen(false)}
        resortName={selectedResort.name}
      />
    </motion.div>
  );
}
