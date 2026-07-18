import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { updateCategoryContentStatusAction } from "@/app/admin/site-categories/actions";
import { getCategorySubtypeLabel } from "@/lib/content/category-labels";
import { listAdminCategoryContent } from "@/lib/repositories/category-content";
import type { CategoryContentItem, PublishStatus } from "@/lib/types/content";

const categoryRows = [
  {
    name: "선수 프로그램",
    ko: "선수 프로그램",
    path: "/athlete-program",
    author: "정회원 이상 제안",
    publisher: "관리자 게시",
    status: "structure_ready",
    editHref: "/admin/site-categories/freeride-athlete-pathway/edit",
    fields: ["종목", "선수 레벨", "목표 대회", "시즌 목표", "코칭 방식", "영상 분석", "참가 기준", "신청 링크"],
    note: "Freeride 선수 성장 단계, 목표 대회, 시즌 목표, 코칭 방식, 영상 분석 기록을 관리합니다. Backcountry 역량 강화는 Education에서 관리합니다.",
  },
  {
    name: "교육",
    ko: "교육",
    path: "/safety-education",
    author: "임원진 이상 작성",
    publisher: "관리자 게시",
    status: "structure_ready",
    editHref: "/admin/site-categories/freeriding-skills/edit",
    fields: ["교육 종류", "강사", "필수 장비", "난이도", "교육 장소", "수료 기준", "취소 규정"],
    note: "눈사태 안전교육, FREERIDING 교육, Backcountry 역량 강화, WFR 관련 교육은 임원진 이상만 작성할 수 있고, 안전 기준을 포함해 더 엄격히 검토합니다.",
  },
  {
    name: "프리라이드 투어",
    ko: "프리라이드 투어",
    path: "/freeride-tour",
    author: "정회원 이상 제안",
    publisher: "관리자 게시",
    status: "structure_ready",
    editHref: "/admin/site-categories/japan-powder-freeride-tour/edit",
    fields: ["지역", "국가", "일정", "가이드", "참가 레벨", "포함/불포함", "보험", "취소/환불", "신청 링크"],
    note: "국가와 지역은 고정값이 아니라 관리자 taxonomy로 추가/삭제할 수 있게 관리합니다. 투어는 일정표, 가이드, 포함/불포함, 보험, 취소/환불 기준을 함께 검토합니다.",
  },
  {
    name: "컬쳐",
    ko: "컬쳐",
    path: "/culture",
    author: "일반회원 이상 작성",
    publisher: "관리자 게시",
    status: "structure_ready",
    editHref: "/admin/site-categories/fun-respect-safety-culture/edit",
    fields: ["자유게시판", "포토제닉", "프리라이드 핫스팟", "산악윤리", "관련 링크", "신고 상태"],
    note: "초기에는 큐레이션형 매거진으로 운영하고, 회원 게시물은 공개 범위와 산악 윤리 기준을 함께 검토한 뒤 승인 후 공개합니다.",
  },
  {
    name: "샵",
    ko: "샵",
    path: "/shop",
    author: "정회원 이상 제안",
    publisher: "관리자 게시",
    status: "structure_ready",
    editHref: "/admin/site-categories/regular-membership/edit",
    fields: ["상품 유형", "가격", "회원 조건", "제공 방식", "재고/판매 상태", "혜택 요약", "환불 기준"],
    note: "멤버십, 교육, 투어, 굿즈 결제를 통합하는 운영 허브로 확장합니다. 결제 연동 전에는 신청 폼과 관리자 확인 흐름으로 운영합니다.",
  },
];

const cmsSteps = [
  ["1", "구조 확정", "각 메뉴별 필수 필드와 권한 기준을 먼저 고정합니다."],
  ["2", "작성 폼 분리", "프로그램, 교육, 투어, 컬쳐, 샵 입력 폼을 각각 만듭니다."],
  ["3", "검토 대기열 연결", "회원이 작성한 초안은 모두 관리자 검토 대기열로 보냅니다."],
  ["4", "공개 페이지 연결", "승인된 콘텐츠만 공개 페이지 목록과 상세 페이지에 노출합니다."],
];

const educationSubtypes = new Set([
  "Avalanche Safety",
  "Freeriding",
  "Backcountry",
  "눈사태 안전",
  "FREERIDING 교육",
  "백컨트리 역량 강화",
  "WFR",
]);

const categoryFilters = [
  { value: "all", label: "전체" },
  { value: "athlete-program", label: "선수 프로그램" },
  { value: "education", label: "교육" },
  { value: "tour", label: "프리라이드 투어" },
  { value: "culture", label: "컬쳐" },
  { value: "marketplace", label: "중고장터" },
  { value: "resource", label: "자료실" },
  { value: "shop", label: "샵" },
] as const;

type CategoryFilter = (typeof categoryFilters)[number]["value"];

const statusFilters = [
  { value: "all", label: "전체 상태" },
  { value: "draft", label: "초안" },
  { value: "review", label: "검토중" },
  { value: "needs_revision", label: "수정요청" },
  { value: "approved", label: "승인됨" },
  { value: "published", label: "게시됨" },
  { value: "rejected", label: "반려" },
  { value: "hidden", label: "숨김" },
  { value: "archived", label: "보관" },
] as const;

type StatusFilter = (typeof statusFilters)[number]["value"];

const rowStatusActions: { status: PublishStatus; label: string }[] = [
  { status: "published", label: "게시" },
  { status: "review", label: "검토중" },
  { status: "hidden", label: "숨김" },
  { status: "archived", label: "보관" },
];

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

  if (kind === "marketplace") {
    return "중고장터";
  }

  if (kind === "shop") {
    return "샵";
  }

  return kind;
}

function getPublicContentHref(item: CategoryContentItem) {
  if (item.kind === "program" && item.subtype === "Freeride") {
    return `/athlete-program/${item.id}`;
  }

  if (item.kind === "program" && educationSubtypes.has(item.subtype)) {
    return `/safety-education/${item.id}`;
  }

  if (item.kind === "tour") {
    return `/freeride-tour/${item.id}`;
  }

  if (item.kind === "culture" || item.kind === "marketplace") {
    return `/culture/${item.id}`;
  }

  if (item.kind === "shop") {
    return `/shop/${item.id}`;
  }

  return "/";
}

function getCategoryFilterValue(item: CategoryContentItem): CategoryFilter {
  if (item.kind === "program" && item.subtype === "Freeride") {
    return "athlete-program";
  }

  if (item.kind === "program" && educationSubtypes.has(item.subtype)) {
    return "education";
  }

  return item.kind as CategoryFilter;
}

function isCategoryFilter(value?: string): value is CategoryFilter {
  return categoryFilters.some((filter) => filter.value === value);
}

function isStatusFilter(value?: string): value is StatusFilter {
  return statusFilters.some((filter) => filter.value === value);
}

function getFilterHref(category: CategoryFilter, status: StatusFilter, q: string) {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (q) {
    params.set("q", q);
  }

  const query = params.toString();

  return query ? `/admin/site-categories?${query}` : "/admin/site-categories";
}

function matchesSearchQuery(item: CategoryContentItem, q: string) {
  if (!q) {
    return true;
  }

  const normalizedQuery = q.toLowerCase();
  const searchableText = [
    item.id,
    item.kind,
    item.subtype,
    item.title.ko,
    item.summary.ko,
    item.body.ko,
    item.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

function getFilterButtonClass(isActive: boolean) {
  return isActive
    ? "h-10 border-zinc-400 bg-zinc-200 px-4 text-xs text-zinc-950 hover:bg-zinc-300"
    : "h-10 px-4 text-xs";
}

function countStatus(items: CategoryContentItem[], status: string) {
  return items.filter((item) => item.status === status).length;
}

type AdminSiteCategoriesPageProps = {
  searchParams?: Promise<{
    category?: string;
    status?: string;
    q?: string;
    result?: string;
    mode?: string;
  }>;
};

export default async function AdminSiteCategoriesPage({
  searchParams,
}: AdminSiteCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeCategory = isCategoryFilter(resolvedSearchParams?.category)
    ? resolvedSearchParams.category
    : "all";
  const activeStatus = isStatusFilter(resolvedSearchParams?.status)
    ? resolvedSearchParams.status
    : "all";
  const activeQuery = (resolvedSearchParams?.q ?? "").trim();
  const actionResult = resolvedSearchParams?.result;
  const actionMode = resolvedSearchParams?.mode;
  const currentListHref = getFilterHref(activeCategory, activeStatus, activeQuery);
  const contentItems = await listAdminCategoryContent();
  const filteredContentItems = contentItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      getCategoryFilterValue(item) === activeCategory;
    const matchesStatus =
      activeStatus === "all" || item.status === activeStatus;
    const matchesSearch = matchesSearchQuery(item, activeQuery);

    return matchesCategory && matchesStatus && matchesSearch;
  });
  const dashboardStats = [
    {
      label: "전체 콘텐츠",
      value: contentItems.length,
      href: getFilterHref("all", "all", ""),
    },
    {
      label: "현재 조건",
      value: filteredContentItems.length,
      href: getFilterHref(activeCategory, activeStatus, activeQuery),
    },
    {
      label: "검토중",
      value: countStatus(contentItems, "review"),
      href: getFilterHref(activeCategory, "review", activeQuery),
    },
    {
      label: "게시됨",
      value: countStatus(contentItems, "published"),
      href: getFilterHref(activeCategory, "published", activeQuery),
    },
    {
      label: "수정요청",
      value: countStatus(contentItems, "needs_revision"),
      href: getFilterHref(activeCategory, "needs_revision", activeQuery),
    },
  ];
  const reviewCount = countStatus(contentItems, "review");
  const revisionCount = countStatus(contentItems, "needs_revision");
  const hiddenCount = countStatus(contentItems, "hidden");
  const priorityGuides = [
    {
      title: "1. 검토중 콘텐츠 확인",
      text:
        reviewCount > 0
          ? `현재 검토중 콘텐츠 ${reviewCount}건이 있습니다. 내용, 이미지, 링크, 권한 기준을 확인한 뒤 게시 또는 수정요청으로 처리합니다.`
          : "현재 검토중 콘텐츠가 없습니다. 새 콘텐츠가 들어오면 가장 먼저 확인할 영역입니다.",
      href: getFilterHref(activeCategory, "review", activeQuery),
    },
    {
      title: "2. 수정요청 회수 확인",
      text:
        revisionCount > 0
          ? `수정요청 상태 ${revisionCount}건이 있습니다. 작성자가 보완 후 다시 제출했는지 확인합니다.`
          : "수정요청 상태의 콘텐츠가 없습니다.",
      href: getFilterHref(activeCategory, "needs_revision", activeQuery),
    },
    {
      title: "3. 숨김/보관 항목 점검",
      text:
        hiddenCount > 0
          ? `숨김 처리된 콘텐츠 ${hiddenCount}건이 있습니다. 다시 공개할 항목인지 보관할 항목인지 정리합니다.`
          : "숨김 처리된 콘텐츠가 없습니다.",
      href: getFilterHref(activeCategory, "hidden", activeQuery),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            카테고리 운영
          </p>
          <h1 className="mt-3 text-4xl font-black">공개 메뉴 관리 구조</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            선수 프로그램, 교육, 프리라이드 투어, 컬쳐, 샵은 단순 페이지가
            아니라 회원 작성, 관리자 검토, 공개 게시가 연결되는 운영 카테고리입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">회원 작성</Badge>
          <Badge tone="amber">관리자 승인</Badge>
          <Badge tone="green">공개 게시</Badge>
          <Button href="/admin/site-categories/new" variant="secondary">
            새 콘텐츠 등록
          </Button>
        </div>
      </div>

      <section className="mt-8 grid gap-5">
        {categoryRows.map((category) => (
          <article
            key={category.path}
            className="border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]"
          >
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={category.status} />
                  <Badge tone="neutral">{category.path}</Badge>
                </div>
                <h2 className="mt-4 text-3xl font-black">{category.ko}</h2>
                <p className="mt-1 text-sm font-black uppercase text-zinc-500">
                  {category.name}
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  {category.note}
                </p>
                <div className="mt-4">
                  <Button href={category.editHref} variant="secondary">
                    샘플 콘텐츠 수정
                  </Button>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs font-black uppercase text-zinc-500">
                      작성 권한
                    </p>
                    <p className="mt-2 font-black">{category.author}</p>
                  </div>
                  <div className="border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs font-black uppercase text-zinc-500">
                      게시 권한
                    </p>
                    <p className="mt-2 font-black">{category.publisher}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-zinc-500">
                    필수 관리 필드
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {category.fields.map((field) => (
                      <span
                        key={field}
                        className="border border-zinc-200 bg-white px-3 py-2 text-xs font-black text-zinc-700"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              등록 콘텐츠
            </p>
            <h2 className="mt-3 text-3xl font-black">
              카테고리 콘텐츠 수정 목록
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              현재 등록된 카테고리 콘텐츠입니다. 관리자 수정 화면에서 내용을
              바꾸면 다시 검토 대기열로 보내 게시 승인 흐름을 거칩니다.
            </p>
          </div>
          <Button href="/admin/site-categories/new" variant="secondary">
            새 콘텐츠 등록
          </Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {dashboardStats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
            >
              <p className="text-xs font-black uppercase text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-black text-zinc-950">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {priorityGuides.map((guide) => (
            <Link
              key={guide.title}
              href={guide.href}
              className="border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
            >
              <p className="text-sm font-black text-zinc-950">{guide.title}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                {guide.text}
              </p>
            </Link>
          ))}
        </div>

        {actionResult ? (
          <div className="mt-4 border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
            {actionResult === "status-updated"
              ? `콘텐츠 상태를 변경했습니다. (${actionMode ?? "mock"})`
              : "요청을 처리하지 못했습니다. 입력값을 다시 확인해 주세요."}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <p className="w-full text-xs font-black uppercase text-zinc-500">
            카테고리 필터
          </p>
          {categoryFilters.map((filter) => (
            <Button
              key={filter.value}
              href={getFilterHref(filter.value, activeStatus, activeQuery)}
              variant="secondary"
              className={getFilterButtonClass(activeCategory === filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
          <p className="w-full text-xs font-black uppercase text-zinc-500">
            상태 필터
          </p>
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              href={getFilterHref(activeCategory, filter.value, activeQuery)}
              variant="secondary"
              className={getFilterButtonClass(activeStatus === filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <form
          action="/admin/site-categories"
          className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 md:grid-cols-[1fr_auto_auto]"
        >
          {activeCategory !== "all" ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          {activeStatus !== "all" ? (
            <input type="hidden" name="status" value={activeStatus} />
          ) : null}
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              검색
            </span>
            <input
              name="q"
              defaultValue={activeQuery}
              placeholder="제목, 요약, subtype, 태그 검색"
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
            href={getFilterHref(activeCategory, activeStatus, "")}
            variant="secondary"
            className="mt-auto"
          >
            검색 초기화
          </Button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-black uppercase text-zinc-500">
                <th className="py-3 pr-4">콘텐츠</th>
                <th className="py-3 pr-4">카테고리</th>
                <th className="py-3 pr-4">상태</th>
                <th className="py-3 pr-4">요약</th>
                <th className="py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredContentItems.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 align-top">
                  <td className="py-4 pr-4">
                    <p className="font-black text-zinc-950">{item.title.ko}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="blue">
                        {getOperationalCategoryLabel(item.kind, item.subtype)}
                      </Badge>
                      <Badge tone="neutral">
                        {getCategorySubtypeLabel(item.subtype)}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="max-w-sm py-4 pr-4 text-sm font-bold leading-6 text-zinc-600">
                    {item.summary.ko}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        href={getPublicContentHref(item)}
                        variant="secondary"
                      >
                        공개 화면
                      </Button>
                      <Button
                        href={`/admin/site-categories/${item.id}/edit`}
                        variant="secondary"
                      >
                        내용 수정
                      </Button>
                      {rowStatusActions.map((action) => (
                        <form
                          key={action.status}
                          action={updateCategoryContentStatusAction}
                        >
                          <input
                            type="hidden"
                            name="contentId"
                            value={item.id}
                          />
                          <input
                            type="hidden"
                            name="status"
                            value={action.status}
                          />
                          <input
                            type="hidden"
                            name="returnTo"
                            value={currentListHref}
                          />
                          <button
                            type="submit"
                            disabled={item.status === action.status}
                            className="h-10 border border-zinc-300 bg-zinc-100 px-3 text-xs font-black text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400"
                          >
                            {action.label}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredContentItems.length ? (
            <div className="border-b border-zinc-100 py-8 text-center text-sm font-bold text-zinc-500">
              선택한 조건에 등록된 콘텐츠가 없습니다.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
          다음 CMS 작업 순서
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {cmsSteps.map(([number, title, text]) => (
            <article key={number} className="border border-zinc-200 p-4">
              <p className="fk-nav-type text-3xl leading-none text-[var(--color-fk-red)]">
                {number}
              </p>
              <h2 className="mt-4 font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
