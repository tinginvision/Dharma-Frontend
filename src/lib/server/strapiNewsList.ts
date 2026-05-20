import "server-only";
import { resolveUploadUrl } from "@/lib/media";
import { getStrapiRestConfig } from "@/lib/server/movies/strapi";

function trim(s: string | undefined): string {
  return (s ?? "").trim();
}

/**
 * Site-wide news listing (`GET /api/news-lists`).
 * Optional full override: `NEXT_PUBLIC_STRAPI_NEWS_URL`.
 * Otherwise `{STRAPI_URL|STRAPI_API_URL|…}/api/news-lists` — same CMS host as movies.
 */
/** `null` when `STRAPI_URL` / `STRAPI_API_URL` (or `NEXT_PUBLIC_STRAPI_NEWS_URL`) is not set. */
export function resolveStrapiNewsListsUrl(): string | null {
  const override = trim(process.env.NEXT_PUBLIC_STRAPI_NEWS_URL);
  if (override) return override;

  const { base } = getStrapiRestConfig();
  if (base) return `${base.replace(/\/$/, "")}/api/news-lists`;

  return null;
}

/** Resolved at runtime from server env (not only build-time `NEXT_PUBLIC_*`). */
export function getStrapiNewsListsUrl(): string | null {
  return resolveStrapiNewsListsUrl();
}

export function logStrapiNewsNotConfigured(context: string): void {
  console.error(
    `[news] ${context}: Strapi not configured — set STRAPI_URL or STRAPI_API_URL (e.g. https://dharma-production.com/cms).`,
  );
}

/** ISR revalidate seconds for news list JSON (listing page + home strip). */
export const NEWS_LIST_REVALIDATE_SEC = 120;

export function logStrapiNewsFetchError(context: string, err: unknown, url?: string): void {
  const msg = err instanceof Error ? err.message : String(err);
  const hint =
    !getStrapiRestConfig().base ?
      "Set STRAPI_URL or STRAPI_API_URL (e.g. https://dharma-production.com/cms) on the server."
    : !trim(process.env.STRAPI_API_TOKEN) &&
        !trim(process.env.STRAPI_AUTH_TOKEN) &&
        !trim(process.env.STRAPI_TOKEN) ?
      "Set STRAPI_API_TOKEN or STRAPI_AUTH_TOKEN if the CMS requires auth."
    : "";
  console.error(`[news] ${context} failed${url ? ` (${url})` : ""}: ${msg}${hint ? ` — ${hint}` : ""}`);
}

function toRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function pickMediaUrl(media: unknown): string {
  if (!media) return "";
  if (typeof media === "string") return media;
  if (typeof media !== "object") return "";
  const top = toRecord(media);
  if (typeof top.url === "string" && top.url.trim()) return top.url.trim();
  const formats = toRecord(top.formats);
  const f =
    toRecord(formats.small) ||
    toRecord(formats.medium) ||
    toRecord(formats.large) ||
    toRecord(formats.thumbnail);
  if (typeof f.url === "string" && f.url.trim()) return f.url.trim();
  const inner = toRecord(top.data);
  if (typeof inner.url === "string" && inner.url.trim()) return inner.url.trim();
  const attrs = toRecord(inner.attributes);
  if (typeof attrs.url === "string" && attrs.url.trim()) return attrs.url.trim();
  const attrsFormats = toRecord(attrs.formats);
  const af =
    toRecord(attrsFormats.small) ||
    toRecord(attrsFormats.medium) ||
    toRecord(attrsFormats.large) ||
    toRecord(attrsFormats.thumbnail);
  if (typeof af.url === "string" && af.url.trim()) return af.url.trim();
  return "";
}

/** Normalized row for grid / home — links use `slug` when set, else `_id`. */
export type StrapiNewsGridItem = {
  _id: string;
  slug: string;
  title: string;
  date: unknown;
  text: string;
  imageUrl: string;
};

export function mapStrapiNewsListItem(item: unknown): StrapiNewsGridItem {
  const withAttrs = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
  const source = toRecord(withAttrs.attributes || item);
  const rawImage = pickMediaUrl(source.image) || pickMediaUrl(source.banner) || "";
  const title = String(source.title || "");
  const slug = String(source.slug || "").trim();
  return {
    _id: String(source.documentId || source.id || withAttrs.id || ""),
    slug,
    title,
    date: source.date ?? "",
    text: String(source.text || ""),
    imageUrl: resolveUploadUrl(rawImage) || rawImage || "",
  };
}
