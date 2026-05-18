import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Tag, Coffee, Headphones } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';

const features = [
  {
    icon: Shield,
    title: 'Trusted Local Experts',
    description: 'Born and bred in Araku — we know every trail, cave, and waterfall in the Eastern Ghats.',
    color: '#2D6A4F',
    bg: '#EFF7F2',
  },
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    description: 'No hidden charges. What you see is what you pay. We match any lower price, guaranteed.',
    color: '#E9A84C',
    bg: '#FEF9EC',
  },
  {
    icon: Coffee,
    title: 'Authentic Experiences',
    description: 'Tribal homestays, coffee estate walks, bonfire nights — curated for genuine discovery.',
    color: '#7C4F2F',
    bg: '#F9F0E8',
  },
  {
    icon: Headphones,
    title: '24/7 WhatsApp Support',
    description: 'Our team is always a message away. Day or night, we\'re here for you during your trip.',
    color: '#52B788',
    bg: '#EFF7F2',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-5 md:px-8 bg-[#EFF7F2]" id="why-choose-us">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionHeader
            badge="Why Us"
            title="Why Travellers Choose Araku Valley"
            subtitle="We don't just run tours — we create memories in the world's most underrated mountain destination."
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-[#FFFBF4] rounded-2xl p-6 border border-[#F4E9D8] hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: feat.bg }}
                >
                  <Icon size={26} color={feat.color} />
                </div>
                <h3 className="font-playfair font-bold text-[#1C1C1E] text-lg mb-2">{feat.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
