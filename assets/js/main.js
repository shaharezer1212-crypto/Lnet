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
    });
  }

  /* ---------------- hand-drawn frames ---------------- */
  // Each [data-sketch] element gets a pencil outline: a rounded rectangle traced
  // by hand (small wobble, an overshoot where the pencil comes back to the start)
  // plus a lighter second pass. It is drawn in as the card scrolls into view.
  var sketched = $$("[data-sketch]");
  var NS = "http://www.w3.org/2000/svg";
  function seeded(n) { return function () { n = (n * 9301 + 49297) % 233280; return n / 233280; }; }
  function roughRect(w, h, r, rnd, jit) {
    // points around the outline, clockwise from the top-left corner's end
    var pts = [], step = 34, i, a;
    function push(x, y) { pts.push([x + (rnd() - .5) * jit, y + (rnd() - .5) * jit]); }
    for (i = r; i <= w - r; i += step) push(i, 0);
    for (a = -90; a <= 0; a += 30) push(w - r + r * Math.cos(a * Math.PI / 180), r + r * Math.sin(a * Math.PI / 180));
    for (i = r; i <= h - r; i += step) push(w, i);
    for (a = 0; a <= 90; a += 30) push(w - r + r * Math.cos(a * Math.PI / 180), h - r + r * Math.sin(a * Math.PI / 180));
    for (i = w - r; i >= r; i -= step) push(i, h);
    for (a = 90; a <= 180; a += 30) push(r + r * Math.cos(a * Math.PI / 180), h - r + r * Math.sin(a * Math.PI / 180));
    for (i = h - r; i >= r; i -= step) push(0, i);
    for (a = 180; a <= 270; a += 30) push(r + r * Math.cos(a * Math.PI / 180), r + r * Math.sin(a * Math.PI / 180));
    push(r + 26, -1.5); // overshoot past the start, the way a pencil closes a box
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (i = 1; i < pts.length; i++) {
      var mx = (pts[i - 1][0] + pts[i][0]) / 2, my = (pts[i - 1][1] + pts[i][1]) / 2;
      d += " Q" + pts[i - 1][0].toFixed(1) + " " + pts[i - 1][1].toFixed(1) + " " + mx.toFixed(1) + " " + my.toFixed(1);
    }
    return d;
  }
  function drawFrames() {
    sketched.forEach(function (el, k) {
      var svg = el.querySelector(":scope > .sketch-line");
      if (!svg) {
        svg = document.createElementNS(NS, "svg");
        svg.setAttribute("class", "sketch-line"); svg.setAttribute("aria-hidden", "true");
        svg.appendChild(document.createElementNS(NS, "path"));
        svg.appendChild(document.createElementNS(NS, "path"));
        el.appendChild(svg);
      }
      var w = el.offsetWidth + 6, h = el.offsetHeight + 6;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2) + 3;
      var rnd = seeded(k * 97 + 13), len = 0;
      Array.prototype.forEach.call(svg.children, function (path, pass) {
        path.setAttribute("d", roughRect(w, h, r, rnd, pass ? 3.2 : 1.6));
        len = Math.max(len, Math.ceil(path.getTotalLength()));
      });
      svg.style.setProperty("--len", len);
    });
  }
  function updateFrames() {
    var vh = window.innerHeight;
    sketched.forEach(function (el) {
      // drawn while its top travels from the bottom of the screen to 55% up
      var d = reduced ? 1 : (vh - el.getBoundingClientRect().top) / (vh * 0.45);
      el.style.setProperty("--d", Math.max(0, Math.min(1, d)).toFixed(3));
    });
  }

  /* ---------------- next session ---------------- */
  function markNext() {
    var now = Date.now();
    var next = $$(".session[data-date]").find(function (li) {
      // a session stays "next" until it ends (90 minutes after start)
      return new Date(li.dataset.date).getTime() + 90 * 60000 > now;
    });
    if (next) next.classList.add("is-next");
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
  markNext();

  function relayout() { buildTrack(); drawFrames(); updateTrack(); updateScenes(); updateFrames(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("load", relayout);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(relayout, 120); }, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  relayout();
  onScroll();
})();
