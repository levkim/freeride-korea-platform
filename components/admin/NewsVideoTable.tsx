import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { NewsVideoItem } from "@/lib/types/content";

type NewsVideoTableProps = {
  items: NewsVideoItem[];
};

const kindLabels = {
  news: "뉴스",
  video: "비디오",
};

export function NewsVideoTable({ items }: NewsVideoTableProps) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">종류</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3">게시일</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">미디어</th>
            <th className="px-4 py-3">태그</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-zinc-100 align-top">
              <td className="px-4 py-4">
                <Badge tone={item.kind === "video" ? "red" : "blue"}>
                  {kindLabels[item.kind]}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <p className="font-black">{item.title.ko}</p>
              </td>
              <td className="px-4 py-4 font-bold">{item.publishedAt}</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4 text-zinc-600">
                <p>{item.imageUrl ? "대표 이미지" : "이미지 없음"}</p>
                {item.youtubeUrl ? <p className="mt-1">YouTube</p> : null}
                {item.sourceUrl ? <p className="mt-1">원문 링크</p> : null}
              </td>
              <td className="px-4 py-4 text-zinc-600">{item.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
