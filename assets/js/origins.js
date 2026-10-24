
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  var addButtons = [].slice.call(document.querySelectorAll('.or-add'));
  var savedOut = document.getElementById('orSaved');

  function renderSaved() {
    if (!savedOut) return;
    var count = addButtons.filter(function (b) { return b.classList.contains('is-added'); }).length;
    savedOut.textContent = count;
    if (reduceMotion) return;
    savedOut.classList.add('is-bump');
    setTimeout(function () { savedOut.classList.remove('is-bump'); }, 320);
  }

  addButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = !btn.classList.contains('is-added');
      btn.classList.toggle('is-added', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + btn.getAttribute('data-name') + (on ? ' from' : ' to') + ' your order');
      renderSaved();
    });
  });

  
  var belt = document.getElementById('orBelt');
  if (belt) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      belt.classList.add('is-in');
    } else {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          belt.classList.add('is-in');
          seen.unobserve(belt);
        });
      }, { threshold: 0.2 });
      seen.observe(belt);
    }
  }
})();