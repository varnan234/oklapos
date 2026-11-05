(() => {
  /* Map: draw outline when scrolled into view */
  const map = document.querySelector('.area-map');
  if (map) {
    const go = () => map.classList.add('is-drawn');
    if (!('IntersectionObserver' in window)) go();
    else {
      const io = new IntersectionObserver((es) => { if (es.some(e => e.isIntersecting)) { go(); io.disconnect(); } }, { threshold: 0.3 });
      io.observe(map);
    }
  }

  /* Contact form (demo: no backend) */
  const form = document.getElementById('ct-form');
  if (!form) return;
  const wrap = document.getElementById('ct-formwrap');
  const done = document.getElementById('ct-done');
  const summary = document.getElementById('ct-summary');
  const rules = {
    'ct-name':  [v => v.trim().length > 1, 'Tell us your name.'],
    'ct-biz':   [v => v.trim().length > 1, 'What is the business called?'],
    'ct-phone': [v => v.replace(/\D/g, '').length >= 10, 'Enter a phone number with area code.'],
    'ct-email': [v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), 'Enter a valid email address.'],
    'ct-type':  [v => v !== '', 'Pick a business type.'],
    'ct-town':  [v => v.trim().length > 1, 'Which town are you in?']
  };
  const setErr = (id, msg) => {
    const el = document.getElementById(id), err = document.getElementById(id + '-err');
    if (msg) { err.textContent = msg; err.hidden = false; el.setAttribute('aria-invalid', 'true'); }
    else { err.hidden = true; err.textContent = ''; el.removeAttribute('aria-invalid'); }
  };
  const check = id => { const [ok, msg] = rules[id]; const good = ok(document.getElementById(id).value); setErr(id, good ? '' : msg); return good; };
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => { if (el.value !== '' || el.hasAttribute('aria-invalid')) check(id); });
    el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) check(id); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(rules).filter(id => !check(id));
    if (bad.length) {
      summary.textContent = bad.length === 1 ? 'One field needs another look.' : bad.length + ' fields need another look.';
      summary.hidden = false;
      document.getElementById(bad[0]).focus();
      return;
    }
    summary.hidden = true;
    const val = id => document.getElementById(id).value.trim();
    const interest = [...form.querySelectorAll('input[name=interest]:checked')].map(c => c.value).join(', ') || 'Not specified';
    const rows = [['Business', val('ct-biz')], ['Type', val('ct-type')], ['Town', val('ct-town')], ['Phone', val('ct-phone')], ['Email', val('ct-email')], ['Interested in', interest]];
    const list = document.getElementById('ct-done-list');
    list.textContent = '';
    rows.forEach(([k, v]) => {
      const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = k; dd.textContent = v; d.append(dt, dd); list.append(d);
    });
    document.getElementById('ct-done-name').textContent = val('ct-name').split(/\s+/)[0];
    // TODO: send FormData(form) to a real endpoint here (fetch POST) before launch.
    wrap.hidden = true; done.hidden = false; done.focus();
    done.scrollIntoView({ block: 'nearest' });
  });

  document.getElementById('ct-again').addEventListener('click', () => {
    form.reset(); Object.keys(rules).forEach(id => setErr(id, ''));
    done.hidden = true; wrap.hidden = false; document.getElementById('ct-name').focus();
  });
})();
