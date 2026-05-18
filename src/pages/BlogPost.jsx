import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blog';
import { Clock, ArrowLeft, Tag, MessageCircle } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function renderContent(content) {
  const lines = content.split('\n');
  const elements = [];
  let key = 0;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="font-playfair font-bold text-[#1C1C1E] text-2xl mt-8 mb-3">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="font-playfair font-semibold text-[#1C1C1E] text-xl mt-6 mb-2">{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**') && line.includes(':')) {
      const parts = line.replace(/\*\*/g, '').split(':');
      elements.push(<p key={key++} className="text-[#6B7280] text-base mb-2"><strong className="text-[#1C1C1E]">{parts[0]}:</strong>{parts.slice(1).join(':')}</p>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++} className="text-[#6B7280] text-base ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>);
    } else if (line.match(/^\|/)) {
      // skip table rows (rendered as-is in a simple way)
    } else if (line.trim()) {
      elements.push(<p key={key++} className="text-[#6B7280] text-base leading-relaxed mb-4">{line}</p>);
    }
  }
  return elements;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const other = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-24 md:pt-32">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <span className="inline-block bg-[#2D6A4F] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{post.category}</span>
          <h1 className="font-playfair font-bold text-white text-2xl md:text-4xl leading-tight max-w-3xl">{post.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-6 flex items-center gap-4 text-sm text-[#6B7280]">
        <span>{post.date}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
        <span>·</span>
        <span>By {post.author}</span>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-5 md:px-8 py-8">
        {renderContent(post.content)}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#F4E9D8]">
          {post.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-[#EFF7F2] text-[#2D6A4F] px-3 py-1.5 rounded-full font-medium">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-[#EFF7F2] rounded-2xl p-8 text-center border border-[#F4E9D8]">
          <h3 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-2">Ready to Experience Araku?</h3>
          <p className="text-[#6B7280] mb-5">Let our local experts plan the perfect trip for you.</p>
          <a
            href="https://wa.me/919573112302"
            target="_blank"
            rel="noopener noreferrer"
            id="blog-cta-whatsapp"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </article>

      {/* Related Posts */}
      {other.length > 0 && (
        <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#EFF7F2]" id="related-posts">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair font-bold text-[#1C1C1E] text-2xl mb-6">More from the Blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {other.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-[#FFFBF4] rounded-xl overflow-hidden border border-[#F4E9D8] hover:shadow-md transition-shadow">
                  <img src={p.image} alt={p.title} className="w-full h-36 object-cover" onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }} />
                  <div className="p-4">
                    <p className="text-xs text-[#6B7280] mb-1">{p.category} · {p.readTime}</p>
                    <h3 className="font-playfair font-semibold text-[#1C1C1E] text-sm leading-snug group-hover:text-[#2D6A4F] transition-colors line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
