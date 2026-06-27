// public/app.js
// Frontend del catálogo Grayer. Obtiene los datos desde /api/products
// (servidos por server.js, que lee la carpeta img/ en tiempo real) y
// renderiza todo el catálogo + maneja las animaciones decorativas.

let currentFilter = 'all';
let allCards = [];
let currentProduct = null;
let wishCount = 0;

// ─── PAGE LOADER ────────────────────────────────────────────────────────
function setLoaderProgress(pct, label) {
  const bar = document.getElementById('loaderBar');
  const sub = document.getElementById('loaderSub');
  if (bar) bar.style.width = pct + '%';
  if (sub && label) sub.textContent = label;
}
function hideLoader() {
  const loader = document.getElementById('pageLoader');
  setTimeout(() => loader.classList.add('hide'), 280);
}

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────
function animateCount(el, target, duration = 900) {
  const start = 0;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── PARTICLE BACKGROUND (canvas, ligero) ──────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function makeParticles() {
    const count = Math.min(46, Math.floor(window.innerWidth / 26));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      vy: -(Math.random() * 0.25 + 0.08),
      vx: (Math.random() - 0.5) * 0.12,
      o: Math.random() * 0.35 + 0.08,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(201,151,43,';
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = h + 10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.globalAlpha = p.o;
      ctx.fillStyle = '#c9972b';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  makeParticles();
  draw();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
}

// ─── CURSOR GLOW ────────────────────────────────────────────────────────
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  let raf = null;
  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      raf = null;
    });
  });
  window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ─── HERO SPARKLES ──────────────────────────────────────────────────────
function initHeroSparkles() {
  const wrap = document.getElementById('heroSparkles');
  const n = 14;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    s.style.animationDuration = (2 + Math.random() * 2.4).toFixed(2) + 's';
    wrap.appendChild(s);
  }
}

// ─── FETCH + RENDER ─────────────────────────────────────────────────────
async function loadCatalog() {
  setLoaderProgress(20, 'Conectando con el servidor…');
  try {
    const res = await fetch('/api/products');
    setLoaderProgress(60, 'Leyendo carpeta img/…');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    setLoaderProgress(85, 'Construyendo catálogo…');
    renderAll(data.sections || []);
    updateStatusBar(data);
    setLoaderProgress(100, 'Listo');
    setTimeout(hideLoader, 250);
  } catch (err) {
    console.error('Error cargando el catálogo:', err);
    setLoaderProgress(100, 'Error al cargar');
    document.getElementById('main').innerHTML = `
      <div class="empty show">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">No se pudo cargar el catálogo</div>
        <div class="empty-sub">Verifica que el servidor Node.js esté corriendo y que la carpeta img/ exista.</div>
      </div>`;
    setTimeout(hideLoader, 600);
  }
}

function updateStatusBar(data) {
  const el = document.getElementById('statusImgs');
  if (!el) return;
  const total = data.totalImages ?? 0;
  const known = data.knownCount ?? 0;
  const auto = data.autoCount ?? 0;
  el.innerHTML = `<strong>${total}</strong> imágenes detectadas en <strong>img/</strong>` +
    (auto > 0 ? ` · ${known} con datos completos · ${auto} generadas automáticamente` : ` · todas con datos completos`);
}

function renderAll(sections) {
  const main = document.getElementById('main');
  main.innerHTML = '';
  allCards = [];

  const catCounts = { all: 0, deportivo: 0, ortopedico: 0, tacones: 0, sneakers: 0, plataforma: 0, men: 0 };

  sections.forEach((sec) => {
    if (!sec.products || !sec.products.length) return;

    const div = document.createElement('div');
    div.className = 'deco-divider';
    div.innerHTML = `<div class="dd-line"></div><span class="dd-gem">✦</span><div class="dd-line"></div>`;
    main.appendChild(div);

    const hdr = document.createElement('div');
    hdr.className = 'section-header reveal';
    hdr.innerHTML = `
      <div class="sh-line"></div>
      <h2>${escapeHtml(sec.title)}</h2>
      ${sec.badgeCls ? `<span class="sh-badge ${sec.badgeCls}">${escapeHtml((sec.tag || '').toUpperCase())}</span>` : ''}
      <div class="sh-line right"></div>`;
    main.appendChild(hdr);

    const grid = document.createElement('div');
    grid.className = 'grid';

    sec.products.forEach((p, pi) => {
      const tag = p.tag || sec.tag;
      catCounts.all++;
      if (catCounts[tag] !== undefined) catCounts[tag]++;

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.tag = tag;
      card.dataset.name = `${p.name} ${p.ref} ${p.colors} ${p.line}`.toLowerCase();
      card.style.animationDelay = `${Math.min(pi, 8) * 0.05}s`;

      card.dataset.img = p.img;
      card.dataset.pname = p.name;
      card.dataset.ref = p.ref;
      card.dataset.colors = p.colors;
      card.dataset.sizes = p.sizes;
      card.dataset.price = p.price;
      card.dataset.line = p.line;
      card.dataset.ribbon = p.ribbonCls;

      card.innerHTML = `
        <div class="card-wish" onclick="toggleWish(this,event)" title="Guardar">♡</div>
        <div class="card-img-wrap">
          <img class="card-img" src="/img/${encodeURIComponent(p.img)}" alt="${escapeHtml(p.name)}" loading="lazy"
               onload="this.classList.add('loaded')" onerror="this.closest('.card-img-wrap').style.opacity='0.35'">
          <div class="card-ribbon ${p.ribbonCls}">${escapeHtml(p.line)}</div>
        </div>
        <div class="card-body">
          <div class="card-name">${escapeHtml(p.name)}</div>
          <div class="card-ref">REF. ${escapeHtml(p.ref)}</div>
          <div class="card-colors-text">${escapeHtml(p.colors)}</div>
          <div class="card-footer">
            <div class="card-sizes">Tallas ${escapeHtml(p.sizes)}</div>
            <div class="card-price">$${p.price}</div>
          </div>
        </div>
        <div class="card-cta" onclick="openModal(this.closest('.card'))">🔍 Ver detalles</div>`;

      grid.appendChild(card);
      allCards.push(card);
    });

    main.appendChild(grid);
  });

  Object.keys(catCounts).forEach(k => {
    const el = document.getElementById('cc-' + k);
    if (el) el.textContent = catCounts[k];
  });

  const heroEl = document.getElementById('heroCount');
  animateCount(heroEl, catCounts.all);
  document.getElementById('marqueeCount').textContent = `${catCounts.all} Estilos`;
  document.querySelectorAll('.marqueeCount2').forEach(e => e.textContent = `${catCounts.all} Estilos`);

  updateCount();
  initReveal();
  filterCards();
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ─── WISHLIST ───────────────────────────────────────────────────────────
function toggleWish(el, e) {
  e.stopPropagation();
  el.classList.toggle('liked');
  const liked = el.classList.contains('liked');
  el.textContent = liked ? '♥' : '♡';
  wishCount += liked ? 1 : -1;
  updateWishFloat();
}
function updateWishFloat() {
  const float = document.getElementById('wishFloat');
  document.getElementById('wishFloatCount').textContent = wishCount;
  float.classList.toggle('show', wishCount > 0);
}

// ─── FILTERING ──────────────────────────────────────────────────────────
function setFilter(tag, btn) {
  currentFilter = tag;
  document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterCards();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  filterCards();
  input.focus();
}

function filterCards() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  document.getElementById('clearBtn').classList.toggle('show', q.length > 0);
  let vis = 0;
  allCards.forEach(c => {
    const ok = (currentFilter === 'all' || c.dataset.tag === currentFilter) && (!q || c.dataset.name.includes(q));
    c.classList.toggle('hidden', !ok);
    if (ok) vis++;
  });
  document.querySelectorAll('.section-header').forEach(h => {
    const g = h.nextElementSibling;
    if (!g) return;
    const any = [...g.querySelectorAll('.card')].some(c => !c.classList.contains('hidden'));
    h.style.display = any ? '' : 'none';
    g.style.display = any ? '' : 'none';
    const prev = h.previousElementSibling;
    if (prev && prev.classList.contains('deco-divider')) prev.style.display = any ? '' : 'none';
  });
  updateCount(vis);
  document.getElementById('emptyState').classList.toggle('show', vis === 0);
}

function updateCount(n) {
  const c = n !== undefined ? n : allCards.length;
  const pill = document.getElementById('countBadge');
  pill.textContent = `${c} producto${c !== 1 ? 's' : ''}`;
  pill.classList.add('bump');
  setTimeout(() => pill.classList.remove('bump'), 220);
}

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ─── STICKY SEARCH SHADOW + BACK TO TOP ────────────────────────────────
function initScrollEffects() {
  const searchBar = document.getElementById('searchBar');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    searchBar.classList.toggle('scrolled', y > 8);
    backTop.classList.toggle('show', y > 600);
  }, { passive: true });
}

// ─── MODAL ──────────────────────────────────────────────────────────────
function openModal(card) {
  const d = card.dataset;
  currentProduct = d;

  document.getElementById('modalImg').src = `/img/${encodeURIComponent(d.img)}`;
  document.getElementById('modalImg').alt = d.pname;

  const ribbon = document.getElementById('modalRibbon');
  ribbon.textContent = d.line;
  ribbon.className = `modal-ribbon ${d.ribbon}`;

  document.getElementById('modalTag').textContent = `✦ ${d.line}`;
  document.getElementById('modalName').textContent = d.pname;
  document.getElementById('modalRef').textContent = `REF. ${d.ref}`;
  document.getElementById('modalPrice').textContent = `$${d.price}`;

  const colorsWrap = document.getElementById('modalColors');
  colorsWrap.innerHTML = '';
  d.colors.split('·').map(c => c.trim()).filter(Boolean).forEach((c, i) => {
    const chip = document.createElement('div');
    chip.className = 'modal-color-chip' + (i === 0 ? ' sel' : '');
    chip.textContent = c;
    chip.onclick = () => {
      colorsWrap.querySelectorAll('.modal-color-chip').forEach(x => x.classList.remove('sel'));
      chip.classList.add('sel');
    };
    colorsWrap.appendChild(chip);
  });

  const sizesWrap = document.getElementById('modalSizes');
  sizesWrap.innerHTML = '';
  const parts = d.sizes.split('-').map(Number);
  const from = parts[0], to = parts[1];
  if (Number.isFinite(from) && Number.isFinite(to)) {
    for (let s = from; s <= to; s++) {
      const chip = document.createElement('div');
      chip.className = 'modal-size-chip';
      chip.textContent = s;
      chip.onclick = () => {
        sizesWrap.querySelectorAll('.modal-size-chip').forEach(x => x.classList.remove('sel'));
        chip.classList.add('sel');
      };
      sizesWrap.appendChild(chip);
    }
  }

  document.getElementById('modalWish').classList.remove('liked');
  document.getElementById('modalWish').textContent = '♡';

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
function toggleModalWish() {
  const btn = document.getElementById('modalWish');
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
}

function pedirWhatsApp() {
  if (!currentProduct) return;
  const col = document.querySelector('#modalColors .modal-color-chip.sel');
  const sz = document.querySelector('#modalSizes .modal-size-chip.sel');
  const colorTxt = col ? col.textContent : 'Sin especificar';
  const sizeTxt = sz ? sz.textContent : 'Sin especificar';
  const msg = encodeURIComponent(
    `¡Hola Grayer! Me interesa este modelo:\n\n` +
    `👠 *${currentProduct.pname}*\n` +
    `📋 REF: ${currentProduct.ref}\n` +
    `🎨 Color: ${colorTxt}\n` +
    `📏 Talla: ${sizeTxt}\n` +
    `💵 Precio: $${currentProduct.price}\n\n` +
    `¿Está disponible? 😊`
  );
  window.open(`https://wa.me/593958935982?text=${msg}`, '_blank');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── INIT ───────────────────────────────────────────────────────────────
initParticles();
initCursorGlow();
initHeroSparkles();
initScrollEffects();
loadCatalog();
