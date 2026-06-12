import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stored = localStorage.getItem('user');
  const currentUser = stored ? JSON.parse(stored) : null;
  const isAdmin = currentUser?.email === 'arakuecostays@gmail.com';

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();
      setPost(data);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    // Page title
    document.title = `${post.seo_title || post.title} | Araku Valley`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = post.seo_description || post.excerpt || post.title;

    // Meta keywords
    if (post.meta_keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        document.head.appendChild(metaKw);
      }
      metaKw.content = post.meta_keywords;
    }

    // OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = `${post.seo_title || post.title} | Araku Valley`;

    // OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = post.seo_description || post.excerpt || '';

    // OG Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property', 'og:image'); document.head.appendChild(ogImg); }
    ogImg.content = post.og_image || post.cover_image || '';

    // OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = window.location.href;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = window.location.href;

    // Cleanup on unmount
    return () => {
      document.title = 'Araku Valley | Tour Packages from Vizag';
    };
  }, [post]);

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#9E8B7B' }}>Loading...</div>;
  if (!post) return <div style={{ padding: '120px 24px', textAlign: 'center' }}>Post not found. <Link to="/blog">← Back to Blog</Link></div>;

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={post.cover_image || 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(26,18,11,0.85))',
        }} />
        {/* Back button */}
        <Link to="/blog" style={{
          position: 'absolute', top: '80px', left: '24px',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#FAF7F2', textDecoration: 'none', fontSize: '14px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 14px',
          borderRadius: '100px', backdropFilter: 'blur(4px)',
        }}>
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Admin Edit */}
        {isAdmin && (
          <Link to={`/admin/blog/edit/${post.id}`} style={{
            position: 'absolute', top: '80px', right: '24px',
            backgroundColor: '#C4622D', color: '#fff',
            padding: '6px 16px', borderRadius: '100px',
            textDecoration: 'none', fontSize: '13px', fontWeight: '600',
          }}>
            ✏️ Edit Post
          </Link>
        )}

        {/* Title overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 24px 32px', maxWidth: '800px', margin: '0 auto',
        }}>
          <span style={{
            backgroundColor: '#C4622D', color: '#fff',
            fontSize: '11px', fontWeight: '700', padding: '4px 12px',
            borderRadius: '100px', letterSpacing: '0.08em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {post.category}
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: '#FAF7F2', fontWeight: 700, lineHeight: 1.15,
            margin: '12px 0 0',
          }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div style={{
        backgroundColor: '#fff', borderBottom: '1px solid #E8DDD4',
        padding: '16px 24px', display: 'flex', gap: '20px', flexWrap: 'wrap',
      }}>
        {[
          { icon: User, text: post.author },
          { icon: Calendar, text: new Date(post.post_date || post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
          { icon: Clock, text: post.read_time },
        ].map(({ icon: Icon, text }) => (
          <span key={text} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: '#6B5744',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <Icon size={14} color="#C4622D" /> {text}
          </span>
        ))}
      </div>

      {/* Article Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
