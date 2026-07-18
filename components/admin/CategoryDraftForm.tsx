"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { getCategorySubtypeLabel } from "@/lib/content/category-labels";
import type { CategoryContentItem, ContentKind } from "@/lib/types/content";
import { submitCategoryDraft } from "@/app/admin/site-categories/new/actions";

type ManagedCategoryKind = Extract<
  ContentKind,
  "program" | "tour" | "culture" | "marketplace" | "resource" | "shop"
>;

type DraftState = {
  kind: ManagedCategoryKind;
  subtype: string;
  titleKo: string;
  summaryKo: string;
  bodyKo: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: string;
  price: string;
  instructor: string;
  operator: string;
  difficulty: string;
  requiredGear: string;
  insuranceNote: string;
  cancellationPolicy: string;
  tourGuide: string;
  itinerary: string;
  includedItems: string;
  excludedItems: string;
  requiredLevel: string;
  athleteLevel: string;
  targetEvents: string;
  seasonGoal: string;
  coachingFormat: string;
  videoReview: string;
  selectionCriteria: string;
  cultureFormat: string;
  communityScope: string;
  ethicsNote: string;
  relatedLink: string;
  shopItemType: string;
  memberRequirement: string;
  fulfillmentMethod: string;
  inventoryStatus: string;
  benefitSummary: string;
  imageUrl: string;
  applicationUrl: string;
  policyNote: string;
};

const initialDraft: DraftState = {
  kind: "program",
  subtype: "Freeride",
  titleKo: "",
  summaryKo: "",
  bodyKo: "",
  location: "",
  startsAt: "",
  endsAt: "",
  capacity: "",
  price: "",
  instructor: "",
  operator: "",
  difficulty: "",
  requiredGear: "",
  insuranceNote: "",
  cancellationPolicy: "",
  tourGuide: "",
  itinerary: "",
  includedItems: "",
  excludedItems: "",
  requiredLevel: "",
  athleteLevel: "",
  targetEvents: "",
  seasonGoal: "",
  coachingFormat: "",
  videoReview: "",
  selectionCriteria: "",
  cultureFormat: "",
  communityScope: "",
  ethicsNote: "",
  relatedLink: "",
  shopItemType: "",
  memberRequirement: "",
  fulfillmentMethod: "",
  inventoryStatus: "",
  benefitSummary: "",
  imageUrl: "/brand/hero-training.png",
  applicationUrl: "",
  policyNote: "",
};

function toDateTimeLocalValue(value?: string) {
  if (!value || !value.includes("T")) {
    return "";
  }

  return value.slice(0, 16);
}

function itemToDraftState(item: CategoryContentItem): DraftState {
  return {
    kind: item.kind,
    subtype: item.subtype,
    titleKo: item.title.ko,
    summaryKo: item.summary.ko,
    bodyKo: item.body.ko,
    location: item.location ?? "",
    startsAt: toDateTimeLocalValue(item.startsAt),
    endsAt: toDateTimeLocalValue(item.endsAt),
    capacity: item.capacity ?? "",
    price: item.price ?? "",
    instructor: item.instructor ?? "",
    operator: item.operator ?? "",
    difficulty: item.difficulty ?? "",
    requiredGear: item.requiredGear ?? "",
    insuranceNote: item.insuranceNote ?? "",
    cancellationPolicy: item.cancellationPolicy ?? "",
    tourGuide: item.tourGuide ?? "",
    itinerary: item.itinerary ?? "",
    includedItems: item.includedItems ?? "",
    excludedItems: item.excludedItems ?? "",
    requiredLevel: item.requiredLevel ?? "",
    athleteLevel: item.athleteLevel ?? "",
    targetEvents: item.targetEvents ?? "",
    seasonGoal: item.seasonGoal ?? "",
    coachingFormat: item.coachingFormat ?? "",
    videoReview: item.videoReview ?? "",
    selectionCriteria: item.selectionCriteria ?? "",
    cultureFormat: item.cultureFormat ?? "",
    communityScope: item.communityScope ?? "",
    ethicsNote: item.ethicsNote ?? "",
    relatedLink: item.relatedLink ?? "",
    shopItemType: item.shopItemType ?? "",
    memberRequirement: item.memberRequirement ?? "",
    fulfillmentMethod: item.fulfillmentMethod ?? "",
    inventoryStatus: item.inventoryStatus ?? "",
    benefitSummary: item.benefitSummary ?? "",
    imageUrl: item.imageUrl,
    applicationUrl: item.applicationUrl ?? "",
    policyNote: item.policyNote ?? "",
  };
}

const categoryOptions: {
  id: string;
  kind: ManagedCategoryKind;
  label: string;
  helper: string;
  subtypes: string[];
}[] = [
  {
    id: "athlete-program",
    kind: "program",
    label: "선수 프로그램",
    helper: "FWT, 올림픽, 국제 대회 출전을 목표로 하는 선수 육성 시스템",
    subtypes: ["Freeride"],
  },
  {
    id: "education",
    kind: "program",
    label: "교육",
    helper: "눈사태 안전, FREERIDING, Backcountry, WFR 교육. 임원진 이상 작성",
    subtypes: ["Avalanche Safety", "Freeriding", "Backcountry", "WFR"],
  },
  {
    id: "tour",
    kind: "tour",
    label: "프리라이드 투어",
    helper: "국내, 일본, 중앙아시아, 유럽, 맞춤 투어",
    subtypes: ["Korea", "Japan", "Central Asia", "Europe", "Custom"],
  },
  {
    id: "culture",
    kind: "culture",
    label: "컬쳐",
    helper: "스토리, 영상/사진, 산악 윤리, 커뮤니티",
    subtypes: ["Story", "Photo / Video", "Mountain Ethics", "Community"],
  },
  {
    id: "marketplace",
    kind: "marketplace",
    label: "중고장터",
    helper: "회원 장비 거래 게시물",
    subtypes: ["Ski", "Snowboard", "Safety Gear", "Wear"],
  },
  {
    id: "resource",
    kind: "resource",
    label: "자료실",
    helper: "앱, 공식 링크, 참고 사이트, 다운로드",
    subtypes: ["Official Link", "App", "Download", "Reference"],
  },
  {
    id: "shop",
    kind: "shop",
    label: "샵",
    helper: "멤버십, 교육/투어 결제, 굿즈",
    subtypes: ["Membership", "Education", "Tour", "Merchandise"],
  },
];

const inputClass =
  "min-h-11 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]";

const textareaClass =
  "min-h-28 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]";

const directPublishKinds = new Set<ManagedCategoryKind>([
  "culture",
  "marketplace",
  "resource",
]);

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="lg:col-span-full">
      <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

type CategoryDraftFormProps = {
  action?: (formData: FormData) => void | Promise<void>;
  initialItem?: CategoryContentItem;
  submitLabel?: string;
  statusLabel?: string;
};

export function CategoryDraftForm({
  action = submitCategoryDraft,
  initialItem,
  submitLabel = "초안 제출",
  statusLabel = "검토 대기열 제출",
}: CategoryDraftFormProps) {
  const [draft, setDraft] = useState<DraftState>(
    initialItem ? itemToDraftState(initialItem) : initialDraft,
  );

  const selectedCategory =
    categoryOptions.find(
      (option) =>
        option.kind === draft.kind && option.subtypes.includes(draft.subtype),
    ) ?? categoryOptions.find((option) => option.kind === draft.kind);
  const isEducationDraft =
    draft.kind === "program" &&
    ["Avalanche Safety", "Freeriding", "Backcountry", "WFR"].includes(
      draft.subtype,
    );
  const isAthleteProgramDraft =
    draft.kind === "program" && draft.subtype === "Freeride";
  const isTourDraft = draft.kind === "tour";
  const isCultureDraft = draft.kind === "culture" || draft.kind === "marketplace";
  const isShopDraft = draft.kind === "shop";
  const isDirectPublishDraft = directPublishKinds.has(draft.kind);

  function update<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleCategoryChange(categoryId: string) {
    const nextCategory = categoryOptions.find(
      (option) => option.id === categoryId,
    );

    if (!nextCategory) {
      return;
    }

    setDraft((current) => ({
      ...current,
      kind: nextCategory.kind,
      subtype: nextCategory.subtypes[0] ?? "",
    }));
  }

  return (
    <form action={action} className="grid gap-8">
      <input type="hidden" name="kind" value={draft.kind} />
      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            콘텐츠 유형
          </p>
          <h2 className="mt-3 text-2xl font-black">어떤 카테고리에 등록할까요?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            선수 프로그램과 Education은 관리자 화면에서 분리해 관리합니다.
            내부 저장 모델은 공유하더라도 운영 기준과 작성 권한은 다르게 봅니다.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleCategoryChange(option.id)}
              className={`border p-4 text-left transition-colors ${
                selectedCategory?.id === option.id
                  ? "border-[var(--color-fk-red)] bg-red-50"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <p className="font-black">{option.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-zinc-600">
                {option.helper}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-2">
        <SectionIntro
          eyebrow="공개 콘텐츠"
          title="목록과 상세 페이지에 보이는 기본 정보"
          description="세부 유형, 대표 이미지, 제목, 요약, 상세 내용을 입력합니다. 이 영역은 모든 카테고리에서 공통으로 공개 화면에 노출되는 핵심 정보입니다."
        />
        <Field label="세부 유형">
          <select
            name="subtype"
            value={draft.subtype}
            onChange={(event) => update("subtype", event.target.value)}
            className={inputClass}
          >
            {selectedCategory?.subtypes.map((subtype) => (
              <option key={subtype} value={subtype}>
                {getCategorySubtypeLabel(subtype)}
              </option>
            ))}
          </select>
        </Field>
        <div className="lg:col-span-2">
          <ImageUploadField
            value={draft.imageUrl}
            onChange={(nextValue) => update("imageUrl", nextValue)}
          />
        </div>
        <Field label="제목">
          <input
            name="titleKo"
            value={draft.titleKo}
            onChange={(event) => update("titleKo", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="요약">
          <textarea
            name="summaryKo"
            value={draft.summaryKo}
            onChange={(event) => update("summaryKo", event.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="상세 내용">
          <textarea
            name="bodyKo"
            value={draft.bodyKo}
            onChange={(event) => update("bodyKo", event.target.value)}
            className="min-h-44 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
          />
        </Field>
      </section>

      <section className="grid gap-5 border border-zinc-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-4">
        <SectionIntro
          eyebrow="운영 공통 정보"
          title="일정, 인원, 신청, 운영 메모"
          description="모집형 콘텐츠에 필요한 일정, 인원, 가격, 신청 링크와 정책 메모를 입력합니다. 선수 프로그램처럼 가격이 맞지 않는 카테고리는 가격 입력을 숨깁니다."
        />
        <Field label="장소 / 지역">
          <input
            name="location"
            value={draft.location}
            onChange={(event) => update("location", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="시작 일시">
          <input
            name="startsAt"
            type="datetime-local"
            value={draft.startsAt}
            onChange={(event) => update("startsAt", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="종료 일시">
          <input
            name="endsAt"
            type="datetime-local"
            value={draft.endsAt}
            onChange={(event) => update("endsAt", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="모집 인원 / 재고">
          <input
            name="capacity"
            value={draft.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            className={inputClass}
            placeholder="예: 12명 / 50개"
          />
        </Field>
        {!isAthleteProgramDraft ? (
          <Field label="가격 / 회비">
            <input
              name="price"
              value={draft.price}
              onChange={(event) => update("price", event.target.value)}
              className={inputClass}
              placeholder="예: 150,000원"
            />
          </Field>
        ) : null}
        <Field label="신청 / 구매 링크">
          <input
            name="applicationUrl"
            value={draft.applicationUrl}
            onChange={(event) => update("applicationUrl", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-xs font-black uppercase text-zinc-500">
            취소 / 환불 / 운영 메모
          </span>
          <textarea
            name="policyNote"
            value={draft.policyNote}
            onChange={(event) => update("policyNote", event.target.value)}
            className={textareaClass}
          />
        </label>
      </section>

      {isEducationDraft ? (
        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              교육 운영 정보
            </p>
            <h2 className="mt-3 text-2xl font-black">교육 운영 필드</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              교육 콘텐츠는 임원진 이상 작성 기준입니다. 강사, 위탁기관,
              필수장비, 난이도, 보험, 취소 기준을 함께 기록해 검토 단계에서
              안전성과 운영 가능성을 확인합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="강사 / 담당자">
              <input
                name="instructor"
                value={draft.instructor}
                onChange={(event) => update("instructor", event.target.value)}
                className={inputClass}
                placeholder="예: 내부 강사 / 외부 전문 강사"
              />
            </Field>
            <Field label="운영 방식 / 위탁기관">
              <input
                name="operator"
                value={draft.operator}
                onChange={(event) => update("operator", event.target.value)}
                className={inputClass}
                placeholder="예: 직접 운영 / 외부 교육센터 위탁"
              />
            </Field>
            <Field label="난이도">
              <select
                name="difficulty"
                value={draft.difficulty}
                onChange={(event) => update("difficulty", event.target.value)}
                className={inputClass}
              >
                <option value="">선택</option>
                <option value="Intro">입문</option>
                <option value="Beginner">초급</option>
                <option value="Intermediate">중급</option>
                <option value="Advanced">상급</option>
                <option value="Expert">전문가</option>
              </select>
            </Field>
            <label className="grid gap-2 md:col-span-2 lg:col-span-3">
              <span className="text-xs font-black uppercase text-zinc-500">
                필수 장비
              </span>
              <textarea
                name="requiredGear"
                value={draft.requiredGear}
                onChange={(event) => update("requiredGear", event.target.value)}
                className={textareaClass}
                placeholder="예: 헬멧, 백프로텍터, 비콘/프로브/삽, 개인 장비"
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                보험 / 안전 고지
              </span>
              <textarea
                name="insuranceNote"
                value={draft.insuranceNote}
                onChange={(event) => update("insuranceNote", event.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                취소 / 환불 기준
              </span>
              <textarea
                name="cancellationPolicy"
                value={draft.cancellationPolicy}
                onChange={(event) =>
                  update("cancellationPolicy", event.target.value)
                }
                className={textareaClass}
              />
            </label>
          </div>
        </section>
      ) : null}

      {isAthleteProgramDraft ? (
        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              선수 육성 운영 정보
            </p>
            <h2 className="mt-3 text-2xl font-black">선수 육성 운영 필드</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              선수 프로그램은 정회원 이상 제안 기준입니다. 선수 레벨, 목표
              대회, 시즌 목표, 코칭 방식, 영상 분석, 참가 기준을 함께 기록해
              장기 성장 경로로 관리합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="선수 레벨">
              <input
                name="athleteLevel"
                value={draft.athleteLevel}
                onChange={(event) => update("athleteLevel", event.target.value)}
                className={inputClass}
                placeholder="예: 육성 / 대회 준비 / 엘리트"
              />
            </Field>
            <Field label="목표 대회">
              <input
                name="targetEvents"
                value={draft.targetEvents}
                onChange={(event) => update("targetEvents", event.target.value)}
                className={inputClass}
                placeholder="예: FWT Qualifier, Challenger, FIS"
              />
            </Field>
            <Field label="시즌 목표">
              <input
                name="seasonGoal"
                value={draft.seasonGoal}
                onChange={(event) => update("seasonGoal", event.target.value)}
                className={inputClass}
                placeholder="예: 대회 2회 출전 / 영상 포트폴리오 완성"
              />
            </Field>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                코칭 방식
              </span>
              <textarea
                name="coachingFormat"
                value={draft.coachingFormat}
                onChange={(event) => update("coachingFormat", event.target.value)}
                className={textareaClass}
                placeholder="예: 시즌 미팅, 현장 코칭, 온라인 피드백, 대회 운영 지원"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                영상 분석
              </span>
              <textarea
                name="videoReview"
                value={draft.videoReview}
                onChange={(event) => update("videoReview", event.target.value)}
                className={textareaClass}
                placeholder="예: 월 1회 영상 리뷰 / 대회 전 라인 분석"
              />
            </label>
            <label className="grid gap-2 md:col-span-2 lg:col-span-3">
              <span className="text-xs font-black uppercase text-zinc-500">
                선발 / 참가 기준
              </span>
              <textarea
                name="selectionCriteria"
                value={draft.selectionCriteria}
                onChange={(event) =>
                  update("selectionCriteria", event.target.value)
                }
                className={textareaClass}
                placeholder="예: 정회원 이상, 기본 라이딩 영상 제출, 안전 교육 이수 권장"
              />
            </label>
          </div>
        </section>
      ) : null}

      {isCultureDraft ? (
        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              컬쳐 운영 정보
            </p>
            <h2 className="mt-3 text-2xl font-black">컬쳐 콘텐츠 운영 필드</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              컬쳐와 중고장터 콘텐츠는 회원 참여가 가능한 영역입니다. 콘텐츠 형식,
              공개 범위, 산악 윤리 기준, 관련 링크를 함께 기록해 커뮤니티 게시물도
              공식 사이트 기준 안에서 검토합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="콘텐츠 형식">
              <input
                name="cultureFormat"
                value={draft.cultureFormat}
                onChange={(event) => update("cultureFormat", event.target.value)}
                className={inputClass}
                placeholder="예: 스토리 / 사진 기록 / 비디오 / 가이드라인"
              />
            </Field>
            <Field label="커뮤니티 범위">
              <input
                name="communityScope"
                value={draft.communityScope}
                onChange={(event) => update("communityScope", event.target.value)}
                className={inputClass}
                placeholder="예: 공개 / 회원 전용 / 정회원 전용"
              />
            </Field>
            <Field label="관련 링크">
              <input
                name="relatedLink"
                value={draft.relatedLink}
                onChange={(event) => update("relatedLink", event.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </Field>
            <label className="grid gap-2 md:col-span-2 lg:col-span-3">
              <span className="text-xs font-black uppercase text-zinc-500">
                산악 윤리 / 커뮤니티 기준
              </span>
              <textarea
                name="ethicsNote"
                value={draft.ethicsNote}
                onChange={(event) => update("ethicsNote", event.target.value)}
                className={textareaClass}
                placeholder="예: 위치 공개 기준, 안전 장비 노출 기준, 타인 촬영 동의, 중고장터 거래 책임"
              />
            </label>
          </div>
        </section>
      ) : null}

      {isShopDraft ? (
        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              샵 운영 정보
            </p>
            <h2 className="mt-3 text-2xl font-black">샵 운영 필드</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              샵은 단순 상품 판매뿐 아니라 정회원권, 교육/투어 결제, 굿즈,
              스폰서십 혜택을 함께 다루는 운영 허브입니다. 결제 연동 전에도
              회원 조건, 제공 방식, 재고 또는 판매 상태를 명확히 기록합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="상품 / 결제 유형">
              <input
                name="shopItemType"
                value={draft.shopItemType}
                onChange={(event) => update("shopItemType", event.target.value)}
                className={inputClass}
                placeholder="예: 멤버십 / 교육 / 투어 / 굿즈"
              />
            </Field>
            <Field label="회원 조건">
              <input
                name="memberRequirement"
                value={draft.memberRequirement}
                onChange={(event) =>
                  update("memberRequirement", event.target.value)
                }
                className={inputClass}
                placeholder="예: 일반회원 이상 / 정회원 전용"
              />
            </Field>
            <Field label="재고 / 판매 상태">
              <input
                name="inventoryStatus"
                value={draft.inventoryStatus}
                onChange={(event) => update("inventoryStatus", event.target.value)}
                className={inputClass}
                placeholder="예: 신청 접수중 / 준비중 / 품절 / 마감"
              />
            </Field>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                제공 방식
              </span>
              <textarea
                name="fulfillmentMethod"
                value={draft.fulfillmentMethod}
                onChange={(event) =>
                  update("fulfillmentMethod", event.target.value)
                }
                className={textareaClass}
                placeholder="예: 관리자 확인 후 회원 등급 변경 / 현장 수령 / 택배 발송 / 외부 결제 확인"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                혜택 요약
              </span>
              <textarea
                name="benefitSummary"
                value={draft.benefitSummary}
                onChange={(event) => update("benefitSummary", event.target.value)}
                className={textareaClass}
                placeholder="예: 우선 참가, 할인, 전용 앱 사용, 운영 참여"
              />
            </label>
          </div>
        </section>
      ) : null}

      {isTourDraft ? (
        <section className="grid gap-5 border border-zinc-200 bg-white p-5">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              투어 운영 정보
            </p>
            <h2 className="mt-3 text-2xl font-black">투어 운영 필드</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              투어 콘텐츠는 정회원 이상 제안 기준입니다. 일정표, 포함/불포함,
              참가 레벨, 가이드, 보험, 취소 기준을 함께 기록해 실제 모집과
              현장 운영에 바로 사용할 수 있게 합니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field label="가이드 / 투어 리더">
              <input
                name="tourGuide"
                value={draft.tourGuide}
                onChange={(event) => update("tourGuide", event.target.value)}
                className={inputClass}
                placeholder="예: FK 투어 리더 / 현지 가이드"
              />
            </Field>
            <Field label="운영 방식 / 현지 파트너">
              <input
                name="operator"
                value={draft.operator}
                onChange={(event) => update("operator", event.target.value)}
                className={inputClass}
                placeholder="예: 직접 운영 / 현지 파트너 공동 운영"
              />
            </Field>
            <Field label="참가 레벨">
              <input
                name="requiredLevel"
                value={draft.requiredLevel}
                onChange={(event) => update("requiredLevel", event.target.value)}
                className={inputClass}
                placeholder="예: 중급 이상 / 상급자 권장"
              />
            </Field>
            <Field label="난이도">
              <select
                name="difficulty"
                value={draft.difficulty}
                onChange={(event) => update("difficulty", event.target.value)}
                className={inputClass}
              >
                <option value="">선택</option>
                <option value="Easy">쉬움</option>
                <option value="Moderate">보통</option>
                <option value="Intermediate">중급</option>
                <option value="Advanced">상급</option>
                <option value="Expert">전문가</option>
              </select>
            </Field>
            <label className="grid gap-2 md:col-span-2 lg:col-span-3">
              <span className="text-xs font-black uppercase text-zinc-500">
                일정표
              </span>
              <textarea
                name="itinerary"
                value={draft.itinerary}
                onChange={(event) => update("itinerary", event.target.value)}
                className={textareaClass}
                placeholder="예: Day 1 도착 및 장비 체크 / Day 2-4 라이딩 / Day 5 예비일"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                포함 사항
              </span>
              <textarea
                name="includedItems"
                value={draft.includedItems}
                onChange={(event) => update("includedItems", event.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                불포함 사항
              </span>
              <textarea
                name="excludedItems"
                value={draft.excludedItems}
                onChange={(event) => update("excludedItems", event.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                필수 장비
              </span>
              <textarea
                name="requiredGear"
                value={draft.requiredGear}
                onChange={(event) => update("requiredGear", event.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                보험 / 안전 고지
              </span>
              <textarea
                name="insuranceNote"
                value={draft.insuranceNote}
                onChange={(event) => update("insuranceNote", event.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                취소 / 환불 기준
              </span>
              <textarea
                name="cancellationPolicy"
                value={draft.cancellationPolicy}
                onChange={(event) =>
                  update("cancellationPolicy", event.target.value)
                }
                className={textareaClass}
              />
            </label>
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="bg-[var(--color-fk-black)] px-5 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-zinc-800"
        >
          {isDirectPublishDraft ? "바로 등록" : submitLabel}
        </button>
        <Badge tone={isDirectPublishDraft ? "green" : "amber"}>
          {isDirectPublishDraft ? "관리자 검토 없이 바로 게시" : statusLabel}
        </Badge>
        <p className="text-sm font-bold text-zinc-600">
          {isDirectPublishDraft
            ? "컬쳐, 중고장터, 자료실은 작성 즉시 공개 상태로 등록됩니다. 필요하면 목록에서 숨김 또는 보관 처리할 수 있습니다."
            : "Supabase 환경변수가 있으면 초안이 저장되고, 없으면 mock 모드로 검증됩니다."}
        </p>
      </section>
    </form>
  );
}
