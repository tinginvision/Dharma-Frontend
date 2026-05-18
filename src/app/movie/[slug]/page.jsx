import { notFound } from "next/navigation";

import { MovieInsideView } from "@/components/movie/MovieInsideView";
import { resolveUploadUrl } from "@/lib/media";
import { fetchOneMovie } from "@/lib/server/movies";
import { buildPageMetadata, plainTextFromHtml } from "@/lib/siteMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  try {
    const data = await fetchOneMovie(decoded);
    const movie = data?.movie;
    if (!movie) {
      return buildPageMetadata({ title: "Movie", path: `/movie/${slug}` });
    }

    const year = movie.year != null && String(movie.year).trim() !== "" ? String(movie.year) : "";
    const pageTitle = year ? `${movie.name} - ${year}` : String(movie.name || "Movie");
    const image =
      resolveUploadUrl(movie.theatricalTrailerImage) ||
      resolveUploadUrl(movie.bigImage) ||
      resolveUploadUrl(movie.mediumImage);

    return buildPageMetadata({
      title: pageTitle,
      description: plainTextFromHtml(movie.synopsis),
      keywords: typeof movie.keywords === "string" ? movie.keywords : undefined,
      image,
      path: `/movie/${encodeURIComponent(decoded)}`,
    });
  } catch {
    return buildPageMetadata({ title: "Movie", path: `/movie/${slug}` });
  }
}

export default async function MovieDetailPage({ params }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  let data;
  try {
    data = await fetchOneMovie(decoded);
  } catch (err) {
    console.error("[movie/[slug]] fetchOneMovie failed:", err);
    data = null;
  }
  if (!data) {
    notFound();
  }
  return <MovieInsideView data={data} />;
}
