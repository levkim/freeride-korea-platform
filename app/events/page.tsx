import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { listEvents } from "@/lib/repositories/events";
import { getEventStatus } from "@/lib/dates/event-status";
import {
  eventSeriesOptions,
  getEventSeriesHref,
  getEventSeriesLabel,
} from "@/lib/events/series";
import type { EventSeries, EventStatus } from "@/lib/types/event";

const countryMarks: Record<string, { code: string; color: string }> = {
  Andorra: { code: "AD", color: "#d50032" },
  Spain: { code: "ES", color: "#c60b1e" },
  France: { code: "FR", color: "#0055a4" },
  Georgia: { code: "GE", color: "#ff0000" },
  Austria: { code: "AT", color: "#ed2939" },
  "United States": { code: "US", color: "#3c3b6e" },
  Switzerland: { code: "CH", color: "#ff0000" },
  Asia: { code: "AS", color: "#144f93" },
};

const statusLabels: Record<EventStatus, string> = {
  upcoming: "예정",
  live: "진행중",
  completed: "완료",
  cancelled: "취소",
};

const validSeries = new Set<EventSeries>(
  eventSeriesOptions.map((option) => option.value),
);

function formatEventDate(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  if (start.toDateString() === end.toDateString()) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

type EventsPageProps = {
  searchParams?: Promise<{
    series?: string;
  }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const selectedSeries =
    params?.series && validSeries.has(params.series as EventSeries)
      ? (params.series as EventSeries)
      : null;
  const allEvents = await listEvents();
  const events = [...allEvents]
    .filter((event) => !selectedSeries || event.series === selectedSeries)
    .sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">
        <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <h1 className="fk-nav-type text-7xl leading-none md:text-8xl">EVENTS</h1>
          {selectedSeries ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge tone="blue">{getEventSeriesLabel(selectedSeries)}</Badge>
              <Link
                href="/events"
                className="fk-nav-type text-lg leading-none text-zinc-500 transition-colors hover:text-[var(--color-fk-red)]"
              >
                전체 이벤트 보기
              </Link>
            </div>
          ) : null}

          <div className="mt-8 border-y border-zinc-300 py-4">
            <p className="text-xs font-black uppercase text-zinc-500">
              대회 시리즈
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/events"
                className={`fk-nav-type border px-4 py-2 text-base leading-none transition-colors ${
                  selectedSeries
                    ? "border-zinc-300 text-zinc-700 hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                    : "border-zinc-300 bg-zinc-100 text-zinc-950"
                }`}
              >
                전체 이벤트
              </Link>
              {eventSeriesOptions.map((option) => {
                const active = selectedSeries === option.value;

                return (
                  <Link
                    key={option.value}
                    href={getEventSeriesHref(option.value)}
                    className={`fk-nav-type border px-4 py-2 text-base leading-none transition-colors ${
                      active
                        ? "border-zinc-300 bg-zinc-200 text-zinc-950"
                        : "border-zinc-300 text-zinc-700 hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                    }`}
                  >
                    {option.shortLabel}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-12 rounded-[28px] bg-zinc-100 p-5 md:max-w-3xl md:p-7">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-4">
                <span className="grid w-6 gap-1">
                  <span className="h-0.5 bg-zinc-900" />
                  <span className="h-0.5 w-4 justify-self-end bg-zinc-900" />
                  <span className="h-0.5 bg-zinc-900" />
                </span>
                <p className="fk-nav-type text-xl leading-none">필터</p>
              </div>
              <span className="text-2xl leading-none">^</span>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                "2026 시즌",
                selectedSeries
                  ? `시리즈 (${getEventSeriesLabel(selectedSeries)})`
                  : "시리즈 (전체)",
                "월 (전체)",
                "국가 (전체)",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex min-h-14 items-center justify-between rounded-full bg-white px-5 text-left"
                >
                  <span className="fk-nav-type text-lg leading-none">{label}</span>
                  <span className="text-2xl leading-none">v</span>
                </button>
              ))}
            </div>

            <div className="mt-7 flex justify-center">
              <button
                type="button"
                className="fk-nav-type border border-[var(--color-fk-red)] px-8 py-3 text-lg leading-none text-zinc-900 transition-colors hover:bg-[var(--color-fk-red)] hover:text-white"
              >
                적용
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-300">
            {events.length === 0 ? (
              <div className="border-b border-zinc-300 py-12">
                <p className="fk-nav-type text-3xl leading-none">
                  등록된 이벤트가 아직 없습니다.
                </p>
                <p className="mt-4 max-w-xl text-zinc-600">
                  관리자 게시가 완료되면 이 시리즈 목록에 이벤트가 표시됩니다.
                </p>
              </div>
            ) : null}
            {events.map((event) => {
              const status = getEventStatus(event);
              const country = countryMarks[event.country] ?? {
                code: event.country.slice(0, 2).toUpperCase(),
                color: "#0b0d10",
              };

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="grid grid-cols-[1fr_34%] gap-5 border-b border-zinc-300 py-7 transition-colors hover:bg-zinc-50 md:grid-cols-[1fr_260px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {event.series === "fis-freeride-world-championships" ? (
                        <Badge tone="red">공식 메이저</Badge>
                      ) : null}
                      <Badge tone={event.officiality === "official" ? "blue" : "neutral"}>
                        {event.officiality === "official" ? "공식" : "비공식"}
                      </Badge>
                    </div>
                    <h2 className="fk-nav-type mt-4 max-w-2xl text-[31px] leading-[0.98] md:text-5xl">
                      {event.name.ko}
                    </h2>
                    <p className="fk-nav-type mt-5 text-2xl leading-none">
                      {formatEventDate(event.startsAt, event.endsAt)}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex border border-zinc-300 px-2 py-1 text-xs font-black uppercase">
                        {statusLabels[status]}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className="flex h-7 w-10 items-center justify-center text-[10px] font-black text-white"
                        style={{ backgroundColor: country.color }}
                      >
                        {country.code}
                      </span>
                      <span className="fk-nav-type text-xl leading-none">
                        {event.country}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-9 aspect-[1.36/1] overflow-hidden bg-zinc-100 md:mt-6">
                    <Image
                      src={event.imageUrl ?? "/brand/hero-event.png"}
                      alt={event.name.ko}
                      fill
                      sizes="(max-width: 768px) 34vw, 260px"
                      className="object-cover"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
