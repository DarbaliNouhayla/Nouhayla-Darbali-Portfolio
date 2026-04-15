/* animations.js — scroll-triggered reveals + navbar scroll state */

(function () {

  /* ── NAVBAR SCROLL STATE ────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── INTERSECTION OBSERVER — fade-up on scroll ─── */
  const fadeTargets = [
    '.proj-card',
    '.stat',
    '.about-bio p',
    '.stack-item',
    '.interest',
    '.currently-reading',
    '.contact-inner',
  ];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  /* stagger items within each group */
  fadeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transitionDelay = (i * 0.07) + 's';
      observer.observe(el);
    });
  });

  /* ── SECTION TITLE REVEAL ───────────────────────── */
  document.querySelectorAll('.section-title, .section-tag').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(14px)';
    const titleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    titleObserver.observe(el);
  });

})();
