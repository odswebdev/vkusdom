(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smoothBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function isVisible(el) {
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ visibilityProperty: true });
    }
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function initHeaderNavScroll() {
    var menu = $('.vkusdom-header__menu-inner');
    var nav = $('.vkusdom-header__nav');
    if (!menu || !nav) return;

    function scrollMenuBy(direction) {
      nav.scrollBy({ left: direction * 300, behavior: smoothBehavior });
    }

    menu.addEventListener('click', function (event) {
      var prev = event.target.closest('.vkusdom-header__nav-arrow--prev');
      if (prev && menu.contains(prev)) { scrollMenuBy(-1); return; }
      var next = event.target.closest('.vkusdom-header__nav-arrow--next');
      if (next && menu.contains(next)) { scrollMenuBy(1); }
    });
  }

  function initmobileMenu() {
    var burger = $('.m-vkusdom-header__burger');
    var mobileMenu = $('#m-vkusdom-mobile-menu');
    if (!burger || !mobileMenu) return;

    var overlay  = $('.m-vkusdom-mobile-menu__overlay', mobileMenu);
    var closeBtn = $('.m-vkusdom-mobile-menu__close', mobileMenu);
    var panel    = $('.m-vkusdom-mobile-menu__panel', mobileMenu);
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    var hideTimer = null;
    var savedScrollY = 0;

    function lockScroll() {
      savedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + savedScrollY + 'px';
      document.body.style.width = '100%';
      document.body.classList.add('vkusdom-no-scroll');
    }

    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('vkusdom-no-scroll');
      window.scrollTo(0, savedScrollY);
    }

    function onKeydown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        setMobileMenuOpen(false);
      }
    }

    function setMobileMenuOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('m-vkusdom-mobile-menu--open', open);

      if (open) {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        mobileMenu.removeAttribute('hidden');
        lockScroll();
        requestAnimationFrame(function () {
          (closeBtn || panel).focus({ preventScroll: true });
        });
        document.addEventListener('keydown', onKeydown);
      } else {
        hideTimer = setTimeout(function () {
          if (!mobileMenu.classList.contains('m-vkusdom-mobile-menu--open')) {
            mobileMenu.setAttribute('hidden', '');
          }
        }, 350);
        unlockScroll();
        burger.focus({ preventScroll: true });
        document.removeEventListener('keydown', onKeydown);
      }
    }

    burger.addEventListener('click', function () {
      setMobileMenuOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { setMobileMenuOpen(false); });
    if (overlay)  overlay.addEventListener('click', function () { setMobileMenuOpen(false); });

    mobileMenu.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab' ||
          !mobileMenu.classList.contains('m-vkusdom-mobile-menu--open')) return;

      var items = $$(FOCUSABLE, panel).filter(isVisible);
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    var mq = window.matchMedia('(min-width: 768px)');
    var onBreakpoint = function (event) {
      if (event.matches && mobileMenu.classList.contains('m-vkusdom-mobile-menu--open')) {
        setMobileMenuOpen(false);
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint); // Safari < 14
  }

  function playLetterSwitch(letter, switchingClass) {
    if (prefersReducedMotion) return;
    letter.classList.remove(switchingClass);
    requestAnimationFrame(function () {
      letter.classList.add(switchingClass);
    });
  }

  function initBrandFilter() {
    var announce = $('#vkusdom-brands-announce');
    var announceTimer = null;

    function announceLater(text) {
      if (!announce) return;
      clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        announce.textContent = text;
      }, 150);
    }

    $$('.vkusdom-brands, .m-vkusdom-brands').forEach(function (root) {
      var isMobile = root.classList.contains('m-vkusdom-brands');
      var prefix = isMobile ? 'm-vkusdom-brands' : 'vkusdom-brands';

      // Визуальная буква — div. В HTML есть скрытый <h3> для AT с тем же классом.
      // Целимся в div — иначе текст уйдёт в скрытый h3.
      var letter = $('div.' + prefix + '__letter', root) ||
                   $('.' + prefix + '__letter', root);
      var list   = $('.' + prefix + '__' + (isMobile ? 'list' : 'cols'), root);
      var empty  = $('.' + prefix + '__empty', root);
      if (!letter || !list || !empty) return;

      var buttons = $$('button[data-letter]', root);
      var group   = list.dataset.letterGroup || '';

      root.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-letter]');
        if (!button || !root.contains(button)) return;

        var value = button.dataset.letter;

        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === button));
        });

        letter.textContent = value;
        playLetterSwitch(letter, prefix + '__letter--switching');

        var hasBrands = value === group;
        list.hidden = !hasBrands;
        empty.hidden = hasBrands;

        if (hasBrands && !prefersReducedMotion) {
          var animClass = prefix + '__' + (isMobile ? 'list' : 'cols') + '--switching';
          list.classList.remove(animClass);
          requestAnimationFrame(function () {
            list.classList.add(animClass);
          });
        }

        announceLater(hasBrands
          ? 'Показаны бренды на букву «' + value + '»'
          : 'По букве «' + value + '» брендов пока нет');
      });

      // Начальное состояние — без анимаций и объявлений
      var initial = null;
      for (var i = 0; i < buttons.length; i += 1) {
        if (buttons[i].dataset.letter === group) { initial = buttons[i]; break; }
      }

      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === initial));
      });
      if (initial) letter.textContent = initial.dataset.letter;
    });
  }

  var SLIDERS = [
    { el: '.vkusdom-popular__slider', prev: '.vkusdom-popular__arrow--prev', next: '.vkusdom-popular__arrow--next', spaceBetween: 10 },
    { el: '.m-vkusdom-brands__slider', spaceBetween: 8 },
    { el: '.m-vkusdom-footer__apps',   spaceBetween: 4 }
  ];

  function initSliders() {
    var sliders = $$('.swiper');
    if (!sliders.length) return;

    // Fallback: Swiper не загрузился
    if (typeof window.Swiper === 'undefined') {
      sliders.forEach(function (s) { s.classList.add('vkusdom-fallback'); });

      var popular = $('.vkusdom-popular__slider');
      var slide = popular && $('.swiper-slide', popular);

      if (popular && slide) {
        var step = slide.getBoundingClientRect().width + 10;

        var prevBtn = $('.vkusdom-popular__arrow--prev');
        var nextBtn = $('.vkusdom-popular__arrow--next');

        if (prevBtn) prevBtn.addEventListener('click', function () {
          popular.scrollBy({ left: -step, behavior: smoothBehavior });
        });
        if (nextBtn) nextBtn.addEventListener('click', function () {
          popular.scrollBy({ left: step, behavior: smoothBehavior });
        });
      }
      return;
    }

    SLIDERS.forEach(function (cfg) {
      var el = $(cfg.el);
      if (!el) return;

      var swiper;
      try {
        swiper = new window.Swiper(el, {
          slidesPerView: 'auto',
          spaceBetween: cfg.spaceBetween,
          speed: 450,
          watchOverflow: true,
          grabCursor: true,
          simulateTouch: true,
          a11y: {
            enabled: true,
            prevSlideMessage: 'Предыдущий слайд',
            nextSlideMessage: 'Следующий слайд'
          },
          keyboard: {
            enabled: true,
            onlyInViewport: true
          }
        });
      } catch (e) {
        if (window.console && window.console.error) {
          window.console.error('[vkusdom] Swiper init failed for', cfg.el, e);
        }
        return;
      }

      if (!swiper) return;

      if (cfg.prev && cfg.next) {
        var prevEl = $(cfg.prev);
        var nextEl = $(cfg.next);
        if (prevEl) prevEl.addEventListener('click', function () { swiper.slidePrev(); });
        if (nextEl) nextEl.addEventListener('click', function () { swiper.slideNext(); });
      }
    });
  }

  var REVEAL_TEXT = [
    '.vkusdom-catalog__title',
    '.m-vkusdom-catalog__title',
    '.vkusdom-popular__title',
    '.vkusdom-brands__title',
    '.m-vkusdom-brands__title'
  ].join(',');

  var REVEAL_SELECTORS = [
    '.vkusdom-breadcrumbs',
    '.vkusdom-catalog__title',
    '.m-vkusdom-catalog__title',
    '.vkusdom-popular__title',
    '.vkusdom-brands__title',
    '.m-vkusdom-brands__title',
    '.vkusdom-brands__filter',
    '.m-vkusdom-brands__filter',
    '.vkusdom-brands__body',
    '.m-vkusdom-brands__body',
    '.m-vkusdom-delivery-toggle',
    '.vkusdom-footer__info',
    '.vkusdom-footer__connect',
    '.vkusdom-footer__bottom',
    '.m-vkusdom-footer > .m-vkusdom-logo',
    '.m-vkusdom-footer > .m-vkusdom-footer__menu',
    '.m-vkusdom-footer > .m-vkusdom-footer__apps',
    '.m-vkusdom-footer > .m-vkusdom-footer__subscribe-box',
    '.m-vkusdom-footer > .m-vkusdom-footer__contacts',
    '.m-vkusdom-footer > .m-vkusdom-footer__socials'
  ];

  var REVEAL_GROUPS = [
    { parent: '.vkusdom-popular__slider', child: '.swiper-slide', step: 70 },
    { parent: '.m-vkusdom-brands__slider', child: '.swiper-slide', step: 60 },
    { parent: '.vkusdom-brands__cols', child: '.vkusdom-brands__col', step: 90 }
  ];

  function initRevealOnScroll() {
    if (!document.documentElement.classList.contains('vkusdom-js')) return;
    if (typeof window.IntersectionObserver === 'undefined') return;

    var groups = [];

    REVEAL_GROUPS.forEach(function (cfg) {
      var parent = $(cfg.parent);
      if (!parent) return;

      var children = $$(cfg.child, parent);
      if (!children.length) return;

      children.forEach(function (c) { c.classList.add('vkusdom-reveal'); });
      groups.push({ el: parent, children: children, step: cfg.step });
    });

    var singles = $$(REVEAL_SELECTORS.join(','));
    singles.forEach(function (el) {
      el.classList.add('vkusdom-reveal');
      if (el.matches(REVEAL_TEXT)) el.classList.add('vkusdom-reveal--text');
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      var slot = 0;

      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var baseDelay = slot * 120;
        slot += 1;

        var group = null;
        for (var i = 0; i < groups.length; i += 1) {
          if (groups[i].el === entry.target) { group = groups[i]; break; }
        }

        if (group) {
          group.children.forEach(function (child, index) {
            child.style.setProperty(
              '--vkusdom-reveal-delay',
              (baseDelay + index * group.step) + 'ms'
            );
            child.classList.add('vkusdom-reveal--visible');
          });
        } else {
          entry.target.style.setProperty('--vkusdom-reveal-delay', baseDelay + 'ms');
          entry.target.classList.add('vkusdom-reveal--visible');
        }

        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    singles.forEach(function (el) { observer.observe(el); });
    groups.forEach(function (g) { observer.observe(g.el); });
  }

  var RIPPLE_HOSTS = [
    '.vkusdom-search__catalog',
    '.vkusdom-header__action--delivery',
    '.vkusdom-subscribe',
    '.m-vkusdom-subscribe',
    '.m-vkusdom-header__burger',
    '.m-vkusdom-delivery-toggle__button'
  ].join(',');

  function initRipple() {
    if (prefersReducedMotion) return;

    document.addEventListener('pointerdown', function (event) {
      var host = event.target.closest(RIPPLE_HOSTS);
      if (!host) return;

      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);

      var isKeyboard = !event.clientX && !event.clientY;
      var left = isKeyboard
        ? rect.width  / 2 - size / 2
        : event.clientX - rect.left - size / 2;
      var top = isKeyboard
        ? rect.height / 2 - size / 2
        : event.clientY - rect.top  - size / 2;

      var ripple = document.createElement('span');
      ripple.className = 'vkusdom-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      ripple.style.width  = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left   = left + 'px';
      ripple.style.top    = top  + 'px';

      var removed = false;
      function remove() {
        if (removed) return;
        removed = true;
        ripple.remove();
      }

      ripple.addEventListener('animationend', remove);
      host.addEventListener('pointercancel', remove, { once: true });
      setTimeout(remove, 800);

      host.appendChild(ripple);
    });
  }

  function boot() {
    initHeaderNavScroll();
    initmobileMenu();
    initBrandFilter();
    initSliders();
    initRevealOnScroll();
    initRipple();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();