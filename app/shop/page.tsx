import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const shopCategories = [
  ["멤버십", "정회원 회비, 스폰서십 회원, 선수 후원 등 멤버십 결제"],
  ["교육", "눈사태 안전교육, WFR 관련 교육, 워크숍 신청 결제"],
  ["투어", "프리라이드 투어 예약금, 참가비, 맞춤 투어 결제"],
  ["굿즈", "팀 의류, 패치, 스티커, 프리라이드 코리아 굿즈"],
];

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="SHOP / 샵"
          title="커머스는 굿즈보다 운영 흐름이 먼저입니다."
          description="초기 SHOP은 결제와 신청이 필요한 멤버십, 교육, 투어, 굿즈를 한곳에서 관리하는 구조로 설계합니다."
        />

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
          {shopCategories.map(([title, text]) => (
            <article
              key={title}
              className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]"
            >
              <Badge tone="blue">{title}</Badge>
              <p className="mt-5 text-sm font-bold leading-6 text-zinc-700">
                {text}
              </p>
              {title === "멤버십" ? (
                <div className="mt-6">
                  <Button href="/shop/regular-membership" variant="secondary">
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
                커머스 운영 계획
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">
                지금은 준비중, 이후 결제와 재고 관리로 확장합니다.
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                "초기에는 문의/신청 기반으로 운영",
                "정회원 회비와 교육/투어 결제는 관리자 승인 흐름과 연결",
                "굿즈는 재고, 옵션, 배송 상태를 별도 관리",
                "회원 중고장터는 Culture 메뉴와 연결하되 결제는 직접 거래 또는 별도 정책으로 분리",
              ].map((item) => (
                <div key={item} className="border border-zinc-200 p-5">
                  <p className="font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-2xl font-black">SHOP 오픈 전 문의</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600">
              현재 단계에서는 상품 구매보다 멤버십, 교육, 투어, 스폰서십 문의를
              우선 연결합니다.
            </p>
            <div className="mt-6">
              <Button href="/contact-join" variant="secondary">
                문의하기
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
