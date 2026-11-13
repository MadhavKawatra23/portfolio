
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  document.querySelectorAll('a[href="#"][data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
    a.setAttribute('title', 'Add your ' + a.dataset.placeholder + ' URL in index.html');
  });


  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = Array.prototype.map.call(navLinks, function (l) {
    return document.getElementById(l.dataset.nav);
  });

  function setActive() {
    var offset = window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (s) {
      if (s && s.getBoundingClientRect().top <= offset) current = s.id;
    });
    navLinks.forEach(function (l) {
      var on = l.dataset.nav === current;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  var revealEls = document.querySelectorAll('.section-head, .journey-grid article, .project, .photo, .about-text, .about-figure');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lb-img');
  var boxCap = document.getElementById('lb-cap');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.photo-btn'));
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + buttons.length) % buttons.length;
    var b = buttons[index];
    boxImg.src = b.dataset.full;
    boxImg.alt = b.querySelector('img').alt;
    boxCap.textContent = b.dataset.caption || '';
  }
  function open(i) {
    opener = buttons[i];
    show(i);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }

  buttons.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'FIGURE') close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'Tab') { 
      var f = box.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
