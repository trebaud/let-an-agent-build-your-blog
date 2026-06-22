import { CONFIG } from "../site.config"
import { renderNavBar } from "./nav"

export type PageMeta = {
  path: string
  title: string
  description?: string
  canonicalUrl?: string
  ogType?: "website" | "article"
  pubDate?: string
  jsonLd?: string
}

export const renderPage = (meta: PageMeta, content: string) => {
  const {
    path,
    title,
    description = CONFIG.BLOG_SUBTITLE,
    canonicalUrl = `${CONFIG.BASE_URL}${path}`,
    ogType = "website",
    pubDate,
    jsonLd,
  } = meta

  const fullTitle = path === "/" ? CONFIG.BLOG_TITLE : `${title} | ${CONFIG.BLOG_TITLE}`
  const escapedDescription = description.replace(/"/g, "&quot;")

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${fullTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <meta name="author" content="${CONFIG.AUTHOR}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${CONFIG.BLOG_TITLE}" />
    ${pubDate ? `<meta property="article:published_time" content="${pubDate}" />` : ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />

    <!-- Feeds -->
    <link rel="alternate" type="application/rss+xml" title="${CONFIG.BLOG_TITLE}" href="${CONFIG.BASE_URL}/feed.xml" />

    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${CONFIG.FAVICON_EMOJI}</text></svg>">
    <script>
      (function () {
        try {
          var t = localStorage.getItem("theme");
          if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
        } catch (e) {}
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap">
    <link rel="stylesheet" href="${CONFIG.STYLES_HREF}">
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
    ${CONFIG.ANALYTICS_DOMAIN && CONFIG.ANALYTICS_WEBSITE_ID ? `<script defer src="https://${CONFIG.ANALYTICS_DOMAIN}/script.js" data-website-id="${CONFIG.ANALYTICS_WEBSITE_ID}"></script>` : ""}
  </head>
  <body>
    <div class="crt-frame">
    <header class="site-header">
      <!-- Win95-style marquee title bar -->
      <div class="titlebar">
        <div class="titlebar-text">
          <span class="titlebar-icon">${CONFIG.FAVICON_EMOJI}</span>
          <div class="marquee" aria-hidden="true">
            <span class="marquee-track">★ ${CONFIG.BLOG_SUBTITLE} ★ &nbsp;&nbsp;&nbsp; 🚧 Under Construction 🚧 &nbsp;&nbsp;&nbsp; ★ ${CONFIG.BLOG_SUBTITLE} ★ &nbsp;&nbsp;&nbsp; 🚧 Under Construction 🚧 &nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class="titlebar-buttons" aria-hidden="true">
          <span class="winbtn">_</span><span class="winbtn">□</span><span class="winbtn">✕</span>
        </div>
      </div>

      <div class="site-bar">
        <a href="/" class="site-brand">
          <span class="site-prompt">${CONFIG.FAVICON_EMOJI}</span>${CONFIG.BLOG_BRAND}
        </a>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">
          <span class="theme-icon theme-icon-dark">🌙 NIGHT SURF</span>
          <span class="theme-icon theme-icon-light">☀ DAY MODE</span>
        </button>
      </div>
      <p class="site-tagline">${CONFIG.BLOG_SUBTITLE}</p>
      ${renderNavBar(path)}
      <div class="star-rule" aria-hidden="true"></div>
    </header>
    <main>
      ${content}
      <div class="star-rule" aria-hidden="true"></div>
      <div class="construction-banner">
        <span class="blink">🚧</span> This page is under eternal construction <span class="blink">🚧</span>
      </div>
    </main>
    <footer class="site-footer">
      <div class="visitor-counter" aria-label="visitor counter">
        <span class="counter-label">You are visitor</span>
        <span class="counter-digits">#000420</span>
      </div>
      <div class="webring" aria-hidden="true">
        <a href="#">◄ prev</a><span class="webring-sep">·</span><a href="#">[ the agent webring ]</a><span class="webring-sep">·</span><a href="#">next ►</a>
      </div>
      <span class="footer-copy">© 1999–${new Date().getFullYear()} ${CONFIG.AUTHOR} · all rights reserved (probably)</span>
      <span class="footer-links">
        ${CONFIG.SOCIALS.map((s) => `<a href="${s.href}">${s.title}</a>`).join("")}
      </span>
      <p class="footer-netscape">Best viewed in Netscape Navigator at 800×600 🚀</p>
    </footer>
    </div>
    <script>
      (function () {
        var btn = document.getElementById("theme-toggle");
        if (!btn) return;
        btn.addEventListener("click", function () {
          var current =
            document.documentElement.dataset.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
          var next = current === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          try { localStorage.setItem("theme", next); } catch (e) {}
        });
      })();
    </script>
  </body>
</html>`
}
