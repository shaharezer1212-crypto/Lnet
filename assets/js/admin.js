/* Builds an updated content/course.json from a form. Nothing is saved server-side. */
(function () {
  "use strict";
  var data = null, newHash = null;
  var $ = function (id) { return document.getElementById(id); };
  var KINDS = ["PDF", "PPT", "ZIP", "MD", "LINK"];
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

  function materialsEditor(list, host) {
    host.textContent = "";
    list.forEach(function (m, i) {
      var row = document.createElement("div");
      row.className = "mat-row";
      row.append(
        field("שם הקובץ", input(m.title, function (v) { m.title = v; })),
        field("קישור", input(m.url, function (v) { m.url = v; }, true)),
        field("סוג", select(KINDS, m.kind || "PDF", function (v) { m.kind = v; })),
        button("הסרה", function () { list.splice(i, 1); materialsEditor(list, host); output(); }, true)
      );
      host.appendChild(row);
    });
    host.appendChild(button("הוספת קובץ", function () {
      list.push({ title: "", url: "", kind: "PDF" }); materialsEditor(list, host); output();
    }));
  }

  function render() {
    var wrap = $("sessions");
    data.sessions.forEach(function (s) {
      s.recording = s.recording || { type: "youtube", url: "" };
      s.materials = s.materials || [];
      var card = document.createElement("section");
      card.className = "admin-card";
      var h = document.createElement("h2");
      h.textContent = "מפגש " + s.number + ": " + s.title;
      var mats = document.createElement("div");
      mats.style.cssText = "display:grid;gap:.6rem";
      card.append(
        h,
        field("קישור לזום", input(s.zoomUrl, function (v) { s.zoomUrl = v; }, true)),
        field("איפה ההקלטה", select(REC, s.recording.type, function (v) { s.recording.type = v; })),
        field("קישור להקלטה", input(s.recording.url, function (v) { s.recording.url = v; }, true)),
        mats
      );
      materialsEditor(s.materials, mats);
      wrap.appendChild(card);
    });

    var tk = document.createElement("section");
    tk.className = "admin-card";
    var th = document.createElement("h2");
    th.textContent = "סט ה־Skills של הסדנה";
    var tm = document.createElement("div");
    tm.style.cssText = "display:grid;gap:.6rem";
    data.toolkit = data.toolkit || { skills: [], links: [] };
    data.toolkit.skills = data.toolkit.skills || [];
    tk.append(th, tm);
    materialsEditor(data.toolkit.skills, tm);
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
