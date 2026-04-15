/* cursor.js — custom cursor + hover interactions */

(function () {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  /* ring follows with lag */
  (function lp() {
    requestAnimationFrame(lp);
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  })();

  /* hover states */
  const interactables = 'a, button, .proj-card, .stack-item, .contact-btn, .nav-cta';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.transform  = 'translate(-50%, -50%) scale(2.5)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
      ring.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.transform  = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.opacity   = '0.6';
    });
  });

  /* expose for easter-egg rave mode */
  window.ndCursor = { cur, ring };
})();
