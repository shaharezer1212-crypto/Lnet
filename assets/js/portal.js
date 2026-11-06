/* Participant portal: passcode gate, sessions, recordings and materials.
   Content lives in content/course.json (edit it with admin.html). */
(function () {
  "use strict";
  var KEY = "lnet-portal-pass";
  var $ = function (id) { return document.getElementById(id); };
  var data = null;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  var dayFmt = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "2-digit", month: "2-digit", timeZone: "Asia/Jerusalem" });
  var timeFmt = new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jerusalem" });
  function whenText(s) {
    var start = new Date(s.date);
    var end = new Date(start.getTime() + (s.durationMinutes || 90) * 60000);
    return dayFmt.format(start) + ", " + timeFmt.format(start) + " עד " + timeFmt.format(end);
  }
  function state(s, now) {
    var start = new Date(s.date).getTime();
    var end = start + (s.durationMinutes || 90) * 60000;
    if (now < start - 30 * 60000) return "future";
    if (now <= end) return "live";
    return "past";
  }

  /* ---------- recordings ---------- */
  function embedUrl(rec) {
    var url = (rec && rec.url || "").trim();
    if (!url) return null;
    var m;
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/))([\w-]{6,})/))) {
      return { kind: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0" };
    }
    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/))) {
      return { kind: "iframe", src: "https://player.vimeo.com/video/" + m[1] + (m[2] ? "?h=" + m[2] : "") };
    }
    if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) {
      return { kind: "iframe", src: "https://drive.google.com/file/d/" + m[1] + "/preview" };
    }
    if (rec.type === "file" || /\.(mp4|webm|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
    return { kind: "iframe", src: url };
  }

  function player(s, st) {
    var e = embedUrl(s.recording);
    if (e && e.kind === "iframe") {
      return el("div", { class: "player" }, [el("iframe", {
        src: e.src, title: "הקלטת מפגש " + s.number + ": " + s.title, loading: "lazy",
        allow: "autoplay; fullscreen; picture-in-picture", allowfullscreen: ""
      })]);
    }
    if (e && e.kind === "video") {
      return el("div", { class: "player" }, [el("video", { src: e.src, controls: "", preload: "metadata" })]);
    }
    var msg = st === "future" ? "המפגש עוד לא התקיים." : st === "live" ? "המפגש מתקיים עכשיו. ההקלטה תעלה כאן אחריו." : "ההקלטה תעלה כאן עד יום אחרי המפגש.";
    return el("div", { class: "player player--empty" }, [el("p", { text: msg })]);
  }

  function fileList(items, emptyText) {
    var ul = el("ul");
    if (!items || !items.length) { ul.appendChild(el("li", { class: "empty", text: emptyText })); return ul; }
    items.forEach(function (m) {
      var kind = (m.kind || "LINK").toUpperCase();
      ul.appendChild(el("li", null, [el("a", {
        href: m.url, target: "_blank", rel: "noopener", download: kind === "LINK" ? null : ""
      }, [el("span", { class: "file-kind", text: kind }), el("span", { text: m.title })])]));
    });
    return ul;
  }

  var chevron = '<svg class="module__chev" viewBox="0 0 22 22" aria-hidden="true"><path d="M5 8l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderModules(now) {
    var wrap = $("modules");
    wrap.textContent = "";
    var lastHeld = null;
    data.sessions.forEach(function (s) { if (state(s, now) !== "future") lastHeld = s.id; });
    if (!lastHeld) lastHeld = data.sessions[0] && data.sessions[0].id;

    data.sessions.forEach(function (s) {
      var st = state(s, now);
      var det = el("details", { class: "module" + (st === "live" ? " is-live" : st === "future" ? " is-locked" : "") });
      if (s.id === lastHeld) det.open = true;
      var sum = el("summary", null, [
        el("span", { class: "module__num", "aria-hidden": "true", text: String(s.number) }),
        el("span", null, [
          el("span", { class: "module__title", text: s.title }),
          el("br"),
          el("span", { class: "module__date", text: "מפגש " + s.number + ", " + whenText(s) + (st === "live" ? ". מתקיים עכשיו" : "") })
        ])
      ]);
      sum.insertAdjacentHTML("beforeend", chevron);
      det.appendChild(sum);

      var side = el("div", { class: "materials" }, [
        el("h4", { text: "חומרים להורדה" }),
        fileList(s.materials, st === "future" ? "החומרים יעלו אחרי המפגש." : "חומרים יעלו אחרי המפגש."),
        el("h4", { text: "מה עושים במפגש", style: "margin-top:1.4rem" }),
        (function () { var ul = el("ul", { class: "topics" }); (s.topics || []).forEach(function (t) { ul.appendChild(el("li", { text: t })); }); return ul; })()
      ]);
      if (s.zoomUrl && st !== "past") {
        side.appendChild(el("p", { style: "margin-top:1.2rem" }, [el("a", { class: "btn btn--small", href: s.zoomUrl, target: "_blank", rel: "noopener", text: "קישור לזום של המפגש" })]));
      }
      det.appendChild(el("div", { class: "module__body" }, [player(s, st), side]));
      wrap.appendChild(det);
    });
  }

  /* ---------- next session ---------- */
  var countTimer = null;
  function renderNext() {
    var now = Date.now();
    var next = data.sessions.find(function (s) { return state(s, now) !== "past"; });
    var box = $("next-up");
    if (!next) {
      box.hidden = false;
      $("next-label").textContent = "הסדנה הסתיימה";
      $("next-title").textContent = "כל ההקלטות והחומרים נשארים כאן בשבילכם.";
      $("next-when").textContent = "";
      $("next-count").textContent = "";
      $("next-zoom").hidden = true;
      return;
    }
    var st = state(next, now);
    box.hidden = false;
    $("next-label").textContent = st === "live" ? "מתקיים עכשיו" : "המפגש הבא";
    $("next-title").textContent = "מפגש " + next.number + ": " + next.title;
    $("next-when").textContent = whenText(next);
    var zoom = $("next-zoom");
    if (next.zoomUrl && st === "live") { zoom.href = next.zoomUrl; zoom.hidden = false; } else { zoom.hidden = true; }

    var diff = new Date(next.date).getTime() - now;
    var count = $("next-count");
    count.textContent = "";
    if (st === "live") {
      count.appendChild(document.createTextNode("LIVE"));
      count.appendChild(el("small", { text: "הצטרפו עכשיו" }));
    } else {
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      if (days > 0) {
        count.appendChild(document.createTextNode(String(days)));
        count.appendChild(el("small", { text: (days === 1 ? "יום" : "ימים") + " ו־" + hours + " שעות עד המפגש" }));
      } else {
        count.appendChild(document.createTextNode(hours + ":" + String(mins).padStart(2, "0")));
        count.appendChild(el("small", { text: "שעות ודקות עד המפגש" }));
      }
    }
  }

  function renderToolkit() {
    var t = data.toolkit || {};
    var sk = $("toolkit-skills"); sk.replaceWith(fileList(t.skills, "קובצי ה־Skills יעלו כאן אחרי המפגש השני."));
    var ln = $("toolkit-links"); ln.replaceWith(fileList(t.links, "עוד אין קישורים."));
  }

  function showDash() {
    $("gate").hidden = true;
    $("dash").hidden = false;
    $("logout").hidden = false;
    $("dash-cohort").textContent = data.course.title + ". " + (data.course.cohort || "");
    renderNext();
    renderModules(Date.now());
    renderToolkit();
    clearInterval(countTimer);
    countTimer = setInterval(renderNext, 30000);
    $("dash-title").focus && $("dash-title").setAttribute("tabindex", "-1");
  }

  function showGate() {
    $("gate").hidden = false;
    $("dash").hidden = true;
    $("logout").hidden = true;
    clearInterval(countTimer);
  }

  function tryPass(pass) {
    return sha256(pass.trim()).then(function (h) { return h === data.passcodeHash; });
  }

  function boot() {
    $("gate-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("passcode");
      var err = $("gate-error");
      if (!input.value.trim()) { err.textContent = "צריך להקליד את קוד הכניסה."; input.focus(); return; }
      if (!data) { err.textContent = "התוכן עוד נטען. נסו שוב בעוד שנייה."; return; }
      tryPass(input.value).then(function (ok) {
        if (ok) { err.textContent = ""; store(KEY, input.value.trim()); input.value = ""; showDash(); $("dash-title").focus(); }
        else { err.textContent = "הקוד לא נכון. בדקו את מייל ההרשמה ונסו שוב."; input.select(); }
      });
    });
    $("logout").addEventListener("click", function () { store(KEY, null); showGate(); $("passcode").focus(); });

    fetch("content/course.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (json) {
        data = json;
        var saved = store(KEY);
        if (saved) return tryPass(saved).then(function (ok) { if (ok) showDash(); else store(KEY, null); });
      })
      .catch(function () {
        $("gate-error").textContent = "לא הצלחנו לטעון את תוכן הסדנה. רעננו את הדף.";
      });
  }

  if (!window.crypto || !crypto.subtle) {
    $("gate-error").textContent = "הדפדפן הזה לא תומך בכניסה. פתחו את הדף בכרום, אדג׳, ספארי או פיירפוקס עדכניים.";
  }
  boot();
})();
