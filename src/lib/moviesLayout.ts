/** Mirrors MoviesCtrl.populateData / movies.html structure */

export type MovieRecord = {
  _id?: string;
  urlName?: string;
  name?: string;
  year?: number;
  status?: boolean;
  releaseType?: string;
  /** Strapi boolean — when true, movie appears under Dharma Distribution */
  dharmaDistribution?: boolean;
  upcomingOrder?: number;
  month?: number;
  bigImage?: string;
  mediumImage?: string;
  smallImage?: string;
  upcomingSmall?: string;
  recentSmall?: string;
  /** Movie detail fields (present when API sends full objects) */
  releaseDate?: string | Date;
  director?: string;
  mainCast?: string;
};

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** `Sep 2026` when month+year exist; otherwise year only. */
export function movieMonthYearText(m: Pick<MovieRecord, "month" | "year">): string {
  const month = Number(m.month);
  const year = Number(m.year);
  const hasMonth = Number.isInteger(month) && month >= 1 && month <= 12;
  const hasYear = Number.isFinite(year) && year > 0;
  if (hasMonth && hasYear) return `${MONTH_SHORT[month - 1]} ${year}`;
  if (hasYear) return String(year);
  return "";
}

export function formatMovieReleaseDate(d: string | Date | null | undefined): string {
  if (d == null || !String(d).trim()) return "";
  const dt = new Date(String(d));
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Full release date, or month + year when the day is not set. */
export function movieReleaseCaption(m: MovieRecord): string {
  return formatMovieReleaseDate(m.releaseDate) || movieMonthYearText(m);
}

/** Newest release first (date → year/month → CMS order), same as Dharma Distribution. */
export function movieLatestSortKey(m: MovieRecord): number {
  const rd = m.releaseDate;
  if (rd != null && String(rd).trim()) {
    const t = new Date(String(rd)).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const year = Number(m.year) || 0;
  const month = Number(m.month) || 0;
  if (year > 0) {
    const mi = month >= 1 && month <= 12 ? month - 1 : 0;
    return new Date(year, mi, 1).getTime();
  }
  return 0;
}

export function sortMoviesLatestFirst(rows: MovieRecord[]): MovieRecord[] {
  return [...rows].sort((a, b) => {
    const da = movieLatestSortKey(a);
    const db = movieLatestSortKey(b);
    if (da !== db) return db - da;
    return (b.upcomingOrder ?? 0) - (a.upcomingOrder ?? 0);
  });
}

/** Row groups for sliders / legacy chunking (Past mobile rail still uses 5-up strips). */
export function chunkBy<T>(arr: T[], size: number): T[][] {
  if (!arr.length) return [];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function groupByReleaseType(rows: MovieRecord[]): Record<string, MovieRecord[]> {
  return rows.reduce<Record<string, MovieRecord[]>>((acc, m) => {
    const key = m.releaseType || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});
}

/** Outer slides of 4, inner chunk(..., 4) for template rows — matches _.chunk(_.chunk(Recent,4),4) loop */
export function layoutRecent(recentRaw: MovieRecord[]): MovieRecord[][][] {
  const recent = [...recentRaw].sort(
    (a, b) => (b.upcomingOrder ?? 0) - (a.upcomingOrder ?? 0)
  );
  const outer = chunkBy(recent, 4);
  return outer.map((group) => chunkBy(group, 4));
}

function isDharmaDistributionMovie(m: MovieRecord): boolean {
  return m.dharmaDistribution === true;
}

export function isUpcomingReleaseType(m: MovieRecord | Record<string, unknown> | null | undefined): boolean {
  if (!m || typeof m !== "object") return false;
  return String((m as MovieRecord).releaseType || "").trim().toLowerCase() === "upcoming";
}

/** Banner used by the Upcoming Releases slider. */
export function upcomingSlideImage(m: MovieRecord): string {
  return (
    String(m.bigImage || "").trim() ||
    String(m.upcomingSmall || "").trim() ||
    String(m.mediumImage || "").trim() ||
    String(m.smallImage || "").trim() ||
    String(m.recentSmall || "").trim()
  );
}

export function buildMovieList(details: MovieRecord[]) {
  const g = groupByReleaseType(details);

  /** All `releaseType: Upcoming` — including `dharmaDistribution: true` (also listed under Distribution). */
  const upcoming = details
    .filter((m) => isUpcomingReleaseType(m))
    .sort((a, b) => (a.upcomingOrder ?? 0) - (b.upcomingOrder ?? 0));
  const recentRaw = g["Recent"] ?? [];
  const pastRaw = g["Past"] ?? [];

  /**
   * Dharma Distribution — every movie with the Strapi flag, including Upcoming
   * and titles with no `releaseType` (those appear only here).
   */
  const pastSorted = sortMoviesLatestFirst(
    details.filter((m) => isDharmaDistributionMovie(m)),
  );

  /** Movies section — released titles only (Recent + Past); Upcoming stays in the slider */
  const recentSorted = [...recentRaw, ...pastRaw]
    .filter((m) => !isDharmaDistributionMovie(m))
    .sort((a, b) => (b.upcomingOrder ?? 0) - (a.upcomingOrder ?? 0));

  return {
    upcoming,
    recentSorted,
    recentSlides: layoutRecent(recentRaw.filter((m) => !isDharmaDistributionMovie(m))),
    pastSorted,
  };
}

export function movieSlug(m: MovieRecord): string {
  const s = m.urlName || m._id;
  return s ? String(s) : "";
}

/** Thumbnail for search dropdown — matches Angular movies.html ui-select-choices */
export function movieSearchThumbnail(m: MovieRecord): string | undefined {
  const rt = m.releaseType;
  if (rt === "Past") return m.smallImage;
  if (rt === "Recent") return m.recentSmall ?? m.mediumImage ?? m.smallImage;
  if (rt === "Upcoming") return m.upcomingSmall ?? m.mediumImage ?? m.smallImage;
  return m.mediumImage ?? m.smallImage ?? m.upcomingSmall ?? m.recentSmall;
}
