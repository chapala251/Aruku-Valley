import React from 'react';
import { Home, Map, Hotel, Car, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Map, label: 'Packages', to: '/packages' },
  { icon: Hotel, label: 'Resorts', to: '/resorts' },
  { icon: Car, label: 'Travels', to: '/travels' },
  { icon: User, label: 'Account', to: '/dashboard' },
];

export default function MobileTabBar() {
  return (
    // CRITICAL: md:hidden means it only shows on mobile (< 768px)
    <nav
      className="md:hidden mobile-tabbar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-tabbar)',
        backgroundColor: '#FFFBF4',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS notch support
      }}
    >
      {tabs.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            color: isActive ? '#2D6A4F' : '#6B7280',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: isActive ? '600' : '400',
            paddingTop: '8px',
          })}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
