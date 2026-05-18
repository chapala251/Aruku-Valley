import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blog';
import SectionHeader from '../components/shared/SectionHeader';
import { Clock, ArrowRight, Tag } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export default function Blog() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-28 md:pt-36">
      <section className="py-20 md:py-24 px-5 md:px-8 bg-[#EFF7F2]" id="blog-header">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Travel Blog"
            title="Araku Valley Travel Guide"
            subtitle="In-depth guides, travel tips, and stories from the Eastern Ghats."
          />
        </div>
      </section>

      <section className="py-24 md:py-32 md:py-20 px-5 md:px-8 bg-[#FFFBF4]" id="blog-grid">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group bg-[#FFFBF4] rounded-2xl overflow-hidden shadow-sm border border-[#F4E9D8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link to={`/blog/${post.slug}`} id={`blog-post-${post.id}`}>
                <div className="relative overflow-hidden h-52">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://araku-valley.com/wp-content/uploads/2024/06/ARAKU-VALLEY.png'; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                  <h2 className="font-playfair font-bold text-[#1C1C1E] text-xl leading-snug mb-3 group-hover:text-[#2D6A4F] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-[#2D6A4F] bg-[#EFF7F2] px-2.5 py-1 rounded-full">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[#2D6A4F] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
