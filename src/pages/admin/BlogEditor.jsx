import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

export default function BlogEditor() {
  const { id } = useParams(); // if editing existing post
  const isEdit = !!id;
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    cover_image: '', category: 'Travel Tips', read_time: '5 min read',
    author: 'Araku Valley Team', published: true,
    seo_title: '', seo_description: '', meta_keywords: '', og_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          style: 'max-width: 100%; border-radius: 6px; margin: 12px 0;',
        },
      }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm(f => ({ ...f, content: editor.getHTML() }));
    },
  });

  const dataLoadedRef = useRef(false);
  useEffect(() => {
    if (editor && form.content && !dataLoadedRef.current) {
      editor.commands.setContent(form.content, false);
      dataLoadedRef.current = true;
    }
  }, [editor, form.content]);

  // Load existing post if editing
  useEffect(() => {
    if (isEdit) {
      supabase.from('blogs').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setForm(data); });
    }
  }, [id]);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!user || user.email !== 'arakuecostays@gmail.com') {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user || user.email !== 'arakuecostays@gmail.com') {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, title, slug }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const uploadToSupabase = async (file) => {
    if (!file) return null;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG or WebP image.');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return null;
    }

    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `blog_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error, data } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

    if (error) {
      console.error('Storage upload error:', error);
      alert('Image upload failed: ' + error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  // Custom functions removed for TipTap

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl = form.cover_image;

      if (imageFile) {
        const uploaded = await uploadToSupabase(imageFile);
        if (!uploaded) {
          setLoading(false);
          return;
        }
        coverImageUrl = uploaded;
      }

      const finalContent = editor ? editor.getHTML() : form.content;

      const payload = { ...form };
      delete payload.post_date; // Remove if it still exists in old state
      
      payload.content = finalContent;
      payload.cover_image = coverImageUrl;
      payload.og_image = form.og_image || coverImageUrl;
      payload.updated_at = new Date().toISOString();

      let error;
      if (isEdit) {
        ({ error } = await supabase.from('blogs').update(payload).eq('id', id));
      } else {
        ({ error } = await supabase.from('blogs').insert([payload]));
      }

      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isEdit ? 'Post updated!' : 'Post published!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setUploading(false);
      toast.error('Image upload failed: ' + err.message);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #E8DDD4', backgroundColor: '#FAF7F2',
    fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A120B', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '150px 20px 40px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: '#1a3a2a', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white', border: '1px solid rgba(255,255,255,0.2)',
            padding: '7px 16px', borderRadius: '8px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
          Araku Admin
        </span>
        <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
          / {isEdit ? 'Edit' : 'Add'} Blog
        </span>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem', fontWeight: 700, color: '#1A120B', marginBottom: '24px',
        }}>
          {isEdit ? '✏️ Edit Blog Post' : '+ New Blog Post'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Title *</label>
            <input name="title" value={form.title} onChange={handleTitleChange} placeholder="Blog post title" style={inputStyle} required />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Slug (auto-generated)</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="url-friendly-slug" style={inputStyle} required />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '8px'
            }}>
              Cover Image
            </label>

            {(imagePreview || form.cover_image) && (
              <img
                src={imagePreview || form.cover_image}
                alt="preview"
                style={{
                  width: '100%', height: '140px', objectFit: 'cover',
                  borderRadius: '8px', marginBottom: '8px', border: '1px solid #e5e7eb'
                }}
              />
            )}

            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
              background: imageFile ? '#2D6A4F' : '#f0fdf4',
              border: `2px dashed ${imageFile ? '#2D6A4F' : '#86efac'}`,
              borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: '600', color: imageFile ? '#fff' : '#2D6A4F',
              transition: 'all 0.2s'
            }}>
              <span>{imageFile ? '✓ Image Selected' : '📷 Choose Image'}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8 }}>
                {imageFile ? imageFile.name : 'JPG, PNG, WebP up to 5MB'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="">Select a category</option>
                {['Destination Guide','Travel Tips','Culture','Food','Adventure','Outdoors','Water','Nature','Photography','Local Experiences'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Read Time</label>
              <input name="read_time" value={form.read_time} onChange={handleChange} placeholder="5 min read" style={inputStyle} />
            </div>
          </div>


          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Short Excerpt *</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Brief description shown on blog listing..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} required />
          </div>

          {/* SEO & Meta Section */}
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #E8DDD4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#1A120B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SEO & Meta Data</h3>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Meta Title (defaults to post title)</label>
              <input name="seo_title" value={form.seo_title || ''} onChange={handleChange}
                placeholder="Custom title for search results..." style={inputStyle} maxLength={60} />
              <p style={{ fontSize: '11px', color: '#9E8B7B', marginTop: '4px' }}>
                {(form.seo_title || '').length}/60 characters
              </p>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Meta Description (defaults to excerpt)</label>
              <textarea name="seo_description" value={form.seo_description || ''} onChange={handleChange}
                placeholder="Custom description for search results (max 160 characters)..."
                style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} maxLength={160} />
              <p style={{ fontSize: '11px', color: '#9E8B7B', marginTop: '4px' }}>
                {(form.seo_description || '').length}/160 characters
              </p>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Meta Keywords</label>
              <input name="meta_keywords" value={form.meta_keywords || ''} onChange={handleChange}
                placeholder="e.g. araku tour, coffee plantation, vizag" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>OG Image URL (defaults to cover image)</label>
              <input name="og_image" value={form.og_image || ''} onChange={handleChange}
                placeholder="https://..." style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{
              fontSize: '13px', fontWeight: '600',
              color: '#6B5744', display: 'block', marginBottom: '6px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Full Content *
            </label>

            {/* Toolbar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px',
              padding: '10px 12px',
              backgroundColor: '#FAF7F2',
              border: '1.5px solid #E8DDD4',
              borderRadius: '10px 10px 0 0',
            }}>
              {/* Bold */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBold().run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: editor?.isActive('bold') ? 'bold' : 'normal',
                }}
              >B</button>

              {/* Italic */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontStyle: 'italic',
                }}
              >I</button>

              {/* Underline */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  textDecoration: 'underline',
                }}
              >U</button>

              {/* H2 */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >H2</button>

              {/* H3 */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >H3</button>

              {/* Bullet List */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >• List</button>

              {/* Ordered List */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >1. List</button>

              {/* Text color */}
              <input
                type="color"
                title="Text Color"
                onChange={e => editor.chain().focus().setColor(e.target.value).run()}
                style={{ width: '32px', height: '32px', border: '1px solid #E8DDD4', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
              />

              {/* Image toolbar button */}
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => imageInputRef.current.click()}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  border: '1px solid #E8DDD4', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  color: '#1A120B'
                }}
              >
                {uploadingInline ? '⏳ Uploading...' : '🖼️ Image'}
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploadingInline(true);
                  const fileName = `blog-inline-${Date.now()}-${file.name}`;
                  const { data, error } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, file);

                  if (!error) {
                    const { data: urlData } = supabase.storage
                      .from('blog-images')
                      .getPublicUrl(data.path);

                    console.log('Uploaded image public URL:', urlData.publicUrl);
                    editor.chain().focus().setImage({ src: urlData.publicUrl }).run();

                    // wait for tiptap to commit
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setForm(f => ({ ...f, content: editor.getHTML() }));
                  } else {
                    toast.error('Image upload failed: ' + error.message);
                  }

                  setUploadingInline(false);
                  e.target.value = '';
                }}
              />
            </div>

            {/* Editable content area */}
            <EditorContent
              editor={editor}
              style={{
                minHeight: '320px',
                padding: '16px',
                border: '1.5px solid #E8DDD4',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                backgroundColor: '#fff',
                fontSize: '15px',
                lineHeight: '1.7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#1A120B',
                outline: 'none',
              }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span style={{ fontSize: '14px', color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Published (visible on blog page)
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '10px 24px', borderRadius: '8px',
              backgroundColor: loading ? '#86efac' : '#2D6A4F',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}>
              {loading ? (
                <>
                  <span style={{
                    width: '14px', height: '14px', border: '2px solid #fff',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.6s linear infinite'
                  }} />
                  Saving...
                </>
              ) : (isEdit ? 'Update Post' : 'Publish Post')}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} style={{
              padding: '13px 24px', borderRadius: '100px',
              backgroundColor: 'transparent', color: '#6B5744',
              border: '1.5px solid #E8DDD4', cursor: 'pointer',
              fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
