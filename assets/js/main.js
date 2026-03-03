/* ============================================================
   LÖWE STUDIO — main.js  v2
   Smooth scroll · Particles (fixed viewport) · Counters · UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initFromConfig();
  initHeader();
  initMobileNav();
  initScrollReveal();
  initCounters();
  initForm();
});

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
function initSmoothScroll() {
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollTo(targetY, duration) {
    duration = duration || 900;
    var startY = window.scrollY;
    var diff   = targetY - startY;
    var start  = null;

    function step(ts) {
      if (!start) start = ts;
      var elapsed  = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    var headerH = 72;
    var targetY = target.getBoundingClientRect().top + window.scrollY - headerH;
    scrollTo(Math.max(0, targetY), 900);
  });
}

/* ── CONFIG INJECTION ─────────────────────────────────────── */
function initFromConfig() {
  if (typeof CONFIG === 'undefined') return;

  // All WhatsApp links
  document.querySelectorAll('[data-wa]').forEach(function(el) {
    el.href = CONFIG.urls.whatsapp();
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  // All email links
  document.querySelectorAll('[data-email]').forEach(function(el) {
    el.href = CONFIG.urls.email();
  });

  // Social links
  document.querySelectorAll('[data-social]').forEach(function(el) {
    var key = el.getAttribute('data-social');
    if (CONFIG.social[key]) el.href = CONFIG.social[key];
  });

  // Contact info
  fill('[data-contact-email]',    CONFIG.contact.email);
  fill('[data-contact-phone]',    CONFIG.contact.phone);
  fill('[data-contact-hours]',    CONFIG.contact.hours);
  fill('[data-contact-response]', CONFIG.contact.responseTime);
  fill('[data-contact-address]',  CONFIG.contact.address);

  // Services grid
  var sg = document.getElementById('services-grid');
  if (sg && CONFIG.services) {
    sg.innerHTML = CONFIG.services.map(function(s, i) {
      return '<article class="service-card reveal" style="transition-delay:' + (i * 0.1) + 's">' +
        '<div class="service-card-header">' +
          '<div>' +
            '<h3 class="service-title">' + s.title + '</h3>' +
            '<p class="service-subtitle">' + s.subtitle + '</p>' +
          '</div>' +
          '<span class="service-icon">' + s.icon + '</span>' +
        '</div>' +
        '<ul class="service-list">' +
          s.items.map(function(item) { return '<li>' + item + '</li>'; }).join('') +
        '</ul>' +
        '<div class="service-ctas">' +
          '<a href="' + CONFIG.urls.whatsapp() + '" class="btn btn-wa" target="_blank" rel="noopener">' +
            svgWA() + ' WhatsApp' +
          '</a>' +
          '<a href="' + CONFIG.urls.email() + '" class="btn btn-email">' +
            svgEmail() + ' Email' +
          '</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  // Testimonials grid
  var tg = document.getElementById('testimonials-grid');
  if (tg && CONFIG.testimonials) {
    tg.innerHTML = CONFIG.testimonials.map(function(t, i) {
      var stars = '';
      for (var s = 0; s < t.stars; s++) stars += '<span class="star">★</span>';
      return '<div class="testimonial-card reveal" style="transition-delay:' + (i * 0.15) + 's">' +
        '<div class="testimonial-stars">' + stars + '</div>' +
        '<p class="testimonial-text">' + t.text + '</p>' +
        '<div class="testimonial-author">' +
          '<div class="author-avatar">' + t.name.charAt(0) + '</div>' +
          '<div>' +
            '<div class="author-name">' + t.name + '</div>' +
            '<div class="author-role">' + t.role + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Promo section
  if (CONFIG.promo && CONFIG.promo.active) {
    var promoEl = document.getElementById('promo');
    if (promoEl) {
      promoEl.style.display = '';
      fillId('promo-badge',    CONFIG.promo.badge);
      fillId('promo-title',    CONFIG.promo.title);
      fillId('promo-desc',     CONFIG.promo.description);
      fillId('promo-original', CONFIG.promo.originalPrice);
      fillId('promo-price',    CONFIG.promo.price);
      fillId('promo-note',     CONFIG.promo.note);
      fillId('promo-cta',      CONFIG.promo.cta);
      var pl = document.getElementById('promo-items');
      if (pl) {
        pl.innerHTML = CONFIG.promo.items.map(function(item) {
          return '<li>' + item + '</li>';
        }).join('');
      }
    }
  }
}

function fill(sel, val) {
  document.querySelectorAll(sel).forEach(function(el) { el.textContent = val; });
}
function fillId(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── HEADER ───────────────────────────────────────────────── */
function initHeader() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── MOBILE NAV ───────────────────────────────────────────── */
function initMobileNav() {
  var ham   = document.getElementById('hamburger');
  var nav   = document.getElementById('mobile-nav');
  var close = document.getElementById('mobile-nav-close');
  if (!ham || !nav) return;

  ham.addEventListener('click',   function() { nav.classList.add('open'); });
  if (close) close.addEventListener('click', function() { nav.classList.remove('open'); });
  nav.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { nav.classList.remove('open'); });
  });
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .timeline-item, .about-card, .platform-card, .service-card, .testimonial-card').forEach(function(el) {
    obs.observe(el);
  });
}

/* ── COUNTERS ─────────────────────────────────────────────── */
function initCounters() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var target   = parseFloat(el.getAttribute('data-counter'));
      var decimal  = (target % 1 !== 0);
      var duration = 1800;
      var startTs  = null;

      function step(ts) {
        if (!startTs) startTs = ts;
        var t    = Math.min((ts - startTs) / duration, 1);
        var ease = 1 - Math.pow(1 - t, 3);
        el.textContent = decimal
          ? (target * ease).toFixed(1)
          : Math.round(target * ease);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = decimal ? target.toFixed(1) : target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(function(el) {
    obs.observe(el);
  });
}

/* ── CONTACT FORM ─────────────────────────────────────────── */
function initForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name    = form.querySelector('[name="name"]').value;
    var email   = form.querySelector('[name="email"]').value;
    var phone   = form.querySelector('[name="phone"]').value;
    var message = form.querySelector('[name="message"]').value;
    var subject = encodeURIComponent('Consulta desde LÖWE STUDIO – ' + name);
    var body    = encodeURIComponent('Nombre: ' + name + '\nEmail: ' + email + '\nTeléfono: ' + phone + '\n\nMensaje:\n' + message);
    var to      = (typeof CONFIG !== 'undefined') ? CONFIG.contact.email : 'lowespa@gmail.com';
    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
  });
}

/* ── SVG ICONS ────────────────────────────────────────────── */
function svgWA() {
  return '<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
}
function svgEmail() {
  return '<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>';
}
