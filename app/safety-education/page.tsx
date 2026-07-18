import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const courses = [
  {
    title: "Avalanche Safety",
    ko: "눈사태 안전교육",
    text: "프리라이딩에서 가장 중요한 눈사태 위험 인지, 사면 평가, 구조 장비 운용, 그룹 의사결정을 다룹니다.",
    tone: "red" as const,
    href: "/safety-education/avalanche-safety-foundation",
    blocks: ["비콘 / 프로브 / 삽", "눈 상태와 경사 판단", "구조 시나리오", "현장 의사결정"],
  },
  {
    title: "FREERIDING",
    ko: "FREERIDING 교육",
    text: "자연설에서 스키어와 보더가 안전하고 즐겁게 다운힐할 수 있도록 라이딩 스킬, 라인 선택, 속도 조절, 지형 활용을 다루는 교육입니다.",
    tone: "red" as const,
    href: "/safety-education/freeriding-skills",
    blocks: ["자연설 라이딩 스킬", "라인 선택", "속도와 턴 컨트롤", "강사 / 외부 교육센터 위탁 가능"],
  },
  {
    title: "Backcountry",
    ko: "백컨트리 역량 강화",
    text: "리조트 밖 지형을 안전하게 이해하고 이동, 판단, 그룹 의사결정을 훈련하는 안전 기반 프로그램입니다.",
    tone: "blue" as const,
    href: "/safety-education/backcountry-development",
    blocks: ["스킨업과 장비 운용", "지형 읽기", "그룹 이동", "응급 상황 대응"],
  },
  {
    title: "WFR",
    ko: "야생 응급 대응",
    text: "Wilderness First Responder 기준의 야외 응급 상황 이해와 산악 활동 중 필요한 안전 판단을 연결합니다.",
    tone: "blue" as const,
    href: "/safety-education/wfr-mountain-response",
    blocks: ["저체온 / 외상 대응", "현장 평가", "대피 판단", "구조 요청 체계"],
  },
];

const rules = [
  "교육 프로그램 작성은 임원진 이상 가능",
  "게시와 모집 시작은 관리자 승인 후 가능",
  "필수 장비, 난이도, 보험 안내를 교육 상세에 명시",
  "수료, 참석, 취소 규정은 운영 정책과 함께 관리",
];

export default function SafetyEducationPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="교육"
          title="즐거운 프리라이딩은 안전 기준 위에서 시작됩니다."
          description="눈사태 안전교육, FREERIDING 교육, 백컨트리 역량 강화, WFR 기반 야생 안전 교육을 중심으로 자연설과 산악 환경에서 안전하고 즐겁게 판단할 수 있는 문화를 만듭니다."
        />

        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.title}
              className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]"
            >
              <Badge tone={course.tone}>{course.title}</Badge>
              <h2 className="mt-5 text-3xl font-black">{course.ko}</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {course.text}
              </p>
              <div className="mt-6 grid gap-3">
                {course.blocks.map((block) => (
                  <div
                    key={block}
                    className="border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-black"
                  >
                    {block}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button href={course.href} variant="secondary">
                  상세 보기
                </Button>
              </div>
            </article>
          ))}
        </section>

        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                교육 게시 기준
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                교육은 신뢰가 먼저입니다.
              </h2>
              <p className="mt-5 text-sm leading-6 text-zinc-600">
                교육은 강사, 장소, 장비, 날씨, 취소 기준까지 함께
                관리해야 하므로 일반 게시물보다 엄격한 승인 흐름을 둡니다.
              </p>
            </div>
            <div className="grid gap-3">
              {rules.map((rule) => (
                <div key={rule} className="border border-zinc-200 p-5">
                  <p className="font-bold">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-center justify-between gap-5 border border-zinc-200 bg-[var(--color-fk-black)] p-6 text-white">
            <div>
              <p className="text-sm font-black uppercase text-zinc-300">
                교육 참여
              </p>
              <h2 className="mt-3 text-3xl font-black">교육 문의와 단체 교육 요청</h2>
            </div>
            <Button href="/contact-join" className="bg-zinc-200 text-black hover:bg-white">
              교육 문의하기
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
