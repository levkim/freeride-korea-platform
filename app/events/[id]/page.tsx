import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CommentSection } from "@/components/public/CommentSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { upcomingEvents } from "@/content/seed/site-data";
import { getEventStatus } from "@/lib/dates/event-status";
import { getEventById, listEvents } from "@/lib/repositories/events";
import {
  eventSeriesOptions,
  getEventSeriesHref,
  getEventSeriesLabel,
} from "@/lib/events/series";
import type { EventSeries, EventStatus } from "@/lib/types/event";

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<EventStatus, string> = {
  upcoming: "예정",
  live: "진행중",
  completed: "완료",
  cancelled: "취소",
};

function formatEventDate(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  if (start.toDateString() === end.toDateString()) {
    return dateFormatter.format(start);
  }

  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

function getSeriesCount(events: { series: EventSeries }[], series: EventSeries) {
  return events.filter((event) => event.series === series).length;
}

export function generateStaticParams() {
  return upcomingEvents.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return {
      title: "Events | FREERIDE KOREA",
    };
  }

  return {
    title: `${event.name.ko} | FREERIDE KOREA`,
    description: event.summary.ko,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const status = getEventStatus(event);
  const allEvents = await listEvents();
  const links = [
    event.officialLink
      ? { label: "공식 링크", href: event.officialLink }
      : null,
    event.registrationLink
      ? { label: "등록 링크", href: event.registrationLink }
      : null,
    event.replayOrResultsLink
      ? { label: "리플레이 / 결과", href: event.replayOrResultsLink }
      : null,
    ...event.relatedLinks.map((link) => ({
      label: link.label,
      href: link.url,
    })),
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">
        <article className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="fk-nav-type text-lg leading-none text-zinc-500 transition-colors hover:text-[var(--color-fk-red)]"
            >
              이벤트 목록
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              href={getEventSeriesHref(event.series)}
              className="fk-nav-type text-lg leading-none text-zinc-500 transition-colors hover:text-[var(--color-fk-red)]"
            >
              {getEventSeriesLabel(event.series)}
            </Link>
          </div>

          <header className="mt-8 grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                {event.series === "fis-freeride-world-championships" ? (
                  <Badge tone="red">공식 메이저</Badge>
                ) : null}
                <Badge tone={event.officiality === "official" ? "blue" : "neutral"}>
                  {event.officiality === "official" ? "공식" : "비공식"}
                </Badge>
                <Badge tone="neutral">{event.season}</Badge>
                <Badge tone={status === "cancelled" ? "red" : "green"}>
                  {statusLabels[status]}
                </Badge>
              </div>
              <h1 className="fk-nav-type mt-6 text-5xl leading-[0.98] md:text-7xl">
                {event.name.ko}
              </h1>
            </div>

            <div className="grid gap-4 border-t border-zinc-300 pt-5 md:grid-cols-2">
              {[
                ["시리즈", getEventSeriesLabel(event.series)],
                ["일정", formatEventDate(event.startsAt, event.endsAt)],
                ["국가", event.country],
                ["장소 / 리조트", `${event.location} / ${event.resort ?? "미정"}`],
                ["시간대", event.timezone],
                ["상태", statusLabels[status]],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-black uppercase text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-zinc-900">{value}</p>
                </div>
              ))}
            </div>
          </header>

          <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-[1.6/1] overflow-hidden bg-zinc-100">
              <Image
                src={event.imageUrl ?? "/brand/hero-event.png"}
                alt={event.name.ko}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            <aside className="grid content-start gap-5 border-t border-zinc-300 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  이벤트 링크
                </p>
                <div className="mt-4 grid gap-3">
                  {links.length > 0 ? (
                    links.map((link) => (
                      <a
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        className="fk-nav-type border border-zinc-300 px-5 py-3 text-center text-lg leading-none transition-colors hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                      >
                        {link.label}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-zinc-600">
                      관리자 게시 후 공식 링크, 등록 링크, 리플레이 또는 결과 링크가 표시됩니다.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-12 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                대회 시리즈
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/events"
                  className="fk-nav-type border border-zinc-300 bg-zinc-100 px-4 py-2 text-base leading-none text-zinc-950 transition-colors hover:border-[var(--color-fk-red)] hover:text-[var(--color-fk-red)]"
                >
                  전체 이벤트
                </Link>
                {eventSeriesOptions.map((option) => {
                  const active = event.series === option.value;

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
                      {option.shortLabel} ({getSeriesCount(allEvents, option.value)})
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8">
              <section>
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  요약
                </p>
                <p className="mt-4 text-lg font-bold leading-8 text-zinc-900">
                  {event.summary.ko}
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  {event.description.ko}
                </p>
              </section>
            </div>
          </section>

          <section className="mt-12">
            <CommentSection targetType="event" targetId={event.id} />
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
