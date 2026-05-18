import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919573112302"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab flex items-center justify-center w-14 h-14 rounded-full text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
      style={{ backgroundColor: '#25D366', bottom: '80px', right: '16px' }}
    >
      <MessageCircle size={28} color="white" fill="white" />
    </a>
  );
}
