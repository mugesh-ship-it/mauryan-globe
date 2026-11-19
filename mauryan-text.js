/* Mauryan text interactions (GSAP + SplitText + ScrollTrigger).
   Enable per element with data-text-anim = reveal | words | fill | underline ; numbers: data-count="1200" (+ optional data-count-suffix).
   Each mode only runs where its attribute exists, so effects can be switched on one at a time in the Designer. */
(function () {
  function start() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var q = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var trig = function (el, start) { return { trigger: el, start: start || "top 68%", once: true }; };

    /* 1. masked line reveal */
    q('[data-text-anim="reveal"]').forEach(function (el) {
      if (reduce) return;
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true, linesClass: "text-line",
        onSplit: function (self) {
          return gsap.from(self.lines, { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.08, delay: 0.2, scrollTrigger: trig(el) });
        }
      });
    });

    /* 2. word fade + rise (hero intro) */
    q('[data-text-anim="words"]').forEach(function (el) {
      if (reduce) return;
      SplitText.create(el, {
        type: "words", autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.words, { opacity: 0, y: 24, filter: "blur(6px)", duration: 0.8, ease: "power3.out", stagger: 0.05, delay: 0.2, scrollTrigger: trig(el) });
        }
      });
    });

    /* 3. scroll-scrubbed colour fill */
    q('[data-text-anim="fill"]').forEach(function (el) {
      if (reduce) return;
      SplitText.create(el, {
        type: "words", autoSplit: true,
        onSplit: function (self) {
          return gsap.fromTo(self.words, { opacity: 0.25 }, { opacity: 1, ease: "none", stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
        }
      });
    });

    /* 4. number count-up */
    q("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-count-suffix") || "";
      if (isNaN(end)) return;
      var dec = (String(el.getAttribute("data-count")).split(".")[1] || "").length;
      var fmt = function (v) { return v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; };
      if (reduce) { el.textContent = fmt(end); return; }
      var o = { v: 0 }; el.textContent = fmt(0);
      gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v); }, scrollTrigger: trig(el) });
    });

    /* 5. underline draw on <em>/<span data-underline> inside a heading */
    q('[data-text-anim="underline"]').forEach(function (el) {
      el.style.position = "relative"; el.style.display = "inline-block";
      var line = document.createElement("span");
      line.setAttribute("aria-hidden", "true");
      line.style.cssText = "position:absolute;left:0;bottom:-.08em;height:2px;width:100%;background:#0c51ee;transform-origin:left;transform:scaleX(0)";
      el.appendChild(line);
      if (reduce) { line.style.transform = "none"; return; }
      gsap.to(line, { scaleX: 1, duration: 0.9, delay: 0.5, ease: "power3.inOut", scrollTrigger: trig(el) });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
