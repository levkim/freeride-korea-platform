import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CommentSection } from "@/components/public/CommentSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getCategorySubtypeLabel } from "@/lib/content/category-labels";
import type { CategoryContentItem } from "@/lib/types/content";

type CategoryDetailPageProps = {
  item: CategoryContentItem;
  listHref: string;
  listLabel: string;
  ctaLabel?: string;
};

const kindLabels: Record<CategoryContentItem["kind"], string> = {
  program: "선수 프로그램",
  tour: "프리라이드 투어",
  culture: "컬쳐",
  marketplace: "중고장터",
  resource: "자료실",
  shop: "샵",
};

function DetailFact({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="border-t border-zinc-200 pt-4">
      <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-zinc-900">{value}</p>
    </div>
  );
}

function hasEducationOperations(item: CategoryContentItem) {
  return Boolean(
    item.instructor ||
      item.operator ||
      item.difficulty ||
      item.requiredGear ||
      item.insuranceNote ||
      item.cancellationPolicy,
  );
}

function hasTourOperations(item: CategoryContentItem) {
  return Boolean(
    item.tourGuide ||
      item.operator ||
      item.requiredLevel ||
      item.itinerary ||
      item.includedItems ||
      item.excludedItems ||
      item.requiredGear ||
      item.insuranceNote ||
      item.cancellationPolicy,
  );
}

function hasAthleteProgramOperations(item: CategoryContentItem) {
  return Boolean(
    item.athleteLevel ||
      item.targetEvents ||
      item.seasonGoal ||
      item.coachingFormat ||
      item.videoReview ||
      item.selectionCriteria,
  );
}

function hasCultureOperations(item: CategoryContentItem) {
  return Boolean(
    item.cultureFormat ||
      item.communityScope ||
      item.ethicsNote ||
      item.relatedLink,
  );
}

function hasShopOperations(item: CategoryContentItem) {
  return Boolean(
    item.shopItemType ||
      item.memberRequirement ||
      item.fulfillmentMethod ||
      item.inventoryStatus ||
      item.benefitSummary,
  );
}

export function CategoryDetailPage({
  item,
  listHref,
  listLabel,
  ctaLabel = "문의 / 신청하기",
}: CategoryDetailPageProps) {
  const hasSchedule = item.startsAt || item.endsAt;
  const isAthleteProgram = item.kind === "program" && item.subtype === "Freeride";
  const schedule = hasSchedule
    ? [item.startsAt, item.endsAt].filter(Boolean).join(" - ")
    : undefined;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[0.94fr_1.06fr] md:py-20">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="blue">{kindLabels[item.kind]}</Badge>
                  <Badge tone="neutral">{getCategorySubtypeLabel(item.subtype)}</Badge>
                  <Badge tone={item.status === "published" ? "red" : "neutral"}>
                    {item.status}
                  </Badge>
                </div>
                <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-normal md:text-6xl">
                  {item.title.ko}
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-700">
                  {item.summary.ko}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href={item.applicationUrl || "/contact-join"} variant="secondary">
                  {ctaLabel}
                </Button>
                <Button href={listHref} variant="ghost">
                  {listLabel}
                </Button>
              </div>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden border border-zinc-200 bg-zinc-100 shadow-[var(--shadow-diffused)]">
              <Image
                src={item.imageUrl}
                alt={item.title.ko}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                <p className="fk-nav-type text-3xl leading-none">
                  {kindLabels[item.kind]} 상세
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
            <p className="fk-nav-type text-3xl leading-none">상세 정보</p>
            <div className="mt-7 grid gap-4">
              <DetailFact label="장소" value={item.location} />
              <DetailFact label="일정" value={schedule} />
              <DetailFact label="모집 인원" value={item.capacity} />
              {!isAthleteProgram ? (
                <DetailFact label="참가비" value={item.price} />
              ) : null}
              <DetailFact label="난이도" value={item.difficulty} />
              <DetailFact label="필요 역량" value={item.requiredLevel} />
              <DetailFact label="선수 레벨" value={item.athleteLevel} />
              <DetailFact label="커뮤니티 범위" value={item.communityScope} />
              <DetailFact label="회원 조건" value={item.memberRequirement} />
              <DetailFact label="재고 상태" value={item.inventoryStatus} />
              {item.tags.length ? (
                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-xs font-black uppercase text-zinc-500">태그</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-black uppercase text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <article className="grid gap-8">
            {hasEducationOperations(item) ? (
              <section className="border border-zinc-200 bg-white p-6">
                <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                  교육 운영 정보
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <DetailFact label="강사" value={item.instructor} />
                  <DetailFact label="운영 주체" value={item.operator} />
                  <DetailFact label="필수 장비" value={item.requiredGear} />
                  <DetailFact label="보험 / 안전" value={item.insuranceNote} />
                  <DetailFact
                    label="취소 / 환불"
                    value={item.cancellationPolicy}
                  />
                </div>
              </section>
            ) : null}
            {hasAthleteProgramOperations(item) ? (
              <section className="border border-zinc-200 bg-white p-6">
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  선수 육성 정보
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <DetailFact label="목표 대회" value={item.targetEvents} />
                  <DetailFact label="시즌 목표" value={item.seasonGoal} />
                  <DetailFact label="훈련 방식" value={item.coachingFormat} />
                  <DetailFact label="영상 분석" value={item.videoReview} />
                  {item.selectionCriteria ? (
                    <div className="border-t border-zinc-200 pt-4 md:col-span-2">
                      <p className="text-xs font-black uppercase text-zinc-500">
                        선발 / 참가 기준
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-zinc-900">
                        {item.selectionCriteria}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            {hasTourOperations(item) ? (
              <section className="border border-zinc-200 bg-white p-6">
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  투어 운영 정보
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <DetailFact label="가이드 / 리더" value={item.tourGuide} />
                  <DetailFact label="운영 주체" value={item.operator} />
                  <DetailFact label="포함 사항" value={item.includedItems} />
                  <DetailFact label="불포함 사항" value={item.excludedItems} />
                  <DetailFact label="필수 장비" value={item.requiredGear} />
                  <DetailFact label="보험 / 안전" value={item.insuranceNote} />
                  <DetailFact
                    label="취소 / 환불"
                    value={item.cancellationPolicy}
                  />
                  {item.itinerary ? (
                    <div className="border-t border-zinc-200 pt-4 md:col-span-2">
                      <p className="text-xs font-black uppercase text-zinc-500">
                        일정표
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-zinc-900">
                        {item.itinerary}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            {hasCultureOperations(item) ? (
              <section className="border border-zinc-200 bg-white p-6">
                <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                  컬쳐 운영 정보
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <DetailFact label="콘텐츠 형식" value={item.cultureFormat} />
                  <DetailFact label="커뮤니티 범위" value={item.communityScope} />
                  <DetailFact label="관련 링크" value={item.relatedLink} />
                  {item.ethicsNote ? (
                    <div className="border-t border-zinc-200 pt-4 md:col-span-2">
                      <p className="text-xs font-black uppercase text-zinc-500">
                        산악 윤리 / 커뮤니티 기준
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-zinc-900">
                        {item.ethicsNote}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            {hasShopOperations(item) ? (
              <section className="border border-zinc-200 bg-white p-6">
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  샵 운영 정보
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <DetailFact label="상품 유형" value={item.shopItemType} />
                  <DetailFact
                    label="회원 조건"
                    value={item.memberRequirement}
                  />
                  <DetailFact label="재고 상태" value={item.inventoryStatus} />
                  <DetailFact
                    label="제공 방식"
                    value={item.fulfillmentMethod}
                  />
                  {item.benefitSummary ? (
                    <div className="border-t border-zinc-200 pt-4 md:col-span-2">
                      <p className="text-xs font-black uppercase text-zinc-500">
                        혜택 요약
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-7 text-zinc-900">
                        {item.benefitSummary}
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
            <div className="border-b border-zinc-200 pb-8">
              <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                본문
              </p>
              <p className="mt-4 text-lg leading-8 text-zinc-700">
                {item.body.ko}
              </p>
            </div>
            {item.policyNote ? (
              <div className="border-l-4 border-[var(--color-fk-black)] bg-zinc-50 p-6">
                <p className="text-sm font-black uppercase text-zinc-500">
                  Policy / 운영 기준
                </p>
                <p className="mt-3 text-sm font-bold leading-7 text-zinc-800">
                  {item.policyNote}
                </p>
              </div>
            ) : null}
          </article>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-14">
          <CommentSection
            targetType="category-content"
            targetId={item.id}
            allowComments={item.kind !== "shop"}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
