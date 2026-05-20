import "server-only";
import { getStrapiNewsListsUrl } from "@/lib/server/strapiNewsList";

/**
 * Shared Strapi list URL for `/news-events` (page + infinite scroll API).
 * Uses the same CMS host as movies (`STRAPI_URL` / `STRAPI_API_URL`).
 */
export const NEWS_LIST_PAGE_SIZE = 9;

export type NewsListFilter = {
  q?: string;
  year?: string;
  month?: string;
  page: number;
};

export function buildNewsListStrapiUrl(filters: NewsListFilter): string | null {
  const base = getStrapiNewsListsUrl();
  if (!base) return null;

  const { q = "", year = "", month = "", page } = filters;
  const params = new URLSearchParams();
  params.set("pagination[page]", String(Math.max(1, page)));
  params.set("pagination[pageSize]", String(NEWS_LIST_PAGE_SIZE));
  params.set("sort[0]", "date:desc");
  params.set("populate", "*");
  if (q.trim()) {
    params.set("filters[$or][0][title][$containsi]", q.trim());
    params.set("filters[$or][1][text][$containsi]", q.trim());
  }
  if (year && month) {
    const mm = String(month).padStart(2, "0");
    params.set("filters[date][$gte]", `${year}-${mm}-01`);
    const nextMonth = new Date(Date.UTC(Number(year), Number(mm) - 1, 1));
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
    const ny = nextMonth.getUTCFullYear();
    const nm = String(nextMonth.getUTCMonth() + 1).padStart(2, "0");
    params.set("filters[date][$lt]", `${ny}-${nm}-01`);
  } else if (year) {
    params.set("filters[date][$contains]", String(year));
  } else if (month) {
    const mm = String(month).padStart(2, "0");
    params.set("filters[date][$contains]", `-${mm}-`);
  }
  return `${base}?${params.toString()}`;
}
