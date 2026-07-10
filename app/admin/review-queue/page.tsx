import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewQueueTable } from "@/components/admin/ReviewQueueTable";
import { reviewQueueItems } from "@/content/seed/site-data";

export default function ReviewQueuePage() {
  return (
    <AdminShell>
      <div>
        <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
          Human-in-the-loop
        </p>
        <h1 className="mt-3 text-4xl font-black">Review Queue</h1>
        <p className="mt-3 max-w-3xl text-zinc-600">
          회원 작성 콘텐츠, AI 초안, 공식 소스 후보, 등급 전환 요청, 중고장터
          매물을 관리자 검토 후 게시합니다.
        </p>
      </div>
      <div className="mt-8">
        <ReviewQueueTable items={reviewQueueItems} />
      </div>
    </AdminShell>
  );
}
