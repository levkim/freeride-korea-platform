import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const cultureBlocks = [
  {
    title: "기록 콘텐츠",
    href: "/culture/fun-respect-safety-culture",
    ko: "영상 / 사진 / 라이딩 스토리",
    text: "대회, 투어, 훈련, 설산과 푸른산의 기록을 매거진형 콘텐츠로 정리합니다.",
  },
  {
    title: "커뮤니티",
    href: "/culture/freeride-community-guideline",
    ko: "커뮤니티",
    text: "초기에는 운영진이 큐레이션하는 게시형 구조로 시작하고, 이후 회원 게시판으로 확장합니다.",
  },
  {
    title: "산악 윤리",
    href: "/culture/mountain-ethics-guideline",
    ko: "산악 윤리",
    text: "산과 사람을 존중하는 이동, 촬영, 지역 문화, 안전 기준을 함께 공유합니다.",
  },
  {
    title: "회원 중고장터",
    href: "/culture/member-marketplace-guideline",
    ko: "회원 중고장터",
    text: "장비 거래는 회원 기반으로 운영하고, 관리자 신고/검토 흐름을 둡니다.",
  },
];

export default function CulturePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Culture / 컬쳐"
          title="프리라이드는 대회 이전에 문화입니다."
          description="좋은 영상과 사진, 산악 윤리, 커뮤니티, 장비 문화까지 함께 쌓아 한국 프리라이드의 언어와 기준을 만듭니다."
        />

        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                Member Board
              </p>
              <h2 className="mt-2 text-2xl font-black">
                로그인 회원은 컬쳐, 중고장터, 자료실 글을 직접 작성할 수 있습니다.
              </h2>
            </div>
            <Button href="/culture/new" variant="secondary">
              회원 글쓰기
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2">
          {cultureBlocks.map((block) => (
            <article
              key={block.title}
              className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]"
            >
              <Badge tone="neutral">{block.title}</Badge>
              <h2 className="mt-5 text-3xl font-black">{block.ko}</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                {block.text}
              </p>
              {block.href ? (
                <div className="mt-6">
                  <Button href={block.href} variant="secondary">
                    상세 보기
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </section>

        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
                편집형 콘텐츠 우선
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                처음부터 자유 게시판으로 열지 않습니다.
              </h2>
            </div>
            <p className="text-base leading-8 text-zinc-600">
              컬쳐 메뉴는 브랜드 톤이 흐트러지기 쉬운 영역입니다. 그래서 1차는
              운영진 큐레이션형 매거진, 영상/사진 기록, 산악 윤리 가이드,
              회원 중고장터로 나누고, 회원 작성 콘텐츠는 등급과 관리자 승인
              기준을 적용하는 방식이 좋습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {["Fun", "Respect", "Safety"].map((value) => (
              <article key={value} className="border border-zinc-200 bg-white p-6">
                <p className="fk-nav-type text-4xl leading-none">{value}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  즐겁게 타되, 산과 사람을 존중하고, 안전 기준을 공유합니다.
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/news-video" variant="secondary">
              뉴스와 영상 보기
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
