/* Landing page behaviour: intro, scroll drawing, the characters, register links. */
(function () {
  "use strict";
  var SITE = window.SITE || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function store(kind, key, value) {
    try {
      var s = window[kind];
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------------- intro ---------------- */
  var intro = $("#intro");
  function setupIntro() {
    if (!intro) return;
    var seen = store("sessionStorage", "lnet-intro-seen") === "1";
    if (SITE.intro === false || reduced || seen) { intro.remove(); return; }

    var stage = $(".intro__stage", intro);
    var done = false, timer = null;
    document.documentElement.style.overflow = "hidden";

    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      store("sessionStorage", "lnet-intro-seen", "1");
      intro.classList.add("is-done");
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { intro.remove(); }, 800);
      var h = $("#hero-title");
      if (h) { h.setAttribute("tabindex", "-1"); }
    }
    function onKey(e) { if (e.key === "Escape") finish(); }
    document.addEventListener("keydown", onKey);
    $("#intro-skip").addEventListener("click", finish);

    function runSketch() {
      $$(".intro__sketch path", intro).forEach(function (p) {
        p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1);
      });
      intro.classList.add("is-drawing");
      timer = setTimeout(finish, 3400);
    }

    var src = SITE.introVideo;
    if (!src) { runSketch(); return; }

    // Try the film first; fall back to the drawn intro if it cannot load.
    var video = document.createElement("video");
    video.muted = true; video.playsInline = true; video.autoplay = true;
    video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.poster = "assets/video/intro-first.jpg";
    var fellBack = false;
    function fallback() {
      if (fellBack || done) return;
      fellBack = true;
      video.remove();
      runSketch();
    }
    video.addEventListener("error", fallback);
    video.addEventListener("loadeddata", function () {
      if (fellBack) return;
      $$(".intro__sketch", intro).forEach(function (el) { el.remove(); });
      var p = video.play();
      if (p && p.catch) p.catch(fallback);
      // Safety net: never hold the page longer than the film plus a beat.
      var ms = isFinite(video.duration) ? video.duration * 1000 + 3000 : 15000;
      timer = setTimeout(finish, Math.min(ms, 20000));
    });
    // The film ends on the drawn room, laid out exactly like the hero art:
    // dissolve into the colour picture, hold a beat, then open the page.
    video.addEventListener("ended", function () {
      intro.classList.add("is-revealed");
      clearTimeout(timer);
      timer = setTimeout(finish, 1500);
    });
    // WebM (VP9) is smaller and plays in browsers without H.264; MP4 covers Safari.
    var webm = src.replace(/\.mp4$/, ".webm");
    video.src = (webm !== src && video.canPlayType('video/webm; codecs="vp9"')) ? webm : src;
    // the photo stays above the film, invisible until the reveal
    stage.insertBefore(video, stage.firstChild);
    // Network too slow: draw the sketch instead of staring at blank paper.
    setTimeout(function () { if (video.readyState < 2) fallback(); }, 1800);
  }

  /* ---------------- timeline track ---------------- */
  var timeline = $("#timeline");
  var track = timeline && $(".timeline__track", timeline);
  var bfly = timeline && $(".timeline__butterfly", timeline);
  var trackPath = null, trackLen = 0;
  var sessions = timeline ? $$(".session", timeline) : [];

  function buildTrack() {
    if (!track) return;
    var h = timeline.offsetHeight;
    track.setAttribute("viewBox", "0 0 40 " + h);
    track.style.height = h + "px";
    // a hand-drawn vertical line: small, slow wobble around x = 20
    var d = "M20 0", step = 60;
    for (var y = step, i = 0; y <= h + step; y += step, i++) {
      var yy = Math.min(y, h);
      var x = 20 + Math.sin(i * 1.7) * 3.2 + Math.cos(i * 0.6) * 1.6;
      var cx = 20 + Math.sin(i * 1.7 + 0.9) * 4;
      d += " Q" + cx.toFixed(1) + " " + (yy - step / 2).toFixed(1) + " " + x.toFixed(1) + " " + yy.toFixed(1);
      if (yy === h) break;
    }
    $$("path", track).forEach(function (p) { p.setAttribute("d", d); });
    trackPath = $(".ink", track);
    trackLen = Math.ceil(trackPath.getTotalLength());
    track.style.setProperty("--len", trackLen);
  }

  var lastBy = 0;
  function updateTrack() {
    if (!trackPath) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    // progress: 0 when the list top reaches 70% of the viewport, 1 when its bottom does
    var start = vh * 0.7;
    var p = (start - r.top) / Math.max(1, r.height);
    p = Math.max(0, Math.min(1, p));
    if (reduced) p = 1;
    track.style.setProperty("--p", p.toFixed(4));
    if (bfly) {
      var pt = trackPath.getPointAtLength(trackLen * p);
      var by = pt.y - bfly.offsetHeight * 0.55;
      var tilt = Math.max(-14, Math.min(14, (by - lastBy) * 0.8));
      lastBy = by;
      bfly.style.transform = "translateY(" + by.toFixed(1) + "px) rotate(" + (reduced ? 0 : tilt).toFixed(1) + "deg)";
      bfly.style.opacity = p <= 0 ? "0.5" : "1";
      // a session lights up once the butterfly has flown past its number
      sessions.forEach(function (li) {
        var num = li.firstElementChild;
        var cy = li.offsetTop + num.offsetTop + num.offsetHeight / 2;
        li.classList.toggle("is-reached", pt.y >= cy);
      });
    }
  }

  /* ---------------- the characters ---------------- */
  // Each [data-scene] gets --p (linear) and --e (eased) as it travels from the
  // bottom of the viewport (0) to 40% from the top (1); the footer runs while
  // the last screen scrolls by. CSS moves the cut-outs from these two numbers.
  var scenes = $$("[data-scene]");
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function updateScenes() {
    var vh = window.innerHeight;
    var maxY = document.documentElement.scrollHeight - vh;
    scenes.forEach(function (el) {
      var p;
      if (reduced) p = 1;
      else if (el.tagName === "FOOTER") p = 1 - (maxY - window.scrollY) / (vh * 0.9);
      else p = (vh - el.getBoundingClientRect().top) / (vh * 0.6);
      p = Math.max(0, Math.min(1, p));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--e", easeOut(p).toFixed(4));
      var run = el.querySelector(".runner");
      if (run) {
        // two running frames swapped every ~40px of scrolling; a jump on arrival
        // the run ends when the card's top reaches 55% of the screen, early enough
        // that the page can always scroll that far
        var rp = reduced ? 1 : Math.max(0, Math.min(1, (vh - el.getBoundingClientRect().top) / (vh * 0.45)));
        run.style.setProperty("--rp", rp.toFixed(4));
        var step = Math.floor(window.scrollY / 40);
        run.dataset.frame = rp >= 0.995 ? "end" : rp <= 0 ? "a" : (step % 2 ? "b" : "a");
        run.style.setProperty("--bob", (step % 2).toString());
        run.style.setProperty("--lean", rp > 0 && rp < 0.995 ? "-6" : "0");
      }
    });
  }

  /* ---------------- hand-drawn frames ---------------- */
  // Each [data-sketch] element gets a pencil outline (assets/js/sketch.js),
  // drawn in as the card scrolls into view.
  var sketched = $$("[data-sketch]");
  function drawFrames() {
    if (!window.Sketch) return;
    sketched.forEach(function (el, k) { window.Sketch.frame(el, k); });
  }
  function updateFrames() {
    var vh = window.innerHeight;
    sketched.forEach(function (el) {
      // drawn while its top travels from the bottom of the screen to 55% up
      var d = reduced ? 1 : (vh - el.getBoundingClientRect().top) / (vh * 0.45);
      el.style.setProperty("--d", Math.max(0, Math.min(1, d)).toFixed(3));
    });
  }

  /* ---------------- scroll ---------------- */
  var head = $(".site-head");
  var heroImg = $(".hero__art img");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      if (head) head.classList.toggle("is-scrolled", y > 8);
      if (heroImg && !reduced && y < window.innerHeight * 1.2) {
        heroImg.style.setProperty("--parallax", Math.min(40, y * 0.08).toFixed(1) + "px");
      }
      updateTrack();
      updateScenes();
      updateFrames();
    });
  }

  /* ---------------- links ---------------- */
  function setupLinks() {
    if (SITE.registerUrl) {
      $$("[data-register]").forEach(function (a) { a.href = SITE.registerUrl; });
    } else {
      $$("[data-register]").forEach(function (a) { a.href = "#price"; });
    }
    if (SITE.questionsUrl) $$("[data-questions]").forEach(function (a) { a.href = SITE.questionsUrl; a.target = "_blank"; a.rel = "noopener"; });
    var li = $("#linkedin-link");
    if (li) {
      if (SITE.linkedinUrl) li.href = SITE.linkedinUrl; else li.remove();
    }
  }

  /* ---------------- boot ---------------- */
  setupIntro();
  setupLinks();

  function relayout() { buildTrack(); drawFrames(); updateTrack(); updateScenes(); updateFrames(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("load", relayout);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(relayout, 120); }, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  relayout();
  onScroll();
})();
