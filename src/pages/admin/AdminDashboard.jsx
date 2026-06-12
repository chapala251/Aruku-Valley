import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// --- Shared Table Styles ---
const tableStyle = { 
  width: '100%', 
  borderCollapse: 'collapse', 
  backgroundColor: 'white', 
  borderRadius: '12px', 
  overflow: 'hidden', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  fontSize: window.innerWidth < 768 ? '12px' : '13px',
};
const thStyle = { backgroundColor: '#2D6A4F', color: 'white', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textAlign: 'left' };
const tdStyle = { padding: '12px 16px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6' };
const editBtnStyle = { backgroundColor: '#2D6A4F', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' };
const deleteBtnStyle = { backgroundColor: '#fee2e2', color: '#dc2626', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer', marginLeft: '6px' };

// --- Unified Delete Helper ---
async function unifiedDelete(table, id, setStateFn, itemName) {
  if (!window.confirm(`Delete this ${itemName} permanently?`)) return;
  
  // Debug: check auth session
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[AUTH] session:', session ? 'EXISTS' : 'NULL (anon mode)');
    console.log('[AUTH] user:', session?.user?.email || 'none');
  } catch (e) {
    console.log('[AUTH] getSession failed:', e);
  }

  console.log(`[DELETE] table=${table} id=${id} type=${typeof id}`);
  
  // Attempt 1: delete with .select() to see what was deleted
  const { data, error, status } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .select();
  
  console.log(`[DELETE RESULT] status=${status} data=`, data, 'error=', error);
  
  if (error) {
    console.error('[DELETE ERROR]', error);
    // If RLS blocks it, try without .select()
    console.log('[DELETE] Retrying without .select()...');
    const { error: retryError } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (retryError) {
      alert(`Delete failed!\nMessage: ${retryError.message}\nCode: ${retryError.code}\nHint: ${retryError.hint || 'Check RLS policies in Supabase Dashboard'}`);
      return;
    }
  }
  
  // Update UI — remove the item regardless
  // (if RLS silently blocked it, item will reappear on refresh and user should check RLS)
  setStateFn(prev => prev.filter(item => item.id !== id));
  toast.success(`${itemName} deleted successfully`);
  console.log(`[DELETE SUCCESS] removed id=${id} from UI`);
}

// --- Table Components ---
function PackagesTable() {
  const [data, setData] = useState([]);
  const fetch = () => supabase.from('packages').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('packages', id, setData, 'package');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '24px' }}>Packages</h2>
        <Link to="/admin/package/new" style={{ ...editBtnStyle, backgroundColor: '#C4622D', padding: '8px 16px' }}>+ Add Package</Link>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
        <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th><th style={thStyle}>Title</th><th style={thStyle}>Type</th>
            <th style={thStyle}>Price</th><th style={thStyle}>Duration</th><th style={thStyle}>Published</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={{ transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}><img src={item.image} alt={item.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} /></td>
              <td style={tdStyle}>{item.title}</td>
              <td style={tdStyle}>{item.type}</td>
              <td style={tdStyle}>₹{item.price}</td>
              <td style={tdStyle}>{item.duration}</td>
              <td style={tdStyle}>{item.published ? '✅ Yes' : '❌ No'}</td>
              <td style={tdStyle}>
                <Link to={`/admin/package/edit/${item.id}`} style={editBtnStyle}>Edit</Link>
                <button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

function ResortsTable() {
  const [data, setData] = useState([]);
  const fetch = () => supabase.from('resorts').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('resorts', id, setData, 'resort');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '24px' }}>Resorts</h2>
        <Link to="/admin/resort/new" style={{ ...editBtnStyle, backgroundColor: '#C4622D', padding: '8px 16px' }}>+ Add Resort</Link>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th><th style={thStyle}>Name</th><th style={thStyle}>Category</th>
            <th style={thStyle}>Price/night</th><th style={thStyle}>Rating</th><th style={thStyle}>Published</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} style={{ transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}><img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} /></td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.category}</td>
              <td style={tdStyle}>₹{item.price_per_night}</td>
              <td style={tdStyle}>{item.rating}</td>
              <td style={tdStyle}>{item.published ? '✅ Yes' : '❌ No'}</td>
              <td style={tdStyle}>
                <Link to={`/admin/resort/edit/${item.id}`} style={editBtnStyle}>Edit</Link>
                <button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function BlogsTable() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('blogs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setBlogs(data || []));
  }, []);

  const deleteBlog = (id) => unifiedDelete('blogs', id, setBlogs, 'blog post');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', color: '#1C1C1E', margin: 0 }}>Blog Posts</h2>
        <button
          onClick={() => navigate('/admin/blog/new')}
          style={{ backgroundColor: '#2D6A4F', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
        >
          + New Blog Post
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Cover</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Published</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={tdStyle}>
                <img src={blog.cover_image || blog.image} alt={blog.title}
                  style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </td>
              <td style={{ ...tdStyle, maxWidth: '260px' }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#1C1C1E' }}>{blog.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{blog.slug}</p>
              </td>
              <td style={tdStyle}>
                <span style={{ backgroundColor: blog.published ? '#dcfce7' : '#fee2e2', color: blog.published ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600' }}>
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style={{ ...tdStyle, fontSize: '12px', color: '#6B7280' }}>
                {new Date(blog.created_at).toLocaleDateString('en-IN')}
              </td>
              <td style={tdStyle}>
                <button onClick={() => navigate(`/admin/blog/edit/${blog.id}`)} style={editBtnStyle}>Edit</button>
                <button type="button" onClick={() => deleteBlog(blog.id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {blogs.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>No blog posts yet.</p>
      )}
    </div>
  );
}

function PackageBookingsTable() {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const fetch = () => supabase.from('package_bookings').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('package_bookings', id, setData, 'booking');

  const updateStatus = async (id, newStatus, table) => {
    await supabase.from(table).update({ status: newStatus }).eq('id', id);
    fetch();
  };

  const total = data.length;
  const pending = data.filter(b => b.status === 'pending' || !b.status).length;
  const confirmed = data.filter(b => b.status === 'confirmed').length;
  const rejected = data.filter(b => b.status === 'rejected').length;

  const filtered = statusFilter === 'all' ? data : data.filter(b => (b.status || 'pending') === statusFilter);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontFamily: 'Playfair Display', fontSize: '24px' }}>Package Bookings</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: total, color: '#6B7280', bg: '#f3f4f6' },
          { label: 'Pending', value: pending, color: '#d97706', bg: '#fef3c7' },
          { label: 'Confirmed', value: confirmed, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Rejected', value: rejected, color: '#dc2626', bg: '#fee2e2' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setStatusFilter(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
            style={{
              backgroundColor: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? s.color : s.bg,
              color: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? 'white' : s.color,
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              border: `1px solid ${s.color}`,
            }}
          >
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th><th style={thStyle}>Name</th><th style={thStyle}>Contact</th>
            <th style={thStyle}>Package</th><th style={thStyle}>Dates</th><th style={thStyle}>Vehicle</th>
            <th style={thStyle}>Accommodation</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
              <td style={tdStyle}>{item.full_name}</td>
              <td style={tdStyle}>{item.contact}{item.whatsapp && ` (WA: ${item.whatsapp})`}</td>
              <td style={tdStyle}>{item.package_name}</td>
              <td style={tdStyle}>{item.start_date} to {item.end_date}</td>
              <td style={tdStyle}>{item.vehicle}</td>
              <td style={tdStyle}>{item.accommodation}</td>
              <td style={tdStyle}>
                <select
                  value={item.status || 'pending'}
                  onChange={(e) => updateStatus(item.id, e.target.value, 'package_bookings')}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer',
                    backgroundColor:
                      (item.status || 'pending') === 'pending' ? '#fef3c7' :
                      item.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                    color:
                      (item.status || 'pending') === 'pending' ? '#d97706' :
                      item.status === 'confirmed' ? '#16a34a' : '#dc2626',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td style={tdStyle}><button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResortBookingsTable() {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const fetch = () => supabase.from('resort_bookings').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('resort_bookings', id, setData, 'booking');

  const updateStatus = async (id, newStatus, table) => {
    await supabase.from(table).update({ status: newStatus }).eq('id', id);
    fetch();
  };

  const total = data.length;
  const pending = data.filter(b => b.status === 'pending' || !b.status).length;
  const confirmed = data.filter(b => b.status === 'confirmed').length;
  const rejected = data.filter(b => b.status === 'rejected').length;

  const filtered = statusFilter === 'all' ? data : data.filter(b => (b.status || 'pending') === statusFilter);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontFamily: 'Playfair Display', fontSize: '24px' }}>Resort Bookings</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: total, color: '#6B7280', bg: '#f3f4f6' },
          { label: 'Pending', value: pending, color: '#d97706', bg: '#fef3c7' },
          { label: 'Confirmed', value: confirmed, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Rejected', value: rejected, color: '#dc2626', bg: '#fee2e2' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setStatusFilter(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
            style={{
              backgroundColor: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? s.color : s.bg,
              color: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? 'white' : s.color,
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              border: `1px solid ${s.color}`,
            }}
          >
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th><th style={thStyle}>Name</th><th style={thStyle}>Contact</th>
            <th style={thStyle}>Resort</th><th style={thStyle}>Check-in / out</th><th style={thStyle}>Guests</th>
            <th style={thStyle}>Room Type</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
              <td style={tdStyle}>{item.full_name}</td>
              <td style={tdStyle}>{item.contact}</td>
              <td style={tdStyle}>{item.resort_name}</td>
              <td style={tdStyle}>{item.checkin_date} / {item.checkout_date}</td>
              <td style={tdStyle}>{item.guests}</td>
              <td style={tdStyle}>{item.room_type}</td>
              <td style={tdStyle}>
                <select
                  value={item.status || 'pending'}
                  onChange={(e) => updateStatus(item.id, e.target.value, 'resort_bookings')}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer',
                    backgroundColor:
                      (item.status || 'pending') === 'pending' ? '#fef3c7' :
                      item.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                    color:
                      (item.status || 'pending') === 'pending' ? '#d97706' :
                      item.status === 'confirmed' ? '#16a34a' : '#dc2626',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td style={tdStyle}><button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TravelBookingsTable() {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const fetch = () => supabase.from('travel_bookings').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('travel_bookings', id, setData, 'booking');

  const updateStatus = async (id, newStatus, table) => {
    await supabase.from(table).update({ status: newStatus }).eq('id', id);
    fetch();
  };

  const total = data.length;
  const pending = data.filter(b => b.status === 'pending' || !b.status).length;
  const confirmed = data.filter(b => b.status === 'confirmed').length;
  const rejected = data.filter(b => b.status === 'rejected').length;

  const filtered = statusFilter === 'all' ? data : data.filter(b => (b.status || 'pending') === statusFilter);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontFamily: 'Playfair Display', fontSize: '24px' }}>Travel Bookings</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: total, color: '#6B7280', bg: '#f3f4f6' },
          { label: 'Pending', value: pending, color: '#d97706', bg: '#fef3c7' },
          { label: 'Confirmed', value: confirmed, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Rejected', value: rejected, color: '#dc2626', bg: '#fee2e2' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setStatusFilter(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
            style={{
              backgroundColor: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? s.color : s.bg,
              color: statusFilter === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? 'white' : s.color,
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              border: `1px solid ${s.color}`,
            }}
          >
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th><th style={thStyle}>Name</th><th style={thStyle}>Contact</th>
            <th style={thStyle}>Travel Date</th><th style={thStyle}>Vehicle</th><th style={thStyle}>Passengers</th>
            <th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
              <td style={tdStyle}>{item.full_name}</td>
              <td style={tdStyle}>{item.contact}</td>
              <td style={tdStyle}>{item.travel_date}</td>
              <td style={tdStyle}>{item.vehicle}</td>
              <td style={tdStyle}>{item.passengers}</td>
              <td style={tdStyle}>
                <select
                  value={item.status || 'pending'}
                  onChange={(e) => updateStatus(item.id, e.target.value, 'travel_bookings')}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer',
                    backgroundColor:
                      (item.status || 'pending') === 'pending' ? '#fef3c7' :
                      item.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                    color:
                      (item.status || 'pending') === 'pending' ? '#d97706' :
                      item.status === 'confirmed' ? '#16a34a' : '#dc2626',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td style={tdStyle}><button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactMessagesTable() {
  const [data, setData] = useState([]);
  const fetch = () => supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(res => setData(res.data || []));
  useEffect(() => { fetch(); }, []);

  const handleDelete = (id) => unifiedDelete('contact_messages', id, setData, 'message');

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontFamily: 'Playfair Display', fontSize: '24px' }}>Contact Messages <span style={{ fontSize: '14px', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '12px' }}>{data.length}</span></h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th><th style={thStyle}>Name</th><th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th><th style={thStyle}>Message</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
              <td style={tdStyle}>{item.full_name}</td>
              <td style={tdStyle}>{item.email}</td>
              <td style={tdStyle}>{item.phone}</td>
              <td style={tdStyle}>{item.message?.substring(0, 80)}{item.message?.length > 80 && '...'}</td>
              <td style={tdStyle}><button type="button" onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminSettings() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success('Password updated'); setNewPassword(''); }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontFamily: 'Playfair Display', fontSize: '24px' }}>Admin Settings</h2>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Admin Email</label>
          <input value="arakuecostays@gmail.com" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#6b7280' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Change Password</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            <button onClick={handlePasswordChange} style={{ backgroundColor: '#2D6A4F', color: 'white', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Update</button>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>🚪 Logout</button>
      </div>
    </div>
  );
}

const uploadImage = async (file, bucket) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;

  // Step 1: upload file
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    toast.error('Image upload failed: ' + uploadError.message);
    return null;
  }

  // Step 2: get public URL using just the fileName
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  console.log('Uploaded URL:', data.publicUrl);
  return data.publicUrl;
};

function NoticesManager() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: '', published: true });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const [noticesEnabled, setNoticesEnabled] = useState(true);

  const load = () => supabase.from('notices').select('*').order('created_at', { ascending: false }).then(({ data }) => setNotices(data || []));
  useEffect(() => { 
    load(); 
    supabase.from('popup_config').select('notices_enabled').eq('id', 'main').single()
      .then(({ data }) => { if (data) setNoticesEnabled(data.notices_enabled ?? true); });
  }, []);

  const toggleNotices = async () => {
    const newVal = !noticesEnabled;
    const { error } = await supabase
      .from('popup_config')
      .update({ notices_enabled: newVal })
      .eq('id', 'main');
    if (error) { toast.error('Failed: ' + error.message); return; }
    setNoticesEnabled(newVal);
    toast.success(`Notices ${newVal ? 'enabled' : 'disabled'}`);
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const url = await uploadImage(file, 'notices-images');
    if (url) setForm(f => ({ ...f, image: url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    if (editId) {
      await supabase.from('notices').update(form).eq('id', editId);
    } else {
      await supabase.from('notices').insert(form);
    }
    setForm({ title: '', description: '', image: '', published: true });
    setEditId(null);
    load();
    toast.success(editId ? 'Notice updated!' : 'Notice added!');
  };

  const handleDelete = (id) => unifiedDelete('notices', id, setNotices, 'notice');

  const handleEdit = (n) => {
    setEditId(n.id);
    setForm({ title: n.title, description: n.description || '', image: n.image || '', published: n.published });
  };

  const togglePublish = async (n) => {
    await supabase.from('notices').update({ published: !n.published }).eq('id', n.id);
    load();
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '24px' }}>📢 Notices Manager</h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: noticesEnabled ? '#dcfce7' : '#fee2e2', borderRadius: '10px', marginBottom: '20px' }}>
        <div>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: noticesEnabled ? '#16a34a' : '#dc2626' }}>
            Notices Section is {noticesEnabled ? 'ENABLED' : 'DISABLED'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>
            {noticesEnabled ? 'Notices are visible on the website' : 'Notices section is hidden from all users'}
          </p>
        </div>
        <button onClick={toggleNotices} style={{ backgroundColor: noticesEnabled ? '#dc2626' : '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
          {noticesEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      {/* Form */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>{editId ? 'Edit Notice' : 'Add New Notice'}</h3>
        <div style={{ display: 'grid', gap: '14px' }}>
          <input placeholder="Notice Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px' }} />
          <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3} style={{ padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
          <div>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleImageUpload(e.target.files[0]); }} />
            <button onClick={() => fileRef.current.click()} style={{ padding: '8px 16px', backgroundColor: '#EFF7F2', color: '#2D6A4F', border: '1px solid #2D6A4F', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              {uploading ? 'Uploading...' : '📷 Upload Image'}
            </button>
            {form.image && <img src={form.image} style={{ height: '80px', borderRadius: '8px', marginLeft: '12px', verticalAlign: 'middle' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} id="notice-pub" />
            <label htmlFor="notice-pub" style={{ fontSize: '13px', color: '#374151' }}>Published (visible on site)</label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ backgroundColor: '#2D6A4F', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              {editId ? 'Update Notice' : 'Add Notice'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ title: '', description: '', image: '', published: true }); }}
                style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notices table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(n => (
            <tr key={n.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={tdStyle}>
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </td>
              <td style={{ ...tdStyle, fontWeight: '600' }}>{n.title}</td>
              <td style={{ ...tdStyle, maxWidth: '200px', color: '#6B7280', fontSize: '12px' }}>{n.description?.substring(0, 60)}{n.description?.length > 60 && '...'}</td>
              <td style={tdStyle}>
                <button onClick={() => togglePublish(n)} style={{ backgroundColor: n.published ? '#dcfce7' : '#fee2e2', color: n.published ? '#16a34a' : '#dc2626', padding: '3px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                  {n.published ? 'Published' : 'Hidden'}
                </button>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(n)} style={editBtnStyle}>Edit</button>
                <button type="button" onClick={() => handleDelete(n.id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PopupManager() {
  const [config, setConfig] = useState({ image: '', target_url: '', enabled: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    supabase.from('popup_config').select('*').eq('id', 'main').single()
      .then(({ data }) => { if (data) setConfig(data); });
  }, []);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const url = await uploadImage(file, 'popup-images');
    if (url) setConfig(c => ({ ...c, image: url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!config.image) { toast.error('Image is required'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('popup_config')
      .update({
        image: config.image,
        target_url: config.target_url || '',
        enabled: config.enabled,
      })
      .eq('id', 'main');
    if (error) toast.error('Save failed: ' + error.message);
    else toast.success('Popup settings saved!');
    setSaving(false);
  };

  const togglePopup = async () => {
    const newVal = !config.enabled;
    await supabase.from('popup_config').update({ enabled: newVal }).eq('id', 'main');
    setConfig(c => ({ ...c, enabled: newVal }));
    toast.success(`Popup ${newVal ? 'enabled' : 'disabled'}`);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '8px' }}>🎯 Popup Banner</h2>
      <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>This popup shows to users when they open the website. Image is mandatory. URL is optional.</p>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', maxWidth: '560px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

        {/* Enable/Disable toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: config.enabled ? '#dcfce7' : '#fee2e2', borderRadius: '10px', marginBottom: '20px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: config.enabled ? '#16a34a' : '#dc2626' }}>
              Popup is {config.enabled ? 'ENABLED' : 'DISABLED'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>
              {config.enabled ? 'Users will see this popup when visiting the site' : 'Popup is hidden from all users'}
            </p>
          </div>
          <button
            onClick={togglePopup}
            style={{ backgroundColor: config.enabled ? '#dc2626' : '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
          >
            {config.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Image upload */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Popup Image *</label>
          <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleImageUpload(e.target.files[0]); }} />
          <button onClick={() => fileRef.current.click()} style={{ padding: '9px 18px', backgroundColor: '#EFF7F2', color: '#2D6A4F', border: '1px solid #2D6A4F', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            {uploading ? 'Uploading...' : '📷 Upload Popup Image'}
          </button>
          {config.image && (
            <div style={{ marginTop: '12px' }}>
              <img src={config.image} alt="Popup preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #e2d9cc' }} />
            </div>
          )}
        </div>

        {/* Target URL */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Redirect URL (optional)</label>
          <input
            type="url"
            placeholder="https://example.com/offer"
            value={config.target_url || ''}
            onChange={e => setConfig(c => ({ ...c, target_url: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>When user clicks the popup image, they will be redirected to this URL</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#2D6A4F', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save Popup Settings'}
        </button>
      </div>
    </div>
  );
}

function FloatingButtonManager() {
  const [config, setConfig] = useState({ whatsapp_enabled: true, whatsapp_number: '919573112302' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('popup_config').select('whatsapp_enabled, whatsapp_number').eq('id', 'main').single()
      .then(({ data }) => { if (data) setConfig({ whatsapp_enabled: data.whatsapp_enabled ?? true, whatsapp_number: data.whatsapp_number || '919573112302' }); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('popup_config')
      .update({
        whatsapp_enabled: config.whatsapp_enabled,
        whatsapp_number: config.whatsapp_number,
      })
      .eq('id', 'main');
    if (error) toast.error('Save failed: ' + error.message);
    else toast.success('Floating button settings saved!');
    setSaving(false);
  };

  const toggleFloating = async () => {
    const newVal = !config.whatsapp_enabled;
    await supabase.from('popup_config').update({ whatsapp_enabled: newVal }).eq('id', 'main');
    setConfig(c => ({ ...c, whatsapp_enabled: newVal }));
    toast.success(`Floating button ${newVal ? 'enabled' : 'disabled'}`);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '8px' }}>💬 Floating WhatsApp Button</h2>
      <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>Control the WhatsApp floating button visible on the website.</p>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', maxWidth: '520px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

        {/* Enable/Disable toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: config.whatsapp_enabled ? '#dcfce7' : '#fee2e2', borderRadius: '10px', marginBottom: '24px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: config.whatsapp_enabled ? '#16a34a' : '#dc2626' }}>
              Floating Button is {config.whatsapp_enabled ? 'ENABLED' : 'DISABLED'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>
              {config.whatsapp_enabled ? 'Button is visible to all users' : 'Button is hidden from all users'}
            </p>
          </div>
          <button
            onClick={toggleFloating}
            style={{ backgroundColor: config.whatsapp_enabled ? '#dc2626' : '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
          >
            {config.whatsapp_enabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* WhatsApp number */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>WhatsApp Number</label>
          <input
            type="text"
            placeholder="919573112302"
            value={config.whatsapp_number}
            onChange={e => setConfig(c => ({ ...c, whatsapp_number: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Include country code, no + or spaces. Example: 919573112302</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#2D6A4F', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}



function TopThingsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', image: '', rank: 1, published: true });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = () => {
    supabase.from('top_things').select('*').order('rank', { ascending: true })
      .then(({ data }) => setItems(data || []));
  };
  useEffect(() => { load(); }, []);

  const uploadImage = async (file) => {
    setUploading(true);
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('top-things-images').upload(fileName, file, { upsert: true });
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('top-things-images').getPublicUrl(fileName);
    setForm(f => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.image) { toast.error('Title and image required'); return; }
    if (editId) {
      await supabase.from('top_things').update(form).eq('id', editId);
      toast.success('Updated!');
    } else {
      await supabase.from('top_things').insert(form);
      toast.success('Added!');
    }
    setForm({ title: '', image: '', rank: items.length + 1, published: true });
    setEditId(null);
    load();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, image: item.image, rank: item.rank, published: item.published });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await supabase.from('top_things').delete().eq('id', id);
    load();
  };

  const togglePublish = async (item) => {
    await supabase.from('top_things').update({ published: !item.published }).eq('id', item.id);
    load();
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', marginBottom: '24px' }}>🏆 Top Things To Do</h2>

      {/* Form */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600' }}>{editId ? 'Edit Item' : 'Add New Item'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <input
            placeholder="Title (e.g. Borra Caves)"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px' }}
          />
          <input
            type="number"
            placeholder="Rank (1, 2, 3...)"
            value={form.rank}
            min={1}
            onChange={e => setForm(f => ({ ...f, rank: Number(e.target.value) }))}
            style={{ padding: '10px 14px', border: '1.5px solid #e2d9cc', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }}
            onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
          <button
            onClick={() => fileRef.current.click()}
            style={{ padding: '8px 16px', backgroundColor: '#EFF7F2', color: '#2D6A4F', border: '1px solid #2D6A4F', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          >
            {uploading ? 'Uploading...' : '📷 Upload Image'}
          </button>
          {form.image && (
            <img src={form.image} alt="preview"
              style={{ height: '60px', width: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2d9cc' }} />
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            Published
          </label>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSave}
            style={{ backgroundColor: '#2D6A4F', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            {editId ? 'Update' : 'Add Item'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ title: '', image: '', rank: items.length + 1, published: true }); }}
              style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ ...tdStyle, fontWeight: '700', color: '#E9A84C', fontSize: '16px' }}>#{item.rank}</td>
              <td style={tdStyle}>
                <img src={item.image} alt={item.title}
                  style={{ width: '72px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              </td>
              <td style={{ ...tdStyle, fontWeight: '600' }}>{item.title}</td>
              <td style={tdStyle}>
                <button onClick={() => togglePublish(item)}
                  style={{ backgroundColor: item.published ? '#dcfce7' : '#fee2e2', color: item.published ? '#16a34a' : '#dc2626', padding: '3px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                  {item.published ? 'Published' : 'Hidden'}
                </button>
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(item)} style={editBtnStyle}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={deleteBtnStyle}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>No items yet. Add your first top thing to do!</p>
      )}
    </div>
  );
}

// --- Main Layout ---
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('packages');
  const [bookingsOpen, setBookingsOpen] = useState(true);
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  if (!user || user.email !== 'arakuecostays@gmail.com') {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItemStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 20px', color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500',
    borderRadius: '0', transition: 'all 0.2s',
    borderLeft: isActive ? '3px solid #E9A84C' : '3px solid transparent',
    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
  });

  const subNavStyle = (isActive) => ({
    ...navItemStyle(isActive),
    paddingLeft: '40px',
    fontSize: '13px',
  });

  const closeSidebarOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f4ee' }}>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          backgroundColor: '#1a3a2a', padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <span style={{ color: 'white', fontFamily: 'Playfair Display', fontWeight: '700', fontSize: '1rem' }}>🌿 ARAKU ADMIN</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '4px' }}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      )}

      {/* Overlay when sidebar open on mobile */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      {/* Fixed Sidebar */}
      <div style={{
        width: '240px', minHeight: '100vh',
        backgroundColor: '#1a3a2a',
        position: 'fixed', top: 0, left: 0,
        display: 'flex', flexDirection: 'column',
        zIndex: 100,
        transform: isMobile
          ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
          : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: '700' }}>
          🌿 ARAKU ADMIN
        </div>
        
        <div style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          <div onClick={() => { setActiveSection('packages'); closeSidebarOnMobile(); }} style={navItemStyle(activeSection === 'packages')}>📦 Packages</div>
          <div onClick={() => { setActiveSection('resorts'); closeSidebarOnMobile(); }} style={navItemStyle(activeSection === 'resorts')}>🏨 Resorts</div>

          <div onClick={() => { setActiveSection('blogs'); closeSidebarOnMobile(); }} style={navItemStyle(activeSection === 'blogs')}>✍️ Blogs</div>
          
          <div
            onClick={() => setAddonsOpen(!addonsOpen)}
            style={{ ...navItemStyle(false), ...(activeSection.startsWith('addon') ? { borderLeft: '3px solid #E9A84C', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } : {}) }}
          >
            🧩 Add-ons {addonsOpen ? '▲' : '▼'}
          </div>
          {addonsOpen && (
            <>
              <div
                onClick={() => { setActiveSection('addon-notices'); closeSidebarOnMobile(); }}
                style={{ ...subNavStyle(activeSection === 'addon-notices'), ...(activeSection === 'addon-notices' ? { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } : {}) }}
              >
                └ 📢 Notices
              </div>
              <div
                onClick={() => { setActiveSection('addon-popup'); closeSidebarOnMobile(); }}
                style={{ ...subNavStyle(activeSection === 'addon-popup'), ...(activeSection === 'addon-popup' ? { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } : {}) }}
              >
                └ 🎯 Popup Banner
              </div>
              <div
                onClick={() => { setActiveSection('addon-floating'); closeSidebarOnMobile(); }}
                style={{ ...subNavStyle(activeSection === 'addon-floating'), ...(activeSection === 'addon-floating' ? { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } : {}) }}
              >
                └ 💬 Floating Button
              </div>
              <div
                onClick={() => { setActiveSection('addon-topthings'); closeSidebarOnMobile(); }}
                style={{ ...subNavStyle(activeSection === 'addon-topthings'), ...(activeSection === 'addon-topthings' ? { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } : {}) }}
              >
                └ 🏆 Top Things
              </div>
            </>
          )}
          
          <div onClick={() => setBookingsOpen(!bookingsOpen)} style={navItemStyle(false)}>📋 Bookings {bookingsOpen ? '▲' : '▼'}</div>
          {bookingsOpen && (
            <>
              <div onClick={() => { setActiveSection('package-bookings'); closeSidebarOnMobile(); }} style={subNavStyle(activeSection === 'package-bookings')}>└ Package Bookings</div>
              <div onClick={() => { setActiveSection('resort-bookings'); closeSidebarOnMobile(); }} style={subNavStyle(activeSection === 'resort-bookings')}>└ Resort Bookings</div>
              <div onClick={() => { setActiveSection('travel-bookings'); closeSidebarOnMobile(); }} style={subNavStyle(activeSection === 'travel-bookings')}>└ Travel Bookings</div>
            </>
          )}

          <div onClick={() => { setActiveSection('contact'); closeSidebarOnMobile(); }} style={navItemStyle(activeSection === 'contact')}>✉️ Contact Messages</div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
          <div onClick={() => { setActiveSection('settings'); closeSidebarOnMobile(); }} style={navItemStyle(activeSection === 'settings')}>👤 Settings</div>
          <div onClick={handleLogout} style={navItemStyle(false)}>🚪 Logout</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        marginLeft: isMobile ? '0' : '240px',
        padding: isMobile ? '70px 16px 32px' : '32px',
        backgroundColor: '#f8f4ee',
        minHeight: '100vh',
        flex: 1,
      }}>
        {activeSection === 'packages' && <PackagesTable />}
        {activeSection === 'resorts' && <ResortsTable />}

        {activeSection === 'blogs' && <BlogsTable />}
        {activeSection === 'addon-notices' && <NoticesManager />}
        {activeSection === 'addon-popup' && <PopupManager />}
        {activeSection === 'addon-floating' && <FloatingButtonManager />}
        {activeSection === 'addon-topthings' && <TopThingsManager />}
        {activeSection === 'package-bookings' && <PackageBookingsTable />}
        {activeSection === 'resort-bookings' && <ResortBookingsTable />}
        {activeSection === 'travel-bookings' && <TravelBookingsTable />}
        {activeSection === 'contact' && <ContactMessagesTable />}
        {activeSection === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
