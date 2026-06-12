import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function PackageEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', slug: '', price: '', mrp: '', price_label: 'per Couple',
    duration: '', type: 'Day Trip', badge: '', image: '',
    includes: '', excludes: '', itinerary: [{ day: 1, title: '', description: '' }],
    rating: '', reviewCount: '', published: true,
  });
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
    const fileName = `package_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('package-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });

    if (error) {
      console.error('Storage upload error:', error);
      alert('Image upload failed: ' + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('package-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  useEffect(() => {
    if (isEdit) {
      supabase.from('packages').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            let parsedItinerary = data.itinerary || [];
            if (parsedItinerary.length > 0 && typeof parsedItinerary[0] === 'string') {
              // Convert legacy string array to object array
              parsedItinerary = parsedItinerary.map((stop, i) => ({
                day: i + 1,
                title: stop,
                description: '',
              }));
            } else if (parsedItinerary.length === 0) {
              parsedItinerary = [{ day: 1, title: '', description: '' }];
            }

            setForm({
              ...data,
              price: data.price || '',
              mrp: data.mrp || '',
              includes: (data.includes || []).join('\n'),
              excludes: (data.excludes || []).join('\n'),
              itinerary: parsedItinerary,
            });
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

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(f => ({ ...f, title, slug }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItin = [...form.itinerary];
    newItin[index][field] = value;
    setForm(f => ({ ...f, itinerary: newItin }));
  };

  const addItineraryDay = () => {
    setForm(f => ({
      ...f,
      itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: '', description: '' }]
    }));
  };

  const removeItineraryDay = (index) => {
    setForm(f => {
      const newItin = f.itinerary.filter((_, i) => i !== index);
      newItin.forEach((item, i) => { item.day = i + 1; });
      return { ...f, itinerary: newItin };
    });
  };

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
        price: parseInt(form.price) || null,
        mrp: parseInt(form.mrp) || null,
        rating: parseFloat(form.rating) || null,
        reviewCount: parseInt(form.reviewCount) || null,
        includes: form.includes.split('\n').filter(Boolean),
        excludes: form.excludes.split('\n').filter(Boolean),
        itinerary: form.itinerary.filter(item => item.title.trim()),
      };

      let error;
      if (isEdit) {
        ({ error } = await supabase.from('packages').update(payload).eq('id', id));
      } else {
        ({ error } = await supabase.from('packages').insert([payload]));
      }

      setLoading(false);
      if (error) { toast.error(error.message); }
      else {
        toast.success(isEdit ? 'Package updated!' : 'Package added!');
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
          / {isEdit ? 'Edit' : 'Add'} Package
        </span>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem', fontWeight: 700, color: '#1A120B', marginBottom: '24px',
        }}>
          {isEdit ? '✏️ Edit Package' : '+ Add New Package'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Package Title *</label>
            <input name="title" value={form.title} onChange={handleTitleChange} placeholder="e.g. Vizag to Araku — 1 Day" style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Slug (auto-generated)</label>
            <input name="slug" value={form.slug} onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Admin Rate (Price ₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="3499" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Display MRP (Original ₹)</label>
              <input name="mrp" type="number" value={form.mrp} onChange={handleChange} placeholder="4999" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price Label</label>
              <input name="price_label" value={form.price_label} onChange={handleChange} placeholder="per Couple" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="1 Night / 2 Days" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                <option>Day Trip</option>
                <option>Overnight</option>
                <option>Extended Tour</option>
                <option>Summer Special</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Rating (0-5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="4.8" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Review Count</label>
              <input name="reviewCount" type="number" value={form.reviewCount} onChange={handleChange} placeholder="124" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Badge (e.g. Most Popular, Best Value, Premium)</label>
            <input name="badge" value={form.badge} onChange={handleChange} placeholder="Most Popular" style={inputStyle} />
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Includes (one per line) <span style={{color:'#16a34a'}}>✅</span></label>
              <textarea name="includes" value={form.includes} onChange={handleChange}
                placeholder={"Transportation\nAccommodation\nBreakfast"}
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Excludes (one per line) <span style={{color:'#dc2626'}}>❌</span></label>
              <textarea name="excludes" value={form.excludes} onChange={handleChange}
                placeholder={"Flight Tickets\nPersonal Expenses\nLunch"}
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Itinerary Builder</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.itinerary.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: '#fff', border: '1px solid #E8DDD4',
                  borderRadius: '12px', padding: '16px', position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A120B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.day}
                    </span>
                    {form.itinerary.length > 1 && (
                      <button type="button" onClick={() => removeItineraryDay(index)} style={{
                        background: 'none', border: 'none', color: '#C4622D', fontSize: '12px',
                        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '600'
                      }}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      value={item.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      placeholder="Title (e.g. Borra Caves & Katika Waterfalls)"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      placeholder="Description of activities..."
                      style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addItineraryDay} style={{
                padding: '10px', borderRadius: '10px', backgroundColor: '#F4EDE3',
                border: '1.5px dashed #C9B8A8', color: '#6B5744', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: '600',
                transition: 'all 0.2s',
              }}>
                + Add Day
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span style={{ fontSize: '14px', color: '#6B5744', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Published (visible on packages page)
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
              ) : (isEdit ? 'Update Package' : 'Add Package')}
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
