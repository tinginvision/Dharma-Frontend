/**
 * SEO / social meta — parity with `views/development.ejs` + `api/responses/metaView.js`.
 */

export const SITE_NAME = "Dharma Productions";

export const DEFAULT_META_DESCRIPTION = "Dharma Productions ";

export const DEFAULT_META_KEYWORDS = "Dharma Productions ";

export const OG_DESCRIPTION =
  "Dharma Productions is a leading Indian Film Production and Distribution company. Owned by Karan Johar, the company was founded by his father Late Shri Yash Johar in 1976.";

export const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/twit-banner/tw-banner.jpg";

export const TWITTER_SITE = "@DharmaMovies";

const FAVICON = "/frontend/img/favicon.png";

/** @returns {string} */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://dharma-production.com";
  return raw.replace(/\/+$/, "");
}

/**
 * @param {string | undefined | null} pathOrUrl
 * @returns {string | undefined}
 */
export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return undefined;
  const s = pathOrUrl.trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  const base = getSiteUrl();
  return `${base}${s.startsWith("/") ? s : `/${s}`}`;
}

/**
 * Legacy `htmlToText` + `_.trunc` (~190 chars) for movie synopsis meta.
 * @param {string | undefined | null} html
 * @param {number} [maxLen]
 */
export function plainTextFromHtml(html, maxLen = 190) {
  if (!html || typeof html !== "string") {
    return DEFAULT_META_DESCRIPTION.trim();
  }
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return DEFAULT_META_DESCRIPTION.trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

/**
 * @param {{ title?: string; description?: string; keywords?: string; image?: string; path?: string }} [opts]
 */
export function buildPageMetadata(opts = {}) {
  const title = opts.title?.trim() || "";
  const documentTitle = title ? `${SITE_NAME} | ${title}` : SITE_NAME;
  const metaDescription =
    (opts.description ?? DEFAULT_META_DESCRIPTION).trim() ||
    DEFAULT_META_DESCRIPTION.trim();
  const metaKeywords =
    (opts.keywords ?? DEFAULT_META_KEYWORDS).trim() || DEFAULT_META_KEYWORDS.trim();
  const ogTitle = title || SITE_NAME;
  const path = opts.path?.trim() || "/";
  const canonical = toAbsoluteUrl(path);
  const ogImage = toAbsoluteUrl(opts.image) || DEFAULT_OG_IMAGE;

  return {
    title: documentTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: SITE_NAME }],
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
    },
    icons: {
      icon: FAVICON,
      shortcut: FAVICON,
    },
    openGraph: {
      siteName: SITE_NAME,
      title: ogTitle,
      description: OG_DESCRIPTION,
      images: [{ url: ogImage }],
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_SITE,
      title: ogTitle,
      description: OG_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    other: {
      "twitter:image:alt": metaDescription,
    },
  };
}

export const defaultSiteMetadata = buildPageMetadata();
