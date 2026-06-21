// Site identity, branding, and presentation config.
// This is the main customization surface — edit freely to rebrand or restyle.
// (Content lives in ../content; the build engine lives in ../core.)

export const CONFIG = {
  // The canonical origin of the deployed site (no trailing slash). Used for
  // canonical URLs, Open Graph tags, the sitemap, and the RSS feed.
  BASE_URL: "https://example.com",
  AUTHOR: "Your Name",
  FAVICON_EMOJI: "✦",
  BLOG_TITLE: "Let an agent build your blog",
  // Short slug shown in the header "prompt", e.g. brand@host style.
  BLOG_BRAND: "agentblog",
  BLOG_SUBTITLE: "A typed static site generator.",
  // Public URL of the stylesheet (output path is wired up in ../core/build.ts).
  STYLES_HREF: "/assets/css/index.css",
  SOCIALS: [
    { title: "github", href: "https://github.com/your-handle/let-an-agent-build-your-blog" },
    { title: "rss", href: "/feed.xml" },
  ],
  // Optional privacy-friendly analytics (Umami). Leave both empty to omit the
  // analytics snippet entirely — see site/components/layout.ts.
  ANALYTICS_DOMAIN: "",
  ANALYTICS_WEBSITE_ID: "",
  NAV: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
} as const

export type Link = {
  title: string
  href: string
}
