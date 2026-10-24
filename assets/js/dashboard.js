(function () {
  'use strict';

  var EMAIL_KEY = 'cfUserEmail';
  var FALLBACK = 'guest@stackly.com';

  function isEmail(v) {
    return typeof v === 'string' && v.length <= 120 && /^[^\s@]{1,64}@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function readEmail() {
    var found = null;
    try {
      var q = new URLSearchParams(window.location.search).get('email');
      if (isEmail(q && q.trim())) {
        found = q.trim();
        try { window.sessionStorage.setItem(EMAIL_KEY, found); } catch (e) { }
      }
    } catch (e) { }
    if (!found) {
      [window.sessionStorage, window.localStorage].forEach(function (store) {
        if (found) return;
        try {
          var v = store.getItem(EMAIL_KEY);
          if (isEmail(v)) found = v;
        } catch (e) { }
      });
    }
    return found;
  }

  function nameFrom(email) {
    var part = email.split('@')[0].split(/[._+\-]/)[0].replace(/[0-9]+/g, '');
    return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : 'there';
  }

  var email = readEmail() || FALLBACK;
  var isGuest = email === FALLBACK;

  [].forEach.call(document.querySelectorAll('[data-db-email]'), function (el) { el.textContent = email; });
  [].forEach.call(document.querySelectorAll('[data-db-initial]'), function (el) { el.textContent = email.charAt(0).toUpperCase(); });
  [].forEach.call(document.querySelectorAll('[data-db-name]'), function (el) { el.textContent = isGuest ? 'there' : nameFrom(email); });
  [].forEach.call(document.querySelectorAll('.db-user'), function (el) {
    el.setAttribute('title', email);
    el.setAttribute('aria-label', 'Signed in as ' + email);
  });

  [].forEach.call(document.querySelectorAll('[data-db-logout]'), function (a) {
    a.addEventListener('click', function () {
      [window.sessionStorage, window.localStorage].forEach(function (store) {
        try { store.removeItem(EMAIL_KEY); } catch (e) { }
      });
    });
  });

  var side = document.getElementById('dbSide');
  var panels = [].slice.call(document.querySelectorAll('.db-panel'));
  if (!side || !panels.length) return;

  var burger = document.getElementById('dbBurger');
  var scrim = document.getElementById('dbScrim');
  var titleEl = document.getElementById('dbTitle');
  var links = [].slice.call(document.querySelectorAll('.db-nav a[data-panel]'));
  var baseTitle = document.title.split(' | ').slice(-1)[0];
  var mobile = window.matchMedia('(max-width: 960px)');

  function setDrawer(open) {
    side.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('cf-lock', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (open && links[0]) {
      var cur = side.querySelector('.db-nav a.is-active') || links[0];
      cur.focus({ preventScroll: true });
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); burger && burger.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && side.classList.contains('is-open')) { setDrawer(false); burger && burger.focus(); }
  });
  window.addEventListener('resize', function () { if (!mobile.matches) setDrawer(false); });

  function show(id) {
    var target = panels.filter(function (p) { return p.id === id; })[0] || panels[0];
    panels.forEach(function (p) { p.classList.toggle('is-on', p === target); });
    var label = '';
    links.forEach(function (a) {
      var on = a.getAttribute('data-panel') === target.id;
      a.classList.toggle('is-active', on);
      if (on) { a.setAttribute('aria-current', 'page'); label = a.getAttribute('data-title') || a.textContent.trim(); }
      else a.removeAttribute('aria-current');
    });
    if (titleEl) titleEl.textContent = label;
    document.title = label + ' | ' + baseTitle;
    window.scrollTo(0, 0);
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = a.getAttribute('data-panel');
      show(id);
      if (mobile.matches) setDrawer(false);
    });
  });

  show(panels[0] ? panels[0].id : '');
})();
