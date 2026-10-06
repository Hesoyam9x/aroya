/* ============================================================
   AROYA Cruises — «Новый год 2027» · interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reveal on scroll (staggered) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var byParent = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var n = byParent.get(p) || 0;
      el.style.transitionDelay = Math.min(n * 90, 450) + 'ms';
      byParent.set(p, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Count-up numbers ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1200, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- 3. Booking form ---------- */
  var form = document.getElementById('offerForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = document.getElementById('formOk');
      var name = form.querySelector('#name');
      var contact = form.querySelector('#contact');
      var valid = true;
      [name, contact].forEach(function (f) {
        if (!f.value.trim()) { f.style.borderColor = '#e0654f'; f.focus(); valid = false; }
        else { f.style.borderColor = ''; }
      });
      if (!valid) return;
      if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      form.reset();
    });
    ['input', 'change'].forEach(function (type) {
      form.addEventListener(type, function (e) {
        if (e.target.matches('input')) e.target.style.borderColor = '';
      });
    });
  }

  /* ---------- 4. Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
