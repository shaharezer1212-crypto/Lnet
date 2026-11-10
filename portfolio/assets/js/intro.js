// פתיח הלומדה: שלושה מסכים, שיבוש במסך השלישי, ומעבר לאתר.
(function () {
  "use strict";
  var intro = document.getElementById("intro");
  if (!intro) return;

  var SITE = window.SITE || {};
  var seen = false;
  try { seen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}
  var force = /[?&]intro=1/.test(location.search);
  if ((SITE.intro === false || seen) && !force) { intro.remove(); return; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var player = intro.querySelector(".player");
  var slides = intro.querySelectorAll(".slide");
  var menu = intro.querySelectorAll(".player__menu li");
  var next = intro.querySelector("[data-next]");
  var prev = intro.querySelector("[data-prev]");
  var counter = intro.querySelector("[data-counter]");
  var track = intro.querySelector(".player__track i");
  var current = 0;
  var timer = null;
  var done = false;

  intro.hidden = false;
  document.body.classList.add("is-locked");

  function fit() {
    var s = Math.min((innerWidth - 24) / 960, (innerHeight - 70) / 600, 1.25);
    player.style.setProperty("--fit", s.toFixed(3));
  }
  fit();
  addEventListener("resize", fit);

  function show(i) {
    current = i;
    slides.forEach(function (s, n) { s.classList.toggle("is-on", n === i); });
    menu.forEach(function (m, n) {
      m.classList.toggle("is-on", n === i);
      m.classList.toggle("is-done", n < i);
    });
    counter.textContent = "שקף " + (i + 1) + " מתוך 24";
    track.style.width = ((i + 1) / 24 * 100) + "%";
    prev.disabled = i === 0;
    clearTimeout(timer);
    // המסך השלישי משתבש לבד; בשניים הראשונים ממתינים רגע ואז ממשיכים
    timer = setTimeout(i === 2 ? glitch : function () { show(i + 1); }, i === 2 ? 1700 : 4200);
  }

  function scramble() {
    var marks = "█▓▒░#/\\<>*?!";
    var nodes = [];
    var walker = document.createTreeWalker(player, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    return setInterval(function () {
      nodes.forEach(function (n) {
        if (Math.random() > 0.35) return;
        n.nodeValue = n.nodeValue.replace(/\S/g, function (c) {
          return Math.random() < 0.3 ? marks[Math.floor(Math.random() * marks.length)] : c;
        });
      });
    }, 70);
  }

  function finish() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    document.body.classList.remove("is-locked");
    removeEventListener("resize", fit);
    removeEventListener("keydown", onKey);
    intro.remove();
    document.dispatchEvent(new Event("intro:done"));
  }

  function glitch() {
    if (done || intro.classList.contains("is-glitch")) return;
    clearTimeout(timer);
    if (reduce) { finish(); return; }
    intro.classList.add("is-glitch");
    var noise = scramble();
    setTimeout(function () {
      clearInterval(noise);
      intro.classList.remove("is-glitch");
      intro.classList.add("is-break");
      setTimeout(finish, 1250);
    }, 1500);
  }

  function onKey(e) {
    if (e.key === "Escape") finish();
  }

  next.addEventListener("click", function () { current < 2 ? show(current + 1) : glitch(); });
  prev.addEventListener("click", function () { if (current > 0) show(current - 1); });
  intro.querySelector(".quiz").addEventListener("click", glitch);
  intro.querySelector("[data-skip]").addEventListener("click", finish);
  addEventListener("keydown", onKey);

  show(0);
})();
