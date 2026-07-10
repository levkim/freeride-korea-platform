import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Button } from "@/components/ui/Button";

const pathways = [
  "Athlete Program",
  "Education",
  "Freeride Tour",
  "Membership",
  "Business Partner",
  "Brand Sponsorship",
  "Media",
  "General",
];

const memberTypes = [
  ["일반회원", "무료 기본 회원, 소식과 커뮤니티 안내를 받습니다."],
  ["정회원", "연 회비 납부 공식 회원으로 전환 신청 후 승인됩니다."],
  ["선수회원", "FWT Qualifier Level 3 이상 기준의 승인형 선수 회원입니다."],
  ["후원회원 / 스폰서십 회원", "개인, 브랜드, 기업, 단체의 후원 및 스폰서십 회원입니다."],
];

export default function ContactJoinPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Contact / Join"
          title="문의와 참여가 시작되는 통합 입구"
          description="선수, 교육, 투어, 회원가입, 협력업체, 브랜드 스폰서십, 미디어 문의를 한 곳에서 분류합니다."
        />
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-4">
            {pathways.map((item) => (
              <button
                key={item}
                className="border border-zinc-200 bg-white p-5 text-left text-sm font-black hover:border-zinc-400"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_0.9fr]">
          <form className="border border-zinc-200 bg-white p-6">
            <h2 className="text-2xl font-black">Smart Form Shell</h2>
            <div className="mt-6 grid gap-4">
              {["Name", "Email / Phone", "Inquiry Type", "Riding Experience"].map(
                (label) => (
                  <label key={label} className="grid gap-2 text-sm font-bold">
                    {label}
                    <input className="h-11 border border-zinc-300 px-3" />
                  </label>
                ),
              )}
              <label className="grid gap-2 text-sm font-bold">
                Message
                <textarea className="min-h-32 border border-zinc-300 p-3" />
              </label>
              <Button>Submit Review Request</Button>
            </div>
          </form>
          <div className="grid gap-3">
            {memberTypes.map(([title, text]) => (
              <article key={title} className="border border-zinc-200 bg-white p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
