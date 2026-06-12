import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function ResortEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', slug: '', tagline: '', category: 'Eco Resort',
    location: '', description: '', image: '',
    price_per_night: '', whatsapp: 'https://wa.me/919573112302',
    rating: 4.5, review_count: 0, published: true,
  });
  
  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState('');
  
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
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

    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `resort_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('resort-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

    if (error) {
      console.error('Storage upload error:', error);
      alert('Image upload failed: ' + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resort-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  useEffect(() => {
    if (isEdit) {
      supabase.from('resorts').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setForm({
              ...data,
              price_per_night: data.price_per_night || '',
            });
            setHighlights(data.highlights || []);
            setAmenities(data.amenities || []);
          }
        });
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

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, name, slug }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };
  const removeHighlight = (i) => setHighlights(highlights.filter((_, idx) => idx !== i));

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };
  const removeAmenity = (i) => setAmenities(amenities.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        if (!uploaded) {
          setLoading(false);
          return;
        }
        imageUrl = uploaded;
      }

      const payload = {
        ...form,
        image: imageUrl,
        price_per_night: parseInt(form.price_per_night) || null,
        rating: parseFloat(form.rating) || 0,
        review_count: parseInt(form.review_count) || 0,
        highlights: highlights,
        amenities: amenities,
      };

      let error;
      if (isEdit) {
        ({ error } = await supabase.from('resorts').update(payload).eq('id', id));
      } else {
        ({ error } = await supabase.from('resorts').insert([payload]));
      }

      setLoading(false);
      if (error) { toast.error(error.message); }
      else {
        toast.success(isEdit ? 'Resort updated!' : 'Resort added!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setUploading(false);
      toast.error('Submission failed: ' + err.message);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #E8DDD4', backgroundColor: '#FAF7F2',
    fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A120B', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: '13px', fontWeight: '600', color: '#6B5744',
    display: 'block', marginBottom: '6px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
          / {isEdit ? 'Edit' : 'Add'} Resort
        </span>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem', fontWeight: 700, color: '#1A120B', marginBottom: '24px',
        }}>
          {isEdit ? '✏️ Edit Resort' : '+ Add New Resort'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Resort Name *</label>
            <input name="name" value={form.name} onChange={handleNameChange} placeholder="e.g. Araku Eco Stays" style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Slug (auto-generated)</label>
            <input name="slug" value={form.slug} onChange={handleChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Tagline</label>
            <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Luxury in the lap of nature" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option>Eco Resort</option>
                <option>Luxury</option>
                <option>Budget</option>
                <option>Boutique</option>
                <option>Camping</option>
                <option>Government Resort</option>
                <option>Private Cottages</option>
                <option>Heritage Stay</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Araku Valley, AP" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Price Per Night (₹)</label>
              <input name="price_per_night" type="number" value={form.price_per_night} onChange={handleChange} placeholder="3500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp Link</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/..." style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Rating (0-5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Review Count</label>
              <input name="review_count" type="number" value={form.review_count} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the resort..."
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: '700',
              textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: '8px'
            }}>
              Cover Image
            </label>

            {(imagePreview || form.image) && (
              <img
                src={imagePreview || form.image}
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          <div>
            <label style={labelStyle}>Highlights</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }} placeholder="e.g. Coffee plantation walks" style={inputStyle} />
              <button type="button" onClick={addHighlight} style={{ padding: '0 20px', borderRadius: '10px', backgroundColor: '#C4622D', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {highlights.map((h, i) => (
                <span key={i} style={{ background: '#EFF7F2', color: '#2D6A4F', padding: '4px 10px', borderRadius: '100px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {h}
                  <button type="button" onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontWeight: 'bold' }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Amenities</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }} placeholder="e.g. Free WiFi" style={inputStyle} />
              <button type="button" onClick={addAmenity} style={{ padding: '0 20px', borderRadius: '10px', backgroundColor: '#C4622D', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {amenities.map((a, i) => (
                <span key={i} style={{ background: '#EFF7F2', color: '#2D6A4F', padding: '4px 10px', borderRadius: '100px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {a}
                  <button type="button" onClick={() => removeAmenity(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontWeight: 'bold' }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span style={{ fontSize: '14px', color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Published (visible on resorts page)
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
              ) : (isEdit ? 'Update Resort' : 'Add Resort')}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} style={{
              padding: '13px 24px', borderRadius: '100px',
              backgroundColor: 'transparent', color: '#6B5744',
              border: '1.5px solid #E8DDD4', cursor: 'pointer',
              fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
