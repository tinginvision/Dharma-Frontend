const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

/**
 * YouTube id or URL → 11-char video id.
 * Accepts a bare id, `v=ID`, watch/share/embed/shorts/youtu.be links, extra query params.
 */
export function youtubeVideoId(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (YT_ID.test(s)) return s;

  // Bare id with extra params: Yy8SKJygKD4&t=10s or Yy8SKJygKD4?t=10s
  const fromBare = s.match(/^([a-zA-Z0-9_-]{11})[?&#]/);
  if (fromBare) return fromBare[1];

  const fromV = s.match(/[?&#]?v=([a-zA-Z0-9_-]{11})/i);
  if (fromV) return fromV[1];

  const fromPath = s.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed|shorts|live|v)\/)([a-zA-Z0-9_-]{11})/i
  );
  if (fromPath) return fromPath[1];

  try {
    const href = /^https?:\/\//i.test(s) ? s : `https://${s.replace(/^\/+/, "")}`;
    const v = new URL(href).searchParams.get("v");
    if (v && YT_ID.test(v)) return v;
  } catch {
    /* ignore */
  }
  return "";
}

/** Open in a normal browser tab — use this for `<a href>`. `/embed/` in a top-level tab often shows YouTube error 153. */
export function youtubeWatchUrl(raw: unknown): string {
  const id = youtubeVideoId(raw);
  return id ? `https://www.youtube.com/watch?v=${id}` : "";
}

/** Iframe `src` only — not for opening in a new tab. */
export function youtubeEmbedUrl(raw: unknown): string {
  const id = youtubeVideoId(raw);
  return id ?
      `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=0&showinfo=0&rel=0&loop=1`
    : "";
}

export function youtubeThumbnailUrl(raw: unknown): string {
  const id = youtubeVideoId(raw);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

/** Highest common static thumb (may 404 for very old videos — fallback in UI). */
export function youtubeThumbnailUrlMax(raw: unknown): string {
  const id = youtubeVideoId(raw);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
}
