import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CommentSection } from "@/components/public/CommentSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { newsVideoItems } from "@/content/seed/site-data";
import { getNewsVideoItemById } from "@/lib/repositories/news-video";
import { getYouTubeEmbedUrl } from "@/lib/media/youtube";

type NewsVideoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateStaticParams() {
  return newsVideoItems
    .filter((item) => item.status === "published")
    .map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: NewsVideoDetailPageProps) {
  const { id } = await params;
  const item = await getNewsVideoItemById(id);

  if (!item) {
    return {
      title: "News & Video | FREERIDE KOREA",
    };
  }

  return {
    title: `${item.title.ko} | FREERIDE KOREA`,
    description: item.summary.ko,
  };
}

export default async function NewsVideoDetailPage({
  params,
}: NewsVideoDetailPageProps) {
  const { id } = await params;
  const item = await getNewsVideoItemById(id);

  if (!item) {
    notFound();
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">
        <article className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <Link
            href="/news-video"
            className="fk-nav-type inline-flex text-lg leading-none text-zinc-500 transition-colors hover:text-[var(--color-fk-red)]"
          >
            뉴스 / 비디오 목록
          </Link>

          <header className="mt-8 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={item.kind === "video" ? "red" : "blue"}>
                  {item.kind === "video" ? "비디오" : "뉴스"}
                </Badge>
                <span className="text-sm font-bold text-zinc-500">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              <h1 className="fk-nav-type mt-6 text-5xl leading-[0.98] md:text-7xl">
                {item.title.ko}
              </h1>
              <p className="mt-6 text-xl font-black leading-9 text-zinc-900">
                {item.summary.ko}
              </p>
            </div>
          </header>

          <section className="mt-10">
            <div className="relative aspect-video overflow-hidden bg-zinc-100">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={item.title.ko}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src={item.imageUrl}
                  alt={item.title.ko}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          </section>

          <section className="mt-12 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="border-t border-zinc-300 pt-5">
              <p className="text-sm font-black uppercase text-zinc-500">태그</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 grid gap-3">
                {item.youtubeUrl ? (
                  <a
                    href={item.youtubeUrl}
                    className="fk-nav-type border border-zinc-300 px-5 py-3 text-center text-lg leading-none transition-colors hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                  >
                    YouTube에서 보기
                  </a>
                ) : null}
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    className="fk-nav-type border border-zinc-300 bg-zinc-100 px-5 py-3 text-center text-lg leading-none text-zinc-950 transition-colors hover:bg-zinc-200"
                  >
                    원문 보기
                  </a>
                ) : null}
              </div>
            </aside>

            <div className="grid gap-8">
              <section>
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  본문
                </p>
                <p className="mt-4 text-lg font-bold leading-8 text-zinc-900">
                  {item.body.ko}
                </p>
              </section>
            </div>
          </section>

          <section className="mt-12">
            <CommentSection targetType="news-video" targetId={item.id} />
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
