/* Landing page behaviour: intro, scroll drawing, register links, contact form. */
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
    video.poster = "assets/img/hero-trio.webp";
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
      $$(".intro__sketch, .intro__photo", intro).forEach(function (el) { el.remove(); });
      var p = video.play();
      if (p && p.catch) p.catch(fallback);
      // Safety net: never hold the page longer than the film plus a beat.
      var ms = isFinite(video.duration) ? video.duration * 1000 + 1500 : 15000;
      timer = setTimeout(finish, Math.min(ms, 20000));
    });
    video.addEventListener("ended", finish);
    video.src = src;
    stage.appendChild(video);
    // Network too slow: draw the sketch instead of staring at blank paper.
    setTimeout(function () { if (video.readyState < 2) fallback(); }, 1800);
  }

  /* ---------------- timeline track ---------------- */
  var timeline = $("#timeline");
  var track = timeline && $(".timeline__track", timeline);
  var bfly = timeline && $(".timeline__butterfly", timeline);
  var trackPath = null, trackLen = 0;

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
      var by = pt.y - 17;
      var tilt = Math.max(-14, Math.min(14, (by - lastBy) * 0.8));
      lastBy = by;
      bfly.style.transform = "translateY(" + by.toFixed(1) + "px) rotate(" + (reduced ? 0 : tilt).toFixed(1) + "deg)";
      bfly.style.opacity = p <= 0 ? "0.35" : "1";
    }
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
    });
  }

  /* ---------------- links ---------------- */
  function setupLinks() {
    if (SITE.registerUrl) {
      $$("[data-register]").forEach(function (a) { a.href = SITE.registerUrl; });
    } else {
      $$("[data-register]").forEach(function (a) { a.href = "#contact"; });
    }
    var li = $("#linkedin-link");
    if (li) {
      if (SITE.linkedinUrl) li.href = SITE.linkedinUrl; else li.remove();
    }
  }

  /* ---------------- contact form ---------------- */
  function setupForm() {
    var form = $("#contact-form");
    if (!form) return;
    var status = $("#cf-status");
    var messages = { name: "צריך למלא שם.", contact: "צריך למלא טלפון או מייל כדי שנוכל לחזור אליכם." };

    function setError(input, msg) {
      var id = input.id + "-err";
      var el = document.getElementById(id);
      if (!msg) { if (el) el.remove(); input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); return; }
      if (!el) {
        el = document.createElement("p");
        el.id = id; el.className = "field__error";
        el.style.cssText = "color:#b3261e;font-weight:700;font-size:var(--step--1);margin:0";
        input.insertAdjacentElement("afterend", el);
      }
      el.textContent = msg;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", id);
    }

    form.addEventListener("input", function (e) { if (e.target.value.trim()) setError(e.target, ""); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      ["name", "contact"].forEach(function (n) {
        var input = form.elements[n];
        if (!input.value.trim()) { setError(input, messages[n]); firstBad = firstBad || input; }
        else setError(input, "");
      });
      if (firstBad) { firstBad.focus(); status.textContent = ""; return; }

      var data = {
        name: form.elements.name.value.trim(),
        contact: form.elements.contact.value.trim(),
        message: form.elements.message.value.trim(),
        source: "Claude workshop landing page"
      };
      var btn = form.querySelector("button[type=submit]");

      if (SITE.contactEndpoint) {
        btn.disabled = true;
        status.textContent = "שולחים...";
        fetch(SITE.contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          status.textContent = "הפרטים נשלחו. שחר יחזור אליכם בקרוב.";
        }).catch(function () {
          status.textContent = "השליחה לא עברה. נסו שוב בעוד רגע, או כתבו לנו ישירות במייל.";
        }).then(function () { btn.disabled = false; });
      } else {
        var body = "שם: " + data.name + "\nטלפון או מייל: " + data.contact + (data.message ? "\n\n" + data.message : "");
        window.location.href = "mailto:" + (SITE.contactEmail || "") +
          "?subject=" + encodeURIComponent("שאלה על סדנת Claude") + "&body=" + encodeURIComponent(body);
        status.textContent = "נפתח חלון מייל עם הפרטים. שלחו אותו ושחר יחזור אליכם.";
      }
    });
  }

  /* ---------------- boot ---------------- */
  setupIntro();
  setupLinks();
  setupForm();
  markNext();

  function relayout() { buildTrack(); updateTrack(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("load", relayout);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(relayout, 120); }, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  relayout();
  onScroll();
})();
