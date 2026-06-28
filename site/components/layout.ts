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
  ogImage?: string
  tags?: string[]
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
    ogImage = CONFIG.OG_IMAGE || undefined,
    tags,
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
    <meta property="og:locale" content="en_US" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />\n    <meta property="og:image:alt" content="${fullTitle}" />` : ""}
    ${pubDate ? `<meta property="article:published_time" content="${pubDate}" />` : ""}
    ${ogType === "article" && tags?.length ? tags.map((t) => `<meta property="article:tag" content="${t}" />`).join("\n    ") : ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ""}
    ${CONFIG.TWITTER_HANDLE ? `<meta name="twitter:creator" content="${CONFIG.TWITTER_HANDLE}" />\n    <meta name="twitter:site" content="${CONFIG.TWITTER_HANDLE}" />` : ""}

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
    <link rel="stylesheet" href="https://unpkg.com/bamboo.css">
    <link rel="stylesheet" href="${CONFIG.STYLES_HREF}">
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
    ${CONFIG.ANALYTICS_DOMAIN && CONFIG.ANALYTICS_WEBSITE_ID ? `<script defer src="https://${CONFIG.ANALYTICS_DOMAIN}/script.js" data-website-id="${CONFIG.ANALYTICS_WEBSITE_ID}"></script>` : ""}
  </head>
  <body>
    <header class="site-header">
      <div class="site-bar">
        <a href="/" class="site-brand">
          <span class="site-prompt">${CONFIG.FAVICON_EMOJI}</span>${CONFIG.BLOG_BRAND}
        </a>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">
          <span class="theme-icon theme-icon-dark">◑</span>
          <span class="theme-icon theme-icon-light">◐</span>
        </button>
      </div>
      <p class="site-tagline">~ ${CONFIG.BLOG_SUBTITLE}</p>
      ${renderNavBar(path)}
    </header>
    <main>
      ${content}
    </main>
    <footer class="site-footer">
      <span class="footer-copy">© ${new Date().getFullYear()} ${CONFIG.AUTHOR}</span>
      <span class="footer-links">
        ${CONFIG.SOCIALS.map((s) => `<a href="${s.href}">${s.title}</a>`).join("")}
      </span>
    </footer>
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
