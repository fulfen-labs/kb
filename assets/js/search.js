// Search for the knowledge base: loads search.json once, matches every word of the query against the title,
// summary, tags and text, and lists the results. No dependencies, no network beyond search.json, no storage.
(() => {
  const form = document.querySelector('form.search');
  if (!form) return;
  const input = form.querySelector('input');
  const status = form.querySelector('#search-status');
  const list = form.querySelector('#search-results');
  let index = null;
  const load = () => index || (index = fetch(form.dataset.index).then((r) => r.json()));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const run = async () => {
    const q = input.value.trim().toLowerCase();
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!q) { list.hidden = true; list.innerHTML = ''; status.textContent = ''; return; }
    const docs = await load();
    const words = q.split(/\s+/);
    const hits = docs.filter((d) => {
      const hay = [d.title, d.summary, d.tags.join(' '), d.content].join(' ').toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    list.innerHTML = hits.map((d) => `<li><time datetime="${esc(d.date)}">${esc(d.label)}</time><div><h3><a href="${esc(d.url)}">${esc(d.title)}</a></h3><p>${esc(d.summary)}</p></div></li>`).join('');
    list.hidden = hits.length === 0;
    status.textContent = hits.length === 1 ? '1 article found.' : `${hits.length} articles found.`;
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 200); });
  const start = new URL(location.href).searchParams.get('q');
  if (start) { input.value = start; run(); }
})();
