import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const purposes = [
  "프리라이드 월드 투어 본선 및 향후 올림픽 대회에 출전할 한국인 선수 육성",
  "글로벌 수준의 프리라이드 컬쳐 선도 및 보급",
  "안전한 프리라이딩을 위한 WFR 관련 교육",
  "프리라이딩에서 가장 중요한 눈사태 안전 교육",
  "무엇보다 즐겁게 설산과 푸른산을 즐기는 문화 선도",
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="About / 소개"
          title="Official enough to trust. Outdoor enough to feel alive."
          description="FREERIDE KOREA는 공식성 60%, 프리미엄 아웃도어 40%의 균형으로 한국 프리라이드 생태계를 연결합니다."
        />
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                Purpose
              </p>
              <h2 className="mt-3 text-3xl font-black">브랜드 목적</h2>
            </div>
            <div className="grid gap-3">
              {purposes.map((purpose) => (
                <div key={purpose} className="border border-zinc-200 bg-white p-5">
                  <p className="font-bold leading-7">{purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-3">
            {["Fun", "Respect", "Safety"].map((value) => (
              <article key={value} className="border border-zinc-200 p-6">
                <h3 className="text-3xl font-black">{value}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  설산과 푸른산을 즐기되, 산과 사람, 안전 기준을 존중하는 문화를
                  만듭니다.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
