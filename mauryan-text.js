/* Mauryan text interactions (GSAP + SplitText + ScrollTrigger).
   Enable per element with data-text-anim = reveal | words | fill | underline ; numbers: data-count="1200" (+ optional data-count-suffix).
   Each mode only runs where its attribute exists, so effects can be switched on one at a time in the Designer. */
(function () {
  function start() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var q = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var trig = function (el, start) { return inView(el) ? null : { trigger: el, start: "clamp(" + (start || "top 68%") + ")", once: true }; };
    /* anything already on screen at load (hero) plays straight away; ScrollTrigger only fires after the first scroll */
    var inView = function (el) { return el.getBoundingClientRect().top < window.innerHeight * 0.85; };

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

    /* 3. paragraphs (data-text-anim="fill"): no scrub any more, they use the uniform appear-from-bottom below */

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


    /* 6. uniform appear for the content that follows each heading (staggered fade + rise).
       Targets are listed here; add data-appear to any extra element in the Designer. */
    var APPEAR = [
      ".section_supply .w-tab-content",
      ".numbers_text .button-outline", ".numbers_row",
      ".compliance_grid > *", ".compliance_body .button-glass-dark",
      ".global_stage",
      ".usecase_nav", ".usecase_card",
      ".blog_slider", ".blog_controls",
      ".faq_intro .button-outline", ".faq_item",
      ".cta_text p", ".cta_content .button-group",
      ".hero_paragraph", ".section_hero .button-group",
      ".division_panel",
      ".process_steps", ".process_progress", ".process_visual",
      ".footer_contact", ".footer_group", ".footer_band",
      '[data-text-anim="fill"]', "[data-appear]"
    ];
    var seen = [];
    var els = [];
    if (!reduce) {
      APPEAR.forEach(function (sel) { q(sel).forEach(function (el) { if (seen.indexOf(el) < 0) { seen.push(el); els.push(el); } }); });
      if (els.length) {
        gsap.set(els, { opacity: 0, y: 32 });
        var now = els.filter(inView);
        if (now.length) gsap.to(now, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.5, overwrite: true, clearProps: "transform" });
        ScrollTrigger.batch(els.filter(function (e) { return now.indexOf(e) < 0; }), {
          start: "clamp(top 85%)", once: true, interval: 0.1, batchMax: 6,
          onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.3, overwrite: true, clearProps: "transform" }); }
        });
      }
    }


    /* headings inside tab panes that were display:none at load never reach their scroll trigger: play them when the tab is opened */
    function revealPane() {
      q('[data-text-anim="words"],[data-text-anim="reveal"]').forEach(function (h) {
        if (!h.offsetParent || !h.children.length) return;
        var kids = [].slice.call(h.querySelectorAll(".text-line")).length ? h.querySelectorAll(".text-line") : h.children;
        var hidden = [].filter.call(kids, function (k) { return parseFloat(getComputedStyle(k).opacity) < 0.05 || (k.classList.contains("text-line") && h.getBoundingClientRect().height && false); });
        if (hidden.length) gsap.to(hidden, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", stagger: 0.05, overwrite: true, clearProps: "transform,filter" });
      });
    }
    document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".w-tab-link")) { setTimeout(revealPane, 120); setTimeout(revealPane, 600); } });

    /* failsafe for short or zoomed windows (e.g. Windows 125-150%): show anything still hidden once the page has loaded and when the bottom is reached */
    function reveal() {
      if (typeof els === "undefined") return;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && parseFloat(getComputedStyle(el).opacity) === 0) gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", overwrite: true, clearProps: "transform" });
      });
    }
    window.addEventListener("scroll", function () { clearTimeout(reveal.t); reveal.t = setTimeout(reveal, 700); }, { passive: true });
    setTimeout(reveal, 2500);
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
