import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeroMediaCarousel } from "@/components/public/HeroMediaCarousel";
import { LatestUpdates } from "@/components/public/LatestUpdates";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import {
  featuredPrograms,
  featuredTours,
  latestUpdates,
  upcomingEvents,
} from "@/content/seed/site-data";
import { getEventStatus } from "@/lib/dates/event-status";
import type { EventStatus } from "@/lib/types/event";

const pathways = [
  {
    title: "Athlete Program",
    ko: "선수 프로그램",
    index: "01",
    text: "FWT 본선과 향후 올림픽 무대를 향한 한국인 선수 육성 루트입니다.",
    href: "/athlete-program",
  },
  {
    title: "Education",
    ko: "교육",
    index: "02",
    text: "눈사태 안전교육과 WFR 관련 교육을 프리라이딩의 기본으로 둡니다.",
    href: "/safety-education",
  },
  {
    title: "Freeride Tour",
    ko: "프리라이드 투어",
    index: "03",
    text: "설산과 푸른산을 즐기는 투어, 원정, 커뮤니티 경험을 연결합니다.",
    href: "/freeride-tour",
  },
  {
    title: "Events",
    ko: "이벤트",
    index: "04",
    text: "FWT, FIS, 아시아 지역 대회 소식을 공식 아카이브로 관리합니다.",
    href: "/events",
  },
];

const values = ["FUN", "RESPECT", "SAFETY", "SNOW MOUNTAINS", "GREEN MOUNTAINS"];

const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: "예정",
  live: "진행중",
  completed: "완료",
  cancelled: "취소",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative border-b border-zinc-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7f8fa_52%,#edf1f6_100%)]">
          <div className="absolute right-[-18vw] top-[-22rem] h-[42rem] w-[42rem] rounded-full border border-red-100 bg-red-50/50" />
          <div className="absolute bottom-[-18rem] left-[-14vw] h-[36rem] w-[36rem] rounded-full border border-blue-100 bg-blue-50/50" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.08fr_0.92fr] md:py-20 lg:min-h-[780px] lg:items-center">
            <div className="fk-reveal max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="red">공식 프리라이드 플랫폼</Badge>
                <span className="text-xs font-black uppercase text-zinc-500">
                  한국 / 선수 육성 / 안전 / 컬쳐
                </span>
              </div>
              <h1 className="mt-7 max-w-full text-[42px] font-black leading-[0.96] tracking-tight sm:text-6xl md:text-7xl">
                <span className="block md:inline">FREERIDE</span>
                <span className="block md:ml-4 md:inline">KOREA</span>
              </h1>
              <p className="mt-7 max-w-full text-lg font-black leading-8 text-zinc-900 sm:text-xl md:max-w-3xl md:text-2xl md:leading-9">
                한국 프리라이드 선수 육성, 안전 교육, 투어, 대회 소식, 산악
                문화를 연결하는 공식 플랫폼.
              </p>
              <p className="mt-5 max-w-full text-base leading-7 text-zinc-600 md:max-w-2xl">
                선수 육성, 눈사태 안전, WFR 관련 교육, 프리라이드 투어,
                공식 대회 정보, 산악 문화를 한곳에서 연결합니다.
              </p>
              <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
                <Button href="/athlete-program" variant="secondary">
                  선수 프로그램
                </Button>
                <Button href="/safety-education" variant="secondary">
                  교육
                </Button>
                <Button href="/contact-join" variant="ghost">
                  문의 / 참여
                </Button>
              </div>
            </div>

            <HeroMediaCarousel />
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-[var(--color-fk-black)] py-4 text-white">
          <div className="fk-marquee flex w-[200%] gap-8 whitespace-nowrap">
            {[...values, ...values, ...values, ...values].map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="text-sm font-black uppercase tracking-normal text-zinc-300"
              >
                {value}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              주요 흐름
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight">
              하나의 브랜드 안에서 훈련, 안전, 투어, 대회 정보를 연결합니다.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              초기 화면은 마케팅 소개보다 실제 운영 메뉴로 바로 들어갈 수 있는
              구조를 우선합니다.
            </p>
          </div>
          <div className="grid gap-3">
            {pathways.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group grid gap-4 border-t border-zinc-200 bg-white/60 p-5 transition-all duration-300 hover:bg-white md:grid-cols-[72px_0.55fr_1fr]"
              >
                <span className="font-mono text-sm font-black text-[var(--color-fk-red)]">
                  {item.index}
                </span>
                <span>
                  <span className="mt-2 block text-2xl font-black">{item.ko}</span>
                </span>
                <span className="text-sm leading-6 text-zinc-600 transition-colors group-hover:text-zinc-900">
                  {item.text}
                </span>
              </a>
            ))}
          </div>
        </section>

        <LatestUpdates items={latestUpdates} />

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.35fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              프로그램과 투어
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              모집 예정 항목을 운영 공지처럼 노출합니다.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              교육, 선수 프로그램, 투어는 모두 신청과 관리자 게시 흐름을 전제로
              설계합니다.
            </p>
          </div>
          <div className="grid gap-4">
            {[...featuredPrograms, ...featuredTours].map((item) => (
              <article
                key={item.id}
                className="grid gap-5 border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)] md:grid-cols-[180px_1fr]"
              >
                <div className="flex min-h-32 items-end border border-zinc-100 bg-[var(--color-fk-ice)] p-4">
                  <Badge tone="blue">{"kind" in item ? item.kind : item.region}</Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{item.title.ko}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {item.summary.ko}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-8 border-y border-zinc-200 py-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                예정 이벤트
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                Official Major와 FWT Pathway를 구분해 관리합니다.
              </h2>
            </div>
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="border-l-4 border-[var(--color-fk-red)] bg-white p-6 shadow-[var(--shadow-diffused)]"
                >
                  <Badge tone="red">{eventStatusLabels[getEventStatus(event)]}</Badge>
                  <h3 className="mt-5 text-3xl font-black tracking-tight">
                    {event.name.ko}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {event.summary.ko}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
