# Fulfen Labs FDE knowledge base

The public Jekyll site at <https://fulfenlabs.io/kb/>: sourced, dated articles on forward deployed engineering from
Fulfen Labs, in the Fulfen design system's website look. The articles are published here from the private research
repository `fulfen-labs/fde-research`; this repository holds only the templates and the published copies.

> **This README is the owner's guide to the repository**: what it is, where everything is and its current state.
> Last reviewed in full on 24 November 2026; it is updated with every change.

## At a glance

| | |
| --- | --- |
| **What it does** | Builds and serves the knowledge base: a home page with the article list, one page per article (with its contents, sources, handbook chapters and review dates), a tag index, search, an Atom feed, `llms.txt`, `robots.txt` and a sitemap |
| **Who uses it** | Readers, once launched; the sync workflow in `fulfen-labs/fde-research`, which writes `_posts/`; the owner and agent sessions, who change the templates |
| **Run it** | `bundle install && bundle exec jekyll serve`, then open <http://localhost:4000/kb/> |
| **State** | Live but **not launched**: every page is `noindex,nofollow` and nothing on fulfenlabs.io links here |
| **Decisions** | fulfen-labs ADR-0040 (the knowledge base moves to fulfenlabs.io/kb/) and ADR-0041 (the fde-research to kb pipeline), in the private `fulfen-labs/fulfen-labs` repository |

## Current state

On 24 November 2026:

- The site deploys to <https://fulfenlabs.io/kb/> on every push to `main` (GitHub Pages, source "GitHub Actions").
  It is an organisation project site: the custom domain comes from the organisation site `fulfen-labs.github.io`,
  so there is no `CNAME` file here.
- `_posts/` holds one post, `2026-11-24-about.md` ("About this knowledge base"), which belongs to this repository.
  No article has been published yet: seven drafts wait for the owner's review in `fde-research/drafts/`.
- **`launched: false`** in `_config.yml`.
- Pages open in the light theme (fulfen-labs ADR-0039 amendment, owner, 24 November 2026). The sun/moon button in
  the header switches to the dark (ink) theme; `_includes/head.html` applies a saved choice before the first paint, kept
  in `localStorage` under `fulfen-theme`, the same key as fulfenlabs.io, so the choice carries between the two. Without
  JavaScript the page is light. The header stays ink in both themes.

## The launch flag

One line in `_config.yml` opens the site to search engines. Change it only on the owner's yes.

| `launched` | Every page | `robots.txt` | `sitemap.xml` | `llms.txt` |
| --- | --- | --- | --- | --- |
| `false` (now) | `<meta name="robots" content="noindex,nofollow">` | `Disallow: /` | empty | says "not launched" |
| `true` | a canonical link, no robots tag | `Allow: /` and the sitemap | every page | the article list only |

The deploy workflow refuses to publish if `launched` is `false` and any page lacks the `noindex` tag.
Crawlers read `robots.txt` only at a host's root (`fulfenlabs.io/robots.txt`, owned by the organisation site), so
`/kb/robots.txt` is advisory; the `noindex` tag on every page is the gate that counts.

There is no sitemap ping and no IndexNow workflow. At launch, also link `/kb/` from fulfenlabs.io (a change to the
organisation site) and redirect `fde.danielvaughan.com` here (ADR-0040).

## Do not edit articles here

`_posts/` is written by `fde-research`'s `scripts/sync-to-kb.sh`, which mirrors that repository's `articles/` and
deletes what was removed there. A hand edit to a synced post is overwritten on the next sync. Fix an article in
`fde-research`. The one exception is `_posts/*-about.md`, which the sync never touches.

Edit only the templates: `_layouts/`, `_includes/`, `assets/`, the pages (`index.html`, `tags.html`,
`search.html`, `search.json`, `llms.txt`, `robots.txt`, `sitemap.xml`), `_data/handbook.yml` and `_config.yml`.

## What is in this repository

| Path | What it is |
| --- | --- |
| `_config.yml` | Site settings, the permalink `/:slug/` and the `launched` flag |
| `_layouts/` | `default` (header, skip link, footer), `home` (Leadspace hero and article list), `post` (an article), `page` |
| `_includes/` | `head` (the launch gate), `header`, `footer`, `post-list`, `docnav`, `claim`, `artefact` |
| `_data/handbook.yml` | Chapter titles of *The Forward Deployed Engineer's Handbook* (from its `manuscript/Book.txt`, commit 7e1f029) |
| `_posts/` | The articles, synced from `fde-research`; plus the "About" post |
| `assets/css/fulfen-page.css`, `assets/js/fulfen-page.js` | fulfen-ui's page templates (Leadspace, DocNav, SourcedClaim, Artefact), copied from fulfen-labs `site/fulfen-ui/`; refresh from there, never edit here |
| `assets/css/kb.css` | The website look: tokens from fulfen-labs `assets/brand/fulfen-tokens.json` (v1.0.0), base rules from its `tools/site.py`, and this site's own rules; at the end, a copy of `site.py`'s `THEME_CSS`: the light theme (the default) and the theme toggle's look |
| `assets/js/search.js` | Search over `search.json`; no dependencies, no storage |
| `.github/workflows/deploy.yml` | Build with `actions/jekyll-build-pages`, check the gate, deploy |

## Article front matter

The sync writes these fields; the `post` layout shows them.

| Field | Shown as |
| --- | --- |
| `title`, `summary` | The heading and the lede |
| `author` | The byline ("Daniel Vaughan, Fulfen Labs") |
| `slug` | The URL, `/kb/<slug>/`. Fixed once published |
| `date`, `reviewed` | The date line and "Last reviewed" |
| `checked` | The provenance line: "Researched and drafted with AI tools; reviewed and edited by Daniel Vaughan. Sources checked on ..." |
| `tags` | Tag links |
| `handbook` | "In the handbook": chapter numbers, titled from `_data/handbook.yml` |
| `sources` | The numbered sources list: title, link, published, checked |

In an article's Markdown, two fulfen-ui templates are available:

```liquid
{% include claim.html text="The claim." source="Publisher, title" url="https://example.org/" date="2026-11-24" %}

{% capture body %}$ make eval
12 passed, 0 failed{% endcapture %}
{% include artefact.html label="Terminal" name="make eval" kind="terminal" body=body caption="What the run printed." %}
```

## How to run and check

- Build: `bundle exec jekyll build` (the `github-pages` gem, as the deploy uses), or the Pages image.
- The checks run before the first deploy (24 November 2026): axe-core (WCAG 2.0 to 2.2 A and AA) on the home page, an
  article, tags, search and the "About" post at 1280 and 375 px, with no violations; the skip link moves focus to
  `main`; DocNav opens by keyboard on a phone and follows its links; no sideways scrolling at 375 px.

## Related repositories

| Repository | Relationship |
| --- | --- |
| `fulfen-labs/fde-research` (private) | Where research is done and articles drafted; its `articles/` is the source of `_posts/` |
| `fulfen-labs/fulfen-labs` (private) | The Fulfen Labs project: decisions (ADR-0040, ADR-0041), brand guidelines, tokens and the website's builder |
| `fulfen-labs/fulfen-labs.github.io` | fulfenlabs.io; its custom domain serves this site at `/kb/` |

