import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TABS = [
  { label: 'Packages', emoji: '🏔️', path: '/packages' },
  { label: 'Resorts', emoji: '🏨', path: '/resorts' },
  { label: 'Travels', emoji: '🚗', path: '/travels' },
];

export default function ArakuNavTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  const handleTab = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#FAF7F2', paddingTop: '68px' }}>
      <div style={{
        backgroundColor: '#F4EDE3',
        margin: '10px 14px',
        borderRadius: '14px',
        padding: '4px',
        display: 'flex',
        alignItems: 'stretch',
        height: '58px',
        gap: '4px',
        border: '1px solid #E8DDD4',
        boxShadow: '0 2px 8px rgba(100,50,20,0.08)',
      }}>
        {TABS.map((tab) => {
          const isActive = activePath === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => handleTab(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px',
                backgroundColor: isActive ? '#C4622D' : 'transparent',
                transition: 'background-color 0.2s ease',
                padding: '4px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{tab.emoji}</span>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#FFFFFF' : '#7C5C44',
                whiteSpace: 'nowrap',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
