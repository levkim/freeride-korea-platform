import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { EventDraftForm } from "@/components/admin/EventDraftForm";
import { Badge } from "@/components/ui/Badge";
import { submitEventDraft } from "@/app/admin/events/new/actions";

type AdminNewEventPageProps = {
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

export default async function AdminNewEventPage({
  searchParams,
}: AdminNewEventPageProps) {
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const mode = resolvedSearchParams?.mode;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            이벤트 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">새 이벤트 등록</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            대회명, 시리즈, 일정, 링크, 한글 설명을 입력합니다. 상태는
            일정에서 자동 계산하고, 취소 여부만 관리자가 직접 선택합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">입력 폼 v1</Badge>
          <Badge tone="amber">검증 전용</Badge>
          <Link
            href="/admin/events"
            className="border border-zinc-300 bg-white px-4 py-2 text-sm font-black transition-colors hover:bg-zinc-50"
          >
            이벤트 목록으로
          </Link>
        </div>
      </div>

      {result ? (
        <div
          className={`mt-6 border p-4 text-sm font-bold leading-6 ${
            result === "invalid"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {result === "invalid"
            ? "입력값을 확인해 주세요. 일정, 필수 설명, URL 형식이 올바른지 확인해야 합니다."
            : `이벤트 초안이 검토 대기열로 제출되었습니다. (${mode ?? "mock"})`}
          {mode === "mock" ? (
            <span className="mt-2 block">
              현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
              처리되었습니다.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        <EventDraftForm action={submitEventDraft} />
      </div>
    </AdminShell>
  );
}
