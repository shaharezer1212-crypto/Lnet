/* Deck controls: fit 1920×1080 slides to the window, keyboard and click
   navigation (right-to-left: ← or Space goes forward), speaker notes (N),
   full screen (F), and #n in the address for a given slide. Pencil frames on
   cards are drawn in each time a slide opens. */
(function () {
  "use strict";
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var notes = document.getElementById("notes"), counter = document.getElementById("counter");
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var printing = /[?&]print\b/.test(location.search);
  var i = 0;

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty("--scale", s.toFixed(4));
  }

  function frames(slide, animate) {
    if (!window.Sketch) return;
    if (animate) { window.Sketch.drawIn(slide, reduced); return; }
    Array.prototype.forEach.call(slide.querySelectorAll("[data-sketch]"), function (el, k) {
      window.Sketch.frame(el, k + 1); el.style.setProperty("--d", "1");
    });
  }

  // mark what animates on each slide (see "motion" in deck.css)
  var RISE = ".kicker, h1, h2, .lede, .big, .note, .quote, .bullets > li, .checks > li, .agenda > li, .chips > li, .card, .why__row, .scale, .scale__legend, .sources";
  slides.forEach(function (slide) {
    var k = 0;
    Array.prototype.forEach.call(slide.querySelectorAll(RISE + ", .char, .split__art, .me__photo, .cover__art, .end__art, .end__slogan"), function (el) {
      if (el.parentElement.closest("[data-a]")) return;
      var src = el.getAttribute("src") || "";
      var kind = el.matches(".cover__art, .end__art") ? "fade" : el.tagName === "IMG" && !el.matches(".end__slogan") ? (/fly-/.test(src) ? "fly" : "pop") : "rise";
      el.dataset.a = kind;
      el.style.setProperty("--i", k++);
    });
  });

  // big numbers count up when their slide opens
  function countUp(slide) {
    Array.prototype.forEach.call(slide.querySelectorAll(".fact b"), function (b) {
      var final = b.dataset.final || (b.dataset.final = b.textContent);
      var m = final.match(/^(\d+)([KM])$/);
      if (!m || reduced) { b.textContent = final; return; }
      var target = m[2] === "M" ? +m[1] * 1000 : +m[1], t0 = null;
      function step(t) {
        if (t0 === null) t0 = t;
        var u = Math.min(1, (t - t0) / 1400), v = Math.round(target * (1 - Math.pow(1 - u, 3)));
        b.textContent = u >= 1 ? final : (v >= 1000 ? (v / 1000).toFixed(1) + "M" : v + "K");
        if (u < 1) requestAnimationFrame(step);
      }
      b.textContent = "0K";
      setTimeout(function () { requestAnimationFrame(step); }, 500);
    });
  }

  function show(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    var prev = slides[i], next = slides[n], dir = n >= i ? 1 : -1;
    i = n;
    if (prev && prev !== next && prev.classList.contains("is-active")) {
      prev.style.setProperty("--dir", dir);
      prev.classList.remove("is-active", "play");
      prev.classList.add("is-leaving");
      setTimeout(function () { prev.classList.remove("is-leaving"); }, 600);
    }
    slides.forEach(function (s) { if (s !== next) s.setAttribute("aria-hidden", "true"); });
    next.setAttribute("aria-hidden", "false");
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
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === " " || e.key === "PageDown" || e.key === "ArrowDown") { e.preventDefault(); show(i + 1); }
    else if (e.key === "ArrowRight" || e.key === "PageUp" || e.key === "ArrowUp" || e.key === "Backspace") { e.preventDefault(); show(i - 1); }
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(slides.length - 1);
    else if (e.key === "n" || e.key === "N" || e.key === "נ") notes.hidden = !notes.hidden;
    else if (e.key === "f" || e.key === "F" || e.key === "כ") {
      if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    }
  });
  // click: left two thirds forward, right third back (reading direction is right to left)
  document.getElementById("deck").addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    show(e.clientX > window.innerWidth * 2 / 3 ? i - 1 : i + 1);
  });
  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () { var n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== i) show(n - 1); });

  fit();
  var start = parseInt(location.hash.slice(1), 10);
  function boot() {
    if (printing) { slides.forEach(function (s) { s.classList.add("is-active"); frames(s, false); }); document.documentElement.dataset.ready = "1"; return; }
    i = start ? start - 1 : 0;
    show(i);
    document.documentElement.dataset.ready = "1";
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
})();
