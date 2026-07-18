import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CategoryDraftForm } from "@/components/admin/CategoryDraftForm";
import { Badge } from "@/components/ui/Badge";
import { getCategorySubtypeLabel } from "@/lib/content/category-labels";
import { getAdminCategoryContentById } from "@/lib/repositories/category-content";
import { updateCategoryContentDraft } from "@/app/admin/site-categories/[id]/edit/actions";

type AdminEditCategoryContentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

const educationSubtypes = new Set([
  "Avalanche Safety",
  "Freeriding",
  "Backcountry",
  "눈사태 안전",
  "FREERIDING 교육",
  "백컨트리 역량 강화",
  "WFR",
]);

function getResultMessage(result: string) {
  if (result === "invalid") {
    return "필수 입력값을 다시 확인해 주세요.";
  }

  if (result === "published") {
    return "수정 내용이 검토 대기열을 거치지 않고 바로 공개 상태로 반영되었습니다.";
  }

  return "수정 내용이 검토 대기열 제출 흐름으로 처리되었습니다.";
}

function getOperationalCategoryLabel(kind: string, subtype: string) {
  if (kind === "program" && subtype === "Freeride") {
    return "선수 프로그램";
  }

  if (kind === "program" && educationSubtypes.has(subtype)) {
    return "교육";
  }

  if (kind === "tour") {
    return "프리라이드 투어";
  }

  if (kind === "shop") {
    return "샵";
  }

  return kind;
}

export default async function AdminEditCategoryContentPage({
  params,
  searchParams,
}: AdminEditCategoryContentPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const mode = resolvedSearchParams?.mode;
  const item = await getAdminCategoryContentById(id);

  if (!item) {
    notFound();
  }

  const action = updateCategoryContentDraft.bind(null, item.id);

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            카테고리 운영
          </p>
          <h1 className="mt-3 text-4xl font-black">카테고리 콘텐츠 수정</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            기존 게시물의 제목, 본문, 이미지, 운영 필드를 수정합니다. 수정한
            내용은 다시 검토 대기열로 보내 관리자 승인 흐름을 거치게 됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">
            {getOperationalCategoryLabel(item.kind, item.subtype)}
          </Badge>
          <Badge tone="neutral">{getCategorySubtypeLabel(item.subtype)}</Badge>
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
              현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
              처리되었습니다.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8">
        <CategoryDraftForm
          action={action}
          initialItem={item}
          submitLabel="수정 내용 제출"
          statusLabel="수정 검토 대기열 제출"
        />
      </div>
    </AdminShell>
  );
}
