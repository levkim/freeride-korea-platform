import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { listNewsVideoItems } from "@/lib/repositories/news-video";
import { getYouTubeEmbedUrl } from "@/lib/media/youtube";

const quickFilters = ["전체", "뉴스", "비디오"];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function NewsVideoPage() {
  const newsVideoItems = await listNewsVideoItems();
  const items = [...newsVideoItems].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">
        <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <h1 className="fk-nav-type text-6xl leading-none md:text-8xl">
                NEWS & VIDEOS
              </h1>
              <p className="mt-5 max-w-xl text-lg font-bold leading-8 text-zinc-600">
                프리라이드 뉴스, 한국 선수 소식, 안전 교육, 투어 리포트,
                영상 하이라이트를 한곳에서 확인합니다.
              </p>
            </div>
            <div className="grid gap-5">
              <div className="flex flex-wrap gap-3">
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className="fk-nav-type border border-zinc-300 px-5 py-2 text-lg leading-none transition-colors hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="rounded-[28px] bg-zinc-100 p-5 md:p-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="grid w-6 gap-1">
                      <span className="h-0.5 bg-zinc-900" />
                      <span className="h-0.5 w-4 justify-self-end bg-zinc-900" />
                      <span className="h-0.5 bg-zinc-900" />
                    </span>
                    <p className="fk-nav-type text-xl leading-none">필터</p>
                  </div>
                  <span className="text-2xl leading-none">^</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {["2026 시즌", "카테고리 (전체)"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="flex min-h-14 items-center justify-between rounded-full bg-white px-5 text-left"
                    >
                      <span className="fk-nav-type text-lg leading-none">{label}</span>
                      <span className="text-2xl leading-none">v</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const youtubeEmbedUrl = getYouTubeEmbedUrl(item.youtubeUrl);
              const href = `/news-video/${item.id}`;

              return (
                <article key={item.id} className="group">
                  <div className="relative aspect-[1.36/1] overflow-hidden bg-zinc-100">
                    {youtubeEmbedUrl ? (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={item.title.ko}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : (
                      <a href={href} className="relative block h-full w-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.title.ko}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </a>
                    )}
                    {item.kind === "video" ? (
                      <span className="absolute left-4 top-4 bg-white px-3 py-2 text-xs font-black uppercase">
                        {youtubeEmbedUrl ? "YouTube" : "재생"}
                      </span>
                    ) : null}
                  </div>
                  <a href={href}>
                    <div className="mt-5 flex items-center gap-3">
                      <Badge tone={item.kind === "video" ? "red" : "blue"}>
                        {item.kind === "video" ? "비디오" : "뉴스"}
                      </Badge>
                      <span className="text-sm font-bold text-zinc-500">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    <h2 className="fk-nav-type mt-4 text-3xl leading-[1.02] transition-colors group-hover:text-[var(--color-fk-red)]">
                      {item.title.ko}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-zinc-600">
                      {item.summary.ko}
                    </p>
                    <p className="fk-nav-type mt-5 text-lg leading-none">자세히 보기</p>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
