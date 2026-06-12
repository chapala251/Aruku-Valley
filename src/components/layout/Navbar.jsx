import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Force re-render on navigation

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className="main-navbar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '64px',
        alignItems: 'center',
        padding: '0 24px',
        backgroundColor: scrolled ? 'rgba(250,247,242,0.97)' : 'rgba(250,247,242,0.93)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8DDD4',
        boxShadow: scrolled ? '0 2px 20px rgba(100,50,20,0.10)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>

        {/* LEFT — empty on desktop (for balance), Sign In on mobile hidden */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="mobile-signin-left" style={{ display: 'none' }}>
          </div>
        </div>

        {/* CENTER — Logo always centered on desktop */}
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', justifyContent: 'center',
          }}>
          <div className="navbar-brand-icon" style={{
            width: '36px', height: '36px', borderRadius: '9px',
            backgroundColor: '#C4622D', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px',
            boxShadow: '0 2px 8px rgba(196,98,45,0.28)', flexShrink: 0,
          }}>🌿</div>
          <span className="navbar-brand-title" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700, fontSize: '22px', color: '#1A120B',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            lineHeight: 1, whiteSpace: 'nowrap',
          }}>Araku Valley</span>
        </Link>
        {/* RIGHT — Sign In button or Greeting */}
        <div className="header-auth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* "Hi, Name" text — HIDE on mobile, show on desktop only */}
              <span
                className="user-greeting"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  color: '#6B5744',
                  whiteSpace: 'nowrap',
                }}
              >
                Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.name?.split(' ')[0] || 'there'}
              </span>

              {/* Avatar circle — always visible */}
              <Link
                to="/dashboard"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#C4622D',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: '700',
                  flexShrink: 0,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {(user.user_metadata?.full_name || user.name || user.email || 'U')[0].toUpperCase()}
              </Link>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="sign-in-button"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B5744',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '100px',
                border: '1.5px solid #C9B8A8',
                backgroundColor: 'transparent',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C4622D';
                e.currentTarget.style.color = '#C4622D';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#C9B8A8';
                e.currentTarget.style.color = '#6B5744';
              }}
            >
              Sign In
            </Link>
          )}
        </div>

      </nav>
    </>
  );
}
