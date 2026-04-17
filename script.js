// ===== FIREBASE CONFIG =====
// ملاحظة لمروان: لا تنسى تحط مفاتيح الفايربيس الحقيقية مالتك هنا
const firebaseConfig = {
  databaseURL: "https://wano-studio-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyPlaceholder_ReplaceWithYourKey",
  authDomain: "wano-studio.firebaseapp.com",
  projectId: "wano-studio",
  storageBucket: "wano-studio.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:placeholder"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ===== STATE =====
let currentUser = null;
let userBots = [];

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => {
  cursorGlow.style.width = '18px';
  cursorGlow.style.height = '18px';
});
document.addEventListener('mouseup', () => {
  cursorGlow.style.width = '28px';
  cursorGlow.style.height = '28px';
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.1;
    const colors = ['rgba(0,212,255,', 'rgba(181,107,255,', 'rgba(0,255,136,'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 80;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('ar');
    if (current >= target) clearInterval(timer);
  }, 20);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// ===== PERFORMANCE BARS ANIMATION =====
function animateBars() {
  const cpuBar = document.querySelector('.cpu-bar');
  const ramBar = document.querySelector('.ram-bar');
  const cpuVal = document.getElementById('cpuVal');
  const ramVal = document.getElementById('ramVal');

  function updateBars() {
    const cpu = 35 + Math.random() * 30;
    const ram = 40 + Math.random() * 35;
    if (cpuBar) { cpuBar.style.width = cpu + '%'; }
    if (cpuVal) cpuVal.textContent = Math.round(cpu);
    if (ramBar) ramBar.style.width = ram + '%';
    if (ramVal) ramVal.textContent = Math.round(ram);
  }

  const barsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateBars();
        setInterval(updateBars, 3000);
        barsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const featuresSection = document.querySelector('.features');
  if (featuresSection) barsObserver.observe(featuresSection);
}
animateBars();

// ===== TERMINAL ANIMATION =====
const terminalLines = [
  { type: 'cmd', text: 'wano deploy --project index.js' },
  { type: 'output', text: '<i class="fa-solid fa-box-open"></i> تحليل مساحة العمل...' },
  { type: 'output', text: '<i class="fa-solid fa-microchip"></i> فحص الموارد (Localhost)... ' },
  { type: 'success', text: '<i class="fa-solid fa-check"></i> الكود آمن — لا مخالفات' },
  { type: 'output', text: '<i class="fa-solid fa-server"></i> جاري تهيئة السيرفر المحلي...' },
  { type: 'output', text: '<i class="fa-brands fa-node-js"></i> إعداد بيئة JavaScript...' },
  { type: 'success', text: '<i class="fa-solid fa-check-double"></i> index.js يعمل الآن على المنفذ 3000' },
  { type: 'output', text: '<i class="fa-solid fa-memory"></i> CPU: 12% | RAM: 128MB' },
  { type: 'output', text: '<i class="fa-solid fa-fingerprint"></i> Host ID: wn-localhost-1' },
  { type: 'success', text: '<i class="fa-solid fa-rocket"></i> تم إنشاء الهوست بنجاح! وقت التشغيل: 24/7' },
];

const terminalBody = document.getElementById('terminalBody');
let terminalIdx = 1;
let terminalRunning = false;

function addTerminalLine(line, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      const div = document.createElement('div');
      if (line.type === 'cmd') {
        div.className = 't-line';
        div.innerHTML = `<span class="t-prompt">root@localhost:~$</span><span class="t-cmd"> ${line.text}</span>`;
      } else {
        div.className = `t-line t-output t-${line.type}`;
        div.innerHTML = line.text; // Changed from textContent to innerHTML to render FontAwesome
      }
      terminalBody.appendChild(div);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      resolve();
    }, delay);
  });
}

async function runTerminal() {
  if (terminalRunning) return;
  terminalRunning = true;
  terminalBody.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 't-cursor';

  for (let i = 0; i < terminalLines.length; i++) {
    await addTerminalLine(terminalLines[i], i === 0 ? 200 : 600 + Math.random() * 400);
  }

  const lastLine = terminalBody.lastChild;
  if (lastLine) lastLine.appendChild(cursor);

  setTimeout(() => {
    terminalRunning = false;
    setTimeout(runTerminal, 3000);
  }, 4000);
}

// Start terminal when hero is visible
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) runTerminal(); });
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('hero'));

// ===== SCROLL FADE-IN =====
document.querySelectorAll('.feature-card, .plan-card, .rule-card, .section-header').forEach(el => {
  el.classList.add('fade-in');
});

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ===== STATUS SECTION =====
const statusServices = [
  { name: 'شبكة Wano (Localhost)', desc: 'مستقرة 100%', status: 'green', badge: 'ok', label: 'متصل' },
  { name: 'خوادم Discord API', desc: 'مناطق: US, EU', status: 'green', badge: 'ok', label: 'متصل' },
  { name: 'خوادم Baileys (WA)', desc: 'اتصال WebSocket', status: 'green', badge: 'ok', label: 'متصل' },
  { name: 'لوحة التحكم', desc: 'Web Dashboard', status: 'green', badge: 'ok', label: 'يعمل' },
  { name: 'نظام المراقبة', desc: 'PM2 Auto-scan', status: 'green', badge: 'ok', label: 'نشط' },
  { name: 'قاعدة البيانات', desc: 'Firebase RTDB', status: 'green', badge: 'ok', label: 'متصل' },
];

function renderStatus() {
  const grid = document.getElementById('statusGrid');
  if (!grid) return;
  grid.innerHTML = statusServices.map(s => `
    <div class="status-item">
      <span class="status-dot ${s.status}"></span>
      <div class="status-info">
        <div class="status-name">${s.name}</div>
        <div class="status-desc">${s.desc}</div>
      </div>
      <span class="status-badge ${s.badge}">${s.label}</span>
    </div>
  `).join('');
}
renderStatus();

// Uptime bars (30 days)
function renderUptimeBars() {
  const bars = document.getElementById('uptimeBars');
  if (!bars) return;
  const data = Array.from({ length: 30 }, (_, i) => {
    const r = Math.random();
    if (i === 7) return 'yellow';
    if (r > 0.98) return 'yellow';
    return 'green';
  });
  bars.innerHTML = data.map(c => {
    const h = c === 'green' ? 100 : 60;
    return `<div class="uptime-bar ${c}" style="height:${h}%" title="${c === 'green' ? '100%' : 'ضغط شبكة'}"></div>`;
  }).join('');
}
renderUptimeBars();

// ===== TOAST =====
function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg; // Changed to innerHTML for FontAwesome
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ===== AUTH MODAL =====
const authModal = document.getElementById('authModal');
const deployModal = document.getElementById('deployModal');

function openAuthModal() {
  authModal.classList.add('open');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginMsg').innerHTML = '';
}
function closeAuthModal() { authModal.classList.remove('open'); }
function openDeployModal() { deployModal.classList.add('open'); }
function closeDeployModal() { deployModal.classList.remove('open'); }

// Trigger buttons
document.getElementById('loginBtn').addEventListener('click', openAuthModal);
document.getElementById('registerBtn').addEventListener('click', () => {
  openAuthModal();
  switchTab('register');
});
document.getElementById('loginBtnM').addEventListener('click', openAuthModal);
document.getElementById('registerBtnM').addEventListener('click', () => { openAuthModal(); switchTab('register'); });
document.getElementById('startFree').addEventListener('click', () => { openAuthModal(); switchTab('register'); });
document.getElementById('watchDemo').addEventListener('click', () => {
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  showToast('<i class="fa-solid fa-play"></i> انظر إلى سيرفر العرض أدناه', 'info');
});
document.getElementById('modalClose').addEventListener('click', closeAuthModal);
document.getElementById('deployClose').addEventListener('click', closeDeployModal);

authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });
deployModal.addEventListener('click', e => { if (e.target === deployModal) closeDeployModal(); });

// Tabs
function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('tabLogin').classList.toggle('active', isLogin);
  document.getElementById('tabRegister').classList.toggle('active', !isLogin);
  document.getElementById('formLogin').classList.toggle('hidden', !isLogin);
  document.getElementById('formRegister').classList.toggle('hidden', isLogin);
}
document.getElementById('tabLogin').addEventListener('click', () => switchTab('login'));
document.getElementById('tabRegister').addEventListener('click', () => switchTab('register'));

// ===== FIREBASE AUTH =====
document.getElementById('submitLogin').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  if (!email || !password) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> يرجى تعبئة جميع الحقول';
    return;
  }

  const btn = document.getElementById('submitLogin');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المصادقة...';
  btn.disabled = true;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    msg.className = 'form-msg success';
    msg.innerHTML = '<i class="fa-solid fa-check-double"></i> تمت المصادقة بنجاح!';
    setTimeout(closeAuthModal, 800);
  } catch (err) {
    msg.className = 'form-msg error';
    msg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${getAuthError(err.code)}`;
  } finally {
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> دخول إلى اللوحة';
    btn.disabled = false;
  }
});

document.getElementById('submitRegister').addEventListener('click', async () => {
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('registerMsg');

  if (!username || !email || !password) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> يرجى تعبئة جميع الحقول';
    return;
  }
  if (password.length < 8) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-shield-halved"></i> كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    return;
  }

  const btn = document.getElementById('submitRegister');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إعداد المساحة...';
  btn.disabled = true;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await db.ref(`users/${cred.user.uid}`).set({
      username,
      email,
      plan: 'free',
      joinedAt: Date.now(),
      bots: {}
    });
    msg.className = 'form-msg success';
    msg.innerHTML = '<i class="fa-solid fa-check"></i> تم تجهيز الحساب والمساحة بنجاح!';
    setTimeout(closeAuthModal, 800);
  } catch (err) {
    msg.className = 'form-msg error';
    msg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${getAuthError(err.code)}`;
  } finally {
    btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> إنشاء الحساب';
    btn.disabled = false;
  }
});

function getAuthError(code) {
  const errors = {
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'البريد مستخدم مسبقاً',
    'auth/invalid-email': 'صيغة البريد غير صالحة',
    'auth/too-many-requests': 'محاولات كثيرة، يرجى الانتظار',
    'auth/weak-password': 'كلمة المرور ضعيفة',
    'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
  };
  return errors[code] || 'حدث خطأ في الاتصال، حاول مجدداً';
}

// ===== AUTH STATE LISTENER =====
auth.onAuthStateChanged(async user => {
  currentUser = user;
  if (user) {
    updateNavForUser(user);
    await loadUserBots(user.uid);
    renderDashboard(user);
  } else {
    resetNavForGuest();
    showLoginPrompt();
  }
});

function updateNavForUser(user) {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;
  actions.innerHTML = `
    <span style="color:var(--text-muted);font-size:0.88rem">مرحباً، <strong style="color:var(--text)">${user.displayName || user.email.split('@')[0]}</strong></span>
    <button class="btn-primary" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> خروج</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
    showToast('<i class="fa-solid fa-info-circle"></i> تم إنهاء الجلسة', 'info');
  });
}

function resetNavForGuest() {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;
  actions.innerHTML = `
    <button class="btn-ghost" id="loginBtn">تسجيل الدخول</button>
    <button class="btn-primary" id="registerBtn"><i class="fa-solid fa-rocket"></i> ابدأ مجاناً</button>
  `;
  document.getElementById('loginBtn').addEventListener('click', openAuthModal);
  document.getElementById('registerBtn').addEventListener('click', () => { openAuthModal(); switchTab('register'); });
}

async function loadUserBots(uid) {
  try {
    const snap = await db.ref(`users/${uid}/bots`).get();
    userBots = snap.exists() ? Object.entries(snap.val()).map(([id, data]) => ({ id, ...data })) : [];
  } catch (e) {
    userBots = [];
  }
}

function showLoginPrompt() {
  const container = document.getElementById('botsContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="login-prompt" id="loginPrompt">
      <div class="login-prompt-icon"><i class="fa-solid fa-terminal"></i></div>
      <h3>سجّل دخول لإدارة مساحة العمل</h3>
      <p>بيئة استضافة مجانية ومستقرة لمشاريع JavaScript</p>
      <button class="btn-primary" id="loginPromptBtn"><i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول / إنشاء حساب</button>
    </div>
  `;
  document.getElementById('loginPromptBtn').addEventListener('click', openAuthModal);
}

function renderDashboard(user) {
  const container = document.getElementById('botsContainer');
  if (!container) return;

  const platformIcons = {
    discord: '<i class="fa-brands fa-discord"></i>', 
    telegram: '<i class="fa-brands fa-telegram"></i>', 
    whatsapp: '<i class="fa-brands fa-whatsapp"></i>',
    slack: '<i class="fa-brands fa-slack"></i>', 
    twitter: '<i class="fa-brands fa-x-twitter"></i>', 
    custom: '<i class="fa-solid fa-code"></i>'
  };

  const botsHtml = userBots.length === 0
    ? `<div class="login-prompt" style="border-style:dashed">
        <div class="login-prompt-icon"><i class="fa-solid fa-server"></i></div>
        <h3>لا توجد مشاريع مرفوعة بعد</h3>
        <p>قم بإنشاء هوست جديد لرفع كود الـ JS الخاص بك</p>
        <button class="btn-primary" id="addFirstBot"><i class="fa-solid fa-plus"></i> إنشاء هوست</button>
      </div>`
    : `<div class="bots-list">
        ${userBots.map(bot => `
          <div class="bot-card" data-id="${bot.id}">
            <div class="bot-icon ${bot.platform || 'discord'}">${platformIcons[bot.platform] || '<i class="fa-solid fa-robot"></i>'}</div>
            <div class="bot-info">
              <div class="bot-name">${bot.name}</div>
              <div class="bot-meta">
                <span class="bot-stat"><i class="fa-solid fa-globe"></i> ${bot.platform || 'discord'}</span>
                <span class="bot-stat"><i class="fa-brands fa-node-js"></i> ${bot.lang || 'Node.js'}</span>
                <span class="bot-stat"><i class="fa-solid fa-calendar-days"></i> ${new Date(bot.createdAt || Date.now()).toLocaleDateString('ar')}</span>
              </div>
            </div>
            ${bot.running !== false
              ? `<span class="running-badge"><span class="pulse-dot"></span>متصل (Online)</span>`
              : `<span class="stopped-badge"><i class="fa-solid fa-circle-pause"></i> متوقف</span>`}
            <div class="bot-actions">
              <button class="bot-btn restart" data-id="${bot.id}" data-action="restart"><i class="fa-solid fa-rotate-right"></i> إعادة</button>
              <button class="bot-btn stop" data-id="${bot.id}" data-action="${bot.running !== false ? 'stop' : 'start'}">${bot.running !== false ? '<i class="fa-solid fa-stop"></i> إيقاف' : '<i class="fa-solid fa-play"></i> تشغيل'}</button>
              <button class="bot-btn delete" data-id="${bot.id}" data-action="delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>`;

  container.innerHTML = `
    <    div class="dashboard-header">
      <div class="user-info">
        <div class="user-avatar">${(user.displayName || user.email)[0].toUpperCase()}</div>
        <div>
          <div class="user-name">${user.displayName || user.email.split('@')[0]}</div>
          <div class="user-plan"><i class="fa-solid fa-bolt" style="color: var(--neon-blue);"></i> استضافة مجانية — ${userBots.length} مساحة مستخدمة</div>
        </div>
      </div>
      <div class="dashboard-actions">
        <button class="btn-primary" id="addBotBtn"><i class="fa-solid fa-plus"></i> إنشاء هوست جديد</button>
        <button class="btn-ghost" id="logoutDash"><i class="fa-solid fa-right-from-bracket"></i> خروج</button>
      </div>
    </div>
    ${botsHtml}
  `;

  // Event listeners
  document.getElementById('addBotBtn')?.addEventListener('click', openDeployModal);
  document.getElementById('addFirstBot')?.addEventListener('click', openDeployModal);
  document.getElementById('logoutDash')?.addEventListener('click', () => {
    auth.signOut();
    showToast('<i class="fa-solid fa-info-circle"></i> تم إنهاء الجلسة', 'info');
  });

  // Bot action buttons
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleBotAction(btn.dataset.id, btn.dataset.action));
  });
}

async function handleBotAction(botId, action) {
  if (!currentUser) return;
  const botRef = db.ref(`users/${currentUser.uid}/bots/${botId}`);

  if (action === 'restart') {
    showToast('<i class="fa-solid fa-rotate-right fa-spin"></i> جاري إعادة تشغيل السيرفر...', 'info');
    await botRef.update({ running: false });
    setTimeout(async () => {
      await botRef.update({ running: true });
      showToast('<i class="fa-solid fa-check"></i> تم إعادة التشغيل بنجاح!', 'success');
      await loadUserBots(currentUser.uid);
      renderDashboard(currentUser);
    }, 1800);

  } else if (action === 'stop') {
    await botRef.update({ running: false });
    showToast('<i class="fa-solid fa-stop"></i> تم إيقاف عملية الـ Node.js', 'info');
    await loadUserBots(currentUser.uid);
    renderDashboard(currentUser);

  } else if (action === 'start') {
    await botRef.update({ running: true });
    showToast('<i class="fa-solid fa-play"></i> تم تشغيل المشروع!', 'success');
    await loadUserBots(currentUser.uid);
    renderDashboard(currentUser);

  } else if (action === 'delete') {
    if (!confirm('هل أنت متأكد من حذف هذه المساحة بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    await botRef.remove();
    showToast('<i class="fa-solid fa-trash"></i> تم حذف المشروع نهائياً', 'info');
    await loadUserBots(currentUser.uid);
    renderDashboard(currentUser);
  }
}

// ===== DEPLOY BOT =====
const BANNED_KEYWORDS = [
  'selfbot', 'discord-self', 'nuker', 'nuke', 'raider', 'raid', 
  'massdm', 'mass-dm', 'hosting-bot', 'hostbot', 'vpn-bot', 'proxy-bot'
];

function aiBotNameCheck(name) {
  const lower = name.toLowerCase();
  return BANNED_KEYWORDS.some(k => lower.includes(k));
}

document.getElementById('submitDeploy').addEventListener('click', async () => {
  if (!currentUser) { openAuthModal(); return; }

  const name = document.getElementById('botName').value.trim();
  const platform = document.getElementById('botPlatform').value;
  const lang = document.getElementById('botLang').value;
  const msg = document.getElementById('deployMsg');

  if (!name) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> يرجى إدخال اسم المشروع';
    return;
  }

  // AI check
  if (aiBotNameCheck(name)) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-shield-halved"></i> جدار الحماية: اسم المشروع يحتوي على كلمات محظورة.';
    showToast('<i class="fa-solid fa-ban"></i> جدار الحماية: تم رفض الإنشاء.', 'error');
    return;
  }

  const btn = document.getElementById('submitDeploy');
  btn.innerHTML = '<i class="fa-solid fa-microchip fa-fade"></i> جاري تخصيص الموارد...';
  btn.disabled = true;
  msg.className = 'form-msg';
  msg.innerHTML = '';

  await new Promise(r => setTimeout(r, 1200));
  btn.innerHTML = '<i class="fa-solid fa-rocket fa-bounce"></i> جاري الرفع...';

  try {
    const botId = 'host_' + Date.now();
    const botData = {
      name,
      platform,
      lang,
      running: true,
      createdAt: Date.now(),
      aiScan: 'passed'
    };

    await db.ref(`users/${currentUser.uid}/bots/${botId}`).set(botData);

    msg.className = 'form-msg success';
    msg.innerHTML = '<i class="fa-solid fa-check-double"></i> تم إعداد مساحة العمل بنجاح!';
    showToast(`<i class="fa-solid fa-server"></i> الهوست ${name} يعمل الآن على خوادمنا!`, 'success');

    setTimeout(async () => {
      closeDeployModal();
      document.getElementById('botName').value = '';
      await loadUserBots(currentUser.uid);
      renderDashboard(currentUser);
      document.getElementById('bots').scrollIntoView({ behavior: 'smooth' });
    }, 1000);

  } catch (e) {
    msg.className = 'form-msg error';
    msg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> فشل الاتصال، حاول مرة أخرى.';
  } finally {
    btn.innerHTML = '<i class="fa-solid fa-rocket"></i> بدء التنصيب والتشغيل';
    btn.disabled = false;
  }
});

// ===== PLAN SELECTION =====
function selectPlan(plan) {
  if (!currentUser) {
    openAuthModal();
    showToast('<i class="fa-solid fa-info-circle"></i> يرجى تسجيل الدخول أولاً لإنشاء الهوست', 'info');
    return;
  }
  const labels = { free: 'Starter', pro: 'Advanced', business: 'Studio Max' };
  showToast(`<i class="fa-solid fa-circle-check"></i> تم تخصيص مساحة العمل (${labels[plan]}) مجاناً لحسابك بنجاح!`, 'success');
}
window.selectPlan = selectPlan;

// ===== NEON GLOW ON HOVER (interactive) =====
document.querySelectorAll('.feature-card, .plan-card, .rule-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAuthModal();
    closeDeployModal();
  }
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      mobileMenu.classList.remove('open');
    }
  });
});

console.log('%c WanoHost [Localhost Env]', 'color:#00d4ff;font-size:24px;font-weight:bold');
console.log('%c استضافة بيئات JavaScript احترافية ومجانية', 'color:#00ff88;font-size:14px');
