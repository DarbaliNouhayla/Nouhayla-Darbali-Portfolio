/* easter-egg.js — Konami code ↑↑↓↓←→←→BA
   - Lights up key bar on hero as you type
   - On completion → cycles outfit via window.nd3d.nextOutfit()
   - Shows glitch overlay with typewriter terminal lines
   - Cursor goes rave mode
   - Press ESC or click to close                                  */

(function () {

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const LABELS = ['↑','↑','↓','↓','←','→','←','→','B','A'];

  let seq = [], overlayOpen = false;

  /* ── BUILD KONAMI KEY BAR ───────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'konami-bar';
  const hero = document.getElementById('hero');
  if (hero) hero.appendChild(bar);

  LABELS.forEach((l, i) => {
    const k = document.createElement('span');
    k.className = 'kkey';
    k.id = 'kk' + i;
    k.textContent = l;
    bar.appendChild(k);
  });

  /* ── LISTEN FOR INPUT ───────────────────────────── */
  document.addEventListener('keydown', e => {
    if (overlayOpen) return;

    seq.push(e.key);
    if (seq.length > KONAMI.length) seq.shift();

    /* check partial match from end */
    const partial = KONAMI.slice(0, seq.length);
    const match   = seq.every((k, i) => k === partial[i]);

    if (!match) { seq = []; resetBar(); return; }

    bar.style.opacity = '1';
    lightKey(seq.length - 1);

    if (seq.join(',') === KONAMI.join(',')) {
      seq = [];
      allLight();
      setTimeout(() => {
        if (window.nd3d) window.nd3d.nextOutfit();
        openOverlay();
        startCursorRave();
        setTimeout(() => { resetBar(); bar.style.opacity = '0'; }, 1400);
      }, 240);
    }
  });

  /* ── KEY BAR HELPERS ────────────────────────────── */
  function lightKey(i) {
    const k = document.getElementById('kk' + i);
    if (k) k.classList.add('lit');
  }
  function resetBar() {
    for (let i = 0; i < 10; i++) {
      const k = document.getElementById('kk' + i);
      if (k) k.classList.remove('lit');
    }
  }
  function allLight() {
    for (let i = 0; i < 10; i++) lightKey(i);
  }

  /* ── OVERLAY ────────────────────────────────────── */
  const TERMINAL_LINES = [
    '> initializing vibe mode...',
    '> loading extra drip...',
    '> skill: easter_egg_finder = TRUE',
    '> you clearly have good taste',
    '> ND.dev — unlocked ✓',
  ];

  function openOverlay() {
    overlayOpen = true;

    const el = document.createElement('div');
    el.id = 'egg-overlay';
    el.innerHTML = `
      <div class="egg-box">
        <div class="egg-glitch" data-text="PARTY MODE">PARTY MODE</div>
        <p class="egg-sub">// you found the secret. nice.</p>
        <div class="egg-lines" id="egg-lines"></div>
        <p class="egg-msg">Achievement unlocked: <span>Knows the Code</span></p>
        <button class="egg-close" id="egg-close-btn">[ press ESC or click to exit ]</button>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));

    /* typewriter */
    const out = document.getElementById('egg-lines');
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.textContent = '';
        out.appendChild(p);
        let j = 0;
        const t = setInterval(() => { p.textContent += line[j++]; if (j >= line.length) clearInterval(t); }, 22);
      }, i * 420);
    });

    document.getElementById('egg-close-btn').addEventListener('click', closeOverlay);
    document.addEventListener('keydown', onEsc);
  }

  function onEsc(e) { if (e.key === 'Escape') closeOverlay(); }

  function closeOverlay() {
    const el = document.getElementById('egg-overlay');
    if (!el) return;
    el.classList.remove('visible');
    setTimeout(() => { el.remove(); overlayOpen = false; }, 450);
    stopCursorRave();
    document.removeEventListener('keydown', onEsc);
  }

  /* ── CURSOR RAVE ────────────────────────────────── */
  const RAVE_COLORS = ['#ff2d78','#ffb700','#00e5ff','#7c3aff','#00ff9d','#ff6b35'];
  let raveInterval = null, rci = 0;

  function startCursorRave() {
    if (!window.ndCursor) return;
    const { cur, ring } = window.ndCursor;
    raveInterval = setInterval(() => {
      const c = RAVE_COLORS[rci++ % RAVE_COLORS.length];
      cur.style.background    = c;
      ring.style.borderColor  = c;
    }, 180);
  }

  function stopCursorRave() {
    clearInterval(raveInterval);
    if (!window.ndCursor) return;
    const { cur, ring } = window.ndCursor;
    cur.style.background   = '#7c3aff';
    ring.style.borderColor = '#a78bfa';
  }

  /* ── INJECT OVERLAY STYLES ──────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #egg-overlay {
      position: fixed; inset: 0; z-index: 8000;
      background: rgba(6,7,15,0.93);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.4s;
      backdrop-filter: blur(14px);
    }
    #egg-overlay.visible { opacity: 1; }

    .egg-box {
      text-align: center;
      padding: 2.8rem 3.2rem;
      border: 0.5px solid rgba(124,58,255,0.45);
      border-radius: 16px;
      background: rgba(10,12,24,0.98);
      max-width: 500px; width: 92%;
      transform: translateY(20px);
      transition: transform 0.4s;
    }
    #egg-overlay.visible .egg-box { transform: translateY(0); }

    .egg-glitch {
      font-family: 'Space Mono', monospace;
      font-size: clamp(1.8rem, 5vw, 2.8rem);
      font-weight: 700; color: #fff;
      letter-spacing: 0.1em; position: relative;
      margin-bottom: 0.5rem;
      animation: eggGlitch 1.4s infinite;
    }
    .egg-glitch::before, .egg-glitch::after {
      content: attr(data-text);
      position: absolute; top: 0; left: 0; width: 100%;
    }
    .egg-glitch::before { color: #ff2d78; clip-path: polygon(0 0,100% 0,100% 38%,0 38%); animation: eggGT 1.4s infinite; }
    .egg-glitch::after  { color: #00e5ff; clip-path: polygon(0 62%,100% 62%,100% 100%,0 100%); animation: eggGB 1.4s infinite; }

    .egg-sub   { font-family:'Courier New',monospace; font-size:0.78rem; color:rgba(167,139,250,0.7); letter-spacing:0.14em; margin-bottom:1.3rem; }
    .egg-lines { text-align:left; background:rgba(0,0,0,0.45); border-radius:8px; padding:0.9rem 1.1rem; min-height:115px; margin-bottom:1.2rem; }
    .egg-lines p { font-family:'Courier New',monospace; font-size:0.7rem; color:#a78bfa; line-height:2; }
    .egg-msg   { font-family:'Courier New',monospace; font-size:0.68rem; color:rgba(100,116,139,0.8); margin-bottom:1.2rem; }
    .egg-msg span { color:#7c3aff; }
    .egg-close { font-family:'Courier New',monospace; font-size:0.68rem; color:rgba(100,116,139,0.7); background:none; border:0.5px solid rgba(100,116,139,0.3); border-radius:4px; padding:0.45rem 1rem; cursor:pointer; letter-spacing:0.1em; transition:all 0.2s; }
    .egg-close:hover { color:#a78bfa; border-color:rgba(124,58,255,0.5); }

    @keyframes eggGlitch { 0%,90%,100%{transform:none} 92%{transform:skewX(-3deg)} 94%{transform:skewX(3deg)} }
    @keyframes eggGT     { 0%,89%,100%{transform:none;opacity:1} 90%{transform:translate(-3px,-1px);opacity:.9} 92%{transform:translate(2px,0);opacity:.8} }
    @keyframes eggGB     { 0%,89%,100%{transform:none;opacity:1} 91%{transform:translate(3px,1px);opacity:.9}  93%{transform:translate(-2px,0);opacity:.8} }
  `;
  document.head.appendChild(style);

})();
