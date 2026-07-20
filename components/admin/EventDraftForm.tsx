"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getEventStatus } from "@/lib/dates/event-status";
import { eventSeriesOptions } from "@/lib/events/series";
import { eventInputSchema } from "@/lib/validation/event";
import type { EventOfficiality, EventSeries } from "@/lib/types/event";

type DraftState = {
  nameKo: string;
  series: EventSeries;
  officiality: EventOfficiality;
  season: string;
  country: string;
  location: string;
  resort: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  cancelled: boolean;
  imageUrl: string;
  summaryKo: string;
  descriptionKo: string;
  officialLink: string;
  registrationLink: string;
  replayOrResultsLink: string;
  relatedLabel: string;
  relatedUrl: string;
};

const initialDraft: DraftState = {
  nameKo: "",
  series: "freeride-world-tour",
  officiality: "official",
  season: "2026",
  country: "",
  location: "",
  resort: "",
  startsAt: "",
  endsAt: "",
  timezone: "Asia/Seoul",
  cancelled: false,
  imageUrl: "/brand/hero-event.png",
  summaryKo: "",
  descriptionKo: "",
  officialLink: "",
  registrationLink: "",
  replayOrResultsLink: "",
  relatedLabel: "",
  relatedUrl: "",
};

function toIsoDateTime(value: string) {
  return value ? new Date(value).toISOString() : "";
}

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

const inputClass =
  "min-h-11 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]";

const textareaClass =
  "min-h-28 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]";

type EventDraftFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function EventDraftForm({ action }: EventDraftFormProps) {
  const [draft, setDraft] = useState<DraftState>(initialDraft);
  const [result, setResult] = useState<string | null>(null);

  const preview = useMemo(() => {
    const startsAt = toIsoDateTime(draft.startsAt);
    const endsAt = toIsoDateTime(draft.endsAt);

    return {
      startsAt,
      endsAt,
      status:
        startsAt && endsAt
          ? getEventStatus({
              startsAt,
              endsAt,
              cancelled: draft.cancelled,
            })
          : "draft",
    };
  }, [draft.cancelled, draft.endsAt, draft.startsAt]);

  function update<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleValidate() {
    const parsed = eventInputSchema.safeParse({
      name: { ko: draft.nameKo, en: draft.nameKo },
      series: draft.series,
      officiality: draft.officiality,
      season: draft.season,
      country: draft.country,
      location: draft.location,
      resort: draft.resort || undefined,
      startsAt: preview.startsAt,
      endsAt: preview.endsAt,
      timezone: draft.timezone,
      cancelled: draft.cancelled,
      imageUrl: draft.imageUrl,
      summary: { ko: draft.summaryKo, en: draft.summaryKo },
      description: { ko: draft.descriptionKo, en: draft.descriptionKo },
      officialLink: draft.officialLink,
      registrationLink: draft.registrationLink,
      replayOrResultsLink: draft.replayOrResultsLink,
      relatedLinks:
        draft.relatedLabel && draft.relatedUrl
          ? [{ label: draft.relatedLabel, url: draft.relatedUrl }]
          : [],
    });

    if (parsed.success) {
      setResult(
        "초안 검증이 완료되었습니다. 다음 단계에서 이 데이터를 Supabase 저장 액션에 연결할 수 있습니다.",
      );
      return;
    }

    setResult(parsed.error.issues[0]?.message ?? "필수 입력값을 확인해 주세요.");
  }

  return (
    <form action={action} encType="multipart/form-data" className="grid gap-8">
      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-2">
        <SectionIntro
          eyebrow="기본 정보"
          title="대회 식별 정보"
          description="대회명, 시리즈, 공식 여부, 시즌, 국가와 장소를 먼저 입력합니다. 이 정보는 공개 목록과 상세 페이지의 핵심 분류 기준으로 사용됩니다."
        />
        <Field label="대회명">
          <input
            name="nameKo"
            required
            value={draft.nameKo}
            onChange={(event) => update("nameKo", event.target.value)}
            className={inputClass}
            placeholder="예: 2026 YETI Xtreme Verbier"
          />
        </Field>
        <Field label="시리즈 카테고리">
          <select
            name="series"
            value={draft.series}
            onChange={(event) => update("series", event.target.value as EventSeries)}
            className={inputClass}
          >
            {eventSeriesOptions.map((series) => (
              <option key={series.value} value={series.value}>
                {series.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="공식 / 비공식 여부">
          <select
            name="officiality"
            value={draft.officiality}
            onChange={(event) =>
              update("officiality", event.target.value as EventOfficiality)
            }
            className={inputClass}
          >
            <option value="official">공식</option>
            <option value="unofficial">비공식</option>
          </select>
        </Field>
        <Field label="시즌">
          <input
            name="season"
            required
            value={draft.season}
            onChange={(event) => update("season", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="국가">
          <input
            name="country"
            required
            value={draft.country}
            onChange={(event) => update("country", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="장소">
          <input
            name="location"
            required
            value={draft.location}
            onChange={(event) => update("location", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="리조트">
          <input
            name="resort"
            value={draft.resort}
            onChange={(event) => update("resort", event.target.value)}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-[1fr_1fr_0.8fr]">
        <SectionIntro
          eyebrow="일정과 상태"
          title="상태 자동 계산 기준"
          description="시작/종료 일시를 입력하면 예정, 진행중, 완료 상태가 자동으로 계산됩니다. 취소 상태만 관리자가 직접 체크합니다."
        />
        <Field label="시작 일시">
          <input
            type="datetime-local"
            name="startsAt"
            required
            value={draft.startsAt}
            onChange={(event) => update("startsAt", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="종료 일시">
          <input
            type="datetime-local"
            name="endsAt"
            required
            value={draft.endsAt}
            onChange={(event) => update("endsAt", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="시간대">
          <input
            name="timezone"
            required
            value={draft.timezone}
            onChange={(event) => update("timezone", event.target.value)}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-3 lg:col-span-3">
          <input
            type="checkbox"
            name="cancelled"
            checked={draft.cancelled}
            onChange={(event) => update("cancelled", event.target.checked)}
          />
          <span className="text-sm font-black">
            취소 처리, 관리자 수동 설정
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-3 lg:col-span-3">
          <span className="text-xs font-black uppercase text-zinc-500">
            상태 미리보기
          </span>
          <StatusBadge status={preview.status} />
          <Badge tone="neutral">일정 기준 자동 계산</Badge>
        </div>
      </section>

      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-2">
        <SectionIntro
          eyebrow="링크와 이미지"
          title="공식 출처와 연결 정보"
          description="공식 링크, 등록 링크, 리플레이 또는 결과 링크를 분리해서 관리합니다. 관련 뉴스나 영상은 제목과 URL을 함께 입력합니다."
        />
        <div className="lg:col-span-2">
          <ImageUploadField
            value={draft.imageUrl}
            onChange={(nextValue) => update("imageUrl", nextValue)}
            placeholder="/brand/hero-event.png"
          />
        </div>
        <Field label="공식 링크">
          <input
            name="officialLink"
            value={draft.officialLink}
            onChange={(event) => update("officialLink", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="등록 링크">
          <input
            name="registrationLink"
            value={draft.registrationLink}
            onChange={(event) => update("registrationLink", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="리플레이 / 결과 링크">
          <input
            name="replayOrResultsLink"
            value={draft.replayOrResultsLink}
            onChange={(event) => update("replayOrResultsLink", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="관련 링크 제목">
          <input
            name="relatedLabel"
            value={draft.relatedLabel}
            onChange={(event) => update("relatedLabel", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="관련 링크 URL">
          <input
            name="relatedUrl"
            value={draft.relatedUrl}
            onChange={(event) => update("relatedUrl", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
      </section>

      <section className="grid gap-5 border border-zinc-200 bg-white p-5 lg:grid-cols-2">
        <SectionIntro
          eyebrow="공개 설명"
          title="목록 소개와 상세 설명"
          description="짧은 소개문은 이벤트 목록 카드에, 상세 설명은 개별 이벤트 상세 페이지에 노출됩니다."
        />
        <Field label="짧은 소개문">
          <textarea
            name="summaryKo"
            required
            value={draft.summaryKo}
            onChange={(event) => update("summaryKo", event.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="상세 설명">
          <textarea
            name="descriptionKo"
            required
            value={draft.descriptionKo}
            onChange={(event) => update("descriptionKo", event.target.value)}
            className={textareaClass}
          />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleValidate}
          className="bg-[var(--color-fk-black)] px-5 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-zinc-800"
        >
          초안 검증
        </button>
        <button
          type="submit"
          className="border border-zinc-400 bg-zinc-200 px-5 py-3 text-sm font-black uppercase text-zinc-950 transition-colors hover:bg-zinc-300"
        >
          검토 대기열로 제출
        </button>
        <p className="text-sm font-bold text-zinc-600">
          {result ?? "현재는 입력 구조만 검증합니다. 실제 DB 저장은 다음 단계에서 연결합니다."}
        </p>
      </div>
    </form>
  );
}
