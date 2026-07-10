import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { UpdateItem } from "@/lib/types/content";

type ContentCardProps = {
  item: UpdateItem;
};

export function ContentCard({ item }: ContentCardProps) {
  return (
    <article className="fk-reveal group border-t border-zinc-200 bg-white/70 p-5 transition-colors duration-300 hover:bg-white">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{item.kind}</Badge>
        <StatusBadge status={item.status} />
      </div>
      <h3 className="mt-5 text-xl font-black tracking-tight transition-colors group-hover:text-[var(--color-fk-blue)]">
        {item.title.en}
      </h3>
      <p className="mt-2 text-base font-bold text-zinc-800">{item.title.ko}</p>
      <p className="mt-4 text-sm leading-6 text-zinc-600">{item.summary.ko}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-500">{item.summary.en}</p>
    </article>
  );
}
