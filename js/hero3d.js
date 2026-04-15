/* hero3d.js — full 3D coder girl scene
   Exposes window.nd3d = { outfits, applyOutfit, parts, sg, ml }
   so easter-egg.js can recolor everything on Konami trigger        */

(function () {
  const wrap = document.getElementById('hero-canvas-wrap');
  const cv   = document.getElementById('hero-cv');
  let W = wrap.clientWidth, H = wrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const cam   = new THREE.PerspectiveCamera(42, W / H, 0.01, 50);
  cam.position.set(0, 0.65, 3.6);
  cam.lookAt(0, 0.3, 0);

  /* ── LIGHTS ──────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x080820, 6));
  const sun  = new THREE.DirectionalLight(0xffeedd, 2.5); sun.position.set(3, 6, 4);   scene.add(sun);
  const fill = new THREE.DirectionalLight(0x4422ff, 1.5); fill.position.set(-3, 2, 3); scene.add(fill);
  const rim  = new THREE.DirectionalLight(0x8855ff, 2.5); rim.position.set(0, 4, -5);  scene.add(rim);
  const sg   = new THREE.PointLight(0x7c3aff, 6,   3.5); sg.position.set(0, 0.72, 0.68); scene.add(sg);
  const ml   = new THREE.PointLight(0x3b82f6, 3,   2);   ml.position.set(0, 0.52, -0.12); scene.add(ml);

  /* ── SHARED MATERIALS (exposed for easter-egg.js) ── */
  const M = {
    hoodie: new THREE.MeshStandardMaterial({ color: 0x0a0c1a, roughness: 0.85 }),
    pants:  new THREE.MeshStandardMaterial({ color: 0x080812, roughness: 0.9  }),
    acc:    new THREE.MeshStandardMaterial({ color: 0x7c3aff, emissive: new THREE.Color(0x7c3aff), emissiveIntensity: 0.8, roughness: 0.4 }),
    acc2:   new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: new THREE.Color(0x3b82f6), emissiveIntensity: 0.6, roughness: 0.4 }),
    shoe:   new THREE.MeshStandardMaterial({ color: 0x06070e, roughness: 0.95 }),
    skin:   new THREE.MeshStandardMaterial({ color: 0xf5aa80, roughness: 0.75 }),
    hair:   new THREE.MeshStandardMaterial({ color: 0x0d0418, roughness: 1    }),
    met:    new THREE.MeshStandardMaterial({ color: 0x181828, roughness: 0.2,  metalness: 0.95 }),
    scrV:   new THREE.MeshStandardMaterial({ color: 0x7c3aff, emissive: new THREE.Color(0x7c3aff), emissiveIntensity: 2   }),
    scrB:   new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: new THREE.Color(0x3b82f6), emissiveIntensity: 1.5 }),
    dk:     new THREE.MeshStandardMaterial({ color: 0x06070e, roughness: 0.95 }),
    dkM:    new THREE.MeshStandardMaterial({ color: 0x0a0c18, roughness: 0.45, metalness: 0.55 }),
    chM:    new THREE.MeshStandardMaterial({ color: 0x0b0d1a, roughness: 0.8,  metalness: 0.2  }),
    cL:     new THREE.MeshStandardMaterial({ color: 0x1a0044, roughness: 1    }),
    cA:     new THREE.MeshStandardMaterial({ color: 0x001040, roughness: 1    }),
    eye:    new THREE.MeshStandardMaterial({ color: 0x040310, roughness: 1    }),
    shine:  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1 }),
  };

  /* ── OUTFIT THEMES ───────────────────────────────── */
  const OUTFITS = [
    { name: 'default',      hoodie: 0x0a0c1a, pants: 0x080812, acc: 0x7c3aff, acc2: 0x3b82f6, shoe: 0x06070e, sgC: 0x7c3aff, mlC: 0x3b82f6, pCols: [0x7c3aff, 0x3b82f6, 0xa78bfa, 0x60a5fa, 0xc4b5fd] },
    { name: 'HOT PINK ♡',   hoodie: 0x2a0118, pants: 0x1a0012, acc: 0xff2d78, acc2: 0xff80ab, shoe: 0x1a0010, sgC: 0xff2d78, mlC: 0xff80ab, pCols: [0xff2d78, 0xff80ab, 0xff2d78, 0xff80ab, 0xffb3c6] },
    { name: 'MATRIX ◈',     hoodie: 0x001a08, pants: 0x000f04, acc: 0x00ff9d, acc2: 0x00cc66, shoe: 0x000c02, sgC: 0x00ff9d, mlC: 0x00cc66, pCols: [0x00ff9d, 0x00cc66, 0x00ff9d, 0x00e580, 0x33ffb0] },
    { name: 'GOLD MODE ★',  hoodie: 0x1a1000, pants: 0x0f0a00, acc: 0xffb700, acc2: 0xffdd00, shoe: 0x0d0800, sgC: 0xffb700, mlC: 0xffdd00, pCols: [0xffb700, 0xffdd00, 0xffa500, 0xffcc00, 0xffe066] },
    { name: 'CYBER CYAN ◎', hoodie: 0x00101a, pants: 0x000810, acc: 0x00e5ff, acc2: 0x0099cc, shoe: 0x00060f, sgC: 0x00e5ff, mlC: 0x0099cc, pCols: [0x00e5ff, 0x0099cc, 0x33eeff, 0x00bbdd, 0x66f0ff] },
    { name: 'CORAL HEAT ✦', hoodie: 0x1a0800, pants: 0x0f0400, acc: 0xff6b35, acc2: 0xff4400, shoe: 0x0d0300, sgC: 0xff6b35, mlC: 0xff4400, pCols: [0xff6b35, 0xff4400, 0xff8c55, 0xff5500, 0xffaa77] },
  ];
  let outfitIdx = 0;

  /* ── HELPERS ─────────────────────────────────────── */
  const B  = (w, h, d)      => new THREE.BoxGeometry(w, h, d);
  const Cy = (r1, r2, h, s=8) => new THREE.CylinderGeometry(r1, r2, h, s);
  const Sp = (r, w=14, h=12)  => new THREE.SphereGeometry(r, w, h);
  const mk = (g, m)         => new THREE.Mesh(g, m);
  function pt(p, m, x=0, y=0, z=0, rx=0, ry=0, rz=0) {
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    p.add(m);
    return m;
  }

  const GG = new THREE.Group();
  scene.add(GG);

  /* ── DESK ────────────────────────────────────────── */
  const dG = new THREE.Group();
  dG.position.set(0, 0.14, 0.55);
  GG.add(dG);

  pt(dG, mk(B(1.5, 0.05, 0.82), M.dkM));
  const deskEdge = mk(B(1.5, 0.008, 0.004), M.acc.clone());
  deskEdge.position.set(0, 0.029, -0.41);
  dG.add(deskEdge);

  [[-0.64, -0.36], [-0.64, 0.35], [0.64, -0.36], [0.64, 0.35]].forEach(([x, z]) =>
    pt(dG, mk(Cy(0.032, 0.032, 0.82, 6), M.dk), x, -0.435, z)
  );
  pt(dG, mk(B(0.22, 0.04, 0.18), M.met), 0, 0.046, 0.28);
  pt(dG, mk(B(0.04, 0.24, 0.04), M.met), 0, 0.17,  0.28);

  /* Monitor */
  const mG = new THREE.Group();
  mG.position.set(0, 0.38, 0.27);
  dG.add(mG);
  pt(mG, mk(B(0.72, 0.42, 0.03), M.met));
  pt(mG, mk(B(0.66, 0.36, 0.015), M.scrV.clone()), 0, 0, -0.023);
  for (let i = 0; i < 7; i++) {
    const w = 0.08 + Math.random() * 0.28;
    const ln = mk(B(w, 0.016, 0.003), i % 3 === 0 ? M.cA : M.cL);
    ln.position.set(-0.24 + w / 2 + Math.random() * 0.06, 0.12 - i * 0.054, -0.031);
    mG.add(ln);
  }

  /* Laptop */
  const lG = new THREE.Group();
  lG.position.set(0, 0.04, -0.02);
  dG.add(lG);
  pt(lG, mk(B(0.6, 0.022, 0.42), M.met));
  const hnG = new THREE.Group();
  hnG.position.set(0, 0.011, -0.21);
  lG.add(hnG);
  const scG = new THREE.Group();
  scG.rotation.x = -1.08;
  hnG.add(scG);
  pt(scG, mk(B(0.6, 0.38, 0.02),   M.met), 0, 0.19,  0);
  pt(scG, mk(B(0.54, 0.32, 0.008), M.scrB), 0, 0.19, -0.012);
  for (let i = 0; i < 6; i++) {
    const w = 0.06 + Math.random() * 0.2;
    const ln = mk(B(w, 0.013, 0.003), i % 4 === 0 ? M.cA : M.cL);
    ln.position.set(-0.19 + w / 2 + Math.random() * 0.04, 0.09 - i * 0.053, -0.019);
    scG.add(ln);
  }
  pt(lG, mk(B(0.54, 0.006, 0.36), M.met), 0, 0.015, 0.02);

  /* Mug */
  const mugG = new THREE.Group();
  mugG.position.set(0.55, 0.056, -0.1);
  dG.add(mugG);
  pt(mugG, mk(Cy(0.038, 0.032, 0.075, 10), M.dk));
  pt(mugG, mk(Cy(0.032, 0.032, 0.01, 10), M.acc2), 0, 0.032, 0);

  /* ── CHAIR ───────────────────────────────────────── */
  const chG = new THREE.Group();
  chG.position.set(0, -0.0, -0.14);
  GG.add(chG);
  pt(chG, mk(B(0.65, 0.055, 0.6),   M.chM));
  pt(chG, mk(B(0.65, 0.75, 0.055),  M.chM),  0, 0.4,   -0.275);
  pt(chG, mk(B(0.06, 0.04, 0.5),    M.dk),  -0.36, 0.2, 0);
  pt(chG, mk(B(0.06, 0.04, 0.5),    M.dk),   0.36, 0.2, 0);
  [[-0.27, -0.26], [-0.27, 0.26], [0.27, -0.26], [0.27, 0.26]].forEach(([x, z]) =>
    pt(chG, mk(Cy(0.022, 0.022, 0.5, 6), M.dk), x, -0.275, z)
  );

  /* ── CHARACTER ───────────────────────────────────── */
  const ch = new THREE.Group();
  ch.position.set(0, 0, -0.14);
  GG.add(ch);

  pt(ch, mk(B(0.32, 0.18, 0.27), M.pants),  0, 0.09, 0);
  pt(ch, mk(B(0.36, 0.52, 0.24), M.hoodie), 0, 0.42, 0);
  pt(ch, mk(B(0.22, 0.11, 0.005), M.hoodie), 0, 0.33,  0.121);
  pt(ch, mk(B(0.36, 0.024, 0.005), M.acc),   0, 0.56,  0.121);
  pt(ch, mk(B(0.014, 0.14, 0.005), M.acc2), -0.12, 0.38, 0.122);
  pt(ch, mk(Cy(0.063, 0.068, 0.1, 8), M.skin), 0, 0.73, 0);

  /* Head */
  const hG = new THREE.Group();
  hG.position.set(0, 0.88, 0.03);
  hG.rotation.x = 0.28;
  ch.add(hG);

  pt(hG, mk(Sp(0.215), M.skin));
  const hm = mk(new THREE.SphereGeometry(0.228, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.7), M.hair);
  hm.position.set(0, -0.02, -0.005); hm.rotation.x = 0.1; hG.add(hm);
  const ht = mk(new THREE.SphereGeometry(0.232, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.44), M.hair);
  ht.position.set(0, 0.01, -0.015); hG.add(ht);
  pt(hG, mk(Cy(0.055, 0.038, 0.22, 8), M.hair),  0, -0.17, -0.21, 0.48, 0, 0);
  pt(hG, mk(Cy(0.038, 0.02,  0.22, 8), M.hair),  0, -0.32, -0.3,  0.88, 0, 0);
  pt(hG, mk(Cy(0.064, 0.064, 0.04, 8), M.acc),   0, -0.12, -0.19, 0.48, 0, 0);

  const b1 = mk(new THREE.SphereGeometry(0.122, 10, 8, 0.2,  Math.PI * 0.72, 0, Math.PI * 0.4), M.hair);
  b1.position.set(-0.056, 0.07, 0.165); b1.rotation.z =  0.3; hG.add(b1);
  const b2 = mk(new THREE.SphereGeometry(0.122, 10, 8, -0.1, Math.PI * 0.65, 0, Math.PI * 0.4), M.hair);
  b2.position.set(0.06, 0.055, 0.168);  b2.rotation.z = -0.25; hG.add(b2);

  pt(hG, mk(Sp(0.038, 8, 6), M.eye),   -0.078, 0.026, 0.196);
  pt(hG, mk(Sp(0.038, 8, 6), M.eye),    0.078, 0.026, 0.196);
  pt(hG, mk(Sp(0.014, 6, 4), M.shine), -0.066, 0.044, 0.228);
  pt(hG, mk(Sp(0.014, 6, 4), M.shine),  0.089, 0.044, 0.228);
  pt(hG, mk(Sp(0.06, 8, 6),  M.skin),  -0.215, 0.008, 0);
  pt(hG, mk(Sp(0.06, 8, 6),  M.skin),   0.215, 0.008, 0);
  pt(hG, mk(Sp(0.04, 6, 4),  M.dk),    -0.242, 0.008, 0.028);
  pt(hG, mk(Sp(0.04, 6, 4),  M.dk),     0.242, 0.008, 0.028);
  pt(hG, mk(Sp(0.018, 6, 4), M.acc),   -0.258, 0.008, 0.028);
  pt(hG, mk(Sp(0.018, 6, 4), M.acc),    0.258, 0.008, 0.028);

  /* Arms */
  const aLG = new THREE.Group(); aLG.position.set(-0.2, 0.63, 0.01); ch.add(aLG);
  const uAL = mk(Cy(0.072, 0.062, 0.3, 8), M.hoodie); uAL.position.set(0, -0.13, 0.04);   uAL.rotation.set(-0.18, 0,  0.14); aLG.add(uAL);
  const fAL = mk(Cy(0.062, 0.052, 0.4, 8), M.hoodie); fAL.position.set(-0.02, -0.3, 0.22); fAL.rotation.set(-1.18, 0,  0.08); aLG.add(fAL);
  const hL  = mk(B(0.092, 0.058, 0.1), M.skin); hL.position.set(-0.04, -0.41, 0.58); aLG.add(hL);

  const aRG = new THREE.Group(); aRG.position.set(0.2, 0.63, 0.01); ch.add(aRG);
  const uAR = mk(Cy(0.072, 0.062, 0.3, 8), M.hoodie); uAR.position.set(0, -0.13, 0.04);   uAR.rotation.set(-0.18, 0, -0.14); aRG.add(uAR);
  const fAR = mk(Cy(0.062, 0.052, 0.4, 8), M.hoodie); fAR.position.set(0.02, -0.3, 0.22); fAR.rotation.set(-1.18, 0, -0.08); aRG.add(fAR);
  const hR  = mk(B(0.092, 0.058, 0.1), M.skin); hR.position.set(0.04, -0.41, 0.58); aRG.add(hR);

  /* Legs */
  [-1, 1].forEach(side => {
    const lg = new THREE.Group(); lg.position.set(side * 0.1, 0.02, 0); ch.add(lg);
    const th = mk(Cy(0.098, 0.088, 0.42, 8), M.pants); th.position.set(0, 0, 0.21); th.rotation.x = Math.PI / 2; lg.add(th);
    const kg = new THREE.Group(); kg.position.set(0, 0.01, 0.42); lg.add(kg);
    pt(kg, mk(Cy(0.086, 0.07, 0.44, 8), M.pants), 0, -0.22, 0);
    const sG = new THREE.Group(); sG.position.set(0, -0.455, 0.04); kg.add(sG);
    pt(sG, mk(B(0.12, 0.065, 0.2),  M.shoe));
    pt(sG, mk(B(0.12, 0.018, 0.22), M.shoe), 0, -0.04, 0.01);
    const st = mk(B(0.122, 0.012, 0.005), M.acc); st.position.set(0, 0.01, side > 0 ? -0.1 : 0.1); sG.add(st);
  });

  /* ── PARTICLES ───────────────────────────────────── */
  const parts = Array.from({ length: 26 }, (_, i) => {
    const cols = OUTFITS[0].pCols;
    const c = cols[i % cols.length];
    const pm = new THREE.MeshStandardMaterial({ color: c, emissive: new THREE.Color(c), emissiveIntensity: 1.2, roughness: 1, transparent: true, opacity: 0.6 });
    const p = mk(B(0.018 + Math.random() * 0.065, 0.01, 0.002), pm);
    p.userData = {
      angle: (i / 26) * Math.PI * 2,
      r:     1.0 + Math.random() * 0.85,
      y:    -0.6 + Math.random() * 2.3,
      ySpd:  0.002 + Math.random() * 0.0045,
      rSpd:  0.003 + Math.random() * 0.006 * (Math.random() < 0.5 ? 1 : -1),
      ob:    0.3 + Math.random() * 0.5,
    };
    GG.add(p);
    return p;
  });

  /* Grid */
  const grid = new THREE.GridHelper(6, 20, 0x1a0050, 0x0a0028);
  grid.position.y = -0.9;
  grid.material.transparent = true;
  grid.material.opacity = 0.5;
  scene.add(grid);

  /* ── OUTFIT SWITCHER (called by easter-egg.js) ───── */
  function applyOutfit(idx) {
    const o = OUTFITS[idx];
    const lerp = (mat, hexC, hexE) => {
      const target = new THREE.Color(hexC);
      const tgt2   = new THREE.Color(hexE || hexC);
      const startC = mat.color.clone();
      const startE = mat.emissive ? mat.emissive.clone() : null;
      let t = 0;
      const id = setInterval(() => {
        t += 0.07;
        mat.color.lerpColors(startC, target, Math.min(t, 1));
        if (startE) mat.emissive.lerpColors(startE, tgt2, Math.min(t, 1));
        if (t >= 1) clearInterval(id);
      }, 16);
    };

    lerp(M.hoodie, o.hoodie);
    lerp(M.pants,  o.pants);
    lerp(M.acc,    o.acc,  o.acc);
    lerp(M.acc2,   o.acc2, o.acc2);
    lerp(M.shoe,   o.shoe);

    sg.color.setHex(o.sgC);
    ml.color.setHex(o.mlC);

    parts.forEach((p, i) => {
      const c = o.pCols[i % o.pCols.length];
      p.material.color.setHex(c);
      p.material.emissive.setHex(c);
    });

    /* outfit label */
    const lbl = document.getElementById('outfit-label');
    if (lbl) {
      if (idx === 0) { lbl.style.opacity = 0; return; }
      lbl.textContent = '// outfit: ' + o.name;
      lbl.style.animation = 'none';
      lbl.offsetHeight; // reflow
      lbl.style.animation = 'flashLabel 1s ease-in-out 3';
      lbl.style.opacity = '0.55';
    }
  }

  /* ── DRAG ROTATION ───────────────────────────────── */
  let drag = false, prevX = 0, targetY = 0.18, currY = 0.18, autoRot = true;

  wrap.addEventListener('mousedown', e => { drag = true; autoRot = false; prevX = e.clientX; wrap.style.cursor = 'grabbing'; });
  window.addEventListener('mouseup', () => { drag = false; wrap.style.cursor = 'grab'; setTimeout(() => autoRot = true, 2800); });
  window.addEventListener('mousemove', e => { if (drag) { targetY += (e.clientX - prevX) * 0.013; prevX = e.clientX; } });
  wrap.addEventListener('touchstart', e => { drag = true; autoRot = false; prevX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', () => { drag = false; setTimeout(() => autoRot = true, 2800); });
  window.addEventListener('touchmove', e => { if (drag) { targetY += (e.touches[0].clientX - prevX) * 0.013; prevX = e.touches[0].clientX; } }, { passive: true });

  /* ── ANIMATE ─────────────────────────────────────── */
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.016;
    if (autoRot) targetY += 0.005;
    currY += (targetY - currY) * 0.07;
    GG.rotation.y = currY;

    ch.position.y = Math.sin(t * 0.85) * 0.007;
    hG.rotation.x = 0.28 + Math.sin(t * 0.7) * 0.022;

    hL.position.y = -0.41 + Math.sin(t * 5.2)         * 0.012;
    hR.position.y = -0.41 + Math.sin(t * 5.2 + 1.4)   * 0.012;
    hL.position.z =  0.58 + Math.sin(t * 5.2)         * 0.016;
    hR.position.z =  0.58 + Math.sin(t * 5.2 + 1.4)   * 0.016;

    sg.intensity = 5   + Math.sin(t * 2.1)       * 0.8;
    ml.intensity = 2.8 + Math.sin(t * 1.7 + 0.5) * 0.5;

    parts.forEach((p, i) => {
      const d = p.userData;
      d.angle += d.rSpd; d.y += d.ySpd;
      if (d.y > 1.9) d.y = -0.7;
      p.position.set(Math.cos(d.angle) * d.r, d.y, Math.sin(d.angle) * d.r);
      p.rotation.y = d.angle + Math.PI / 2;
      p.material.opacity = d.ob * (0.5 + Math.sin(t * 1.8 + i) * 0.5);
    });

    renderer.render(scene, cam);
  })();

  /* ── RESIZE ──────────────────────────────────────── */
  new ResizeObserver(() => {
    W = wrap.clientWidth; H = wrap.clientHeight;
    cam.aspect = W / H; cam.updateProjectionMatrix();
    renderer.setSize(W, H);
  }).observe(wrap);

  /* ── EXPOSE API ──────────────────────────────────── */
  window.nd3d = { OUTFITS, applyOutfit, outfitIdx: () => outfitIdx, nextOutfit: () => { outfitIdx = (outfitIdx + 1) % OUTFITS.length; applyOutfit(outfitIdx); } };

})();
