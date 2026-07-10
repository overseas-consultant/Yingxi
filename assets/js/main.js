/* ============================================
   星途 LumiPath · 独立站矩阵 · 共享交互脚本
   ============================================ */

(function () {
  'use strict';

  /* ===== Path resolver for sub-pages ===== */
  // Detect if we're in a subdirectory (workvisa/, study/, travel/)
  var pathDepth = (window.location.pathname.match(/\//g) || []).length;
  // Root index.html: depth 1 ( /index.html or / )
  // Subdirectory: depth 2 ( /workvisa/index.html )
  var isSubpage = pathDepth > 1 && !window.location.pathname.endsWith('/index.html') === false && window.location.pathname !== '/';
  // Simpler: check if pathname contains a subdirectory
  var pathParts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  // ['index.html'] or [] => root
  // ['workvisa', 'index.html'] => subpage
  var assetBase = pathParts.length > 1 ? '../' : '';

  /* ===== Navbar scroll shadow + mobile toggle ===== */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var toggle = document.querySelector('.navbar-toggle');
    var menu = document.querySelector('.navbar-menu');

    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        menu.classList.toggle('show');
      });

      // Close menu on link click (mobile)
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          menu.classList.remove('show');
        });
      });
    }
  }

  /* ===== Scroll fade-in animation (IntersectionObserver) ===== */
  function initScrollAnimation() {
    var elements = document.querySelectorAll('.fade-in-up');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ===== FAQ Accordion ===== */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;
      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(function (other) { other.classList.remove('open'); });
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ===== General Accordion (travel page etc.) ===== */
  function initAccordion() {
    var accItems = document.querySelectorAll('.accordion-item');
    accItems.forEach(function (item) {
      var header = item.querySelector('.accordion-header');
      if (!header) return;
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Optionally close siblings
        var siblings = item.parentElement.querySelectorAll('.accordion-item.open');
        siblings.forEach(function (s) {
          if (s !== item) s.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    });
  }

  /* ===== Tabs ===== */
  function initTabs() {
    var tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach(function (container) {
      var tabBtns = container.querySelectorAll('.tab-btn');
      var tabContents = container.querySelectorAll('.tab-content');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          tabBtns.forEach(function (b) { b.classList.remove('active'); });
          tabContents.forEach(function (c) { c.classList.remove('active'); });
          btn.classList.add('active');
          var content = container.querySelector('#' + target);
          if (content) content.classList.add('active');
        });
      });
    });
  }

  /* ===== Carousel ===== */
  function initCarousel() {
    var containers = document.querySelectorAll('[data-carousel]');
    containers.forEach(function (container) {
      var track = container.querySelector('.carousel-track');
      var slides = container.querySelectorAll('.carousel-slide');
      var prevBtn = container.querySelector('.carousel-prev');
      var nextBtn = container.querySelector('.carousel-next');
      var dotsContainer = container.querySelector('.carousel-dots');
      if (!track || slides.length === 0) return;

      var current = 0;
      var total = slides.length;

      // Create dots
      if (dotsContainer) {
        for (var i = 0; i < total; i++) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('data-index', i);
          dot.addEventListener('click', function () {
            goTo(parseInt(this.getAttribute('data-index')));
          });
          dotsContainer.appendChild(dot);
        }
      }

      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        var dots = container.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      // Auto play
      var autoPlay = setInterval(function () { goTo(current + 1); }, 5000);

      // Pause on hover
      container.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
      container.addEventListener('mouseleave', function () {
        clearInterval(autoPlay);
        autoPlay = setInterval(function () { goTo(current + 1); }, 5000);
      });

      // Touch swipe
      var startX = 0;
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) goTo(current + 1);
          else goTo(current - 1);
        }
      }, { passive: true });
    });
  }

  /* ===== Modal System ===== */
  function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function initModals() {
    var overlays = document.querySelectorAll('.overlay');

    overlays.forEach(function (overlay) {
      // Close on overlay click
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(overlay);
      });
      // Close button
      var closeBtns = overlay.querySelectorAll('.modal-close');
      closeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () { closeModal(overlay); });
      });
    });

    // ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        overlays.forEach(function (overlay) {
          if (overlay.classList.contains('show')) closeModal(overlay);
        });
      }
    });

    // ===== Consultation & Assessment button handler =====
    // ALL consult/assess actions open OpenHex real-time chat
    var OPENHEX_URL = 'https://agent.openhex.tech/share/77cbf0929e8ab6034bc6b82ff1c9f3d6';

    document.querySelectorAll('[data-action="consult"], [data-action="assess"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var modal = document.getElementById('consult-modal');
        if (modal) {
          openModal(modal);
          // Load OpenHex iframe
          var iframe = modal.querySelector('#openhex-chat-frame');
          var fallback = modal.querySelector('#chat-fallback');
          if (iframe) {
            // Reset loaded state and always load fresh
            delete iframe.dataset.loaded;
            iframe.src = OPENHEX_URL;
            // Show fallback if iframe doesn't load within 5 seconds
            setTimeout(function() {
              if (!iframe.dataset.loaded) {
                if (fallback) fallback.style.display = '';
              }
            }, 5000);
          }
        }
      });
    });
  }

  /* ===== Smooth scroll for anchor links ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = 70; // navbar height
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ===== Stats counter animation ===== */
  function initStatsCounter() {
    var stats = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) {
      stats.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'));
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * (target - start) + start);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { observer.observe(el); });
  }

  /* ===== Init all ===== */
  function init() {
    initNavbar();
    initScrollAnimation();
    initFAQ();
    initAccordion();
    initTabs();
    initCarousel();
    initModals();
    initSmoothScroll();
    initStatsCounter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
