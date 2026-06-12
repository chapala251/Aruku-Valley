import re

with open('src/pages/admin/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# Remove VehiclesTable
content = re.sub(r'function VehiclesTable\(\) \{.*?(?=\nfunction BlogsTable\(\) \{)', '', content, flags=re.DOTALL)

# Remove ThingsToDoManager
content = re.sub(r'function ThingsToDoManager\(\) \{.*?(?=\n// --- Main Layout ---)', '', content, flags=re.DOTALL)

top_things_manager = """function TopThingsManager() {
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

// --- Main Layout ---"""

content = content.replace('// --- Main Layout ---', top_things_manager)

sidebar_link = """              <div
                onClick={() => setActiveSection('addon-topthings')}
                style={{ ...subNavStyle(activeSection === 'addon-topthings'), ...(activeSection === 'addon-topthings' ? { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' } : {}) }}
              >
                └ 🏆 Top Things
              </div>"""

if 'addon-topthings' not in content:
    content = content.replace('└ 💬 Floating Button\n              </div>', '└ 💬 Floating Button\n              </div>\n' + sidebar_link)

if '{activeSection === \'addon-topthings\' && <TopThingsManager />}' not in content:
    content = content.replace('{activeSection === \'addon-floating\' && <FloatingButtonManager />}', '{activeSection === \'addon-floating\' && <FloatingButtonManager />}\n        {activeSection === \'addon-topthings\' && <TopThingsManager />}')

with open('src/pages/admin/AdminDashboard.jsx', 'w') as f:
    f.write(content)

