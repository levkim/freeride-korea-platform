import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewQueueTable } from "@/components/admin/ReviewQueueTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { listReviewQueueItems } from "@/lib/repositories/review-queue";
import type { ReviewQueueItem } from "@/lib/types/review";

const typeFilters = [
  { value: "all", label: "전체 유형" },
  { value: "news", label: "뉴스" },
  { value: "video", label: "비디오" },
  { value: "event", label: "이벤트" },
  { value: "program", label: "프로그램" },
  { value: "tour", label: "투어" },
  { value: "culture", label: "컬쳐" },
  { value: "marketplace", label: "중고장터" },
  { value: "shop", label: "샵" },
  { value: "member-upgrade", label: "회원 전환" },
  { value: "source-alert", label: "소스 알림" },
  { value: "ai-draft", label: "AI 초안" },
  { value: "inquiry", label: "문의" },
] as const;

const statusFilters = [
  { value: "all", label: "전체 상태" },
  { value: "new", label: "신규" },
  { value: "reviewing", label: "확인중" },
  { value: "review", label: "검토중" },
  { value: "needs_revision", label: "수정요청" },
  { value: "approved", label: "승인됨" },
  { value: "published", label: "게시됨" },
  { value: "rejected", label: "반려" },
  { value: "hidden", label: "숨김" },
  { value: "archived", label: "보관" },
] as const;

const riskFilters = [
  { value: "all", label: "전체 위험도" },
  { value: "low", label: "낮음" },
  { value: "medium", label: "중간" },
  { value: "high", label: "높음" },
] as const;

type TypeFilter = (typeof typeFilters)[number]["value"];
type StatusFilter = (typeof statusFilters)[number]["value"];
type RiskFilter = (typeof riskFilters)[number]["value"];

type ReviewQueuePageProps = {
  searchParams?: Promise<{
    type?: string;
    status?: string;
    risk?: string;
    q?: string;
  }>;
};

function isTypeFilter(value?: string): value is TypeFilter {
  return typeFilters.some((filter) => filter.value === value);
}

function isStatusFilter(value?: string): value is StatusFilter {
  return statusFilters.some((filter) => filter.value === value);
}

function isRiskFilter(value?: string): value is RiskFilter {
  return riskFilters.some((filter) => filter.value === value);
}

function getFilterHref(
  type: TypeFilter,
  status: StatusFilter,
  risk: RiskFilter,
  q: string,
) {
  const params = new URLSearchParams();

  if (type !== "all") {
    params.set("type", type);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (risk !== "all") {
    params.set("risk", risk);
  }

  if (q) {
    params.set("q", q);
  }

  const query = params.toString();

  return query ? `/admin/review-queue?${query}` : "/admin/review-queue";
}

function getFilterButtonClass(isActive: boolean) {
  return isActive
    ? "h-10 border-zinc-400 bg-zinc-200 px-4 text-xs text-zinc-950 hover:bg-zinc-300"
    : "h-10 px-4 text-xs";
}

function matchesSearchQuery(item: ReviewQueueItem, q: string) {
  if (!q) {
    return true;
  }

  const normalizedQuery = q.toLowerCase();
  const searchableText = [
    item.id,
    item.kind,
    item.title,
    item.submittedBy,
    item.status,
    item.risk,
    item.requiredAuthorRole,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default async function ReviewQueuePage({
  searchParams,
}: ReviewQueuePageProps) {
  const resolvedSearchParams = await searchParams;
  const activeType = isTypeFilter(resolvedSearchParams?.type)
    ? resolvedSearchParams.type
    : "all";
  const activeStatus = isStatusFilter(resolvedSearchParams?.status)
    ? resolvedSearchParams.status
    : "all";
  const activeRisk = isRiskFilter(resolvedSearchParams?.risk)
    ? resolvedSearchParams.risk
    : "all";
  const activeQuery = (resolvedSearchParams?.q ?? "").trim();
  const reviewQueueItems = await listReviewQueueItems();
  const filteredItems = reviewQueueItems.filter((item) => {
    const matchesType = activeType === "all" || item.kind === activeType;
    const matchesStatus =
      activeStatus === "all" || item.status === activeStatus;
    const matchesRisk = activeRisk === "all" || item.risk === activeRisk;

    return (
      matchesType &&
      matchesStatus &&
      matchesRisk &&
      matchesSearchQuery(item, activeQuery)
    );
  });

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            관리자 검토
          </p>
          <h1 className="mt-3 text-4xl font-black">검토 대기열</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            회원이 작성한 콘텐츠, AI 초안, 공식 소스 후보, 회원 등급 전환
            요청, 중고장터 매물, 카테고리 콘텐츠 초안을 관리자가 검토한 뒤
            승인, 수정 요청, 반려, 게시 처리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">review queue v1</Badge>
          <Badge tone="amber">관리자 게시 승인</Badge>
          <Button href="/admin/site-categories/new" variant="secondary">
            카테고리 초안 작성
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <section className="border border-zinc-200 bg-white p-5">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["전체 검토", reviewQueueItems.length],
              ["현재 조건", filteredItems.length],
              [
                "검토 필요",
                reviewQueueItems.filter((item) =>
                  ["new", "reviewing", "review"].includes(item.status),
                ).length,
              ],
              [
                "높은 위험도",
                reviewQueueItems.filter((item) => item.risk === "high").length,
              ],
            ].map(([label, value]) => (
              <div key={label} className="border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-black text-zinc-950">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <Button
                key={filter.value}
                href={getFilterHref(
                  filter.value,
                  activeStatus,
                  activeRisk,
                  activeQuery,
                )}
                variant="secondary"
                className={getFilterButtonClass(activeType === filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                href={getFilterHref(
                  activeType,
                  filter.value,
                  activeRisk,
                  activeQuery,
                )}
                variant="secondary"
                className={getFilterButtonClass(activeStatus === filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
            {riskFilters.map((filter) => (
              <Button
                key={filter.value}
                href={getFilterHref(
                  activeType,
                  activeStatus,
                  filter.value,
                  activeQuery,
                )}
                variant="secondary"
                className={getFilterButtonClass(activeRisk === filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <form
            action="/admin/review-queue"
            className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 md:grid-cols-[1fr_auto_auto]"
          >
            {activeType !== "all" ? (
              <input type="hidden" name="type" value={activeType} />
            ) : null}
            {activeStatus !== "all" ? (
              <input type="hidden" name="status" value={activeStatus} />
            ) : null}
            {activeRisk !== "all" ? (
              <input type="hidden" name="risk" value={activeRisk} />
            ) : null}
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                검색
              </span>
              <input
                name="q"
                defaultValue={activeQuery}
                placeholder="제목, 제출자, 유형, 상태 검색"
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
              />
            </label>
            <button
              type="submit"
              className="mt-auto h-11 border border-zinc-400 bg-zinc-200 px-5 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-300"
            >
              검색
            </button>
            <Button
              href={getFilterHref(activeType, activeStatus, activeRisk, "")}
              variant="secondary"
              className="mt-auto"
            >
              검색 초기화
            </Button>
          </form>
        </section>

        <div className="mt-5">
          <ReviewQueueTable items={filteredItems} />
        </div>
      </div>
    </AdminShell>
  );
}
