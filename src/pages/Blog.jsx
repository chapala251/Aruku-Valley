import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, Tag, ArrowRight, X } from 'lucide-react';
import ArakuNavTabs from '../components/ArakuNavTabs';

const CATEGORIES = ['All', 'Destination Guide', 'Travel Tips', 'Culture', 'Food', 'Adventure', 'Outdoors', 'Water', 'Nature', 'Photography', 'Local Experiences'];

export default function Blog() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');

  // Sync activeCategory with URL param
  useEffect(() => {
    setActiveCategory(categoryFilter || 'All');
  }, [categoryFilter]);

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('published', true);
      if (activeCategory && activeCategory !== 'All') {
        query = query.eq('category', activeCategory);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, [activeCategory]);

  const handleCategoryClick = (cat) => {
    if (cat === 'All') {
      navigate('/blog');
    } else {
      navigate(`/blog?category=${encodeURIComponent(cat)}`);
    }
  };

  const filtered = posts; // already filtered via Supabase query

  // Check if admin is logged in
  const stored = localStorage.getItem('user');
  const currentUser = stored ? JSON.parse(stored) : null;
  const isAdmin = currentUser?.email === 'arakuecostays@gmail.com'; // your admin email

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
      <ArakuNavTabs />

      {/* Header */}
      <div style={{
        backgroundColor: '#2D6A4F', padding: '48px 24px 40px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          OUR JOURNAL
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: '#FFFBF4', fontWeight: 700, margin: '0 0 12px',
        }}>Araku Stories</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
          Travel guides, tribal culture, coffee stories and adventure tips from the Eastern Ghats
        </p>

        {/* Admin Add Post Button */}
        {isAdmin && (
          <Link to="/admin/blog/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            marginTop: '20px', backgroundColor: '#C4622D', color: '#fff',
            padding: '10px 24px', borderRadius: '100px', textDecoration: 'none',
            fontSize: '14px', fontWeight: '600',
          }}>
            + Add New Post
          </Link>
        )}
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex', gap: '8px', padding: '20px 24px',
        overflowX: 'auto', scrollbarWidth: 'none',
        borderBottom: '1px solid #E8DDD4',
        backgroundColor: '#fff',
        alignItems: 'center',
      }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
            padding: '7px 18px', borderRadius: '100px', border: 'none',
            cursor: 'pointer', whiteSpace: 'nowrap',
            backgroundColor: activeCategory === cat ? '#2D6A4F' : '#F4EDE3',
            color: activeCategory === cat ? '#fff' : '#6B5744',
            fontSize: '13px', fontWeight: activeCategory === cat ? '600' : '400',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
          }}>
            {cat}
          </button>
        ))}
        {activeCategory !== 'All' && (
          <button onClick={() => handleCategoryClick('All')} style={{
            padding: '5px 12px', borderRadius: '100px',
            border: '1px solid #dc2626', backgroundColor: '#fee2e2',
            color: '#dc2626', fontSize: '12px', fontWeight: '600',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <X size={12} /> Clear filter
          </button>
        )}
      </div>

      {/* Blog Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9E8B7B' }}>Loading posts...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((post, i) => (
              <article key={post.id} style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E8DDD4',
                boxShadow: '0 2px 12px rgba(100,50,20,0.07)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(100,50,20,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(100,50,20,0.07)'; }}
              >
                {/* Cover Image */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={post.cover_image || 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: 'rgba(45,106,79,0.9)', color: '#fff',
                    fontSize: '10px', fontWeight: '700', padding: '4px 10px',
                    borderRadius: '100px', letterSpacing: '0.06em',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backdropFilter: 'blur(4px)',
                  }}>
                    {post.category}
                  </span>
                  {/* Admin Edit Button */}
                  {isAdmin && (
                    <Link to={`/admin/blog/edit/${post.id}`} style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: '#C4622D', color: '#fff',
                      fontSize: '11px', fontWeight: '600', padding: '4px 10px',
                      borderRadius: '100px', textDecoration: 'none',
                    }}>
                      ✏️ Edit
                    </Link>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9E8B7B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <Clock size={12} /> {post.read_time}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9E8B7B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {new Date(post.post_date || post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.25rem', fontWeight: '600',
                    color: '#1A120B', margin: '0 0 10px', lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h2>

                  <p style={{
                    fontSize: '13px', color: '#6B5744', lineHeight: 1.6,
                    margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </p>

                  <Link to={`/${post.slug}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#C4622D', fontWeight: '600', fontSize: '13px',
                    textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
