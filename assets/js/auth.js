
(function () {
  'use strict';

  var form = document.getElementById('auForm');
  if (!form) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fields = [].slice.call(form.querySelectorAll('[data-rule]'));
  var submitBtn = document.getElementById('auSubmit');
  var btnText = submitBtn.querySelector('.au-btn__txt');
  var idleLabel = btnText.textContent;
  var sendingLabel = form.getAttribute('data-page') === 'signup' ? 'Creating account…' : 'Logging in…';
  var successUrl = form.getAttribute('data-success') || 'index.html';
  var sending = false;

  var rules = {
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email, like name@example.com.';
    },
    // signup: create a password
    newPassword: function (v) {
      if (!v) return 'Please create a password.';
      if (v.length < 8) return 'Use at least 8 characters.';
      return /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Include at least one letter and one number.';
    },
    // login: enter the password
    password: function (v) {
      if (!v) return 'Please enter your password.';
      return v.length >= 8 ? '' : 'Your password must be at least 8 characters.';
    },
    confirm: function (v) {
      if (!v) return 'Please re-enter your password.';
      return v === form.elements.password.value ? '' : 'Passwords do not match.';
    },
    terms: function (v, field) {
      return field.checked ? '' : 'Please accept the Terms and conditions to continue.';
    }
  };

  function valueOf(field) {
    // passwords are never trimmed; everything else is
    return field.classList.contains('au-input--pw') ? field.value : field.value.trim();
  }

  function errorEl(field) {
    return document.getElementById(field.getAttribute('aria-describedby'));
  }

  function check(field) {
    var msg = rules[field.getAttribute('data-rule')](valueOf(field), field);
    var out = errorEl(field);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    out.textContent = msg;
    out.hidden = !msg;
    return !msg;
  }

  var pwButtons = [].slice.call(form.querySelectorAll('.au-pw__btn'));

  function setVisible(btn, show) {
    var input = btn.parentNode.querySelector('.au-input--pw');
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    btn.firstElementChild.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  }

  pwButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setVisible(btn, btn.getAttribute('aria-pressed') !== 'true');
    });
  });

  function clearAll() {
    form.reset();
    pwButtons.forEach(function (b) { setVisible(b, false); });
    fields.forEach(function (f) {
      f.removeAttribute('aria-invalid');
      var out = errorEl(f);
      out.textContent = '';
      out.hidden = true;
    });
  }

  function setIdle() {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-loading');
    btnText.textContent = idleLabel;
  }

  function shake() {
    if (reduceMotion) return;
    form.classList.remove('is-shake');
    void form.offsetWidth; // restart the animation
    form.classList.add('is-shake');
  }
  form.addEventListener('animationend', function (e) {
    if (e.animationName === 'au-shake') form.classList.remove('is-shake');
  });

  fields.forEach(function (field) {
    var isCheck = field.type === 'checkbox';

    // validate on leaving a field, but only once something was typed
    field.addEventListener('blur', function () {
      if (!isCheck && field.value !== '') check(field);
    });

    field.addEventListener(isCheck ? 'change' : 'input', function () {
      if (field.getAttribute('aria-invalid') === 'true') check(field);
      if (field === form.elements.password && form.elements.confirm && form.elements.confirm.value !== '') {
        check(form.elements.confirm);
      }
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
      shake();
      firstBad.focus();
      return;
    }

    sending = true;
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    btnText.textContent = sendingLabel;

    
    var email = form.elements.email.value.trim();
    var role = form.elements.role ? form.elements.role.value : 'customer';
    var remember = form.elements.remember && form.elements.remember.checked;
    var target = form.getAttribute('data-success-' + role) || successUrl;

    setTimeout(function () {
      if (form.getAttribute('data-page') === 'login') {
        // The dashboards read this key to show the signed-in email.
        try { window.sessionStorage.setItem('cfUserEmail', email); } catch (err) { }
        try {
          if (remember) window.localStorage.setItem('cfUserEmail', email);
          else window.localStorage.removeItem('cfUserEmail');
        } catch (err) { }
      }
      clearAll();
      window.location.href = target;
    }, 900);
  });


  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { clearAll(); setIdle(); }
  });
})();