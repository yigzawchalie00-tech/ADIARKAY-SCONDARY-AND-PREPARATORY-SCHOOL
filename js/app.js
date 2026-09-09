// ── NAV SCROLL ────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MOBILE NAV ────────────────────────────────────────────────────
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active-nav'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-nav');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── CONTACT FORM ──────────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('contact-success').style.display = 'block';
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => {
      document.getElementById('contact-success').style.display = 'none';
    }, 5000);
  }, 1000);
});

// ── CHAT ASSISTANT ────────────────────────────────────────────────
const chatKnowledge = {
  // Admissions
  'admission': 'To apply to Adiarkay School: bring your Grade 8 results (for Grade 9) or Grade 10 national exam results (for Grade 11), plus your birth certificate, previous school ID, and two passport photos. Visit the registrar\'s office Monday–Friday, 8AM–5PM.',
  'apply': 'To apply, visit our registrar\'s office with your exam results, birth certificate, previous school ID, and two passport-size photos. Registration opens after national exam results are released each year.',
  'register': 'Registration is done in person at the school registrar\'s office. Bring your national exam results, birth certificate, previous school ID card, and two passport photos. Office hours: Monday–Friday, 8AM–5PM.',
  'document': 'Required documents: national exam results, birth certificate, previous school student ID card, and two passport-size photographs.',
  'fee': 'Please visit the school registrar\'s office or contact us directly for information about registration fees for the current academic year.',
  'requirement': 'For Grade 9: completed Grade 8 with passing results. For Grade 11 (preparatory): Grade 10 national examination results required. Both require valid documents.',

  // Grades & Academics
  'grade': 'Adiarkay School offers Grade 9 and 10 (General Secondary Education) and Grade 11 and 12 (University Preparatory). Preparatory students choose either Natural Science or Social Science stream.',
  'level': 'We offer two cycles: Secondary (Grades 9–10) covering general education, and Preparatory (Grades 11–12) with Natural Science and Social Science streams for university entrance.',
  'subject': 'Secondary subjects include Mathematics, English, Amharic, Physics, Chemistry, Biology, History, Civics, and Geography. Preparatory Natural Science focuses on Maths, Physics, Chemistry, Biology, and English. Social Science focuses on Economics, History, Geography, Civics, and English.',
  'natural science': 'The Natural Science stream (Grade 11–12) covers Mathematics, Physics, Chemistry, Biology, and English — preparing students for science and engineering university programs.',
  'social science': 'The Social Science stream (Grade 11–12) covers Economics, History, Geography, Civics, and English — preparing students for social sciences, law, and business university programs.',
  'preparatory': 'The preparatory cycle (Grades 11–12) prepares students for the Ethiopian University Entrance Examination. Students choose between Natural Science and Social Science streams.',
  'university': 'Our preparatory program (Grades 11–12) is specifically designed to prepare students for the Ethiopian University Entrance Examination, with a strong focus on exam-relevant subjects and study skills.',

  // Location
  'location': 'Adiarkay Secondary and Preparatory School is located in Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia.',
  'where': 'We are located in Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia.',
  'address': 'Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia. Office hours: Monday–Friday, 8:00 AM – 5:00 PM.',

  // General
  'hour': 'The school registrar\'s office is open Monday to Friday, 8:00 AM to 5:00 PM.',
  'contact': 'You can reach us by visiting the school in person during office hours (Monday–Friday, 8AM–5PM), or by sending a message through the Contact section on this website.',
  'teacher': 'Adiarkay School has over 80 qualified and experienced teachers across all subjects for both secondary and preparatory levels.',
  'student': 'Adiarkay School currently has over 1,200 enrolled students across all grades (9–12).',
  'mission': 'Our mission is to provide every student with the knowledge, skills, and values needed to excel in university education and contribute meaningfully to the development of Ethiopia.',
  'vision': 'Our vision is to be the leading preparatory school in North Gondar, recognized for academic achievement, ethical leadership, and community service.',
  'club': 'We offer extracurricular activities including Science Club, English Debate Club, Mathematics Olympiad, Sports and Athletics, Library and Reading programs, and Community Service.',
  'sport': 'We offer Sports and Athletics as part of our extracurricular program, giving students opportunities for physical development alongside academic excellence.',
  'result': 'Our students have achieved strong results in national examinations. We are proud of our high university placement rate of approximately 95% for preparatory graduates.',
};

function getResponse(input) {
  const text = input.toLowerCase().trim();

  // Direct keyword matching
  for (const [key, response] of Object.entries(chatKnowledge)) {
    if (text.includes(key)) return response;
  }

  // Fallback
  if (text.length < 3) return 'Please type a question — I\'m happy to help with admissions, academics, location, and more!';

  return 'Thank you for your question. For detailed information, please visit our registrar\'s office Monday–Friday, 8AM–5PM, or use the Contact form on this page. Is there anything else I can help you with?';
}

function toggleChat() {
  const win = document.getElementById('chat-window');
  win.style.display = win.style.display === 'none' ? 'flex' : 'none';
  if (win.style.display === 'flex') {
    document.getElementById('chat-input').focus();
  }
}

function addMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.innerHTML = `<div class="chat-bubble-msg">${text}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="chat-bubble-msg chat-typing"><span></span><span></span><span></span></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  // Remove quick replies after first message
  const qr = document.getElementById('quick-replies');
  if (qr) qr.remove();

  addMessage(text, 'user');
  input.value = '';
  showTyping();

  setTimeout(() => {
    removeTyping();
    addMessage(getResponse(text), 'bot');
  }, 800 + Math.random() * 500);
}

function quickAsk(question) {
  const input = document.getElementById('chat-input');
  input.value = question;
  sendChat();
                        }
