/* Builds an updated content/course.json from a form. Nothing is saved server-side. */
(function () {
  "use strict";
  var data = null, newHash = null;
  var $ = function (id) { return document.getElementById(id); };
  var KINDS = ["PDF", "PPT", "ZIP", "MD", "DOC", "LINK"];
  var LINK_KINDS = ["מאמר", "סרטון", "כלי", "מדריך", "דוגמה"];
  var REC = [["youtube", "YouTube"], ["vimeo", "Vimeo"], ["drive", "Google Drive"], ["file", "קובץ וידאו"]];

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function field(label, input) {
    var id = "f" + Math.random().toString(36).slice(2, 8);
    input.id = id;
    var wrap = document.createElement("div");
    wrap.className = "field";
    var l = document.createElement("label");
    l.htmlFor = id; l.textContent = label;
    wrap.append(l, input);
    return wrap;
  }
  function input(value, onInput, ltr) {
    var i = document.createElement("input");
    i.value = value || "";
    if (ltr) i.dir = "ltr";
    i.addEventListener("input", function () { onInput(i.value.trim()); output(); });
    return i;
  }
  function select(options, value, onChange) {
    var s = document.createElement("select");
    s.style.cssText = "font:inherit;border:1.5px solid #000;border-radius:14px;padding:.6rem .8rem;background:#fff";
    options.forEach(function (o) {
      var opt = document.createElement("option");
      opt.value = Array.isArray(o) ? o[0] : o; opt.textContent = Array.isArray(o) ? o[1] : o;
      s.appendChild(opt);
    });
    s.value = value;
    s.addEventListener("change", function () { onChange(s.value); output(); });
    return s;
  }
  function button(text, onClick, ghost) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn btn--small" + (ghost ? " btn--ghost" : "");
    b.textContent = text; b.addEventListener("click", onClick);
    return b;
  }

  function textarea(value, onInput) {
    var t = document.createElement("textarea");
    t.value = value || "";
    t.rows = 3;
    t.addEventListener("input", function () { onInput(t.value.trim()); output(); });
    return t;
  }
  function group(title, hint) {
    var g = document.createElement("div");
    g.className = "admin-group";
    var h = document.createElement("h3");
    h.textContent = title;
    g.appendChild(h);
    if (hint) { var p = document.createElement("p"); p.className = "admin-hint"; p.textContent = hint; g.appendChild(p); }
    return g;
  }

  // rows editor: cols = [[key, label, kind]] where kind is "text", "ltr" or an options array
  function rowsEditor(list, host, cols, blank, addText) {
    host.textContent = "";
    list.forEach(function (m, i) {
      var row = document.createElement("div");
      row.className = "mat-row";
      row.style.gridTemplateColumns = cols.map(function (c) { return c[2] === "ltr" ? "1.4fr" : Array.isArray(c[2]) ? "auto" : "1fr"; }).join(" ") + " auto";
      cols.forEach(function (c) {
        var key = c[0];
        var ctl = Array.isArray(c[2]) ? select(c[2], m[key] || c[2][0], function (v) { m[key] = v; })
          : input(m[key], function (v) { m[key] = v; }, c[2] === "ltr");
        row.appendChild(field(c[1], ctl));
      });
      row.appendChild(button("הסרה", function () { list.splice(i, 1); rowsEditor(list, host, cols, blank, addText); output(); }, true));
      host.appendChild(row);
    });
    host.appendChild(button(addText, function () {
      list.push(JSON.parse(JSON.stringify(blank))); rowsEditor(list, host, cols, blank, addText); output();
    }));
  }
  var FILE_COLS = [["title", "שם הקובץ", "text"], ["url", "קישור", "ltr"], ["kind", "סוג", KINDS]];
  var LINK_COLS = [["title", "כותרת", "text"], ["url", "קישור", "ltr"], ["kind", "סוג", LINK_KINDS], ["note", "משפט הסבר (לא חובה)", "text"]];

  function render() {
    var wrap = $("sessions");
    data.sessions.forEach(function (s) {
      s.recording = s.recording || { type: "youtube", url: "" };
      s.slides = s.slides || { url: "" };
      s.files = s.files || s.materials || []; delete s.materials;
      s.links = s.links || [];
      s.homework = s.homework || { title: "", text: "", url: "" };
      if (s.summary === undefined) s.summary = "";

      var card = document.createElement("details");
      card.className = "admin-card";
      var sum = document.createElement("summary");
      sum.textContent = "מפגש " + s.number + ": " + s.title;
      card.appendChild(sum);

      var g1 = group("המפגש");
      g1.append(
        field("קישור לזום", input(s.zoomUrl, function (v) { s.zoomUrl = v; }, true)),
        field("סיכום קצר (מופיע מתחת לכותרת)", textarea(s.summary, function (v) { s.summary = v; }))
      );
      var g2 = group("ההקלטה", "YouTube (לא רשום), Vimeo, Google Drive או קישור לקובץ וידאו.");
      g2.append(
        field("איפה ההקלטה", select(REC, s.recording.type, function (v) { s.recording.type = v; })),
        field("קישור להקלטה", input(s.recording.url, function (v) { s.recording.url = v; }, true))
      );
      var g3 = group("המצגת", "קישור שיתוף של Google Slides או Canva, קישור ל־PDF, או כל קישור אחר.");
      g3.append(field("קישור למצגת", input(s.slides.url, function (v) { s.slides.url = v; }, true)));
      var g4 = group("להרחבה", "מאמרים, סרטונים וכלים. כל קישור מופיע ככרטיס עם הסוג ומשפט הסבר.");
      var lh = document.createElement("div"); lh.className = "admin-rows"; g4.appendChild(lh);
      rowsEditor(s.links, lh, LINK_COLS, { title: "", url: "", kind: LINK_KINDS[0], note: "" }, "הוספת קישור");
      var g5 = group("קבצים להורדה");
      var fh = document.createElement("div"); fh.className = "admin-rows"; g5.appendChild(fh);
      rowsEditor(s.files, fh, FILE_COLS, { title: "", url: "", kind: "PDF" }, "הוספת קובץ");
      var g6 = group("משימה עד המפגש הבא", "משאירים ריק אם אין משימה.");
      g6.append(
        field("שם המשימה", input(s.homework.title, function (v) { s.homework.title = v; })),
        field("מה עושים", textarea(s.homework.text, function (v) { s.homework.text = v; })),
        field("קישור לפרטים (לא חובה)", input(s.homework.url, function (v) { s.homework.url = v; }, true))
      );
      card.append(g1, g2, g3, g4, g5, g6);
      wrap.appendChild(card);
    });

    var tk = document.createElement("details");
    tk.className = "admin-card";
    var th = document.createElement("summary");
    th.textContent = "סט ה־Skills וקישורים שימושיים";
    data.toolkit = data.toolkit || { skills: [], links: [] };
    data.toolkit.skills = data.toolkit.skills || [];
    data.toolkit.links = data.toolkit.links || [];
    var gs = group("סט ה־Skills"); var sh = document.createElement("div"); sh.className = "admin-rows"; gs.appendChild(sh);
    var gl = group("קישורים שימושיים"); var lh2 = document.createElement("div"); lh2.className = "admin-rows"; gl.appendChild(lh2);
    tk.append(th, gs, gl);
    rowsEditor(data.toolkit.skills, sh, FILE_COLS, { title: "", url: "", kind: "ZIP" }, "הוספת קובץ");
    rowsEditor(data.toolkit.links, lh2, [["title", "כותרת", "text"], ["url", "קישור", "ltr"]], { title: "", url: "", kind: "LINK" }, "הוספת קישור");
    wrap.appendChild(tk);
  }

  function json() {
    var copy = JSON.parse(JSON.stringify(data));
    if (newHash) copy.passcodeHash = newHash;
    return JSON.stringify(copy, null, 2) + "\n";
  }
  function output() { $("out").value = json(); }

  $("new-pass").addEventListener("input", function (e) {
    var v = e.target.value.trim();
    if (!v) { newHash = null; output(); return; }
    sha256(v).then(function (h) { newHash = h; output(); });
  });
  $("download").addEventListener("click", function () {
    var blob = new Blob([json()], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "course.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    $("admin-status").textContent = "הקובץ ירד. עכשיו מחליפים בו את content/course.json בגיטהאב.";
  });
  $("copy").addEventListener("click", function () {
    var done = function () { $("admin-status").textContent = "הקובץ הועתק."; };
    if (navigator.clipboard) navigator.clipboard.writeText(json()).then(done, function () { $("out").select(); document.execCommand("copy"); done(); });
    else { $("out").select(); document.execCommand("copy"); done(); }
  });

  fetch("content/course.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (j) { data = j; render(); output(); })
    .catch(function () { $("admin-status").textContent = "לא הצלחנו לטעון את content/course.json. פתחו את הדף דרך שרת (לא כקובץ מקומי)."; });
})();
