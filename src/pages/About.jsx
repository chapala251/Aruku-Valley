import { Link } from 'react-router-dom';
import ArakuNavTabs from '../components/ArakuNavTabs';

export default function About() {
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
      <ArakuNavTabs />

      {/* Hero */}
      <div style={{
        backgroundColor: '#2D6A4F',
        padding: '60px 24px 50px',
        textAlign: 'center',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: '11px',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          marginBottom: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>WHO WE ARE</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: '#FFFBF4', fontWeight: 700, margin: '0 0 16px',
          lineHeight: 1.1,
        }}>About Araku Valley</h1>
        <p style={{
          color: 'rgba(255,255,255,0.78)', fontSize: '15px',
          maxWidth: '520px', margin: '0 auto', lineHeight: 1.7,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Your trusted local travel partner for exploring the Eastern Ghats —
          tribal culture, coffee plantations, and breathtaking viewpoints await.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Our Story */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#C4622D', marginBottom: '10px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center',
          }}>— OUR STORY —</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem', fontWeight: 600, color: '#1A120B', marginBottom: '16px',
          }}>Born from a Love for Araku</h2>
          <p style={{
            fontSize: '15px', color: '#4A3728', lineHeight: 1.85,
            fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '14px',
          }}>
            We are a team of local guides, travel enthusiasts, and hospitality experts
            born and raised in the Eastern Ghats. Araku Valley is not just a destination
            for us — it is home. We started this journey to share the real Araku with
            travellers from across India and the world.
          </p>
          <p style={{
            fontSize: '15px', color: '#4A3728', lineHeight: 1.85,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            From the misty Vanjangi Hills to the ancient Borra Caves, from aromatic
            coffee estates to vibrant tribal markets — we curate experiences that go
            beyond the usual tourist trail and connect you with the soul of this land.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px', marginBottom: '48px',
        }}>
          {[
            { number: '2,000+', label: 'Happy Travellers' },
            { number: '20+', label: 'Tour Packages' },
            { number: '8+', label: 'Years of Experience' },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: '#fff', borderRadius: '14px',
              border: '1px solid #E8DDD4', padding: '20px 12px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(100,50,20,0.06)',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem', fontWeight: 700, color: '#C4622D',
                margin: '0 0 4px',
              }}>{stat.number}</p>
              <p style={{
                fontSize: '12px', color: '#6B5744',
                fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0,
              }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Why Us */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#C4622D', marginBottom: '10px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center',
          }}>— WHY CHOOSE US —</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem', fontWeight: 600, color: '#1A120B', marginBottom: '20px',
          }}>What Makes Us Different</h2>

          {[
            { icon: '🌿', title: 'Local Expertise', desc: 'Born and bred in Araku — we know every trail, cave, and waterfall in the Eastern Ghats.' },
            { icon: '💰', title: 'Best Price Guarantee', desc: 'No hidden charges. Transparent pricing. We match any lower price, guaranteed.' },
            { icon: '🏕️', title: 'Authentic Experiences', desc: 'Tribal homestays, coffee estate walks, bonfire nights — curated for genuine discovery.' },
            { icon: '📱', title: '24/7 WhatsApp Support', desc: 'Our team is always a message away. Day or night, we are here during your trip.' },
          ].map(item => (
            <div key={item.title} style={{
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              marginBottom: '20px', padding: '18px',
              backgroundColor: '#fff', borderRadius: '14px',
              border: '1px solid #E8DDD4',
            }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px', fontWeight: '700', color: '#1A120B',
                  margin: '0 0 6px',
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '13px', color: '#6B5744', lineHeight: 1.6,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0,
                }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Collaborate Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: '1px solid #E8DDD4',
          padding: '32px 24px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(100,50,20,0.08)',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#C4622D', marginBottom: '10px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center',
          }}>— PARTNER WITH US —</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.7rem', fontWeight: 600, color: '#1A120B', marginBottom: '12px',
            textAlign: 'center',
          }}>Want to Collaborate?</h2>
          <p style={{
            fontSize: '14px', color: '#4A3728', lineHeight: 1.75,
            fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '20px',
          }}>
            Are you a resort owner or travel operator in and around Araku Valley?
            We would love to feature your property or services on our platform
            and bring more travellers your way. Whether you run a resort, homestay,
            cab service, or adventure activity — let's grow together.
          </p>

          {/* Two collaborate options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { icon: '🏨', label: 'Resorts & Stays', desc: 'List your property and reach thousands of travellers' },
              { icon: '🚗', label: 'Travels & Cabs', desc: 'Partner with us for tour transportation services' },
            ].map(item => (
              <div key={item.label} style={{
                backgroundColor: '#FAF7F2', borderRadius: '12px',
                border: '1px solid #E8DDD4', padding: '16px 12px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>{item.icon}</span>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px', fontWeight: '700', color: '#1A120B', margin: '0 0 4px',
                }}>{item.label}</p>
                <p style={{
                  fontSize: '11px', color: '#9E8B7B', margin: 0,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#2D6A4F', color: '#FFFBF4',
              padding: '12px 28px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'background-color 0.2s',
            }}>
              📩 Contact Us to Collaborate
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          backgroundColor: '#C4622D', borderRadius: '20px',
          padding: '36px 24px', textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem', color: '#FFFBF4', fontWeight: 700, margin: '0 0 10px',
          }}>Ready to Explore Araku?</h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '24px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Browse our curated packages and start planning your perfect trip.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/packages" style={{
              backgroundColor: '#FFFBF4', color: '#C4622D',
              padding: '12px 28px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Explore Packages
            </Link>
            <Link to="/contact" style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFBF4',
              padding: '12px 28px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}>
              📩 Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
