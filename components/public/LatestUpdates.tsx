import { ContentCard } from "@/components/public/ContentCard";
import type { UpdateItem } from "@/lib/types/content";

type LatestUpdatesProps = {
  items: UpdateItem[];
};

export function LatestUpdates({ items }: LatestUpdatesProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            최신 소식
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            뉴스, 교육, 투어, 공지를 한곳에서 확인합니다.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 md:justify-self-end">
          뉴스, 영상, 대회, 교육, 투어 공지를 한 화면에서 빠르게 확인하는 운영형
          첫 화면 구조입니다.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.25fr_0.9fr_0.85fr]">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
