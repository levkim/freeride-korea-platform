import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const pathways = [
  {
    title: "프리라이드",
    ko: "프리라이드 선수 육성",
    text: "FWT Qualifier, Challenger, World Tour 본선과 향후 올림픽 무대를 목표로 하는 선수 성장 루트입니다.",
    items: ["대회 목표 설정", "라인 선택과 경기 운영", "영상 분석", "해외 대회 준비"],
  },
];

const levels = [
  ["입문", "프리라이드 입문자와 대회 관심자를 위한 기본 방향 설정"],
  ["육성", "국내외 훈련과 영상 피드백을 통한 실전 역량 강화"],
  ["대회", "FWT Qualifier 출전 준비, 시즌 계획, 경기 운영 지원"],
  ["엘리트", "Challenger, World Tour, 국제 무대 진출을 목표로 한 집중 관리"],
];

export default function AthleteProgramPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="선수 프로그램"
          title="한국 프리라이드 선수가 세계 무대로 가는 구조를 만듭니다."
          description="선수 프로그램은 단순 강습이 아니라 대회 출전, 영상 분석, 시즌 목표, 경기 운영을 함께 설계하는 성장 시스템입니다. 백컨트리 역량 강화는 Education 메뉴에서 별도로 관리합니다."
        />

        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2">
          {pathways.map((pathway) => (
            <article
              key={pathway.title}
              className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]"
            >
              <Badge tone={pathway.title === "프리라이드" ? "red" : "blue"}>
                {pathway.title}
              </Badge>
              <h2 className="mt-5 text-3xl font-black">{pathway.ko}</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {pathway.text}
              </p>
              <div className="mt-6 grid gap-2">
                {pathway.items.map((item) => (
                  <div
                    key={item}
                    className="border-t border-zinc-200 pt-3 text-sm font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  href="/athlete-program/freeride-athlete-pathway"
                  variant="secondary"
                >
                  상세 보기
                </Button>
              </div>
            </article>
          ))}
        </section>

        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                  선수 성장 단계
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight">
                  실력보다 먼저 구조를 잡습니다.
                </h2>
                <p className="mt-5 text-sm leading-6 text-zinc-600">
                  선수 회원 기준, 시즌 목표, 훈련 기록, 대회 결과는 이후 관리자
                  CMS에서 누적 관리할 수 있는 구조로 확장합니다.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {levels.map(([label, text]) => (
                  <article key={label} className="border border-zinc-200 p-5">
                    <p className="fk-nav-type text-2xl leading-none">{label}</p>
                    <p className="mt-4 text-sm font-bold leading-6 text-zinc-700">
                      {text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="border-l-4 border-[var(--color-fk-blue)] bg-white p-6">
            <h2 className="text-2xl font-black">신청과 게시 권한</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
              투어와 선수 프로그램 제안은 정회원부터 가능하며, 교육 콘텐츠 작성은 임원진 이상 가능합니다. 실제 게시는
              관리자가 승인합니다. 선수 프로그램 참여 신청과 선수회원 전환은
              운영진 검토를 거쳐 진행합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/contact-join" variant="secondary">
                프로그램 문의
              </Button>
              <Button href="/events" variant="secondary">
                대회 일정 보기
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
