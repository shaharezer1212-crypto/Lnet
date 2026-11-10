(function () {
  "use strict";
  var SITE = window.SITE || {};
  document.documentElement.classList.add("js");

  // קישורי יצירת קשר מתוך ההגדרות
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    var value = SITE[key];
    if (!value) { a.hidden = true; return; }
    if (key === "email") { a.href = "mailto:" + value; a.textContent = value; }
    else { a.href = value; }
  });

  // רשימת הפרויקטים
  var list = document.querySelector("[data-projects]");
  if (list) {
    var tilts = [-3, 2.5, -2, 3.5];
    (window.PROJECTS || []).forEach(function (p, i) {
      var el = document.createElement(p.url ? "a" : "article");
      el.className = "project";
      if (p.url) el.href = p.url;
      el.setAttribute("data-reveal", "");

      var media = document.createElement("div");
      media.className = "project__media";
      var images = p.images || [];
      var panel = document.createElement("figure");
      panel.className = "panel" + (images.length ? "" : " panel--todo");
      panel.style.setProperty("--r", tilts[i % tilts.length] + "deg");
      panel.style.setProperty("--ar", "16 / 9");
      if (images.length) {
        var img = document.createElement("img");
        img.src = images[0]; img.alt = p.title + ", " + p.client; img.loading = "lazy";
        panel.appendChild(img);
      } else {
        var note = document.createElement("figcaption");
        note.className = "panel__note";
        note.textContent = "כאן: צילום מסך של הפרויקט";
        panel.appendChild(note);
      }
      media.appendChild(panel);
      if (images.length > 1) {
        var strip = document.createElement("div");
        strip.className = "project__strip";
        images.slice(1).forEach(function (src, n) {
          var f = document.createElement("figure");
          f.className = "panel";
          f.style.setProperty("--r", (n % 2 ? 2 : -2) + "deg");
          f.style.setProperty("--ar", "16 / 9");
          var t = document.createElement("img");
          t.src = src; t.alt = ""; t.loading = "lazy";
          f.appendChild(t);
          strip.appendChild(f);
        });
        media.appendChild(strip);
      }

      var body = document.createElement("div");
      var num = document.createElement("div");
      num.className = "project__num";
      num.textContent = (i < 9 ? "0" : "") + (i + 1);
      var title = document.createElement("h3");
      title.className = "project__title";
      title.textContent = p.title;
      var meta = document.createElement("ul");
      meta.className = "project__meta";
      [p.client, p.type, p.year].forEach(function (m) {
        if (!m) return;
        var li = document.createElement("li");
        li.textContent = m;
        meta.appendChild(li);
      });
      var text = document.createElement("p");
      text.className = "project__text";
      text.textContent = p.text;
      body.append(num);
      if (p.award) {
        var award = document.createElement("div");
        award.className = "project__award";
        award.textContent = p.award;
        body.append(award);
      }
      body.append(title, meta, text);
      if (p.stats && p.stats.length) {
        var stats = document.createElement("dl");
        stats.className = "project__stats";
        p.stats.forEach(function (st) {
          var d = document.createElement("div");
          var dd = document.createElement("dd"); dd.textContent = st.num;
          var dt = document.createElement("dt"); dt.textContent = st.label;
          d.append(dd, dt);
          stats.appendChild(d);
        });
        body.append(stats);
      }

      el.append(media, body);
      list.appendChild(el);
    });
    var count = document.querySelector("[data-project-count]");
    if (count) count.textContent = "(" + (window.PROJECTS || []).length + ")";
  }

  // חשיפה בגלילה
  function reveal() {
    var targets = document.querySelectorAll("[data-reveal], .display");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
  // כשהפתיח רץ, הכותרות נחשפות רק אחריו
  if (document.getElementById("intro")) document.addEventListener("intro:done", reveal, { once: true });
  else reveal();

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
