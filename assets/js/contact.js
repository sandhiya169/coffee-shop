
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function relayout() {
    if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
    if (window.cfLenis && typeof window.cfLenis.resize === 'function') window.cfLenis.resize();
  }

  /* ---------- Contact form ---------- */
  var REDIRECT_URL = '404.html'; 
  var form = document.getElementById('ctContactForm');

  if (form) {
    var fields = [].slice.call(form.querySelectorAll('[data-rule]'));
    var submitBtn = document.getElementById('ctSubmit');
    var btnText = submitBtn.querySelector('.ct-btn__txt');
    var btnIcon = submitBtn.querySelector('.cf-btn__icon i');
    var alertBox = document.getElementById('ctAlert');
    var counter = document.getElementById('ctMsgCount');
    var sending = false;

    var rules = {
      name: function (v) {
        if (!v) return 'Please enter your name.';
        if (v.length < 2) return 'Your name must be at least 2 characters.';
        if (/[\d@#$%^&*()_+=<>{}\[\]\\\/|~`!?;:",]/.test(v)) return 'Your name can only contain letters and spaces.';
        return '';
      },
      email: function (v) {
        if (!v) return 'Please enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email, like name@example.com.';
      },
      phone: function (v) {
        if (!v) return 'Please enter your phone number.';
        if (!/^[+()\d\s.-]+$/.test(v)) return 'Use digits only (spaces, +, - and brackets are fine).';
        var digits = v.replace(/\D/g, '').length;
        return digits >= 10 && digits <= 15 ? '' : 'Please enter a valid phone number (10 to 15 digits).';
      },
      message: function (v) {
        if (!v) return 'Please tell us a little about what you have in mind.';
        if (v.length < 10) return 'Please add a few more details (at least 10 characters).';
        return v.length <= 500 ? '' : 'Please keep your message to 500 characters or fewer.';
      }
    };

    function boxOf(field) { return field.closest('.ct-field'); }
    function errorEl(field) { return document.getElementById(field.getAttribute('aria-describedby')); }
    function ruleOf(field) { return rules[field.getAttribute('data-rule')]; }

    function check(field) {
      var value = field.value.trim();
      var msg = ruleOf(field)(value);
      var out = errorEl(field);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      out.textContent = msg;
      out.hidden = !msg;
      boxOf(field).classList.toggle('is-valid', !msg && !!value);
      return !msg;
    }

    function allValid() {
      return fields.every(function (f) { return !ruleOf(f)(f.value.trim()); });
    }

    function updateCount() {
      if (!counter) return;
      var msgField = form.elements.message;
      var len = msgField.value.length, max = msgField.maxLength;
      counter.textContent = len + ' / ' + max;
      counter.classList.toggle('is-near', len >= max * 0.9);
    }

    function resetFields() {
      form.reset();
      fields.forEach(function (f) {
        f.removeAttribute('aria-invalid');
        var out = errorEl(f);
        out.textContent = '';
        out.hidden = true;
        boxOf(f).classList.remove('is-valid');
      });
      alertBox.hidden = true;
      updateCount();
    }

    function resetButton() {
      sending = false;
      submitBtn.disabled = false;
      btnText.textContent = 'Send message';
      if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { check(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true' || boxOf(field).classList.contains('is-valid')) check(field);
        if (field === form.elements.message) updateCount();
        if (!alertBox.hidden && allValid()) alertBox.hidden = true;
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

      var firstBad = null;
      fields.forEach(function (field) {
        if (!check(field) && !firstBad) firstBad = field;
      });
      if (firstBad) {
        alertBox.hidden = false;
        firstBad.focus();
        relayout();
        return;
      }

      alertBox.hidden = true;
      sending = true;
      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';
      if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';

      setTimeout(function () {
        resetFields();
        window.location.href = REDIRECT_URL;
      }, 900);
    });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { resetFields(); resetButton(); }
    });

    updateCount();
  }

  /* ---------- Scroll-driven motion (hero cup parallax, wreath turn) ---------- */
  var hero = document.querySelector('.ct-hero__float');
  var wreath = document.querySelector('.ct-wreath');

  if (!reduceMotion && (hero || wreath)) {
    var queued = false;

    function update() {
      queued = false;
      var vh = window.innerHeight;

      if (hero) {
        var y = Math.min(window.scrollY, vh * 1.2);
        hero.style.setProperty('--ct-par', (-y * 0.08).toFixed(1));
      }

      if (wreath) {
        var r = wreath.getBoundingClientRect();
        if (r.bottom > -80 && r.top < vh + 80) {
          var p = (vh * 0.5 - r.top) / (r.height + vh * 0.5); 
          p = Math.max(0, Math.min(1, p));
          wreath.style.setProperty('--ct-rot', ((p - 0.5) * 24).toFixed(1));
        }
      }
    }

    function queue() {
      if (!queued) { queued = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }
})();


(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function relayout() {
    if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
    if (window.cfLenis && typeof window.cfLenis.resize === 'function') window.cfLenis.resize();
  }

  
  var brew = document.getElementById('ctBrew');
  var steps = brew ? [].slice.call(brew.querySelectorAll('.ct-step')) : [];

  if (steps.length && !reduceMotion) {
    var stacked = window.matchMedia('(max-width: 820px)');
    var queued = false;
    brew.classList.add('is-live');

    var paint = function () {
      queued = false;
      var vh = window.innerHeight, lit = 0;

      if (stacked.matches) {
        steps.forEach(function (s, i) {
          if (s.getBoundingClientRect().top < vh * 0.7) lit = i + 1;
        });
      } else {
        var top = steps[0].parentNode.getBoundingClientRect().top;
        lit = Math.max(0, Math.min(steps.length, Math.ceil((vh * 0.75 - top) / (vh * 0.5) * steps.length)));
      }

      steps.forEach(function (s, i) {
        s.classList.toggle('is-lit', i < lit);
        s.classList.toggle('is-pass', i < lit - 1);
      });
    };
    var queue = function () {
      if (!queued) { queued = true; window.requestAnimationFrame(paint); }
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    paint();
  }

  /* Quick answers: topic tabs plus one open question per topic */
  var faq = document.getElementById('ctFaq');
  var list = faq ? faq.querySelector('.ct-tabs') : null;
  var tabs = list ? [].slice.call(list.querySelectorAll('[role="tab"]')) : [];
  var groups = faq ? [].slice.call(faq.querySelectorAll('.ct-qgroup')) : [];

  if (tabs.length && tabs.length === groups.length) {
    faq.classList.add('is-live');
    list.hidden = false;

    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        groups[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      setTimeout(relayout, 60);
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, to = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to > -1) { e.preventDefault(); select(to, true); }
      });
    });
    select(0);
  }

  if (faq) {
    faq.addEventListener('toggle', function (e) {
      var d = e.target;
      if (d.open) {
        [].forEach.call(d.parentNode.querySelectorAll('details[open]'), function (o) { if (o !== d) o.open = false; });
      }
      setTimeout(relayout, 350);
    }, true);
  }
})();