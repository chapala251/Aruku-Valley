import { NavLink } from 'react-router-dom';
import { Info, Home, BookOpen } from 'lucide-react';

export default function MobileTabBar() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 999,
      height: '64px',
      backgroundColor: '#FFFBF4',
      borderTop: '1px solid #E8DDD4',
      boxShadow: '0 -4px 20px rgba(100,50,20,0.10)',
      display: 'none',
    }} className="araku-mobile-tabbar">

      {/* ABOUT */}
      <NavLink to="/about" end
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '3px', height: '64px', textDecoration: 'none',
          color: isActive ? '#C4622D' : '#9E8B7B',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '10px', fontWeight: isActive ? '600' : '400',
          borderTop: isActive ? '2.5px solid #C4622D' : '2.5px solid transparent',
        })}
      >
        <Info size={20} />
        <span>About</span>
      </NavLink>

      {/* HOME */}
      <NavLink to="/" end
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '3px', height: '64px', textDecoration: 'none',
          color: isActive ? '#C4622D' : '#9E8B7B',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '10px', fontWeight: isActive ? '600' : '400',
          borderTop: isActive ? '2.5px solid #C4622D' : '2.5px solid transparent',
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      {/* BLOG */}
      <NavLink to="/blog" end
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '3px', height: '64px', textDecoration: 'none',
          color: isActive ? '#C4622D' : '#9E8B7B',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '10px', fontWeight: isActive ? '600' : '400',
          borderTop: isActive ? '2.5px solid #C4622D' : '2.5px solid transparent',
        })}
      >
        <BookOpen size={20} />
        <span>Blog</span>
      </NavLink>

    </nav>
  );
}
