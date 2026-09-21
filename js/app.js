// ── NAV ───────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  document.getElementById('nav-links').classList.remove('open');
}));

// ── LOAD DATA FROM SUPABASE ───────────────────────────────────────
async function loadStats() {
  try {
    const { data } = await supabase.from('stats').select('*');
    if (!data || data.length === 0) return;
    const statsEl = document.getElementById('hero-stats');
    const items = ['students','teachers','grades','placement'];
    const map = {};
    data.forEach(s => map[s.key] = s);
    statsEl.innerHTML = items.map((k, i) => {
      const s = map[k];
      if (!s) return '';
      return `${i > 0 ? '<div class="stat-div"></div>' : ''}
        <div class="stat"><span class="stat-n">${s.value}</span><span class="stat-l">${s.label}</span></div>`;
    }).join('');
  } catch (e) {}
}

async function loadSchoolInfo() {
  try {
    const { data } = await supabase.from('school_info').select('*');
    if (!data) return;
    const map = {};
    data.forEach(r => map[r.key] = r.value);
    if (map.mission) document.getElementById('mission-text').textContent = `"${map.mission}"`;
    if (map.vision) document.getElementById('vision-text').textContent = `"${map.vision}"`;
    if (map.location) {
      document.getElementById('contact-location').innerHTML = map.location.replace(',', ',<br>');
      document.getElementById('footer-location').textContent = map.location;
    }
    if (map.office_hours) document.getElementById('contact-hours').innerHTML = map.office_hours.replace(',', ',<br>');
    if (map.phone && map.phone.trim()) {
      document.getElementById('contact-phone').textContent = map.phone;
      document.getElementById('contact-phone-wrap').style.display = 'flex';
    }
    if (map.email && map.email.trim()) {
      document.getElementById('contact-email').textContent = map.email;
      document.getElementById('contact-email-wrap').style.display = 'flex';
    }
  } catch (e) {}
}

async function loadNews() {
  try {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) return;
    const grid = document.getElementById('news-grid');
    grid.innerHTML = data.map((n, i) => `
      <div class="news-card ${i === 0 ? 'news-card-featured' : ''}">
        <div class="news-tag ${n.tag === 'Achievement' ? 'news-tag-achievement' : n.tag === 'Event' ? 'news-tag-event' : ''}">${n.tag}</div>
        <h3 class="news-title">${n.title}</h3>
        ${n.excerpt ? `<p class="news-excerpt">${n.excerpt}</p>` : ''}
        <div class="news-date">${n.date_label || ''}</div>
      </div>
    `).join('');
  } catch (e) {}
}

async function loadGallery() {
  try {
    const { data } = await supabase.from('gallery').select('*').order('sort_order');
    if (!data || data.length === 0) return;
    document.getElementById('gallery-empty').style.display = 'none';
    document.getElementById('gallery-grid').innerHTML = data.map(p => `
      <div class="gallery-item" onclick="openLightbox('${p.url}','${(p.caption||'').replace(/'/g,"\\'")}')">
        <img src="${p.url}" alt="${p.caption||'School photo'}" loading="lazy">
        ${p.caption ? `<div class="gallery-caption">${p.caption}</div>` : ''}
      </div>
    `).join('');
  } catch (e) {}
}

function openLightbox(url, caption) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-overlay" onclick="this.parentElement.remove()"></div>
    <div class="lightbox-content">
      <img src="${url}" alt="${caption}">
      ${caption ? `<div class="lightbox-caption">${caption}</div>` : ''}
      <button class="lightbox-close" onclick="this.closest('.lightbox').remove()">✕</button>
    </div>`;
  document.body.appendChild(lb);
}

// ── CONTACT FORM ──────────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...'; btn.disabled = true;
  setTimeout(() => {
    document.getElementById('contact-success').style.display = 'block';
    e.target.reset(); btn.textContent = 'Send Message'; btn.disabled = false;
    setTimeout(() => document.getElementById('contact-success').style.display = 'none', 5000);
  }, 1000);
});

// ── CHAT ──────────────────────────────────────────────────────────
const chatKnowledge = {
  'admission': 'To apply: bring your Grade 8 results (for Grade 9) or Grade 10 national exam results (for Grade 11), plus birth certificate, previous school ID, and two passport photos. Visit the registrar Monday–Friday, 8AM–5PM.',
  'apply': 'Visit our registrar\'s office with your exam results, birth certificate, previous school ID, and two passport photos. Registration opens after national exam results each year.',
  'register': 'Registration is done in person at the school. Office hours: Monday–Friday, 8AM–5PM.',
  'document': 'Required: national exam results, birth certificate, previous school ID card, and two passport photos.',
  'grade': 'We offer Grade 9–10 (Secondary) and Grade 11–12 (Preparatory) with Natural Science and Social Science streams.',
  'subject': 'Secondary: Maths, English, Amharic, Physics, Chemistry, Biology, History, Civics, Geography. Preparatory Natural Science: Maths, Physics, Chemistry, Biology, English. Social Science: Economics, History, Geography, Civics, English.',
  'location': 'Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia.',
  'where': 'Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia.',
  'hour': 'Office hours: Monday–Friday, 8:00 AM – 5:00 PM.',
  'teacher': 'Adiarkay School has over 80 qualified teachers across all subjects.',
  'student': 'We currently have over 1,200 enrolled students across Grades 9–12.',
  'mission': 'To provide every student with the knowledge, skills, and values needed to excel in university and contribute to Ethiopia.',
  'vision': 'To be the leading preparatory school in North Gondar, recognized for academic achievement and community service.',
  'preparatory': 'Grades 11–12 prepare students for the Ethiopian University Entrance Examination in either Natural Science or Social Science stream.',
  'university': 'Our preparatory program has a 95% university placement rate.',
  'natural': 'Natural Science stream covers Maths, Physics, Chemistry, Biology, and English.',
  'social': 'Social Science stream covers Economics, History, Geography, Civics, and English.',
  'club': 'Extracurricular: Science Club, English Debate Club, Maths Olympiad, Sports, Library, Community Service.',
};

function getResponse(input) {
  const text = input.toLowerCase().trim();
  for (const [key, response] of Object.entries(chatKnowledge)) {
    if (text.includes(key)) return response;
  }
  return 'Thank you for your question. Please visit our registrar\'s office Monday–Friday 8AM–5PM, or use the Contact form on this page.';
}

function toggleChat() {
  const win = document.getElementById('chat-window');
  win.style.display = win.style.display === 'none' ? 'flex' : 'none';
  if (win.style.display === 'flex') document.getElementById('chat-input').focus();
}

function addMessage(text, sender) {
  const c = document.getElementById('chat-messages');
  const d = document.createElement('div');
  d.className = `chat-msg ${sender}`;
  d.innerHTML = `<div class="chat-bubble-msg">${text}</div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const qr = document.getElementById('quick-replies');
  if (qr) qr.remove();
  addMessage(text, 'user');
  input.value = '';
  const c = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot'; typing.id = 'typing';
  typing.innerHTML = `<div class="chat-bubble-msg"><span class="dot-anim">●</span> <span class="dot-anim" style="animation-delay:.2s">●</span> <span class="dot-anim" style="animation-delay:.4s">●</span></div>`;
  c.appendChild(typing); c.scrollTop = c.scrollHeight;
  setTimeout(() => { document.getElementById('typing')?.remove(); addMessage(getResponse(text), 'bot'); }, 900);
}

function quickAsk(q) { document.getElementById('chat-input').value = q; sendChat(); }

// ── INIT ──────────────────────────────────────────────────────────
loadStats();
loadSchoolInfo();
loadNews();
loadGallery();
