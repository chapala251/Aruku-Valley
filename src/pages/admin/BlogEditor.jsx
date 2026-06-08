import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function BlogEditor() {
  const { id } = useParams(); // if editing existing post
  const isEdit  = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    cover_image: '', category: 'Travel Tips', read_time: '5 min read',
    author: 'Araku Valley Team', published: true,
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading]       = useState(false);

  // Load existing post if editing
  useEffect(() => {
    if (isEdit) {
      supabase.from('blogs').select('*').eq('id', id).single()
        .then(({ data }) => { if (data) setForm(data); });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug  = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, title, slug }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview instantly
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const uploadToSupabase = async (file) => {
    const fileExt  = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl = form.cover_image;

      // If new image file selected, upload it first
      if (imageFile) {
        setUploading(true);
        coverImageUrl = await uploadToSupabase(imageFile);
        setUploading(false);
      }

      const payload = {
        ...form,
        cover_image: coverImageUrl,
        updated_at: new Date().toISOString(),
      };

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
        navigate('/blog');
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
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '80px 20px 40px' }}>
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

          <div>
            <label style={{
              fontSize: '13px', fontWeight: '600',
              color: '#6B5744', display: 'block', marginBottom: '6px',
            }}>
              Cover Image *
            </label>

            {/* Upload button */}
            <label htmlFor="image-upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '100px',
              backgroundColor: '#F4EDE3', border: '1.5px dashed #C9B8A8',
              cursor: 'pointer', fontSize: '14px', fontWeight: '500',
              color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}>
              📁 Choose Image from Device
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>

            <p style={{
              fontSize: '12px', color: '#9E8B7B', marginTop: '6px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Supported: JPG, PNG, WEBP. Max 5MB recommended.
            </p>

            {/* Image Preview */}
            {(imagePreview || form.cover_image) && (
              <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview || form.cover_image}
                  alt="Cover preview"
                  style={{
                    width: '100%', maxWidth: '400px',
                    height: '200px', objectFit: 'cover',
                    borderRadius: '12px', border: '1px solid #E8DDD4',
                  }}
                />
                {/* Remove image button */}
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setImageFile(null); setForm(f => ({ ...f, cover_image: '' })); }}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                    border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload progress indicator */}
            {uploading && (
              <p style={{
                marginTop: '8px', fontSize: '13px', color: '#C4622D',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                ⏳ Uploading image...
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option>Destination Guide</option>
                <option>Travel Tips</option>
                <option>Culture & Food</option>
                <option>Adventure</option>
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

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B5744', display: 'block', marginBottom: '6px' }}>
              Full Content (HTML supported) *
            </label>
            <textarea name="content" value={form.content} onChange={handleChange}
              placeholder="<p>Write your full article here. You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; etc.</p>"
              style={{ ...inputStyle, minHeight: '300px', resize: 'vertical', fontFamily: 'monospace' }}
              required
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span style={{ fontSize: '14px', color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Published (visible on blog page)
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" disabled={loading || uploading} style={{
              flex: 1, padding: '13px', borderRadius: '100px',
              backgroundColor: (loading || uploading) ? '#E8A882' : '#C4622D',
              color: '#fff', border: 'none',
              cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '700',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {uploading ? 'Uploading image...' : loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
            </button>
            <button type="button" onClick={() => navigate('/blog')} style={{
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
