(function () {
  'use strict';

  var burger = document.getElementById('cfBurger');
  var nav = document.getElementById('cfNav');
  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('cf-lock', open);
    };
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setNav(false); });
  }

  var header = document.querySelector('.cf-header');
  var links = [].slice.call(document.querySelectorAll('.cf-nav a[href^="#"]'));
  var spy = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 40);
    var y = window.scrollY + 140, cur = 0;
    spy.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menu = document.getElementById('cfMenu');
  var chips = [].slice.call(document.querySelectorAll('.cf-chip'));

  var layoutTimer;
  function refreshLayout() {
    if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
    if (window.cfLenis && typeof window.cfLenis.resize === 'function') window.cfLenis.resize();
  }
  function refreshAfterFilter() {
    refreshLayout();
    window.requestAnimationFrame(refreshLayout);
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(refreshLayout, 350);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
      menu.classList.toggle('is-filtered', f !== 'all');
      [].forEach.call(menu.children, function (item) {
        item.hidden = f !== 'all' && item.getAttribute('data-type') !== f;
      });
      refreshAfterFilter();
    });
  });

  var items = [].slice.call(document.querySelectorAll('.reveal'));
  var showAll = function () { items.forEach(function (el) { el.classList.add('in'); }); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 4000);
  } else {
    showAll();
  }

  var form = document.getElementById('cfForm');
  if (form) {
    var input  = form.querySelector('input[type="email"]');
    var errEl  = document.createElement('p');
    errEl.className = 'cf-form__err';
    errEl.setAttribute('aria-live', 'polite');
    errEl.setAttribute('role', 'alert');
    errEl.hidden = true;
    form.appendChild(errEl);

    function clearErr() {
      input.classList.remove('is-bad');
      errEl.hidden = true;
      errEl.textContent = '';
    }
    input.addEventListener('input', clearErr);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value.trim();

      if (!val) {
        input.classList.add('is-bad');
        errEl.textContent = 'Please enter your email address.';
        errEl.hidden = false;
        input.focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        input.classList.add('is-bad');
        errEl.textContent = 'Please enter a valid email address.';
        errEl.hidden = false;
        input.focus();
        return;
      }

      input.value = '';
      clearErr();
      window.location.href = '404.html';
    });
  }


  (function () {
    var testimonials = [
      {
        big: {
          quote: "I came in for a quick flat white and stayed an hour. It\u2019s the first caf\u00e9 where the coffee, the room and the people all feel considered.",
          name: "Meera", role: "Weekday regular", avatar: "assets/images/avatar-2.webp"
        },
        card1: {
          quote: "The Caramel Bloom Latte is dessert and breakfast at once. I\u2019ve stopped ordering anything else.",
          name: "James", role: "Weekend visitor", avatar: "assets/images/avatar-4.webp"
        },
        card2: {
          quote: "Bought a bag of beans on a whim. My kitchen smells incredible and it\u2019s the best pour-over I\u2019ve made at home.",
          name: "Priya", role: "Home brewer", avatar: "assets/images/avatar-3.webp"
        }
      },
      {
        big: {
          quote: "Every single visit feels like a treat. The staff know your order before you say it, and the coffee is genuinely extraordinary.",
          name: "Lena", role: "Daily regular", avatar: "assets/images/avatar-2.webp"
        },
        card1: {
          quote: "The Sage & Honey Flat White changed what I thought coffee could taste like. Nothing else comes close.",
          name: "Carlos", role: "Coffee enthusiast", avatar: "assets/images/avatar-4.webp"
        },
        card2: {
          quote: "I brought my whole team here for a morning meeting. Three people asked for the beans to take home.",
          name: "Sofia", role: "Team lead", avatar: "assets/images/avatar-3.webp"
        }
      },
      {
        big: {
          quote: "This is what a neighbourhood caf\u00e9 should be. Warm, unpretentious, and with coffee that actually makes you think.",
          name: "Marco", role: "Local regular", avatar: "assets/images/avatar-4.webp"
        },
        card1: {
          quote: "Tried the Honey Cardamom Cold Brew on a whim. Now I dream about it between visits.",
          name: "Aisha", role: "Cold brew convert", avatar: "assets/images/avatar-3.webp"
        },
        card2: {
          quote: "The space is beautiful, the music is right, and the coffee is even better. I do my best thinking here.",
          name: "Dan", role: "Remote worker", avatar: "assets/images/avatar-1.webp"
        }
      }
    ];

    var bigEl   = document.getElementById('cfQuoteBig');
    var card1El = document.getElementById('cfQuoteCard1');
    var card2El = document.getElementById('cfQuoteCard2');
    var dotsEl  = document.getElementById('cfKindDots');

    if (!bigEl || !card1El || !card2El) return;

    var current = 0;
    var dots = dotsEl ? [].slice.call(dotsEl.querySelectorAll('.cf-kind__dot')) : [];

    function setCard(el, data) {
      var bq   = el.querySelector('blockquote');
      var img  = el.querySelector('figcaption img');
      var span = el.querySelector('figcaption span');
      if (bq)  bq.textContent = data.quote;
      if (img) { img.src = data.avatar; img.alt = data.name; }
      if (span) {
        var b = span.querySelector('b');
        if (b) b.textContent = data.name;
        var nodes = span.childNodes;
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].nodeType === 3) { nodes[i].textContent = data.role; break; }
        }
      }
    }

    function updateDots(idx) {
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
    }

    function getInner(el) {
      return el.querySelectorAll('blockquote, figcaption, .cf-mark');
    }

    function fadeInner(el, cls, add) {
      var nodes = getInner(el);
      for (var i = 0; i < nodes.length; i++) {
        if (add) nodes[i].classList.add(cls);
        else nodes[i].classList.remove(cls);
      }
    }

    function rotate() {
      var next = (current + 1) % testimonials.length;
      var set  = testimonials[next];

      fadeInner(bigEl,   'cf-fade-out', true);
      fadeInner(card1El, 'cf-fade-out', true);
      fadeInner(card2El, 'cf-fade-out', true);

      setTimeout(function () {
        setCard(bigEl,   set.big);
        setCard(card1El, set.card1);
        setCard(card2El, set.card2);
        updateDots(next);

        fadeInner(bigEl,   'cf-fade-out', false);
        fadeInner(card1El, 'cf-fade-out', false);
        fadeInner(card2El, 'cf-fade-out', false);

        current = next;
      }, 460);
    }

    setInterval(rotate, 4000);
  }());

  (function () {
    var layout = document.querySelector('.cf-phil__layout');
    if (!layout) return;
    var wrapEl = layout.querySelector('.cf-phil__items');
    var art = layout.querySelector('.cf-phil__art');
    var pin = art;
    if (!wrapEl) return;

    function freePin() {
      for (var n = pin && pin.parentElement; n; n = n.parentElement) {
        var cs = window.getComputedStyle(n);
        if (/hidden|auto|scroll/.test(cs.overflowX + ' ' + cs.overflowY)) {
          n.style.overflowX = 'clip';
          n.style.overflowY = 'visible';
        }
      }
    }
    freePin();

    var rows = [].slice.call(wrapEl.querySelectorAll('.cf-pri'));
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var cur = 0, queued = false;

    function update() {
      queued = false;
      var vh = window.innerHeight, mid = vh * 0.5;
      var lb = layout.getBoundingClientRect();
      if (lb.bottom < -80 || lb.top > vh + 80) return;

      var best = 0, gap = Infinity;
      rows.forEach(function (r, i) {
        var b = r.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - mid);
        if (d < gap) { gap = d; best = i; }
      });
      if (best !== cur) {
        rows.forEach(function (r, i) { r.classList.toggle('is-current', i === best); });
        cur = best;
      }

      if (art && !still.matches) {
        var wb = wrapEl.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (mid - wb.top) / wb.height));
        art.style.setProperty('--rot', (p * 100).toFixed(1) + 'deg');
      }
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', freePin);
    update();
  }());

})();

(function () {
  var box = document.getElementById('cfHours');
  var badge = document.getElementById('cfStatus');
  if (!box) return;
  var rows = [].slice.call(box.children);
  function fmt(h) { var s = h >= 12 ? 'pm' : 'am'; return ((h + 11) % 12 + 1) + ':00 ' + s; }
  function run() {
    var now = new Date(), day = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
    var todayRow = null;
    rows.forEach(function (r) {
      var on = r.getAttribute('data-days').split(',').indexOf(String(day)) > -1;
      r.classList.toggle('is-today', on);
      if (on) todayRow = r;
    });
    if (!badge || !todayRow) return;
    var o = +todayRow.getAttribute('data-open'), c = +todayRow.getAttribute('data-close');
    var open = t >= o && t < c;
    badge.hidden = false;
    badge.classList.toggle('is-closed', !open);
    badge.querySelector('b').textContent = open ? 'Open now' : 'Closed now';
    badge.querySelector('span').textContent = open ? 'Closes ' + fmt(c) : (t < o ? 'Opens ' + fmt(o) + ' today' : 'Opens tomorrow');
  }
  run();
  setInterval(run, 60000);
})();

(function () {
  var el = document.getElementById('cfPreloader');
  var root = document.documentElement;
  if (!el) { root.classList.remove('cf-loading'); return; }

  var MIN = 1200, MAX = 2000, t0 = Date.now(), done = false;

  function hide() {
    if (done) return;
    done = true;
    root.classList.remove('cf-loading');
    el.classList.add('is-done');
    el.setAttribute('aria-hidden', 'true');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
  }

  function ready() {
    var wait = Math.max(0, MIN - (Date.now() - t0));
    setTimeout(hide, wait);
  }

  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready);

  setTimeout(hide, MAX);
})();

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && !reduceMotion) {
    var headerItems = document.querySelectorAll('.cf-header .cf-logo, .cf-header .cf-nav > a, .cf-header .cf-tools > *');
    if (headerItems.length) {
      window.gsap.from(headerItems, {
        y: -10,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.055,
        ease: 'power2.out',
        delay: 0.12,
        clearProps: 'transform,opacity,visibility'
      });
    }
  }

  if (window.Lenis && !reduceMotion) {
    var lenis = new window.Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true,
      autoRaf: true
    });
    window.cfLenis = lenis;
  }
})();

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduceMotion) return;

  var gsap = window.gsap;
  var root = document.documentElement;

  var selector = 'main section h2, main section h3, main section h4, footer h2, footer h3, footer h4';

  var skip = '.cf-header, #cfmSpecialsTrack, [aria-hidden="true"]';

  var headings = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (h) {
    return !h.closest(skip) && !h.classList.contains('cf-h1--hero');
  });
  if (!headings.length) return;

 
  function splitIntoWords(heading) {
    var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    var words = [];
    textNodes.forEach(function (node) {
      var fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          var mask = document.createElement('span');
          var word = document.createElement('span');
          mask.className = 'cf-stagger-mask';
          word.className = 'cf-stagger-word';
          word.textContent = part;
          mask.appendChild(word);
          fragment.appendChild(mask);
          words.push(word);
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });
    return words;
  }

  /* Big section titles get a slower, longer rise than small card titles. */
  function profile(heading) {
    var big = heading.tagName === 'H2';
    return big
      ? { duration: 1.0, stagger: 0.075, ease: 'power4.out', from: 130 }
      : { duration: 0.7, stagger: 0.045, ease: 'power3.out', from: 115 };
  }

  function finish(heading, words) {
    gsap.set(words, { clearProps: 'transform,willChange' });
    heading.classList.add('is-revealed');
  }

  function reveal(heading, words, instant) {
    if (instant) { finish(heading, words); return; }
    var p = profile(heading);
    gsap.to(words, {
      yPercent: 0,
      rotate: 0,
      duration: p.duration,
      stagger: p.stagger,
      ease: p.ease,
      overwrite: 'auto',
      onComplete: function () { finish(heading, words); }
    });
  }

  var items = [];
  headings.forEach(function (heading) {
    if (heading.dataset.staggerReady === 'true') return;
    heading.dataset.staggerReady = 'true';
    var words = splitIntoWords(heading);
    if (!words.length) return;
    /* Hide right away (the words are clipped by their masks) so there is no flash. */
    var p = profile(heading);
    gsap.set(words, { yPercent: p.from, rotate: 4, transformOrigin: '0% 100%' });
    items.push({ heading: heading, words: words });
  });
  if (!items.length) return;

  function observe() {
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (it) { finish(it.heading, it.words); });
      return;
    }
    var byEl = new Map();
    items.forEach(function (it) { byEl.set(it.heading, it); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var it = byEl.get(entry.target);
        if (!it) return;
        if (entry.isIntersecting) {
          byEl.delete(entry.target);
          io.unobserve(entry.target);
          reveal(it.heading, it.words, false);
        } else if (entry.boundingClientRect.bottom < 0) {
          byEl.delete(entry.target);
          io.unobserve(entry.target);
          reveal(it.heading, it.words, true);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (it) { io.observe(it.heading); });

    var ticking = false;
    function sweep() {
      ticking = false;
      if (!byEl.size) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        return;
      }
      var vh = window.innerHeight;
      var atBottom = vh + window.pageYOffset >= document.documentElement.scrollHeight - 4;
      byEl.forEach(function (it, el) {
        var r = el.getBoundingClientRect();
        if (!r.width && !r.height) return;            
        if (r.bottom < 0) {
          byEl.delete(el); io.unobserve(el);
          reveal(it.heading, it.words, true);
        } else if (atBottom && r.top < vh) {
          byEl.delete(el); io.unobserve(el);
          reveal(it.heading, it.words, false);
        }
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(sweep); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

 
  if (!root.classList.contains('cf-loading')) {
    observe();
  } else {
    var mo = new MutationObserver(function () {
      if (root.classList.contains('cf-loading')) return;
      mo.disconnect();
      setTimeout(observe, 120);
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }
})();

(function () {
  var els = [].slice.call(document.querySelectorAll('[data-aos]'));

  if (typeof window.AOS === 'undefined') {
    els.forEach(function (el) { el.removeAttribute('data-aos'); el.removeAttribute('data-aos-delay'); el.removeAttribute('data-aos-duration'); });
    return;
  }

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  });

  window.addEventListener('load', function () { AOS.refresh(); });
  setTimeout(function () { AOS.refresh(); }, 2100);
})();

/* ── Signature Specials: infinite right-to-left marquee ── */
(function () {
  var track = document.getElementById('cfmSpecialsTrack');
  if (!track) return;

  var origCards = [].slice.call(track.querySelectorAll('.cfm-sp-card'));
  var cardCount = origCards.length;

  /* ── Clone cards for seamless wrap-around ── */
  origCards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });


  track.style.gridTemplateColumns = 'repeat(' + (cardCount * 2) + ', minmax(280px, 320px))';


  var speed  = 0.8;   
  var paused = false;
  var resumeTimer;

  function step() {
    if (!paused) {
      track.scrollLeft += speed;

   
      var halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(step);
  }

  /* ── Pause on hover / touch ── */
  function pause() {
    paused = true;
    clearTimeout(resumeTimer);
  }

  function resume() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { paused = false; }, 2000);
  }

  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('touchstart', pause,  { passive: true });
  track.addEventListener('touchend',   resume, { passive: true });

  /* ── Respect reduced-motion ── */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(step);
  }
})();


(function () {
  var tabList = document.getElementById('cfmBrewTabs');
  if (!tabList) return;

  var tabs   = [].slice.call(tabList.querySelectorAll('.cfm-brew__tab'));
  var panels = [].slice.call(document.querySelectorAll('.cfm-brew__panel'));

  function activate(tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });

    panels.forEach(function (p) {
      var targetId = tab.getAttribute('aria-controls');
      var show     = p.id === targetId;
      if (show) {
        p.removeAttribute('hidden');
        p.querySelectorAll('.cfm-brew__bar-fill').forEach(function (fill) {
          var clone = fill.cloneNode(true);
          fill.parentNode.replaceChild(clone, fill);
        });
      } else {
        p.setAttribute('hidden', '');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activate(tab); });

    /* Arrow-key navigation */
    tab.addEventListener('keydown', function (e) {
      var idx = tabs.indexOf(tab);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        activate(tabs[(idx + 1) % tabs.length]);
        tabs[(idx + 1) % tabs.length].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activate(tabs[(idx - 1 + tabs.length) % tabs.length]);
        tabs[(idx - 1 + tabs.length) % tabs.length].focus();
      }
    });
  });
})();

/* ── Back to top: smooth scroll without page reload ── */
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('a.cf-top');
    if (!btn) return;
    e.preventDefault();
    if (window.cfLenis) {
      window.cfLenis.scrollTo(0, { duration: 1.2, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
