/* Deck controls and choreography.
   - Fits the 1920×1080 slides to the window; ← or Space forward (right to left), → back,
     N speaker notes, F full screen, Home / End, #n in the address.
   - Every .card gets a pencil outline (assets/js/sketch.js), drawn in when its slide opens.
   - Elements enter one after another ([data-a] + --i, see "motion" in deck.css);
     headline words rise one by one; big numbers count up; the terminal types itself. */
(function () {
  "use strict";
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var notes = document.getElementById("notes"), counter = document.getElementById("counter");
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var printing = /[?&]print\b/.test(location.search);
  var i = 0, timers = [];

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty("--scale", s.toFixed(4));
  }

  /* ---- prepare every slide once ---- */
  var ENTER = [
    [".tag, .vs__badge", "stamp"],
    [".char", "pop"],
    [".big, .mid, .note, .quote, .quote__by, .cover__chip, .cover__sub, .card, .goal__path > li, .agenda > li, .ticks > li, .stop, .term, .timer, .end__slogan, .load, .dial, .sources", "rise"]
  ];
  slides.forEach(function (slide) {
    Array.prototype.forEach.call(slide.querySelectorAll(".card"), function (c) { c.setAttribute("data-sketch", ""); });
    ENTER.forEach(function (pair) {
      Array.prototype.forEach.call(slide.querySelectorAll(pair[0]), function (el) {
        if (el.dataset.a || (el.parentElement && el.parentElement.closest("[data-a]"))) return;
        var kind = pair[1];
        if (kind === "pop" && /fly-/.test(el.getAttribute("src") || "")) kind = "fly";
        el.dataset.a = kind;
      });
    });
    // stagger in reading order
    var k = 0;
    Array.prototype.forEach.call(slide.querySelectorAll("[data-a]"), function (el) { el.style.setProperty("--i", k++); });
    // headline words
    Array.prototype.forEach.call(slide.querySelectorAll(".split"), function (h) {
      var n = 0, parts = [];
      Array.prototype.forEach.call(h.childNodes, function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) parts.push(document.createTextNode(t));
            else { var w = document.createElement("span"); w.className = "w"; w.style.setProperty("--w", n++); w.textContent = t; parts.push(w); }
          });
        } else { node.classList.add("w"); node.style.setProperty("--w", n++); parts.push(node); }
      });
      h.textContent = "";
      parts.forEach(function (p) { h.appendChild(p); });
    });
  });

  function frames(slide, animate) {
    if (!window.Sketch) return;
    if (animate) { window.Sketch.drawIn(slide, reduced); return; }
    Array.prototype.forEach.call(slide.querySelectorAll("[data-sketch]"), function (el, k) { window.Sketch.frame(el, k + 1); el.style.setProperty("--d", "1"); });
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function countUp(slide) {
    Array.prototype.forEach.call(slide.querySelectorAll(".num b"), function (b) {
      var final = b.dataset.final || (b.dataset.final = b.textContent);
      var m = final.match(/^(\d+)([KM])$/);
      if (!m || reduced || printing) { b.textContent = final; return; }
      var target = m[2] === "M" ? +m[1] * 1000 : +m[1];
      b.textContent = "0K";
      later(function () {
        var t0 = null;
        (function step(t) {
          if (t0 === null) t0 = t;
          var u = Math.min(1, (t - t0) / 1500), v = Math.round(target * (1 - Math.pow(1 - u, 3)));
          b.textContent = u >= 1 ? final : (v >= 1000 ? (v / 1000).toFixed(1) + "M" : v + "K");
          if (u < 1) requestAnimationFrame(step);
        })(performance.now());
      }, 900);
    });
  }

  function type(slide) {
    Array.prototype.forEach.call(slide.querySelectorAll(".typer"), function (pre) {
      var lines = pre.dataset.lines.split("|");
      function cls(l, n) { return n === 0 ? "cmd" : /^✓/.test(l) ? "ok" : "dim"; }
      if (reduced || printing) {
        pre.innerHTML = lines.map(function (l, n) { return '<span class="' + cls(l, n) + '">' + l + "</span>"; }).join("\n");
        return;
      }
      pre.textContent = "";
      var caret = document.createElement("span"); caret.className = "caret";
      pre.appendChild(caret);
      var t = 1100;
      lines.forEach(function (line, n) {
        var span = document.createElement("span"); span.className = cls(line, n);
        var speed = n === 0 ? 45 : 14;
        later(function () { if (n) pre.insertBefore(document.createTextNode("\n"), caret); pre.insertBefore(span, caret); }, t);
        for (var c = 1; c <= line.length; c++) (function (c) { later(function () { span.textContent = line.slice(0, c); }, t + c * speed); })(c);
        t += line.length * speed + (n === 0 ? 500 : 380);
      });
    });
  }

  function show(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    var prev = slides[i], next = slides[n], dir = n >= i ? 1 : -1;
    timers.forEach(clearTimeout); timers = [];
    i = n;
    if (prev && prev !== next && prev.classList.contains("is-active")) {
      prev.style.setProperty("--dir", dir);
      prev.classList.remove("is-active", "play");
      prev.classList.add("is-leaving");
      setTimeout(function () { prev.classList.remove("is-leaving"); }, 700);
    }
    slides.forEach(function (s) { s.setAttribute("aria-hidden", s === next ? "false" : "true"); });
    next.style.setProperty("--dir", dir);
    next.classList.remove("play");
    next.classList.add("is-entering");
    void next.offsetWidth;
    next.classList.remove("is-entering");
    next.classList.add("is-active", "play");
    counter.textContent = (i + 1) + " / " + slides.length;
    notes.textContent = next.dataset.notes || "";
    if (location.hash !== "#" + (i + 1)) history.replaceState(null, "", "#" + (i + 1));
    frames(next, true);
    countUp(next);
    type(next);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === " " || e.key === "PageDown" || e.key === "ArrowDown") { e.preventDefault(); show(i + 1); }
    else if (e.key === "ArrowRight" || e.key === "PageUp" || e.key === "ArrowUp" || e.key === "Backspace") { e.preventDefault(); show(i - 1); }
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(slides.length - 1);
    else if (e.key === "n" || e.key === "N" || e.key === "מ") notes.hidden = !notes.hidden;
    else if (e.key === "f" || e.key === "F" || e.key === "כ") {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    }
  });
  // click: the left two thirds go forward, the right third goes back (reading direction)
  document.getElementById("deck").addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    show(e.clientX > window.innerWidth * 2 / 3 ? i - 1 : i + 1);
  });
  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () { var n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== i) show(n - 1); });

  fit();
  var start = parseInt(location.hash.slice(1), 10);
  function boot() {
    if (printing) {
      slides.forEach(function (s) { s.classList.add("is-active"); frames(s, false); countUp(s); type(s); });
      document.documentElement.dataset.ready = "1";
      return;
    }
    i = start ? start - 1 : 0;
    show(i);
    document.documentElement.dataset.ready = "1";
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
})();
