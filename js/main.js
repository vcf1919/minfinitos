/* Momentos Infinitos · interacción (sin dependencias) */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/34641252765?text=';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navegación ---------- */
  var nav = $('.nav');
  var toggle = $('.nav__toggle');
  var menu = $('#menu-movil');

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.hidden = true;
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) { closeMenu(); return; }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    menu.hidden = false;
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
  });

  /* ---------- Scroll: nav, parallax de blobs ---------- */
  var parallax = reduceMotion ? [] : $$('[data-parallax]');
  var ticking = false;
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
    var vh = window.innerHeight;
    parallax.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var f = parseFloat(el.getAttribute('data-parallax')) || 0;
      var delta = (r.top + r.height / 2 - vh / 2) * f;
      el.style.setProperty('--py', delta.toFixed(1) + 'px');
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Aparición escalonada ---------- */
  var reveals = $$('.reveal');
  var groups = new Map();
  reveals.forEach(function (el) {
    var p = el.parentElement;
    var i = groups.get(p) || 0;
    el.style.setProperty('--d', Math.min(i * 90, 450) + 'ms');
    groups.set(p, i + 1);
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });

    var once = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); once.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    $$('.park, #how-steps').forEach(function (el) { once.observe(el); });
  } else {
    reveals.concat($$('.park, #how-steps')).forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Enlace activo en la navegación ---------- */
  var navLinks = $$('.nav__links a');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['espacio', 'celebraciones', 'profesionales', 'opiniones', 'contacto'].forEach(function (id) {
      var s = document.getElementById(id); if (s) secIO.observe(s);
    });
  }

  /* ---------- Botón flotante de WhatsApp ---------- */
  var fab = $('#fab');
  if (fab && 'IntersectionObserver' in window) {
    var state = { hero: true, cfg: false, foot: false };
    var upd = function () { fab.classList.toggle('is-visible', !state.hero && !state.cfg && !state.foot); };
    var fabIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var k = en.target.classList.contains('hero') ? 'hero' : en.target.id === 'organiza' ? 'cfg' : 'foot';
        state[k] = en.isIntersecting;
      });
      upd();
    }, { threshold: 0 });
    fabIO.observe($('.hero')); fabIO.observe($('#organiza')); fabIO.observe($('.footer'));
  }

  /* ---------- Carrusel de reseñas ---------- */
  $$('.marquee__row').forEach(function (row) {
    var track = $('.marquee__track', row);
    if (!reduceMotion) {
      $$('li', track).forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      });
    }
    var t;
    row.addEventListener('touchstart', function () { clearTimeout(t); row.classList.add('is-paused'); }, { passive: true });
    row.addEventListener('touchend', function () { t = setTimeout(function () { row.classList.remove('is-paused'); }, 1800); }, { passive: true });
  });

  /* ======================================================
     CONFIGURADOR
     ====================================================== */
  var form = $('#cfg-form');
  if (form) initConfigurator();

  function initConfigurator() {
    var NS = 'http://www.w3.org/2000/svg';
    var steps = $$('.step', form);
    var TOTAL = 5;
    var current = 1;
    var reached = 1;
    var bar = $('#cfg-bar');
    var stepTxt = $('#cfg-steptxt');
    var prevBtn = $('#cfg-prev');
    var nextBtn = $('#cfg-next');
    var navBox = $('#cfg-nav');
    var live = $('#cfg-live');
    var caption = $('#cfg-caption');
    var fecha = $('#cfg-fecha');
    var fechaTxt = $('#cfg-fecha-txt');
    var ninos = $('#cfg-ninos');
    var adultos = $('#cfg-adultos');
    var tema = $('#cfg-tema');
    var nombre = $('#cfg-nombre');
    var cfgBox = $('#cfg');

    var TYPES = {
      cumple:  { label: 'Cumpleaños infantil', phrase: 'un cumpleaños infantil', balloons: [['#F2A3A0', '#9FCBE6', '#F6C59B', '#F2C230'], ['#9FCBE6', '#F2A3A0', '#F6C59B']] },
      bautizo: { label: 'Bautizo o comunión', phrase: 'un bautizo o una comunión', balloons: [['#FFFFFF', '#CFE6F3', '#9FCBE6'], ['#CFE6F3', '#FFFFFF', '#E9DFC4']] },
      baby:    { label: 'Baby shower', phrase: 'un baby shower', balloons: [['#FBDCD9', '#DCEDF8', '#FFFFFF', '#F2A3A0'], ['#DCEDF8', '#FBDCD9', '#FFFFFF']] },
      comida:  { label: 'Comida o cena', phrase: 'una comida o cena', balloons: [['#F6C59B', '#FFFFFF', '#F2C230']] },
      clase:   { label: 'Clase o taller', phrase: 'una clase o taller', balloons: [] },
      otro:    { label: 'Otro evento', phrase: 'un evento', balloons: [['#F6C59B', '#F2A3A0', '#9FCBE6']] }
    };
    var FRANJA = { 'mañana': 'por la mañana', 'mediodía': 'a mediodía', 'tarde': 'por la tarde', 'noche': 'por la noche' };
    var EXTRAS = { deco: 'nuestra propia decoración', catering: 'la comida o el catering', tarta: 'la tarta' };
    var EXTRAS_LABEL = { deco: 'Decoración propia', catering: 'Comida o catering propio', tarta: 'Tarta' };

    /* Fecha mínima: hoy */
    var today = new Date();
    var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    fecha.min = iso(today);

    function val(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
    function extras() { return $$('input[name="extra"]:checked', form).map(function (i) { return i.value; }); }
    function num(el) { var n = parseInt(el.value, 10); return isNaN(n) ? 0 : Math.max(0, Math.min(200, n)); }
    function longDate(v) {
      if (!v) return '';
      var p = v.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      var wd = d.toLocaleDateString('es-ES', { weekday: 'long' });
      var mo = d.toLocaleDateString('es-ES', { month: 'long' });
      var s = wd + ' ' + d.getDate() + ' de ' + mo;
      if (d.getFullYear() !== today.getFullYear()) s += ' de ' + d.getFullYear();
      return s;
    }
    function shortDate(v) {
      if (!v) return '';
      var p = v.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
    }
    function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }
    function joinEs(list) {
      if (list.length <= 1) return list.join('');
      return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
    }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    /* ---------- Mensaje ---------- */
    function buildMessage() {
      var t = TYPES[val('tipo')] || TYPES.otro;
      var n = num(ninos), a = num(adultos);
      var name = nombre.value.trim();
      var parts = [];
      parts.push('Hola' + (name ? ', soy ' + name : '') + '.');
      var s = 'Me gustaría reservar Momentos Infinitos para ' + t.phrase;
      if (fecha.value) s += ' el ' + longDate(fecha.value);
      if (val('franja')) s += ' ' + FRANJA[val('franja')];
      parts.push(s + '.');
      if (n && a) parts.push('Seremos unos ' + plural(n, 'niño', 'niños') + ' y ' + plural(a, 'adulto', 'adultos') + '.');
      else if (n) parts.push('Seremos unos ' + plural(n, 'niño', 'niños') + '.');
      else if (a) parts.push('Seremos unos ' + plural(a, 'adulto', 'adultos') + '.');
      var ex = extras().map(function (k) { return EXTRAS[k]; });
      if (ex.length) parts.push('Traeremos ' + joinEs(ex) + '.');
      if (tema.value.trim()) parts.push('Temática: ' + tema.value.trim() + '.');
      parts.push('¿Tenéis disponibilidad y me podéis pasar presupuesto?');
      return parts.join(' ');
    }

    /* ---------- Resumen ---------- */
    function buildSummary() {
      var dl = $('#cfg-summary');
      dl.innerHTML = '';
      var n = num(ninos), a = num(adultos);
      var rows = [
        ['Evento', (TYPES[val('tipo')] || TYPES.otro).label, 1],
        ['Fecha', cap(longDate(fecha.value)) + (val('franja') ? ' · ' + cap(val('franja')) : ''), 2],
        ['Invitados', plural(n, 'niño', 'niños') + ' · ' + plural(a, 'adulto', 'adultos'), 3],
        ['Extras', extras().map(function (k) { return EXTRAS_LABEL[k]; }).join(', ') || 'Ninguno', 4]
      ];
      if (tema.value.trim()) rows.push(['Temática', cap(tema.value.trim()), 4]);
      rows.push(['Nombre', nombre.value.trim(), 5]);
      rows.forEach(function (r) {
        var div = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = r[0];
        var dd = document.createElement('dd'); dd.textContent = r[1];
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'link-btn link-btn--inline'; b.textContent = 'Cambiar';
        b.setAttribute('aria-label', 'Cambiar ' + r[0].toLowerCase());
        b.addEventListener('click', function () { go(r[2]); });
        dd.appendChild(b);
        div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
      });
      var msg = buildMessage();
      $('#cfg-msg').textContent = msg;
      $('#cfg-send').href = WA + encodeURIComponent(msg);
    }

    /* ---------- Validación ---------- */
    function validate(step) {
      var err = '';
      var focusEl = null;
      if (step === 1 && !val('tipo')) { err = 'Elige un tipo de evento para seguir.'; focusEl = $('input[name="tipo"]', form); }
      if (step === 2) {
        if (!fecha.value) { err = 'Elige una fecha en el calendario.'; focusEl = fecha; }
        else if (fecha.value < fecha.min) { err = 'Esa fecha ya ha pasado: elige otra.'; focusEl = fecha; }
        else if (!val('franja')) { err = 'Elige una franja: mañana, mediodía, tarde o noche.'; focusEl = $('input[name="franja"]', form); }
        fecha.setAttribute('aria-invalid', focusEl === fecha ? 'true' : 'false');
      }
      if (step === 3 && num(ninos) + num(adultos) === 0) { err = 'Indica al menos una persona.'; focusEl = ninos; }
      if (step === 5 && !nombre.value.trim()) { err = 'Escribe tu nombre para firmar el mensaje.'; focusEl = nombre; nombre.setAttribute('aria-invalid', 'true'); }
      var box = $('[data-step="' + step + '"] [data-error]', form);
      if (box) box.textContent = err;
      if (err && focusEl) focusEl.focus({ preventScroll: true });
      return !err;
    }

    /* ---------- Navegación entre pasos ---------- */
    function go(target) {
      if (target === current) return;
      var back = target < current;
      var from = $('[data-step="' + current + '"]', form);
      var to = $('[data-step="' + target + '"]', form);
      from.hidden = true;
      from.classList.remove('is-active', 'is-entering', 'from-left');
      to.hidden = false;
      to.classList.add('is-active');
      if (!reduceMotion) {
        to.classList.remove('is-entering', 'from-left');
        void to.offsetWidth;
        to.classList.add('is-entering');
        if (back) to.classList.add('from-left');
      }
      current = target;
      reached = Math.max(reached, target);
      if (current === 6) buildSummary();
      updateUI();
      var title = $('.step__title', to);
      if (title) title.focus({ preventScroll: true });
      var r = form.getBoundingClientRect();
      var navH = nav.offsetHeight;
      var stageH = window.innerWidth < 900 ? $('.cfg__stage').offsetHeight : 0;
      if (r.top < navH + stageH - 10) {
        window.scrollTo({ top: window.scrollY + r.top - navH - stageH - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    function updateUI() {
      var shown = Math.min(current, TOTAL);
      bar.style.width = (current === 6 ? 100 : (shown / TOTAL) * 100) + '%';
      stepTxt.textContent = current === 6 ? '¡Listo!' : 'Paso ' + shown + ' de ' + TOTAL;
      live.textContent = current === 6 ? 'Resumen de tu fiesta' : 'Paso ' + shown + ' de ' + TOTAL;
      prevBtn.hidden = current === 1;
      navBox.hidden = current === 6;
      nextBtn.innerHTML = (current === 5 ? 'Ver resumen' : 'Siguiente') + ' <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
      renderRoom();
    }

    nextBtn.addEventListener('click', function () { if (validate(current)) go(current + 1); });
    prevBtn.addEventListener('click', function () { if (current > 1) go(current - 1); });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (current < 6 && validate(current)) go(current + 1); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
        e.preventDefault();
        if (current < 6 && validate(current)) go(current + 1);
      }
    });
    $('#cfg-restart').addEventListener('click', function () {
      form.reset();
      ninos.value = 12; adultos.value = 15;
      reached = 1;
      $$('[data-error]', form).forEach(function (e) { e.textContent = ''; });
      fechaTxt.textContent = 'Elige el día en el calendario';
      go(1);
    });

    form.addEventListener('change', function (e) {
      var err = e.target.closest('.step') && $('[data-error]', e.target.closest('.step'));
      if (err) err.textContent = '';
      if (e.target === fecha) {
        fechaTxt.textContent = fecha.value ? cap(longDate(fecha.value)) : 'Elige el día en el calendario';
        fecha.setAttribute('aria-invalid', 'false');
      }
      renderRoom();
    });
    form.addEventListener('input', function (e) {
      if (e.target === tema || e.target === nombre || e.target === ninos || e.target === adultos) {
        if (e.target === nombre) nombre.setAttribute('aria-invalid', 'false');
        updateTotal();
        renderRoom();
      }
    });

    /* Ideas de temática */
    $$('.tchip', form).forEach(function (b) {
      b.addEventListener('click', function () { tema.value = b.getAttribute('data-theme'); renderRoom(); });
    });

    /* Contadores con pulsación mantenida */
    function bump(name, d) {
      var el = name === 'ninos' ? ninos : adultos;
      el.value = Math.max(0, Math.min(200, num(el) + d));
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
      updateTotal(); renderRoom();
    }
    function updateTotal() {
      var t = num(ninos) + num(adultos);
      $('#cfg-total').innerHTML = '<span>' + t + (t === 1 ? ' persona' : ' personas') + ' en total · Aforo máximo: 60' + (t > 60 ? '. Para grupos más grandes, consúltanos.' : '') + '</span>';
      $$('[data-dec]', form).forEach(function (b) { b.disabled = num(b.getAttribute('data-dec') === 'ninos' ? ninos : adultos) <= 0; });
    }
    $$('[data-inc], [data-dec]', form).forEach(function (b) {
      var name = b.getAttribute('data-inc') || b.getAttribute('data-dec');
      var d = b.hasAttribute('data-inc') ? 1 : -1;
      var timer, rep;
      var stop = function () { clearTimeout(timer); clearInterval(rep); };
      b.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        bump(name, d);
        timer = setTimeout(function () { rep = setInterval(function () { bump(name, d); }, 90); }, 450);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });
      b.addEventListener('click', function (e) { if (e.detail === 0) bump(name, d); });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
    [ninos, adultos].forEach(function (el) {
      el.addEventListener('blur', function () { el.value = num(el); updateTotal(); renderRoom(); });
    });
    updateTotal();

    /* ---------- Ilustración de la sala ---------- */
    var room = $('#room');
    var gTables = $('#r-tables', room);
    var gBalloons = $('#r-balloons', room);
    var gBalls = $('#r-balls', room);
    var cake = $('#r-cake', room);
    var garland = $('#r-garland', room);
    var theme = $('#r-theme', room);
    var themeIcon = $('#r-theme-icon', room);
    var whiteboard = $('[data-show="clase"]', room);
    var win = $('#r-window', room);
    var sun = $('#r-sun', room);
    var nameTag = $('#r-name', room);

    function el(tag, attrs, parent) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    }
    function popOn(node, delay) {
      if (reduceMotion) { node.classList.add('on'); return; }
      setTimeout(function () { requestAnimationFrame(function () { node.classList.add('on'); }); }, delay || 0);
    }
    function setOn(node, on, delay) {
      if (on) { if (!node.classList.contains('on')) popOn(node, delay); }
      else node.classList.remove('on');
    }

    /* bolas del parque */
    (function () {
      var cols = ['#F2A3A0', '#9FCBE6', '#FFFFFF', '#7EA6D9', '#F2A3A0', '#FFFFFF'];
      for (var i = 0; i < 34; i++) {
        var x = 272 + (i % 12) * 9.5 + (Math.floor(i / 12) % 2 ? 4.5 : 0);
        var y = 165 - Math.floor(i / 12) * 7;
        el('circle', { cx: x, cy: y, r: 4.6, fill: cols[(i * 7) % cols.length], stroke: '#E3D9BF', 'stroke-width': .6 }, gBalls);
      }
    })();

    /* mesas: 6 huecos (fila delantera y trasera) */
    var SLOTS = [
      { x: 58, y: 238, s: 1 }, { x: 70, y: 196, s: .74 },
      { x: 152, y: 238, s: 1 }, { x: 140, y: 196, s: .74 },
      { x: 246, y: 238, s: 1 }, { x: 210, y: 196, s: .74 }
    ];
    var drawOrder = [1, 3, 5, 0, 2, 4]; // primero la fila de atrás para que la delantera quede encima
    var tableNodes = [];
    drawOrder.forEach(function (i) {
      var sl = SLOTS[i];
      var g = el('g', { transform: 'translate(' + sl.x + ' ' + sl.y + ') scale(' + sl.s + ')' }, gTables);
      var p = el('g', { 'class': 'pop' }, g);
      [-27, -9, 9, 27].forEach(function (cx) {
        el('rect', { x: cx - 6, y: -42, width: 12, height: 18, rx: 4, fill: '#1F4E5F' }, p);
      });
      el('rect', { x: -40, y: -26, width: 80, height: 7, rx: 3, fill: '#FFFFFF', stroke: '#D9CFB2', 'stroke-width': 1.2 }, p);
      el('rect', { x: -36, y: -19, width: 3.5, height: 19, rx: 1.5, fill: '#C9C1A7' }, p);
      el('rect', { x: 32.5, y: -19, width: 3.5, height: 19, rx: 1.5, fill: '#C9C1A7' }, p);
      var plates = el('g', { 'class': 'pop pop--fade plates' }, p);
      [-24, -8, 8, 24].forEach(function (cx) { el('ellipse', { cx: cx, cy: -27.5, rx: 5.5, ry: 2, fill: '#DCEDF8', stroke: '#9FCBE6', 'stroke-width': .8 }, plates); });
      tableNodes[i] = { pop: p, plates: plates, slot: sl };
    });

    function balloonCluster(cx, baseY, colors, delay) {
      var g = el('g', {}, gBalloons);
      var offs = [[-12, -72], [12, -78], [0, -96], [-21, -94], [21, -98]];
      colors.forEach(function (c, i) {
        var o = offs[i % offs.length];
        var b = el('g', { 'class': 'pop' }, g);
        var inner = el('g', { 'class': 'balloon', style: 'animation-delay:' + (-i * 0.7) + 's' }, b);
        el('path', { d: 'M' + (cx + o[0]) + ' ' + (baseY + o[1] + 14) + ' Q ' + (cx + o[0] / 2 + 3) + ' ' + (baseY + o[1] / 2 + 6) + ' ' + cx + ' ' + baseY, fill: 'none', stroke: '#8A9AA8', 'stroke-width': .9 }, inner);
        el('ellipse', { cx: cx + o[0], cy: baseY + o[1], rx: 12, ry: 14.5, fill: c, stroke: c === '#FFFFFF' ? '#D9CFB2' : 'none', 'stroke-width': 1 }, inner);
        el('path', { d: 'M' + (cx + o[0] - 2) + ' ' + (baseY + o[1] + 15.5) + 'h4l-2 -2.4z', fill: c === '#FFFFFF' ? '#D9CFB2' : c }, inner);
        el('ellipse', { cx: cx + o[0] - 4.5, cy: baseY + o[1] - 5, rx: 2.8, ry: 4, fill: '#fff', opacity: .55 }, inner);
        popOn(b, (delay || 0) + i * 110);
      });
    }

    var THEMES = [
      { re: /dino|jur[aá]sic|t-?rex/i, d: 'M-11 7c2 0 3-1 4-4 1-4 4-6 8-6 3 0 4-1 5-4h4c1 0 1 2 0 3l-2 1c0 4-2 6-4 7v3M-6 7v3m6-3v3m-4-10-1-3m5 2v-3' },
      { re: /princes|reina|corona|hada/i, d: 'M-11 8h22l2-14-7 5-5-9-5 9-7-5z' },
      { re: /f[uú]tbol|bal[oó]n|valencia|bar[cç]a|madrid/i, d: 'M0-11a11 11 0 1 0 .01 0zM0-5l5 3.5-2 6h-6l-2-6zM0-5v-6M5-1.5l6-2M3 4.5l3.5 5M-3 4.5l-3.5 5M-5-1.5l-6-2' },
      { re: /hallow|calabaz|terror|miedo/i, d: 'M0-6c-7-1-11 3-11 8s4 8 11 8 11-3 11-8-4-9-11-8zM0-6v-4l3-2M-5 0l2 2 2-2M1 0l2 2 2-2M-4 6h8' },
      { re: /navid|noel|reyes|invier/i, d: 'M0-12l-8 11h4l-6 8h20l-6-8h4zM0 7v4' },
      { re: /unicorn|arco|rainbow/i, d: 'M-11 6a11 11 0 0 1 22 0M-6 6a6 6 0 0 1 12 0' },
      { re: /espac|cohete|astron|planeta/i, d: 'M0-12c5 4 6 10 4 16h-8c-2-6-1-12 4-16zM-4 4l-4 5h4M4 4l4 5h-4M0-4v.1' },
      { re: /.+/, d: 'M0-11l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L0 5.5l-6.5 3.4 1.3-7.2-5.3-5.1 7.3-1z' }
    ];

    var lastType = null;
    var lastName = '';
    function renderRoom() {
      var tipo = val('tipo');
      var n = num(ninos), a = num(adultos), total = n + a;

      /* globos según tipo */
      if (tipo !== lastType) {
        gBalloons.innerHTML = '';
        if (tipo) {
          var conf = TYPES[tipo].balloons;
          if (conf[0]) balloonCluster(112, 150, conf[0], 0);
          if (conf[1]) balloonCluster(246, 150, conf[1], 220);
        }
        lastType = tipo;
      }
      setOn(whiteboard, tipo === 'clase');

      /* ventana según franja */
      var fr = val('franja');
      var skies = { 'mañana': ['#EAF4FB', 38, 76, '#F2C230'], 'mediodía': ['#DCEDF8', 56, 38, '#F2C230'], 'tarde': ['#FCE6D2', 72, 70, '#F6A86B'], 'noche': ['#2C4C66', 70, 40, '#FFF3C7'] };
      if (fr && current >= 2) {
        var sk = skies[fr];
        win.setAttribute('fill', sk[0]);
        $('#r-sun-pos', room).setAttribute('transform', 'translate(' + sk[1] + ' ' + sk[2] + ')');
        $('circle', sun).setAttribute('fill', sk[3]);
        $('.moon-cut', sun).setAttribute('opacity', fr === 'noche' ? 1 : 0);
        setOn(sun, true);
      } else {
        win.setAttribute('fill', '#EAF4FB');
        setOn(sun, false);
      }

      /* mesas según personas (a partir del paso 3) */
      var count = reached >= 3 ? Math.max(1, Math.min(6, Math.ceil(total / 10))) : 0;
      if (total === 0) count = 0;
      var cat = extras().indexOf('catering') > -1 && reached >= 4;
      var k = 0;
      [0, 1, 2, 3, 4, 5].forEach(function (i) {
        var t = tableNodes[i];
        var on = i < count;
        setOn(t.pop, on, k * 90);
        if (on) k++;
        setOn(t.plates, on && cat, 250 + i * 60);
      });

      /* tarta sobre la primera mesa */
      var tarta = extras().indexOf('tarta') > -1 && count > 0;
      $('#r-cake-pos', room).setAttribute('transform', 'translate(' + SLOTS[0].x + ' ' + (SLOTS[0].y - 26) + ')');
      setOn(cake, tarta, 200);

      /* guirnalda: decoración propia */
      setOn(garland, extras().indexOf('deco') > -1);

      /* temática */
      var tv = tema.value.trim();
      if (tv) {
        var th = THEMES.filter(function (x) { return x.re.test(tv); })[0];
        themeIcon.innerHTML = '';
        el('path', { d: th.d }, themeIcon);
        setOn(theme, true);
      } else setOn(theme, false);

      /* nombre en el cartel */
      var nm = nombre.value.trim();
      if (nm !== lastName) {
        nameTag.textContent = nm ? 'La fiesta de ' + nm : '';
        nameTag.classList.remove('on');
        if (nm) popOn(nameTag, 0);
        lastName = nm;
      }

      /* texto bajo la ilustración */
      var bits = [];
      if (tipo) bits.push(TYPES[tipo].label);
      if (fecha.value) bits.push(shortDate(fecha.value) + (fr ? ' · ' + fr : ''));
      if (count) bits.push(total + ' personas · ' + plural(count, 'mesa', 'mesas'));
      caption.textContent = bits.length ? bits.join(' · ') : 'Tu sala, lista para montar';
    }

    updateUI();
  }

  /* ======================================================
     MAPA 3D (MapLibre + OpenFreeMap), carga diferida
     ====================================================== */
  var mapEl = $('#map');
  if (mapEl && 'IntersectionObserver' in window) {
    var mapIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { mapIO.disconnect(); loadMap(); }
    }, { rootMargin: '600px 0px' });
    mapIO.observe(mapEl);
  }

  function loadMap() {
    var V = '4.7.1';
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/maplibre-gl@' + V + '/dist/maplibre-gl.css';
    document.head.appendChild(css);
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/maplibre-gl@' + V + '/dist/maplibre-gl.js';
    s.onload = initMap;
    document.head.appendChild(s);
  }

  function initMap() {
    if (!window.maplibregl) return;
    try {
      var center = [-0.4039251, 39.4072586];
      var map = new maplibregl.Map({
        container: mapEl,
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: center,
        zoom: 16.9,
        pitch: 58,
        bearing: -24,
        maxPitch: 70,
        cooperativeGestures: true,
        attributionControl: { compact: true },
        locale: {
          'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl + rueda para hacer zoom en el mapa',
          'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + rueda para hacer zoom en el mapa',
          'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa',
          'NavigationControl.ZoomIn': 'Acercar',
          'NavigationControl.ZoomOut': 'Alejar',
          'NavigationControl.ResetBearing': 'Orientar al norte'
        }
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', function () {
        var layers = map.getStyle().layers;
        layers.forEach(function (l) {
          var id = l.id;
          try {
            if (l.type === 'background') map.setPaintProperty(id, 'background-color', '#FBF4DC');
            else if (/water/.test(id) && l.type === 'fill') map.setPaintProperty(id, 'fill-color', '#CFE6F3');
            else if (/park|wood|landcover/.test(id) && l.type === 'fill') map.setPaintProperty(id, 'fill-color', '#EEF0D6');
            else if (/landuse_residential/.test(id)) map.setPaintProperty(id, 'fill-color', '#F7EED3');
            else if (id === 'building') map.setLayoutProperty(id, 'visibility', 'none');
            else if (/highway|road/.test(id) && l.type === 'line' && !/casing/.test(id)) map.setPaintProperty(id, 'line-color', '#FFFFFF');
            else if (/casing/.test(id) && l.type === 'line') map.setPaintProperty(id, 'line-color', '#EADFBF');
            else if (l.type === 'symbol' && map.getPaintProperty(id, 'text-color') !== undefined) map.setPaintProperty(id, 'text-color', '#4A6B8A');
          } catch (e) { /* capa sin esa propiedad */ }
        });
        var firstLabel = (layers.filter(function (l) { return l.type === 'symbol'; })[0] || {}).id;
        map.addLayer({
          id: 'mi-3d',
          type: 'fill-extrusion',
          source: 'openmaptiles',
          'source-layer': 'building',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 10], 0, '#FFF4DC', 9, '#FBE6C2', 15, '#C4E1F4', 28, '#9FCBE6'],
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 10],
            'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
            'fill-extrusion-opacity': 0.92
          }
        }, firstLabel);
        try { map.setLight({ anchor: 'viewport', color: '#FFF4DA', intensity: 0.28, position: [1.2, 200, 40] }); } catch (e) {}
        mapEl.classList.add('is-ready');
      });

      var m = document.createElement('div');
      m.className = 'marker';
      m.setAttribute('role', 'img');
      m.setAttribute('aria-label', 'Momentos Infinitos, Carrer Huelva 9');
      m.innerHTML = '<svg aria-hidden="true"><use href="#mi-symbol"/></svg>';
      new maplibregl.Marker({ element: m, anchor: 'bottom', offset: [0, -6] }).setLngLat(center).addTo(map);

      if (!reduceMotion) {
        map.once('idle', function () { map.easeTo({ bearing: 8, duration: 5200, easing: function (t) { return 1 - Math.pow(1 - t, 3); } }); });
      }
    } catch (err) {
      /* sin WebGL: se queda el bloque alternativo */
    }
  }
})();
