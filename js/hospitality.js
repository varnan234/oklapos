/* OKLA-POS — hospitality demo, payments receipt, install timeline */
(() => {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Table map + kitchen display ---------------- */
  (() => {
    const root = document.querySelector('[data-hosp-demo]');
    if (!root) return;

    const STATES = [
      { key: 'open', word: 'Open', short: 'Open' },
      { key: 'seated', word: 'Seated', short: 'Seated' },
      { key: 'ordered', word: 'Ordered', short: 'Ordered' },
      { key: 'check', word: 'Check printed', short: 'Check' }
    ];
    const STATIONS = ['GRILL', 'FRY', 'BAR'];
    const it = (s, q, n, m, a) => ({ s, q, n, m: m || [], a });
    const ORDERS = [
      [it('GRILL', 1, 'Chicken fried steak', ['+ white gravy', '- no onion'], 'ALLERGY: nuts'), it('FRY', 1, 'Fried okra', ['+ extra crispy']), it('BAR', 2, 'Sweet tea', ['- no ice'])],
      [it('GRILL', 1, 'Ribeye 12oz', ['Med rare', '+ side of peppers']), it('GRILL', 1, 'Cheeseburger', ['- no onion', '+ pepper jack']), it('BAR', 1, 'Old fashioned', ['+ on the rocks'])],
      [it('FRY', 1, 'Catfish basket', ['+ tartar', '- no slaw']), it('GRILL', 1, 'Grilled chicken', ['+ BBQ glaze']), it('BAR', 2, 'Lemonade')],
      [it('GRILL', 2, 'Breakfast skillet', ['Eggs over easy', '- no jalapeno'], 'ALLERGY: dairy'), it('BAR', 2, 'Coffee', ['+ cream on side'])],
      [it('FRY', 1, 'Chicken tenders', ['+ honey mustard']), it('FRY', 1, 'Onion rings'), it('BAR', 1, 'Draft beer', ['+ frosted mug'])],
      [it('GRILL', 1, 'Patty melt', ['+ rye', '- no pickle']), it('FRY', 1, 'Fries', ['+ well done']), it('BAR', 1, 'Draft beer')]
    ];
    const INIT = { BAR1: [1, 65], T2: [1, 34], T3: [2, 12], T5: [2, 207], B1: [3, 9], B3: [1, 52] };
    const TPL_START = { T3: 0, T5: 1 };

    const log = root.querySelector('[data-hosp-log]');
    const rails = {};
    STATIONS.forEach(s => { rails[s] = root.querySelector('[data-rail="' + s + '"]'); });
    let orderNo = 1040;

    const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

    const tables = Array.from(root.querySelectorAll('.hosp-tbl')).map((el, i) => {
      const id = el.dataset.table;
      return {
        id, el, label: el.dataset.label, desc: el.dataset.desc,
        nEl: el.querySelector('.hosp-tbl__n'),
        sEl: el.querySelector('.hosp-tbl__s'),
        tEl: el.querySelector('.hosp-tbl__t'),
        st: 0, sec: 0, tickets: [],
        tpl: TPL_START[id] !== undefined ? TPL_START[id] : (i + 2) % ORDERS.length
      };
    });

    function render(t, pop) {
      const s = STATES[t.st];
      t.el.dataset.status = s.key;
      t.sEl.textContent = s.short;
      t.tEl.textContent = fmt(t.sec);
      const next = STATES[(t.st + 1) % STATES.length].word;
      t.el.setAttribute('aria-label', 'Table ' + t.label + ', ' + t.desc + '. Status: ' + s.word + '. Activate to change to ' + next + '.');
      if (pop && !reduce) {
        t.el.classList.remove('is-pop'); void t.el.offsetWidth; t.el.classList.add('is-pop');
      }
    }

    function buildTicket(t, station, items, no, fresh) {
      const el = document.createElement('div');
      el.className = 'hosp-tkt ticket ticket--torn' + (fresh && !reduce ? ' is-new' : '');
      const add = (parent, tag, cls, text) => {
        const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; parent.appendChild(n); return n;
      };
      const hd = add(el, 'div', 'hosp-tkt__hd mono');
      add(hd, 'b', '', '#' + no);
      add(hd, 'span', '', t.label.toUpperCase());
      const meta = add(el, 'div', 'hosp-tkt__meta');
      meta.append(station + ' · ');
      add(meta, 'span', '', fmt(t.sec)).setAttribute('data-age', '');
      add(el, 'hr', 'tear');
      const ul = add(el, 'ul');
      items.forEach(i => {
        const li = add(ul, 'li', 'hosp-tkt__item', i.q + ' ' + i.n);
        if (i.m.length) {
          const mu = add(li, 'ul');
          i.m.forEach(m => add(mu, 'li', '', m));
        }
        if (i.a) add(ul, 'li', 'hosp-tkt__alert', '** ' + i.a);
      });
      return el;
    }

    function fire(t, fresh) {
      const items = ORDERS[t.tpl % ORDERS.length];
      t.tpl++;
      const by = {};
      items.forEach(i => { (by[i.s] = by[i.s] || []).push(i); });
      const no = ++orderNo;
      const sent = [];
      STATIONS.forEach(s => {
        if (!by[s]) return;
        const el = buildTicket(t, s, by[s], no, fresh);
        rails[s].insertBefore(el, rails[s].firstChild);
        rails[s].scrollLeft = 0;
        t.tickets.push(el);
        sent.push(s);
      });
      return { no, sent };
    }

    function bump(t) {
      t.tickets.forEach(el => {
        if (reduce) { el.remove(); return; }
        el.classList.remove('is-new'); el.classList.add('is-out');
        setTimeout(() => el.remove(), 300);
      });
      t.tickets = [];
    }

    function advance(t) {
      const prev = t.st;
      t.st = (t.st + 1) % STATES.length;
      t.sec = 0;
      let msg = t.label.toUpperCase() + ' → ' + STATES[t.st].word.toUpperCase();
      if (prev === 2) bump(t);
      if (t.st === 2) {
        const r = fire(t, true);
        msg += ' · #' + r.no + ' sent to ' + r.sent.join(', ');
      } else if (t.st === 3) {
        msg += ' · tickets bumped';
      }
      if (log) log.textContent = msg;
      render(t, true);
    }

    // initial state
    tables.forEach(t => {
      const init = INIT[t.id];
      if (init) {
        t.st = init[0]; t.sec = init[1];
        if (t.st === 2) fire(t, false);
      }
      render(t, false);
    });
    if (log) log.textContent = 'T3 and T5 are already on the rail. Tap a table to send another.';

    tables.forEach(t => t.el.addEventListener('click', () => advance(t)));

    // timers: only tick while the demo is on screen and tab is visible
    let visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(root);
    }
    setInterval(() => {
      if (!visible || document.hidden) return;
      tables.forEach(t => {
        if (t.st === 0) return;
        t.sec++;
        t.tEl.textContent = fmt(t.sec);
        if (t.st === 2) t.tickets.forEach(el => { const a = el.querySelector('[data-age]'); if (a) a.textContent = fmt(t.sec); });
      });
    }, 1000);
  })();

  /* ---------------- Payments receipt ---------------- */
  (() => {
    const vis = document.querySelector('[data-pay]');
    if (!vis) return;
    const slip = vis.querySelector('.pay-slip');
    const amtEl = vis.querySelector('[data-pay-amt]');
    const timeEl = vis.querySelector('[data-pay-time]');
    const btn = vis.querySelector('[data-pay-again]');
    const SALES = [['$24.50', '12:41 PM'], ['$8.75', '12:43 PM'], ['$63.20', '12:47 PM']];
    let n = 0;

    function print() {
      if (reduce) return;
      vis.classList.add('is-armed');
      vis.classList.remove('is-printing');
      void slip.offsetWidth;
      vis.classList.add('is-printing');
    }
    if (!reduce) vis.classList.add('is-armed');
    let done = false;
    if ('IntersectionObserver' in window && !reduce) {
      const io = new IntersectionObserver(es => {
        if (es[0].isIntersecting && !done) { done = true; print(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(vis);
    } else {
      vis.classList.remove('is-armed');
    }
    btn.addEventListener('click', () => {
      n = (n + 1) % SALES.length;
      amtEl.textContent = SALES[n][0];
      timeEl.textContent = SALES[n][1];
      slip.setAttribute('aria-label', 'Sample card terminal receipt. Sale approved, ' + SALES[n][0].replace('$', '') + ' dollars.');
      done = true;
      print();
    });
  })();

  /* ---------------- Install timeline progress ---------------- */
  (() => {
    const track = document.querySelector('[data-inst-track]');
    if (!track) return;
    const steps = Array.from(track.querySelectorAll('.inst-step'));
    const n = steps.length;
    const set = p => {
      track.style.setProperty('--p', p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle('is-lit', p > (i / n) * 0.92 + 0.001));
    };
    if (reduce || !('IntersectionObserver' in window)) { set(1); return; }
    let active = false, ticking = false;
    const update = () => {
      ticking = false;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.72 - r.top) / (r.height + vh * 0.2);
      set(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => { if (active && !ticking) { ticking = true; requestAnimationFrame(update); } };
    new IntersectionObserver(es => { active = es[0].isIntersecting; if (active) onScroll(); }, { rootMargin: '0px 0px 20% 0px' }).observe(track);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  })();
})();
