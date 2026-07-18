import { PageHero } from "@/components/public/PageHero";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { Button } from "@/components/ui/Button";
import { submitInquiry } from "./actions";

const inquiryTypes = [
  ["선수 프로그램", "선수 육성, 대회 준비, 훈련 루트 문의"],
  ["교육", "눈사태 안전교육, FREERIDING 교육, 백컨트리 역량 강화, WFR 문의"],
  ["프리라이드 투어", "국내외 프리라이드 여행 및 맞춤 투어 문의"],
  ["회원가입 / 등급 전환", "일반회원, 정회원, 선수회원, 스폰서십 회원 문의"],
  ["협력업체", "리조트, 가이드, 교육기관, 브랜드 협력 제안"],
  ["스폰서십", "선수 육성, 안전 교육, 문화 확산 후원 문의"],
  ["미디어", "취재, 인터뷰, 영상/사진 협업 문의"],
  ["일반 문의", "기타 문의 및 제안"],
];

const memberTypes = [
  [
    "일반회원",
    "무료 기본 회원입니다. 소식 확인, 커뮤니티 참여, 이벤트 안내, 중고장터 이용을 기준으로 합니다.",
  ],
  [
    "정회원",
    "연 회비를 납부한 공식 회원입니다. 교육/훈련/투어 우선 참가 및 할인 혜택, 전용앱 사용, 투어와 선수 프로그램 제안 및 운영 제안 참여가 가능합니다.",
  ],
  [
    "선수회원",
    "정회원 가입 후 FWT Qualifier, FIS, 국가대표 및 국내 주요 대회 경력 기준을 갖춘 사람을 운영진 승인 후 선수회원으로 전환합니다.",
  ],
  [
    "스폰서십 회원",
    "선수 육성, 안전 교육, 프리라이드 문화 확산을 후원하는 개인, 브랜드, 기업, 단체 회원입니다.",
  ],
];

const inputClass =
  "h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]";

const labelClass = "grid gap-2 text-sm font-bold";

type ContactJoinPageProps = {
  searchParams?: Promise<{
    status?: string;
    mode?: string;
  }>;
};

export default async function ContactJoinPage({
  searchParams,
}: ContactJoinPageProps) {
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams?.status;
  const persistenceMode = resolvedSearchParams?.mode;

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="문의·참여"
          title="문의와 참여가 시작되는 통합 입구"
          description="선수, 교육, 투어, 회원가입, 협력업체, 브랜드 스폰서십, 미디어 문의를 한곳에서 접수하고 운영 목적에 맞게 분류합니다."
        />

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-4">
            {inquiryTypes.map(([title, description]) => (
              <article
                key={title}
                className="border border-zinc-200 bg-white p-5"
              >
                <h2 className="text-sm font-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_0.9fr]">
          <form action={submitInquiry} className="border border-zinc-200 bg-white p-6">
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              문의 접수
            </p>
            <h2 className="mt-3 text-2xl font-black">문의 / 참여 신청</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              접수된 내용은 관리자 검토 후 담당자에게 배정됩니다. 목록에서는
              개인정보가 마스킹되고, 상세 검토 화면에서만 원문을 확인합니다.
            </p>
            {status === "received" ? (
              <div className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
                문의가 접수되었습니다. 관리자 확인 후 담당자가 연락드립니다.
                {persistenceMode === "mock" ? (
                  <span className="mt-2 block">
                    현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
                    처리되었습니다.
                  </span>
                ) : null}
              </div>
            ) : null}
            {status === "invalid" ? (
              <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-900">
                필수 항목을 다시 확인해 주세요. 이름, 이메일, 문의 유형, 제목,
                문의 내용, 개인정보 동의가 필요합니다.
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                이름
                <input name="name" className={inputClass} placeholder="홍길동" required />
              </label>
              <label className={labelClass}>
                이메일
                <input
                  name="email"
                  type="email"
                  className={inputClass}
                  placeholder="name@example.com"
                  required
                />
              </label>
              <label className={labelClass}>
                전화번호
                <input name="phone" className={inputClass} placeholder="010-0000-0000" />
              </label>
              <label className={labelClass}>
                문의 유형
                <select name="type" className={inputClass} defaultValue="" required>
                  <option value="" disabled>
                    문의 유형 선택
                  </option>
                  {inquiryTypes.map(([title], index) => (
                    <option
                      key={title}
                      value={[
                        "athlete-program",
                        "education",
                        "freeride-tour",
                        "membership",
                        "business-partner",
                        "sponsorship",
                        "media",
                        "general",
                      ][index]}
                    >
                      {title}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                라이딩 / 활동 경험
                <select name="ridingExperience" className={inputClass} defaultValue="">
                  <option value="" disabled>
                    경험 수준 선택
                  </option>
                  <option>입문 / 관심 단계</option>
                  <option>중급 라이더</option>
                  <option>상급 라이더</option>
                  <option>대회 참가 경험 있음</option>
                  <option>파트너 / 미디어 / 후원 문의</option>
                </select>
              </label>
              <label className={labelClass}>
                희망 회원 등급
                <select name="requestedMemberType" className={inputClass} defaultValue="">
                  <option value="" disabled>
                    해당 시 선택
                  </option>
                  {memberTypes.map(([title]) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-bold">
              제목
              <input
                name="title"
                className={inputClass}
                placeholder="문의 제목을 입력해 주세요"
                required
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold">
              문의 내용
              <textarea
                name="message"
                className="min-h-36 border border-zinc-300 bg-white p-3 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
                placeholder="문의 내용, 참가 목적, 희망 일정, 관련 경력 등을 입력해 주세요."
                required
              />
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-zinc-600">
              <input name="privacyAccepted" type="checkbox" className="mt-1" required />
              <span>
                문의 처리와 답변을 위해 입력한 개인정보를 수집하고 이용하는 데
                동의합니다. 실제 저장 기능 연결 시 개인정보 처리방침 링크와
                보관 기간을 함께 안내합니다.
              </span>
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button>문의 접수</Button>
              <p className="text-sm font-bold text-zinc-500">
                Supabase 환경변수가 있으면 문의가 DB에 저장되고, 없으면 검증
                모드로 접수 결과만 표시합니다.
              </p>
            </div>
          </form>

          <aside className="grid gap-3 content-start">
            <div className="border border-zinc-200 bg-white p-5">
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                회원 등급 안내
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                모든 가입은 일반회원으로 시작하고, 이후 정회원, 선수회원,
                스폰서십 회원 등급 전환은 운영진 검토 후 진행합니다.
              </p>
            </div>
            {memberTypes.map(([title, text]) => (
              <article key={title} className="border border-zinc-200 bg-white p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
              </article>
            ))}
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
