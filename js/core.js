// Shared: reveal-on-scroll + no-js flag removal.
document.documentElement.classList.remove('no-js');
(() => {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(e => io.observe(e));
})();
