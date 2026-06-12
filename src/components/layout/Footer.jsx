import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

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

const quickLinks = [
  { label: 'Tour Packages', to: '/packages' },
  { label: 'Resorts & Hotels', to: '/resorts' },
  { label: 'Travels & Cabs', to: '/travels' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer({ setTermsOpen = () => {} }) {
  return (
    <footer className="bg-[#1C1C1E] text-[#F4E9D8]" id="footer">
      <div className="max-w-7xl mx-auto px-5 md:px-8 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-28 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center">
                <Leaf size={22} color="white" />
              </div>
              <div>
                <span className="font-playfair font-bold text-white text-xl leading-none block">Araku</span>
                <span className="text-[#52B788] text-xs font-semibold tracking-wider uppercase">Valley</span>
              </div>
            </Link>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
              Your trusted travel partner for exploring the lush Eastern Ghats — tribal culture, coffee plantations, and breathtaking viewpoints await.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919573112302"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp"
                className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} color="white" fill="white" />
              </a>
              <a
                href="https://facebook.com/share/1Ez8XKHMUE/"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-facebook"
                className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com/araku_eco_stays"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-instagram"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold text-white text-lg mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#6B7280] hover:text-[#52B788] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] group-hover:bg-[#52B788] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair font-semibold text-white text-lg mb-5">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+919573112302" className="flex items-center gap-3 text-[#6B7280] hover:text-[#52B788] text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2F] group-hover:bg-[#2D6A4F] flex items-center justify-center transition-colors">
                  <Phone size={14} color="#52B788" />
                </div>
                +91 95731 12302
              </a>
              <a href="mailto:info@araku-valley.com" className="flex items-center gap-3 text-[#6B7280] hover:text-[#52B788] text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2F] group-hover:bg-[#2D6A4F] flex items-center justify-center transition-colors">
                  <Mail size={14} color="#52B788" />
                </div>
                info@araku-valley.com
              </a>
              <div className="flex items-start gap-3 text-[#6B7280] text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2F] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} color="#52B788" />
                </div>
                <span>Araku Valley, Visakhapatnam District, Andhra Pradesh — 531151</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2D2D2F] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs">© 2025 Araku Valley. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="text-[#6B7280] hover:text-[#52B788] text-xs transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setTermsOpen(true); }} className="text-[#6B7280] hover:text-[#52B788] text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
