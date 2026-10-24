(function () {
  'use strict';

  [].forEach.call(document.querySelectorAll('[data-back]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else if (document.referrer && document.referrer !== window.location.href) {
        window.location.href = document.referrer;
      } else {
        window.location.href = 'index.html';
      }
    });
  });

  
  
  var animated = [].slice.call(document.querySelectorAll('[data-aos]'));
  if (typeof window.AOS === 'undefined') {
    animated.forEach(function (el) {
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-delay');
      el.removeAttribute('data-aos-duration');
    });
  } else {
    window.AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 0,
      disable: function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    });
  }
})();