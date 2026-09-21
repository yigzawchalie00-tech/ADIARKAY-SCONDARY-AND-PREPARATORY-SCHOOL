// ── AUTH ──────────────────────────────────────────────────────────
function doLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_auth', '1');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'flex';
    loadAll();
  } else {
    document.getElementById('login-error').textContent = 'Incorrect password.';
  }
}

function doLogout() {
  sessionStorage.removeItem('admin_auth');
  location.reload();
}

if (sessionStorage.getItem('admin_auth') === '1') {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'flex';
  loadAll();
}

// ── NAVIGATION ────────────────────────────────────────────────────
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
}

// ── TOAST ─────────────────────────────────────────────────────────
function toast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.className = 'toast', 3000);
}

// ── LOAD ALL ──────────────────────────────────────────────────────
function loadAll() {
  loadStatsEditor();
  loadInfoEditor();
  loadNewsList();
  loadGalleryAdmin();
}

// ── STATS ─────────────────────────────────────────────────────────
let statsData = [];

async function loadStatsEditor() {
  const { data } = await supabase.from('stats').select('*').order('id');
  if (!data) return;
  statsData = data;
  const container = document.getElementById('stats-editor');
  container.innerHTML = data.map(s => `
    <div class="stat-edit">
      <label>${s.label}</label>
      <input type="text" id="stat-${s.key}-value" value="${s.value}" placeholder="Value">
      <input type="text" id="stat-${s.key}-label" value="${s.label}" placeholder="Label" style="margin-top:6px;font-size:12px;font-weight:400;">
    </div>
  `).join('');
}

async function saveStats() {
  for (const s of statsData) {
    const val = document.getElementById(`stat-${s.key}-value`)?.value;
    const lbl = document.getElementById(`stat-${s.key}-label`)?.value;
    if (val !== undefined) {
      await supabase.from('stats').update({ value: val, label: lbl }).eq('key', s.key);
    }
  }
  toast('Stats saved!');
}

// ── SCHOOL INFO ───────────────────────────────────────────────────
async function loadInfoEditor() {
  const { data } = await supabase.from('school_info').select('*');
  if (!data) return;
  const map = {};
  data.forEach(r => map[r.key] = r.value);
  if (map.location) document.getElementById('info-location').value = map.location;
  if (map.office_hours) document.getElementById('info-hours').value = map.office_hours;
  if (map.phone) document.getElementById('info-phone').value = map.phone;
  if (map.email) document.getElementById('info-email').value = map.email;
  if (map.mission) document.getElementById('info-mission').value = map.mission;
  if (map.vision) document.getElementById('info-vision').value = map.vision;
}

async function saveInfo() {
  const fields = [
    { key: 'location', id: 'info-location' },
    { key: 'office_hours', id: 'info-hours' },
    { key: 'phone', id: 'info-phone' },
    { key: 'email', id: 'info-email' },
    { key: 'mission', id: 'info-mission' },
    { key: 'vision', id: 'info-vision' },
  ];
  for (const f of fields) {
    const val = document.getElementById(f.id)?.value || '';
    await supabase.from('school_info').upsert({ key: f.key, value: val }, { onConflict: 'key' });
  }
  toast('School info saved!');
}

// ── NEWS ──────────────────────────────────────────────────────────
async function loadNewsList() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('news-list');
  if (!data || data.length === 0) {
    container.innerHTML = '<div style="color:var(--dim);text-align:center;padding:20px;">No news yet. Add your first announcement.</div>';
    return;
  }
  container.innerHTML = data.map(n => `
    <div class="news-item">
      <div>
        <div class="news-item-title">${n.title}</div>
        <div class="news-item-tag">${n.tag} · ${n.date_label || ''}</div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;">
        <button class="btn btn-sm btn-primary" onclick="editNews(${n.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteNews(${n.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function showNewsForm(clear = true) {
  if (clear) {
    document.getElementById('edit-news-id').value = '';
    document.getElementById('nf-title').value = '';
    document.getElementById('nf-excerpt').value = '';
    document.getElementById('nf-tag').value = 'Announcement';
    document.getElementById('nf-date').value = '';
    document.getElementById('news-form-label').textContent = 'Add News';
  }
  document.getElementById('news-form-card').style.display = 'block';
  document.getElementById('nf-title').focus();
}

function hideNewsForm() {
  document.getElementById('news-form-card').style.display = 'none';
}

async function editNews(id) {
  const { data } = await supabase.from('news').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('edit-news-id').value = data.id;
  document.getElementById('nf-title').value = data.title;
  document.getElementById('nf-excerpt').value = data.excerpt || '';
  document.getElementById('nf-tag').value = data.tag || 'Announcement';
  document.getElementById('nf-date').value = data.date_label || '';
  document.getElementById('news-form-label').textContent = 'Edit News';
  showNewsForm(false);
}

async function saveNews() {
  const title = document.getElementById('nf-title').value.trim();
  if (!title) { toast('Title is required', 'err'); return; }
  const id = document.getElementById('edit-news-id').value;
  const payload = {
    title,
    excerpt: document.getElementById('nf-excerpt').value.trim(),
    tag: document.getElementById('nf-tag').value,
    date_label: document.getElementById('nf-date').value.trim(),
  };
  if (id) {
    await supabase.from('news').update(payload).eq('id', id);
    toast('News updated!');
  } else {
    await supabase.from('news').insert(payload);
    toast('News added!');
  }
  hideNewsForm();
  loadNewsList();
}

async function deleteNews(id) {
  if (!confirm('Delete this news item?')) return;
  await supabase.from('news').delete().eq('id', id);
  toast('Deleted.');
  loadNewsList();
}

// ── GALLERY (Cloudinary upload) ───────────────────────────────────
const CLOUD_NAME = 'dlndqllxi';
const UPLOAD_PRESET = 'adiarkay-school';

async function loadGalleryAdmin() {
  const { data } = await supabase.from('gallery').select('*').order('sort_order');
  const grid = document.getElementById('gallery-admin-grid');
  if (!data || data.length === 0) {
    grid.innerHTML = '<div style="color:var(--dim);font-size:13px;">No photos yet. Upload some above.</div>';
    return;
  }
  grid.innerHTML = data.map(p => `
    <div class="gallery-admin-item">
      <img src="${p.url}" alt="${p.caption || ''}">
      ${p.caption ? `<div class="gallery-caption">${p.caption}</div>` : ''}
      <button class="del-btn" onclick="deletePhoto(${p.id})">✕</button>
    </div>
  `).join('');
}

async function uploadPhotos(files) {
  if (!files || files.length === 0) return;
  const caption = document.getElementById('photo-caption').value.trim();
  const progress = document.getElementById('upload-progress');
  progress.style.display = 'block';

  let uploaded = 0;
  for (const file of files) {
    progress.textContent = `Uploading ${uploaded + 1} of ${files.length}...`;
    try {
      // Upload to Cloudinary using unsigned preset
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'adiarkay-school');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!result.secure_url) throw new Error(result.error?.message || 'Upload failed');

      // Save URL to Supabase gallery table
      await supabase.from('gallery').insert({
        url: result.secure_url,
        caption: caption || null,
        sort_order: Date.now(),
      });
      uploaded++;
    } catch (err) {
      toast(`Failed: ${file.name} — ${err.message}`, 'err');
    }
  }

  progress.style.display = 'none';
  document.getElementById('photo-caption').value = '';
  document.getElementById('photo-upload').value = '';
  if (uploaded > 0) toast(`${uploaded} photo(s) uploaded!`);
  loadGalleryAdmin();
}

async function deletePhoto(id) {
  if (!confirm('Delete this photo?')) return;
  await supabase.from('gallery').delete().eq('id', id);
  toast('Photo deleted.');
  loadGalleryAdmin();
}
