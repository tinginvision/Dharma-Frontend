import { notFound } from "next/navigation";

import { NewsArticleView } from "@/components/news/NewsArticleView";
import { resolveUploadUrl } from "@/lib/media";
import { fetchNewsDetailPage } from "@/lib/server/newsDetail";
import { buildPageMetadata, plainTextFromHtml } from "@/lib/siteMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchNewsDetailPage(slug);
  const article = data?.article;
  const title = article?.title?.trim();

  if (!title) {
    return buildPageMetadata({ title: "News", path: `/news-events/${slug}` });
  }

  const image =
    resolveUploadUrl(article.image) ||
    resolveUploadUrl(article.banner);

  return buildPageMetadata({
    title,
    description: plainTextFromHtml(article.html || article.text),
    keywords: typeof article.keywords === "string" ? article.keywords : undefined,
    image,
    path: `/news-events/${encodeURIComponent(slug)}`,
  });
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params;
  const data = await fetchNewsDetailPage(slug);
  if (!data?.article?._id) notFound();

  return <NewsArticleView article={data.article} related={data.related} />;
}
