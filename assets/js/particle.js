/* ============================================================
   LÖWE STUDIO — particle.js
   Partículas interactivas, sin dependencias externas.
   Cyan dominante · Gold · Magenta accent
   ============================================================ */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  var CFG = {
    count:        85,
    speed:        0.55,
    connectDist:  130,
    repulseDist:  140,
    repulseForce: 5,
    minR:         0.8,
    maxR:         2.4,
    /* Palette — duplicates = higher probability */
    colors: [
      [0, 212, 200],   // cyan ×4  → ~57 %
      [0, 212, 200],
      [0, 212, 200],
      [0, 212, 200],
      [201, 168, 76],  // gold ×2  → ~29 %
      [201, 168, 76],
      [180, 0, 100],   // magenta  → ~14 %
    ],
  };

  /* ── STATE ──────────────────────────────────────────────── */
  var canvas, ctx;
  var W = 0, H = 0;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var rafId = null;

  /* ── INIT ────────────────────────────────────────────────── */
  function init() {
    /* Create or reuse canvas */
    canvas = document.getElementById('lw-particles');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'lw-particles';
      canvas.setAttribute('aria-hidden', 'true');
      applyStyles(canvas);
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    ctx = canvas.getContext('2d');

    resize();
    spawnAll();
    bindEvents();

    if (rafId) cancelAnimationFrame(rafId);
    loop();
  }

  function applyStyles(el) {
    el.style.cssText = [
      'position:fixed',
      'top:0', 'left:0',
      'width:100%', 'height:100%',
      'pointer-events:none',
      'z-index:0',
      'display:block',
    ].join(';');
  }

  /* ── RESIZE ─────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── PARTICLE FACTORY ────────────────────────────────────── */
  function makeParticle(xOverride, yOverride) {
    var col = CFG.colors[Math.floor(Math.random() * CFG.colors.length)];
    var angle = Math.random() * Math.PI * 2;
    var spd   = (Math.random() * 0.6 + 0.2) * CFG.speed;
    return {
      x:     xOverride !== undefined ? xOverride : Math.random() * W,
      y:     yOverride !== undefined ? yOverride : Math.random() * H,
      vx:    Math.cos(angle) * spd,
      vy:    Math.sin(angle) * spd,
      r:     Math.random() * (CFG.maxR - CFG.minR) + CFG.minR,
      alpha: Math.random() * 0.45 + 0.15,
      col:   col,
    };
  }

  function spawnAll() {
    particles = [];
    for (var i = 0; i < CFG.count; i++) particles.push(makeParticle());
  }

  /* ── MAIN LOOP ───────────────────────────────────────────── */
  function loop() {
    rafId = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    drawLines();
    drawDots();
  }

  /* ── DRAW CONNECTIONS ────────────────────────────────────── */
  function drawLines() {
    var len = particles.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        var a = particles[i];
        var b = particles[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        var dist = CFG.connectDist;
        if (d2 < dist * dist) {
          var d     = Math.sqrt(d2);
          var alpha = 0.10 * (1 - d / dist);
          /* Blend colors of both endpoints */
          var r = ((a.col[0] + b.col[0]) >> 1);
          var g = ((a.col[1] + b.col[1]) >> 1);
          var bl= ((a.col[2] + b.col[2]) >> 1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + bl + ',' + alpha + ')';
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  /* ── DRAW DOTS ───────────────────────────────────────────── */
  function drawDots() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      updateParticle(p);

      /* Cyan gets a soft glow */
      var isCyan = p.col[0] === 0 && p.col[1] > 200;
      if (isCyan) {
        ctx.shadowBlur  = 8;
        ctx.shadowColor = 'rgba(0,212,200,0.65)';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',' + p.alpha + ')';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  /* ── UPDATE PARTICLE PHYSICS ─────────────────────────────── */
  function updateParticle(p) {
    /* Mouse repulsion */
    var dx = p.x - mouse.x;
    var dy = p.y - mouse.y;
    var d2 = dx * dx + dy * dy;
    var rd = CFG.repulseDist;
    if (d2 < rd * rd && d2 > 0.001) {
      var d    = Math.sqrt(d2);
      var norm = CFG.repulseForce * (1 - d / rd) / d;
      p.vx += dx * norm * 0.08;
      p.vy += dy * norm * 0.08;
    }

    /* Speed cap */
    var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (spd > 3.0) {
      p.vx = (p.vx / spd) * 3.0;
      p.vy = (p.vy / spd) * 3.0;
    }

    /* Damping */
    p.vx *= 0.994;
    p.vy *= 0.994;

    /* Move */
    p.x += p.vx;
    p.y += p.vy;

    /* Wrap edges */
    if (p.x < -5)     p.x = W + 5;
    if (p.x > W + 5)  p.x = -5;
    if (p.y < -5)     p.y = H + 5;
    if (p.y > H + 5)  p.y = -5;
  }

  /* ── EVENTS ─────────────────────────────────────────────── */
  function bindEvents() {
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    /* Click → burst of 4 new particles near cursor */
    window.addEventListener('click', function (e) {
      /* Don't fire on UI elements */
      var tag = e.target.tagName;
      if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
      for (var i = 0; i < 4; i++) {
        var off = 20;
        particles.push(makeParticle(
          e.clientX + (Math.random() - 0.5) * off,
          e.clientY + (Math.random() - 0.5) * off
        ));
      }
      /* Keep pool under control */
      if (particles.length > CFG.count + 40) {
        particles.splice(0, 4);
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        /* Re-clamp existing particles that ended up off-screen */
        for (var i = 0; i < particles.length; i++) {
          if (particles[i].x > W) particles[i].x = Math.random() * W;
          if (particles[i].y > H) particles[i].y = Math.random() * H;
        }
      }, 150);
    });
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
