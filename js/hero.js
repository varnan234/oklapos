/* OKLA-POS — header behavior + proof-strip count-up. */
(() => {
  const header = document.querySelector('[data-nav]');
  if (!header) return;
  const toggle = header.querySelector('.nav-toggle');
  const list = header.querySelector('.nav-list');
  const label = header.querySelector('.nav-toggle__label');
  const links = Array.from(list.querySelectorAll('a'));
  const desktop = window.matchMedia('(min-width: 1080px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let open = false;

  Array.from(list.children).forEach((li, i) => li.style.setProperty('--i', i));

  // sticky bottom rule after scrolling
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // keep closed mobile panel out of the tab order / a11y tree
  const sync = () => {
    const hidden = !desktop.matches && !open;
    if ('inert' in list) list.inert = hidden;
    if (hidden) list.setAttribute('aria-hidden', 'true'); else list.removeAttribute('aria-hidden');
  };

  const setOpen = (next, restoreFocus) => {
    open = next;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    sync();
    if (open) { const first = links[0]; if (first) first.focus({ preventScroll: true }); }
    else if (restoreFocus) toggle.focus();
  };

  toggle.setAttribute('aria-label', 'Open menu');
  sync();

  toggle.addEventListener('click', () => setOpen(!open, true));
  links.forEach(a => a.addEventListener('click', () => { if (open) setOpen(false, false); }));

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); return; }
    if (e.key === 'Tab') { // trap focus between toggle and panel links
      const items = [toggle, ...links];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && (i === items.length - 1 || i === -1)) { e.preventDefault(); items[0].focus(); }
    }
  });

  const onChange = () => { if (desktop.matches && open) setOpen(false, false); else sync(); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange); else desktop.addListener(onChange);

  // highlight current section link on desktop
  if ('IntersectionObserver' in window) {
    const map = new Map();
    links.forEach(a => {
      const id = (a.getAttribute('href') || '').replace('#', '');
      const el = id && document.getElementById(id);
      if (el) map.set(el, a);
    });
    if (map.size) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          const a = map.get(en.target);
          if (!a) return;
          if (en.isIntersecting) { links.forEach(l => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
          else if (a.getAttribute('aria-current')) a.removeAttribute('aria-current');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach((_, el) => io.observe(el));
    }
  }

  // proof strip: count up numbers once
  const nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window && !reduce.matches) {
    const run = (el) => {
      const to = parseInt(el.dataset.count, 10), dur = 1100, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { run(en.target); io2.unobserve(en.target); } });
    }, { threshold: 0.6 });
    nums.forEach(n => io2.observe(n));
  }
})();
