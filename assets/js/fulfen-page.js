// Fulfen Labs page templates, behaviour for plain pages (theme/fulfen-page.css; fulfen-labs ADR-0037). No
// dependencies, no network, no storage. Load it with <script src="fulfen-page.js" defer></script>: an external file,
// so it runs under a Content-Security-Policy of script-src 'self'.
// - DocNav: open beside the text from 66rem, closed as a disclosure below it; marks the section being read with
//   aria-current="location". Links stay plain anchors: nothing changes how the page scrolls.
// - LifecycleArc: the amber path draws once when the figure first comes into view, and not at all under
//   prefers-reduced-motion (the CSS ignores data-draw then).
(() => {
  const wide = matchMedia('(min-width: 66rem)');

  for (const nav of document.querySelectorAll('.fulfen-docnav')) {
    const details = nav.querySelector('details');
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    if (details) {
      const fit = () => { details.open = wide.matches; };
      fit();
      wide.addEventListener('change', fit);
    }
    // The current section is the last heading whose top has passed a line a third of the way down the viewport.
    let queued = false;
    const mark = () => {
      queued = false;
      const line = innerHeight / 3;
      let current = null;
      for (const t of targets) {
        if (t.getBoundingClientRect().top <= line) current = t;
        else break;
      }
      for (const a of links) {
        const on = current && a.hash.slice(1) === current.id;
        if (on) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      }
    };
    addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(mark);
      }
    }, { passive: true });
    addEventListener('resize', mark);
    // On a narrow screen, close the disclosure after a link is followed, so the section is not under the list.
    for (const a of links) a.addEventListener('click', () => { if (details && !wide.matches) details.open = false; });
    mark();
  }

  const arcs = document.querySelectorAll('.fulfen-arc[data-arc]');
  if (arcs.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        io.unobserve(en.target);
        // Two frames: let the hidden state paint first, so the transition runs.
        requestAnimationFrame(() => requestAnimationFrame(() => en.target.setAttribute('data-draw', 'done')));
      }
    }, { threshold: 0.4 });
    for (const arc of arcs) {
      arc.setAttribute('data-draw', 'pending');
      io.observe(arc);
    }
  }
})();
