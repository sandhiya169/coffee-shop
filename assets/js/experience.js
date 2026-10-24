
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function relayout() {
    if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
    if (window.cfLenis && typeof window.cfLenis.resize === 'function') window.cfLenis.resize();
  }

  var live = document.createElement('p');
  live.className = 'ex-sr';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  live.style.cssText = 'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
  document.body.appendChild(live);

  var savedOut = document.getElementById('exSaved');
  if (savedOut) savedOut.textContent = '0';

  var layers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (layers.length && !reduceMotion) {
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var host = el.parentNode.getBoundingClientRect();
        if (host.bottom < -100 || host.top > vh + 100) return;
        var strength = parseFloat(el.getAttribute('data-parallax')) || 0;
        var progress = (host.top + host.height / 2 - vh / 2); // px from viewport centre
        var y = +(progress * strength).toFixed(1);
        if (window.gsap) window.gsap.set(el, { y: y }); 
        else el.style.transform = 'translate3d(0,' + y + 'px,0)';
      });
    }

    function request() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  var day = document.querySelector('.ex-day');
  if (day) {
    var stops = [].slice.call(day.querySelectorAll('[role="tab"]'));
    var slides = [].slice.call(day.querySelectorAll('.ex-day__slide'));
    var phases = ['morning', 'afternoon', 'evening'];
    var AUTOPLAY = true; 
    var cur = 0, timer = null, stopped = reduceMotion || !AUTOPLAY, inView = false, hovering = false;

    function showPhase(i, focusTab) {
      cur = (i + stops.length) % stops.length;
      day.setAttribute('data-phase', phases[cur]);
      stops.forEach(function (t, k) {
        var on = k === cur;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        slides[k].classList.toggle('is-on', on);
      });
      if (focusTab) stops[cur].focus();
    }

    function tick() { showPhase(cur + 1); }
    function syncTimer() {
      clearInterval(timer);
      if (!stopped && inView && !hovering) timer = setInterval(tick, 4200);
    }

    stops.forEach(function (t, k) {
      t.addEventListener('click', function () { stopped = true; showPhase(k); syncTimer(); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = cur + 1;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = cur - 1;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = stops.length - 1;
        if (n === null) return;
        e.preventDefault();
        stopped = true;
        showPhase(n, true);
        syncTimer();
      });
    });

    var stage = day.querySelector('.ex-day__stage');
    stage.addEventListener('mouseenter', function () { hovering = true; syncTimer(); });
    stage.addEventListener('mouseleave', function () { hovering = false; syncTimer(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        syncTimer();
      }, { threshold: 0.35 }).observe(day);
    }
  }

  var pans = [].slice.call(document.querySelectorAll('.ex-pan'));
  if (pans.length) {
    var canHover = window.matchMedia('(hover: hover) and (min-width: 901px)');

    function openPan(pan) {
      pans.forEach(function (p) {
        var on = p === pan;
        p.classList.toggle('is-open', on);
        p.querySelector('.ex-pan__btn').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      window.setTimeout(relayout, 850);
    }

    pans.forEach(function (pan) {
      var btn = pan.querySelector('.ex-pan__btn');
      btn.addEventListener('click', function () { if (!pan.classList.contains('is-open')) openPan(pan); });
      pan.addEventListener('mouseenter', function () {
        if (canHover.matches && !pan.classList.contains('is-open')) openPan(pan);
      });
    });
  }

 
  var quoteSec = document.getElementById('exTestimonials');
  if (quoteSec) {
    var qSlides = [].slice.call(quoteSec.querySelectorAll('.ex-quote__slide'));
    var qDots   = [].slice.call(quoteSec.querySelectorAll('.ex-quote__dot'));
    var qPrev   = document.getElementById('exQuotePrev');
    var qNext   = document.getElementById('exQuoteNext');
    var qCurrent = 0;
    var qTimer = null;
    var qInView = false;
    var qHovering = false;
    var qInterval = 4600; 

    function showQuoteSlide(index) {
      if (!qSlides.length) return;
      qCurrent = (index + qSlides.length) % qSlides.length;

      qSlides.forEach(function (slide, idx) {
        var isActive = idx === qCurrent;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      qDots.forEach(function (dot, idx) {
        var isActive = idx === qCurrent;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        dot.tabIndex = isActive ? 0 : -1;
      });

      relayout();
    }

    function nextQuote() {
      showQuoteSlide(qCurrent + 1);
    }

    function prevQuote() {
      showQuoteSlide(qCurrent - 1);
    }

    function stopTimer() {
      if (qTimer) {
        clearInterval(qTimer);
        qTimer = null;
      }
    }

    function startTimer() {
      stopTimer();
      if (!reduceMotion && qInView && !qHovering) {
        qTimer = setInterval(nextQuote, qInterval);
      }
    }

    if (qNext) {
      qNext.addEventListener('click', function () {
        nextQuote();
        startTimer();
      });
    }

    if (qPrev) {
      qPrev.addEventListener('click', function () {
        prevQuote();
        startTimer();
      });
    }

    qDots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showQuoteSlide(idx);
        startTimer();
      });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          showQuoteSlide(qCurrent + 1);
          if (qDots[qCurrent]) qDots[qCurrent].focus();
          startTimer();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showQuoteSlide(qCurrent - 1);
          if (qDots[qCurrent]) qDots[qCurrent].focus();
          startTimer();
        }
      });
    });

    quoteSec.addEventListener('mouseenter', function () {
      qHovering = true;
      stopTimer();
    });

    quoteSec.addEventListener('mouseleave', function () {
      qHovering = false;
      startTimer();
    });

    quoteSec.addEventListener('focusin', function () {
      qHovering = true;
      stopTimer();
    });

    quoteSec.addEventListener('focusout', function () {
      qHovering = false;
      startTimer();
    });

    var touchStartX = 0;
    var touchStartY = 0;
    quoteSec.addEventListener('touchstart', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }
    }, { passive: true });

    quoteSec.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        var diffX = e.changedTouches[0].clientX - touchStartX;
        var diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 42 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            nextQuote();
          } else {
            prevQuote();
          }
          startTimer();
        }
      }
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        qInView = entries[0].isIntersecting;
        startTimer();
      }, { threshold: 0.25 }).observe(quoteSec);
    } else {
      qInView = true;
      startTimer();
    }
  }

  window.addEventListener('load', relayout);
  window.addEventListener('resize', (function () {
    var t;
    return function () { clearTimeout(t); t = setTimeout(relayout, 200); };
  })());
})();