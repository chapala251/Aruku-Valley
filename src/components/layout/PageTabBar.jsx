import { NavLink } from 'react-router-dom';

const TABS = [
  { label: 'Home',       to: '/' },
  { label: 'Packages',   to: '/packages' },
  { label: 'Resorts',    to: '/resorts' },
  { label: 'Travels',    to: '/travels' },
  { label: 'Vanjangi',   to: '/vanjangi' },
  { label: 'Lambasingi', to: '/lambasingi' },
  { label: 'Blog',       to: '/blog' },
  { label: 'Contact',    to: '/contact' },
];

export default function PageTabBar() {
  return (
    <div style={{
      position: 'sticky',
      top: '64px',
      zIndex: 900,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E8DDD4',
      boxShadow: '0 2px 8px rgba(100,50,20,0.06)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Hide scrollbar on Chrome/Safari */}
      <style>{`
        .page-tab-bar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="page-tab-bar"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',    // centered on all sizes
          width: '100%',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        {TABS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 18px',
              fontSize: '13.5px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#C4622D' : '#6B5744',
              textDecoration: 'none',
              borderBottom: isActive
                ? '2.5px solid #C4622D'   // active tab underline
                : '2.5px solid transparent',
              backgroundColor: isActive
                ? 'rgba(196,98,45,0.05)'   // subtle active bg
                : 'transparent',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.borderBottom.includes('#C4622D')) {
                e.currentTarget.style.color = '#C4622D';
                e.currentTarget.style.backgroundColor = 'rgba(196,98,45,0.04)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.borderBottom.includes('#C4622D')) {
                e.currentTarget.style.color = '#6B5744';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
