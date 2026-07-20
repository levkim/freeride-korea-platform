import {
  signInMemberAction,
  signOutMemberAction,
  signUpMemberAction,
} from "@/app/account/actions";
import { Badge } from "@/components/ui/Badge";
import type { Member } from "@/lib/types/member";

const memberTypeLabels = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
};

const memberStatusLabels = {
  active: "활성",
  reviewing: "검토중",
  suspended: "정지",
};

const authMessages: Record<string, string> = {
  "signed-in": "로그인되었습니다.",
  "signed-out": "로그아웃되었습니다.",
  "signed-up": "회원가입이 완료되었습니다.",
  "signup-check-email":
    "회원가입이 접수되었습니다. Supabase 이메일 인증 설정이 켜져 있으면 메일 인증 후 로그인할 수 있습니다.",
  "signup-invalid": "회원가입 입력값을 다시 확인해 주세요.",
  "signin-invalid": "로그인 입력값을 다시 확인해 주세요.",
  "signup-error": "회원가입 처리 중 문제가 발생했습니다. 이미 가입된 이메일인지 확인해 주세요.",
  "signin-error": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth-not-configured":
    "회원 로그인 환경변수가 아직 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_ANON_KEY 설정이 필요합니다.",
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
      />
    </label>
  );
}

export function MemberAuthPanel({
  authStatus,
  missingEnv,
  member,
  email,
}: {
  authStatus?: string;
  missingEnv: string[];
  member: Member | null;
  email?: string | null;
}) {
  const message = authStatus ? authMessages[authStatus] : null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            회원 로그인
          </p>
          <h2 className="mt-3 text-3xl font-black">내 계정으로 접속</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            이메일과 비밀번호로 로그인하면 회원 등급, 승인 상태, 이후 작성
            가능한 게시판과 신청 내역을 계정 기준으로 연결합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={missingEnv.length ? "amber" : "green"}>
              {missingEnv.length ? "Auth 설정 필요" : "Supabase Auth 준비됨"}
            </Badge>
            <Badge tone="blue">회원 테이블 이메일 기준 연결</Badge>
          </div>
        </div>

        <div className="grid gap-5">
          {message ? (
            <div className="border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
              {message}
            </div>
          ) : null}

          {missingEnv.length ? (
            <div className="border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-xl font-black text-amber-950">
                로그인 환경변수 설정 필요
              </h3>
              <p className="mt-3 text-sm font-bold leading-6 text-amber-900">
                Supabase Project Settings &gt; API에서 anon public key를 확인한
                뒤 Sites 환경변수에 `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 추가해야
                실제 회원 로그인이 작동합니다.
              </p>
              <code className="mt-4 block border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-950">
                {missingEnv.join(", ")}
              </code>
            </div>
          ) : member || email ? (
            <div className="border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-zinc-500">
                    로그인 계정
                  </p>
                  <p className="text-xs font-black uppercase text-[var(--color-fk-red)]">
                    공개 닉네임
                  </p>
                  <h3 className="mt-2 text-2xl font-black">
                    {member?.name ?? email}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-zinc-600">{email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member ? (
                    <>
                      <Badge tone="blue">
                        {memberTypeLabels[member.memberType]}
                      </Badge>
                      <Badge tone="green">
                        {memberStatusLabels[member.status]}
                      </Badge>
                    </>
                  ) : (
                    <Badge tone="amber">회원 테이블 연결 대기</Badge>
                  )}
                </div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-zinc-100 pt-5 md:grid-cols-3">
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">
                    회원 등급
                  </p>
                  <p className="mt-2 font-black">
                    {member ? memberTypeLabels[member.memberType] : "확인 필요"}
                  </p>
                </div>
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">
                    상태
                  </p>
                  <p className="mt-2 font-black">
                    {member ? memberStatusLabels[member.status] : "확인 필요"}
                  </p>
                </div>
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">
                    가입일
                  </p>
                  <p className="mt-2 font-black">{member?.joinedAt ?? "-"}</p>
                </div>
              </div>
              <form action={signOutMemberAction} className="mt-5">
                <button
                  type="submit"
                  className="h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              <form action={signInMemberAction} className="border border-zinc-200 bg-white p-5">
                <h3 className="text-2xl font-black">로그인</h3>
                <div className="mt-5 grid gap-4">
                  <Field
                    label="이메일"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                  <Field
                    label="비밀번호"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  로그인
                </button>
              </form>

              <form action={signUpMemberAction} className="border border-zinc-200 bg-white p-5">
                <h3 className="text-2xl font-black">회원가입</h3>
                <div className="mt-5 grid gap-4">
                  <Field label="이름" name="name" autoComplete="name" />
                  <Field label="닉네임" name="nickname" autoComplete="nickname" />
                  <Field
                    label="이메일"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                  <Field
                    label="비밀번호"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                  />
                  <Field
                    label="비밀번호 확인"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  일반회원으로 가입
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
