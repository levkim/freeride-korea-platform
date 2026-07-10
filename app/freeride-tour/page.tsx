import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { featuredTours } from "@/content/seed/site-data";

const regions = [
  "All",
  "Korea",
  "Japan",
  "Central Asia",
  "Europe",
  "Custom",
];

const tourTypes = [
  {
    title: "Resort Based",
    ko: "리조트 기반",
    text: "리프트 접근성과 현장 컨디션을 활용하는 프리라이드 투어입니다.",
  },
  {
    title: "Backcountry",
    ko: "백컨트리",
    text: "스킨업, 루트 판단, 그룹 의사결정이 포함되는 산악형 투어입니다.",
  },
  {
    title: "Expedition",
    ko: "원정",
    text: "중앙아시아, 유럽 등 장거리 목적지를 위한 원정형 프로그램입니다.",
  },
  {
    title: "Custom",
    ko: "맞춤 투어",
    text: "팀, 브랜드, 선수, 촬영 목적에 맞춘 별도 설계형 투어입니다.",
  },
];

const quickFacts = [
  ["Regions", "관리자 추가 / 삭제 가능"],
  ["Application", "신청 폼 기반 접수"],
  ["Publishing", "정회원 이상 작성, 관리자 게시"],
  ["Safety", "장비, 보험, 안전교육 고지 포함"],
];

export default function FreerideTourPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative border-b border-zinc-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7f8fa_56%,#edf1f6_100%)]">
          <div className="absolute right-[-16rem] top-[-20rem] h-[36rem] w-[36rem] rounded-full border border-blue-100 bg-blue-50/60" />
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.02fr_0.98fr] md:py-24">
            <div className="fk-reveal">
              <Badge tone="blue">Freeride Tour</Badge>
              <h1 className="mt-7 max-w-full text-[40px] font-black leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
                <span className="block">Mountain travel,</span>
                <span className="block">built for freeride</span>
                <span className="block">culture.</span>
              </h1>
              <p className="mt-7 max-w-full text-lg font-black leading-8 text-zinc-900 sm:text-xl md:max-w-3xl md:leading-9">
                프리라이드 여행, 백컨트리 원정, 리조트 기반 캠프, 맞춤 투어를
                등록하고 신청받는 메뉴입니다.
              </p>
              <p className="mt-5 max-w-full text-base leading-7 text-zinc-600 md:max-w-2xl">
                투어는 교육보다 여행 경험과 현장 운영이 중심입니다. 일정,
                난이도, 모집 인원, 포함 사항, 보험, 취소/환불 규정을 명확하게
                보여주는 구조로 설계합니다.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/contact-join">Tour Inquiry</Button>
                <Button href="#tour-list" variant="secondary">
                  View Tours
                </Button>
              </div>
            </div>

            <div className="fk-reveal grid content-end gap-4">
              <div className="border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
                <p className="fk-nav-type text-4xl leading-none">TOUR BOARD</p>
                <div className="mt-8 grid gap-4">
                  {quickFacts.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[120px_1fr] border-t border-zinc-200 pt-4"
                    >
                      <p className="text-xs font-black uppercase text-zinc-500">
                        {label}
                      </p>
                      <p className="text-sm font-bold text-zinc-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l-4 border-[var(--color-fk-red)] bg-white p-5">
                <p className="text-sm font-black uppercase text-zinc-500">
                  Cancellation / Refund
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  모든 투어 상세에는 취소/환불 규정, 보험 권장, 필수 장비,
                  안전교육 포함 여부를 별도 블록으로 표시합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            Region taxonomy
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {regions.map((region) => (
              <span
                key={region}
                className="border border-zinc-200 bg-white px-4 py-2 text-sm font-black uppercase text-zinc-700"
              >
                {region}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
            지역은 고정값이 아니라 관리자 화면에서 추가, 삭제, 숨김, 정렬 가능한
            taxonomy로 관리합니다.
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              Tour types
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              여행 경험과 산악 판단을 구분해서 보여줍니다.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {tourTypes.map((type) => (
              <article
                key={type.title}
                className="border-t border-zinc-200 bg-white/70 p-5"
              >
                <p className="fk-nav-type text-2xl leading-none">{type.title}</p>
                <p className="mt-3 text-lg font-black">{type.ko}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{type.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tour-list" className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                Tour list
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                모집 예정 투어
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 md:justify-self-end">
              현재는 mock data이며, 이후 관리자 CMS에서 등록한 투어가 이 목록에
              표시됩니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5">
            {featuredTours.map((tour) => (
              <article
                key={tour.id}
                className="fk-reveal grid gap-5 border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)] lg:grid-cols-[220px_1fr_180px]"
              >
                <div className="flex min-h-40 items-end bg-[var(--color-fk-ice)] p-4">
                  <Badge tone="blue">{tour.region}</Badge>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{tour.country}</Badge>
                    <Badge tone="red">{tour.difficulty}</Badge>
                    <Badge tone="blue">{tour.status}</Badge>
                  </div>
                  <h3 className="mt-5 text-3xl font-black tracking-tight">
                    {tour.title.en}
                  </h3>
                  <p className="mt-2 text-xl font-bold">{tour.title.ko}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
                    {tour.summary.ko}
                  </p>
                </div>
                <div className="grid content-between gap-4 border-t border-zinc-200 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-500">
                      Required blocks
                    </p>
                    <ul className="mt-3 grid gap-2 text-sm font-bold text-zinc-700">
                      <li>Itinerary</li>
                      <li>Included / Not included</li>
                      <li>Safety & insurance</li>
                      <li>Refund policy</li>
                    </ul>
                  </div>
                  <Button href="/contact-join" variant="secondary">
                    Apply / Inquiry
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
