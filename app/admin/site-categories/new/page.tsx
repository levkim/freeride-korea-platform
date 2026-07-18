import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryDraftForm } from "@/components/admin/CategoryDraftForm";
import { Badge } from "@/components/ui/Badge";

type AdminNewCategoryContentPageProps = {
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

function getResultMessage(result: string) {
  if (result === "invalid") {
    return "필수 입력값을 다시 확인해 주세요.";
  }

  if (result === "published") {
    return "콘텐츠가 검토 대기열을 거치지 않고 바로 공개 상태로 등록되었습니다.";
  }

  return "카테고리 초안이 검토 대기열 제출 흐름으로 처리되었습니다.";
}

export default async function AdminNewCategoryContentPage({
  searchParams,
}: AdminNewCategoryContentPageProps) {
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const mode = resolvedSearchParams?.mode;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            카테고리 운영
          </p>
          <h1 className="mt-3 text-4xl font-black">새 카테고리 콘텐츠 등록</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            선수 프로그램, 교육, 프리라이드 투어, 컬쳐, 중고장터, 자료실,
            샵 콘텐츠를 같은 작성 화면에서 등록합니다. 선수 프로그램, 교육, 투어,
            샵은 검토 후 게시하고, 컬쳐, 중고장터, 자료실은 작성 즉시 공개됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">입력 폼 v1</Badge>
          <Badge tone="amber">검증 전용</Badge>
          <Link
            href="/admin/site-categories"
            className="border border-zinc-300 bg-white px-4 py-2 text-sm font-black transition-colors hover:bg-zinc-50"
          >
            카테고리 운영으로
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
          {getResultMessage(result)}
          {mode === "mock" ? (
            <span className="mt-2 block">
              현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로 처리되었습니다.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        <CategoryDraftForm />
      </div>
    </AdminShell>
  );
}
