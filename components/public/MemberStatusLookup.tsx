"use client";

import { useActionState } from "react";
import {
  lookupMemberStatusAction,
  type MemberStatusLookupState,
} from "@/app/account/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const initialState: MemberStatusLookupState = {
  status: "idle",
};

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

const inquiryTypeLabels = {
  "athlete-program": "선수 프로그램",
  education: "교육",
  "freeride-tour": "프리라이드 투어",
  membership: "회원가입 / 등급 전환",
  "business-partner": "협력업체",
  sponsorship: "스폰서십",
  media: "미디어",
  general: "일반 문의",
};

const inquiryStatusLabels = {
  new: "신규",
  reviewing: "검토중",
  needs_reply: "답변 필요",
  closed: "종료",
};

export function MemberStatusLookup() {
  const [state, formAction, pending] = useActionState(
    lookupMemberStatusAction,
    initialState,
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            회원 상태 조회
          </p>
          <h2 className="mt-3 text-3xl font-black">가입/문의 접수 확인</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            회원가입 또는 등급 전환 문의에 사용한 이메일과 전화번호로 현재
            접수 상태를 확인합니다. 개인정보 보호를 위해 최소한의 상태 정보만
            표시합니다.
          </p>
        </div>

        <form action={formAction} className="border border-zinc-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              이메일
              <input
                name="email"
                type="email"
                required
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
                placeholder="name@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              전화번호
              <input
                name="phone"
                required
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
                placeholder="010-0000-0000"
              />
            </label>
          </div>
          <div className="mt-5">
            <Button>{pending ? "확인 중..." : "상태 확인"}</Button>
          </div>

          {state.message ? (
            <div className="mt-5 border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
              {state.message}
            </div>
          ) : null}

          {state.status === "success" && state.result ? (
            <div className="mt-6 grid gap-4">
              {state.result.member ? (
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-zinc-500">회원</p>
                      <h3 className="mt-1 text-xl font-black">
                        {state.result.member.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="blue">
                        {memberTypeLabels[state.result.member.memberType]}
                      </Badge>
                      <Badge tone="green">
                        {memberStatusLabels[state.result.member.status]}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-bold text-zinc-600">
                    가입일 {state.result.member.joinedAt}
                  </p>
                </div>
              ) : null}

              <div className="border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-black text-zinc-500">최근 접수</p>
                <div className="mt-3 grid gap-2">
                  {state.result.inquiries.map((item) => (
                    <div
                      key={`${item.title}-${item.createdAt}`}
                      className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 bg-white px-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-1 text-xs font-bold text-zinc-500">
                          {inquiryTypeLabels[item.type]} · {item.createdAt}
                        </p>
                      </div>
                      <Badge tone="amber">{inquiryStatusLabels[item.status]}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {state.result.upgradeReviews.length ? (
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-black text-zinc-500">
                    등급 전환 검토
                  </p>
                  <div className="mt-3 grid gap-2">
                    {state.result.upgradeReviews.map((item) => (
                      <div
                        key={`${item.title}-${item.createdAt}`}
                        className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 bg-white px-3 py-3"
                      >
                        <p className="text-sm font-black">{item.title}</p>
                        <Badge tone="blue">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
