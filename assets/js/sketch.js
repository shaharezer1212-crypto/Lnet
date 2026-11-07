/* Hand-drawn pencil frames, shared by the landing page and the portal.
   Sketch.frame(el, seed) puts an SVG outline inside el: a rounded rectangle traced
   by hand (small wobble, an overshoot where the pencil comes back to the start)
   plus a lighter second pass. CSS draws it in through --d (0..1) on el. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function seeded(n) { return function () { n = (n * 9301 + 49297) % 233280; return n / 233280; }; }

  function roughRect(w, h, r, rnd, jit) {
    var pts = [], step = 34, i, a, rad = Math.PI / 180;
    function push(x, y) { pts.push([x + (rnd() - .5) * jit, y + (rnd() - .5) * jit]); }
    for (i = r; i <= w - r; i += step) push(i, 0);
    for (a = -90; a <= 0; a += 30) push(w - r + r * Math.cos(a * rad), r + r * Math.sin(a * rad));
    for (i = r; i <= h - r; i += step) push(w, i);
    for (a = 0; a <= 90; a += 30) push(w - r + r * Math.cos(a * rad), h - r + r * Math.sin(a * rad));
    for (i = w - r; i >= r; i -= step) push(i, h);
    for (a = 90; a <= 180; a += 30) push(r + r * Math.cos(a * rad), h - r + r * Math.sin(a * rad));
    for (i = h - r; i >= r; i -= step) push(0, i);
    for (a = 180; a <= 270; a += 30) push(r + r * Math.cos(a * rad), r + r * Math.sin(a * rad));
    push(r + 26, -1.5); // overshoot past the start, the way a pencil closes a box
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (i = 1; i < pts.length; i++) {
      var mx = (pts[i - 1][0] + pts[i][0]) / 2, my = (pts[i - 1][1] + pts[i][1]) / 2;
      d += " Q" + pts[i - 1][0].toFixed(1) + " " + pts[i - 1][1].toFixed(1) + " " + mx.toFixed(1) + " " + my.toFixed(1);
    }
    return d;
  }

  function frame(el, seed) {
    var svg = el.querySelector(":scope > .sketch-line");
    if (!svg) {
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "sketch-line");
      svg.setAttribute("aria-hidden", "true");
      svg.appendChild(document.createElementNS(NS, "path"));
      svg.appendChild(document.createElementNS(NS, "path"));
      el.appendChild(svg);
    }
    var w = el.offsetWidth + 6, h = el.offsetHeight + 6;
    if (w < 8 || h < 8) return;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2) + 3;
    var rnd = seeded((seed || 0) * 97 + 13), len = 0;
    Array.prototype.forEach.call(svg.children, function (path, pass) {
      path.setAttribute("d", roughRect(w, h, r, rnd, pass ? 3.2 : 1.6));
      len = Math.max(len, Math.ceil(path.getTotalLength()));
    });
    svg.style.setProperty("--len", len);
  }

  // Frame every [data-sketch] under root and draw them in once (for views that
  // open on a click rather than on scroll).
  function drawIn(root, reduced) {
    var els = Array.prototype.slice.call((root || document).querySelectorAll("[data-sketch]"));
    els.forEach(function (el, k) { frame(el, k + 1); el.style.setProperty("--d", reduced ? "1" : "0"); });
    if (reduced) return;
    var t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      els.forEach(function (el, k) {
        var u = Math.max(0, Math.min(1, (t - t0 - k * 60) / 650));
        el.style.setProperty("--d", (1 - Math.pow(1 - u, 3)).toFixed(3));
      });
      if (t - t0 < 650 + els.length * 60) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.Sketch = { frame: frame, drawIn: drawIn };
})();
