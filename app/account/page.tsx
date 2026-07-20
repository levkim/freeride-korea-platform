import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { MemberStatusLookup } from "@/components/public/MemberStatusLookup";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const memberSteps = [
  {
    label: "1",
    title: "일반회원 가입",
    description:
      "문의·참여 페이지에서 회원가입 / 등급 전환 유형으로 접수하면 일반회원으로 먼저 등록됩니다.",
  },
  {
    label: "2",
    title: "등급 전환 검토",
    description:
      "정회원, 선수회원, 스폰서십 회원 희망자는 관리자 검토 큐에서 자격과 요청 내용을 확인합니다.",
  },
  {
    label: "3",
    title: "회원 포털 확장",
    description:
      "로그인 기능 연결 후 신청 내역, 댓글, 중고장터, 교육·투어 참가 내역을 직접 확인하게 됩니다.",
  },
];

const portalModules = [
  ["회원 등급", "일반회원, 정회원, 임원회원, 선수회원, 스폰서십 회원 상태를 확인합니다."],
  ["신청 내역", "교육, 투어, 선수 프로그램, 이벤트 참가 신청 기록을 모아 봅니다."],
  ["작성 콘텐츠", "뉴스·영상 제보, 컬쳐 게시글, 중고장터 매물, 자료실 제안을 관리합니다."],
  ["알림", "관리자 승인, 보완 요청, 결제/회비 안내, 안전 공지를 확인합니다."],
];

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                회원 포털
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none text-zinc-950 md:text-6xl">
                My FREERIDE KOREA
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
                회원가입은 지금 바로 접수할 수 있고, 모든 가입은 일반회원으로
                시작합니다. 정회원, 선수회원, 스폰서십 회원 전환은 운영진 검토
                후 진행됩니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  href="/contact-join"
                  variant="secondary"
                  className="border-zinc-300 bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                >
                  회원가입 / 등급 전환
                </Button>
                <Button href="/contact-join" variant="secondary">
                  문의하기
                </Button>
              </div>
            </div>
            <div className="grid gap-3 border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div>
                  <p className="text-sm font-black text-zinc-500">
                    현재 운영 상태
                  </p>
                  <h2 className="mt-2 text-2xl font-black">회원가입 v1 연결 완료</h2>
                </div>
                <Badge tone="green">Supabase 저장</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {memberSteps.map((step) => (
                  <article key={step.label} className="border border-zinc-200 bg-white p-4">
                    <p className="flex h-8 w-8 items-center justify-center border border-zinc-300 text-sm font-black">
                      {step.label}
                    </p>
                    <h3 className="mt-4 font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {portalModules.map(([title, description]) => (
              <article key={title} className="border border-zinc-200 bg-white p-5">
                <p className="text-xs font-black uppercase text-[var(--color-fk-red)]">
                  준비 모듈
                </p>
                <h2 className="mt-3 text-2xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <MemberStatusLookup />

        <section className="border-y border-zinc-200 bg-zinc-100">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                다음 개발 예정
              </p>
              <h2 className="mt-3 text-3xl font-black">로그인 / 마이페이지 v2</h2>
            </div>
            <div className="grid gap-3 text-sm font-bold leading-7 text-zinc-700 md:grid-cols-2">
              <p>이메일 인증 또는 Supabase Auth 기반 로그인</p>
              <p>회원 본인 신청 내역 조회</p>
              <p>댓글, 중고장터, 컬쳐 게시글 작성 이력</p>
              <p>정회원 회비, 선수회원 자격, 스폰서십 상태 관리</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
