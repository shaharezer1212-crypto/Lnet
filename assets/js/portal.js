/* Participant portal: passcode gate, the course path, and one page per session
   (recording, presentation, files, prep reading, task for next time).
   Content lives in content/course.json (edit it with admin.html).
   Open portal.html#demo to see the portal filled with example content. */
(function () {
  "use strict";
  var KEY = "lnet-portal-pass", DEMO = "lnet-portal-demo";
  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data = null, authed = false;

  function store(kind, key, value) {
    try {
      var st = window[kind];
      if (value === undefined) return st.getItem(key);
      if (value === null) st.removeItem(key); else st.setItem(key, value);
    } catch (e) { return null; }
  }
  if (location.hash === "#demo") { store("sessionStorage", DEMO, "1"); history.replaceState(null, "", "#home"); }
  if (window.SITE && SITE.portalDemoLink && store("sessionStorage", DEMO) !== "1") {
    $("demo-link").hidden = false;
    $("demo-link").querySelector("a").addEventListener("click", function (e) {
      e.preventDefault(); store("sessionStorage", DEMO, "1"); location.reload();
    });
  }
  var demo = store("sessionStorage", DEMO) === "1";

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  /* ---------- time ---------- */
  var dayFmt = new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "2-digit", month: "2-digit", timeZone: "Asia/Jerusalem" });
  var timeFmt = new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jerusalem" });
  function whenText(s) {
    var start = new Date(s.date), end = new Date(start.getTime() + (s.durationMinutes || 90) * 60000);
    return dayFmt.format(start) + ", " + timeFmt.format(start) + " עד " + timeFmt.format(end);
  }
  function state(s, now) {
    var start = new Date(s.date).getTime(), end = start + (s.durationMinutes || 90) * 60000;
    if (now < start - 30 * 60000) return "future";
    if (now <= end) return "live";
    return "past";
  }
  var STATE_TEXT = { past: "התקיים", live: "מתקיים עכשיו", future: "בקרוב" };

  /* ---------- media ---------- */
  function recordingEmbed(rec) {
    var url = (rec && rec.url || "").trim(), m;
    if (!url) return null;
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/))([\w-]{6,})/))) return { iframe: "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0" };
    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/))) return { iframe: "https://player.vimeo.com/video/" + m[1] + (m[2] ? "?h=" + m[2] : "") };
    if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) return { iframe: "https://drive.google.com/file/d/" + m[1] + "/preview" };
    if (rec.type === "file" || /\.(mp4|webm|mov)(\?|$)/i.test(url)) return { video: url };
    return { iframe: url };
  }
  function slidesEmbed(url) {
    url = (url || "").trim();
    var m;
    if (!url) return null;
    if ((m = url.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/))) return { src: "https://docs.google.com/presentation/d/" + m[1] + "/embed?start=false&loop=false", open: url, label: "Google Slides" };
    if (/canva\.com\/design\//.test(url)) return { src: url.split("?")[0].replace(/\/(edit|view)$/, "/view") + "?embed", open: url, label: "Canva" };
    if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) return { src: "https://drive.google.com/file/d/" + m[1] + "/preview", open: url, label: "Google Drive" };
    if (/\.pdf(\?|#|$)/i.test(url)) return { src: url + "#view=FitH", open: url, label: "PDF" };
    // a deck from this site (slides/session-N/index.html): shown live, with its animations
    if (!/^https?:/i.test(url) && /\.html?(\?|#|$)/i.test(url)) return { src: url, open: url, label: "מצגת" };
    return { src: null, open: url, label: "קישור" };
  }
  function host(url) {
    try { return new URL(url, location.href).hostname.replace(/^www\./, ""); } catch (e) { return ""; }
  }

  /* ---------- pieces ---------- */
  function player(s, st) {
    var e = recordingEmbed(s.recording);
    if (e && e.iframe) return el("div", { class: "player" }, [el("iframe", { src: e.iframe, title: "הקלטת מפגש " + s.number, loading: "lazy", allow: "autoplay; fullscreen; picture-in-picture", allowfullscreen: true })]);
    if (e && e.video) return el("div", { class: "player" }, [el("video", { src: e.video, controls: true, preload: "metadata", playsinline: true })]);
    var msg = st === "future" ? "המפגש עוד לא התקיים. ההקלטה תעלה כאן עד יום אחריו." : st === "live" ? "המפגש מתקיים עכשיו. ההקלטה תעלה כאן אחריו." : "ההקלטה תעלה כאן עד יום אחרי המפגש.";
    return el("div", { class: "player player--empty" }, [
      el("img", { class: "player__peek", src: "assets/img/claude-peek.webp", alt: "", width: 640, height: 503 }),
      el("p", { text: msg })
    ]);
  }

  function fileList(items, emptyText) {
    var ul = el("ul");
    if (!items || !items.length) { ul.appendChild(el("li", { class: "empty", text: emptyText })); return ul; }
    items.forEach(function (m) {
      var kind = (m.kind || "LINK").toUpperCase();
      ul.appendChild(el("li", null, [el("a", { href: m.url, target: "_blank", rel: "noopener" }, [
        el("span", { class: "file-kind", text: kind }), el("span", { text: m.title })
      ])]));
    });
    return ul;
  }

  /* ---------- home ---------- */
  var countTimer = null;
  function renderNext() {
    var now = Date.now();
    var next = data.sessions.find(function (s) { return state(s, now) !== "past"; });
    var box = $("next-up");
    box.hidden = false;
    if (!next) {
      $("next-label").textContent = "הסדנה הסתיימה";
      $("next-title").textContent = "כל ההקלטות והחומרים נשארים כאן בשבילכם.";
      $("next-when").textContent = ""; $("next-count").textContent = "";
      $("next-zoom").hidden = true; $("next-open").hidden = true;
      return;
    }
    var st = state(next, now);
    $("next-label").textContent = st === "live" ? "מתקיים עכשיו" : "המפגש הבא";
    $("next-title").textContent = "מפגש " + next.number + ": " + next.title;
    $("next-when").textContent = whenText(next);
    $("next-open").href = "#" + next.id; $("next-open").hidden = false;
    var zoom = $("next-zoom");
    if (next.zoomUrl && st === "live") { zoom.href = next.zoomUrl; zoom.hidden = false; } else zoom.hidden = true;
    var count = $("next-count"), diff = new Date(next.date).getTime() - now;
    count.textContent = "";
    if (st === "live") { count.append("LIVE"); count.appendChild(el("small", { text: "הצטרפו עכשיו" })); return; }
    var days = Math.floor(diff / 86400000), hours = Math.floor((diff % 86400000) / 3600000), mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) { count.append(String(days)); count.appendChild(el("small", { text: (days === 1 ? "יום" : "ימים") + " ו־" + hours + " שעות עד המפגש" })); }
    else { count.append(hours + ":" + String(mins).padStart(2, "0")); count.appendChild(el("small", { text: "שעות ודקות עד המפגש" })); }
  }

  function renderPath() {
    var now = Date.now(), list = $("path-list");
    list.textContent = "";
    var flyAt = -1;
    data.sessions.forEach(function (s, i) {
      var st = state(s, now);
      if (flyAt < 0 && st !== "past") flyAt = i;
      list.appendChild(el("li", { class: "stop hatched is-" + st, "data-sketch": true }, [
        el("a", { class: "stop__link", href: "#" + s.id, "aria-label": "מפגש " + s.number + ": " + s.title + ". " + STATE_TEXT[st] }, [
          el("span", { class: "stop__top" }, [
            el("span", { class: "stop__num", "aria-hidden": "true", text: String(s.number) }),
            el("span", { class: "stop__state", text: STATE_TEXT[st] })
          ]),
          el("span", { class: "stop__date", text: whenText(s) }),
          el("span", { class: "stop__title", text: s.title })
        ])
      ]));
    });
    // the butterfly moves on by itself: it waits on the next (or live) session
    var fly = el("img", { class: "path__fly", src: "assets/img/fly-wide.webp", alt: "", width: 640, height: 576 });
    if (flyAt < 0) { fly.classList.add("is-finished"); list.appendChild(fly); }
    else list.children[flyAt].appendChild(fly);
    $("path-progress").textContent = "";
  }

  function renderToolkit() {
    var t = data.toolkit || {}, shown = 0;
    [["toolkit-skills", t.skills], ["toolkit-links", t.links]].forEach(function (p) {
      var old = $(p[0]), card = old.closest(".hatched");
      if (!p[1] || !p[1].length) { card.hidden = true; return; }
      var ul = fileList(p[1]); ul.id = p[0]; old.replaceWith(ul); card.hidden = false; shown++;
    });
    document.querySelector(".toolkit").hidden = !shown;
  }

  /* ---------- one session ---------- */
  function renderSession(s) {
    var now = Date.now(), st = state(s, now), i = data.sessions.indexOf(s);
    var root = $("session-root");
    root.textContent = "";

    root.appendChild(el("p", { class: "s-crumbs" }, [el("a", { href: "#home", text: "כל המפגשים" })]));
    root.appendChild(el("header", { class: "s-head" }, [
      el("div", null, [
        el("p", { class: "s-kicker" }, [
          el("span", { class: "s-num", text: String(s.number) }),
          "מפגש " + s.number + ". " + whenText(s) + ". " + STATE_TEXT[st]
        ]),
        el("h1", { id: "session-title", tabindex: "-1", text: s.title }),
        s.summary ? el("p", { class: "s-summary", text: s.summary }) : null
      ])
    ]));

    var main = el("div", { class: "s-main" }, [player(s, st)]);
    var topics = el("ul", { class: "s-topics" });
    (s.topics || []).forEach(function (t) { topics.appendChild(el("li", { text: t })); });
    main.appendChild(el("section", { class: "s-block" }, [el("h2", { text: st === "future" ? "מה נעשה במפגש" : "מה עשינו במפגש" }), topics]));

    var side = el("aside", { class: "s-side", "aria-label": "חומרי המפגש" });
    if (s.zoomUrl && st !== "past") {
      side.appendChild(el("section", { class: "side-card side-card--zoom hatched", "data-sketch": true }, [
        el("h2", { text: st === "live" ? "המפגש מתקיים עכשיו" : "קישור לזום" }),
        el("p", { text: whenText(s) }),
        el("a", { class: "btn btn--small", href: s.zoomUrl, target: "_blank", rel: "noopener", text: "הצטרפות לזום" })
      ]));
    }
    var sl = slidesEmbed(s.slides && s.slides.url);
    if (sl && sl.src) {
      // the deck gets the full width of the main column, in 16:9, right under the recording
      main.insertBefore(el("section", { class: "s-block s-deck" }, [
        el("div", { class: "s-deck__head" }, [
          el("h2", { text: "המצגת" }),
          el("a", { class: "btn btn--small btn--ghost", href: sl.open, target: "_blank", rel: "noopener", text: "פתיחה במסך מלא" })
        ]),
        el("div", { class: "slides" }, [el("iframe", { src: sl.src, title: "המצגת של מפגש " + s.number, loading: "lazy", allowfullscreen: true })]),
        el("p", { class: "s-empty", text: "לוחצים על המצגת ועוברים בין השקפים בחיצים או ברווח." })
      ]), main.children[1]);
    } else if (sl) {
      side.appendChild(el("section", { class: "side-card hatched", "data-sketch": true }, [
        el("h2", { text: "המצגת" }),
        el("a", { class: "btn btn--small", href: sl.open, target: "_blank", rel: "noopener", text: "פתיחת המצגת בחלון חדש" })
      ]));
    }
    // a card shows only when it has something in it
    if (s.files && s.files.length) side.appendChild(el("section", { class: "side-card materials hatched", "data-sketch": true }, [
      el("h2", { text: "קבצים להורדה" }), fileList(s.files)
    ]));
    // articles and links to read before the session, in place of the old "להרחבה" block
    var prep = s.prep || s.links;
    if (prep && prep.length) side.appendChild(el("section", { class: "side-card materials side-card--prep hatched", "data-sketch": true }, [
      el("h2", null, ["הכנות לקראת המפגש ", el("small", { class: "side-card__tag", text: "(מומלץ)" })]),
      fileList(prep)
    ]));
    var hw = s.homework || {};
    if (hw.title) {
      side.appendChild(el("section", { class: "side-card side-card--task hatched", "data-sketch": true }, [
        el("h2", { text: "משימה עד המפגש הבא" }),
        el("h3", { text: hw.title }),
        hw.text ? el("p", { text: hw.text }) : null,
        hw.url ? el("a", { class: "btn btn--small", href: hw.url, target: "_blank", rel: "noopener", text: "לפרטי המשימה" }) : null
      ]));
    }
    root.appendChild(el("div", { class: "s-grid" }, [main, side]));

    var prev = data.sessions[i - 1], next = data.sessions[i + 1];
    root.appendChild(el("nav", { class: "s-pager", "aria-label": "מעבר בין מפגשים" }, [
      prev ? el("a", { class: "s-pager__link", href: "#" + prev.id }, [el("small", { text: "המפגש הקודם" }), el("span", { text: prev.number + ". " + prev.title })]) : el("span"),
      next ? el("a", { class: "s-pager__link s-pager__link--next", href: "#" + next.id }, [el("small", { text: "המפגש הבא" }), el("span", { text: next.number + ". " + next.title })]) : el("span")
    ]));
  }

  /* ---------- views ---------- */
  function route() {
    if (!authed) return;
    var id = location.hash.replace("#", "");
    var s = data.sessions.find(function (x) { return x.id === id; });
    $("gate").hidden = true;
    $("logout").hidden = false;
    $("nav-home").hidden = !s;
    $("view-home").hidden = !!s;
    $("view-session").hidden = !s;
    window.scrollTo(0, 0);
    if (s) {
      renderSession(s);
      document.title = "מפגש " + s.number + " | אזור המשתתפים";
      window.Sketch && window.Sketch.drawIn($("view-session"), reduced);
      $("session-title").focus({ preventScroll: true });
    } else {
      renderNext(); renderPath(); renderToolkit();
      document.title = "אזור המשתתפים | Claude, השותף החדש שלך";
      window.Sketch && window.Sketch.drawIn($("view-home"), reduced);
    }
  }

  function enter() {
    authed = true;
    $("home-cohort").textContent = data.course.title + ". " + (data.course.cohort || "");
    $("demo-ribbon").hidden = !data.course.demo;
    clearInterval(countTimer);
    countTimer = setInterval(function () { if (!$("view-home").hidden) renderNext(); }, 30000);
    route();
  }

  function showGate() {
    authed = false;
    $("gate").hidden = false;
    $("view-home").hidden = true; $("view-session").hidden = true;
    $("logout").hidden = true; $("nav-home").hidden = true;
    clearInterval(countTimer);
    window.Sketch && window.Sketch.drawIn($("gate"), reduced);
  }

  function tryPass(pass) { return sha256(pass.trim()).then(function (h) { return h === data.passcodeHash; }); }

  $("gate-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("passcode"), err = $("gate-error");
    if (!input.value.trim()) { err.textContent = "צריך להקליד את קוד הכניסה."; input.focus(); return; }
    if (!data) { err.textContent = "התוכן עוד נטען. נסו שוב בעוד שנייה."; return; }
    tryPass(input.value).then(function (ok) {
      if (ok) { err.textContent = ""; store("localStorage", KEY, input.value.trim()); input.value = ""; enter(); $("home-title").focus(); }
      else { err.textContent = "הקוד לא נכון. בדקו את מייל ההרשמה ונסו שוב."; input.select(); }
    });
  });
  $("logout").addEventListener("click", function () { store("localStorage", KEY, null); location.hash = "#home"; showGate(); $("passcode").focus(); });
  window.addEventListener("hashchange", route);
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll("[data-sketch]"), function (n, k) { if (n.offsetParent && window.Sketch) window.Sketch.frame(n, k + 1); });
    }, 150);
  });

  if (!window.crypto || !crypto.subtle) $("gate-error").textContent = "הדפדפן הזה לא תומך בכניסה. פתחו את הדף בכרום, אדג׳, ספארי או פיירפוקס עדכניים.";
  showGate();
  fetch(demo ? "content/course.demo.json" : "content/course.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) {
      data = json;
      var saved = store("localStorage", KEY);
      if (saved) return tryPass(saved).then(function (ok) { if (ok) enter(); else store("localStorage", KEY, null); });
    })
    .catch(function () { $("gate-error").textContent = "לא הצלחנו לטעון את תוכן הסדנה. רעננו את הדף."; });
})();
