import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import type { ReviewQueueItem } from "@/lib/types/review";
import type { MemberType } from "@/lib/types/member";

type ReviewQueueTableProps = {
  items: ReviewQueueItem[];
};

const reviewKindLabels: Record<ReviewQueueItem["kind"], string> = {
  news: "뉴스",
  video: "비디오",
  event: "이벤트",
  program: "교육/프로그램",
  tour: "투어",
  culture: "컬쳐",
  marketplace: "중고장터",
  resource: "자료실",
  shop: "샵",
  "member-upgrade": "회원 등급 전환",
  "source-alert": "소스 알림",
  "ai-draft": "AI 초안",
  inquiry: "문의 처리",
};

const memberRoleLabels: Record<MemberType | "admin", string> = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
  admin: "관리자",
};

export function ReviewQueueTable({ items }: ReviewQueueTableProps) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">검토 유형</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3">제출자</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">위험도</th>
            <th className="px-4 py-3">작성 권한</th>
            <th className="px-4 py-3">게시 권한</th>
            <th className="px-4 py-3">등록일</th>
            <th className="px-4 py-3">관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-zinc-100">
              <td className="px-4 py-4 font-bold">
                {reviewKindLabels[item.kind]}
              </td>
              <td className="px-4 py-4">{item.title}</td>
              <td className="px-4 py-4 text-zinc-600">{item.submittedBy}</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={item.risk} />
              </td>
              <td className="px-4 py-4 font-bold">
                {memberRoleLabels[item.requiredAuthorRole]}
              </td>
              <td className="px-4 py-4 font-bold">
                {memberRoleLabels[item.requiredPublishRole]}
              </td>
              <td className="px-4 py-4 font-bold">{item.createdAt}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/review-queue/${item.id}`}
                    className="border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                  >
                    검토
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length ? (
        <div className="border-t border-zinc-100 py-8 text-center text-sm font-bold text-zinc-500">
          선택한 조건에 해당하는 검토 항목이 없습니다.
        </div>
      ) : null}
    </div>
  );
}
