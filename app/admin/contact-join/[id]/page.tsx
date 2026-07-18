import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { getInquiryById } from "@/lib/repositories/inquiries";
import type { InquiryStatus, InquiryType } from "@/lib/types/inquiry";
import { submitInquiryAction } from "./actions";

type InquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

const inquiryTypeLabels: Record<InquiryType, string> = {
  "athlete-program": "선수 프로그램",
  education: "교육",
  "freeride-tour": "프리라이드 투어",
  membership: "회원가입 / 등급",
  "business-partner": "협력업체",
  sponsorship: "스폰서십",
  media: "미디어",
  general: "일반 문의",
};

const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "신규",
  reviewing: "검토중",
  needs_reply: "답변 필요",
  closed: "종료",
};

const actionResultMessages: Record<string, string> = {
  reviewing: "문의가 검토중 상태로 변경되었습니다.",
  needs_reply: "문의가 답변 필요 상태로 변경되었습니다.",
  closed: "문의가 종료 상태로 변경되었습니다.",
  new: "문의가 신규 상태로 변경되었습니다.",
  invalid: "상태와 관리자 메모를 다시 확인해 주세요.",
};

function getStatusTone(status: InquiryStatus) {
  if (status === "new") {
    return "amber";
  }

  if (status === "reviewing") {
    return "blue";
  }

  if (status === "needs_reply") {
    return "red";
  }

  return "green";
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const { item: inquiry } = await getInquiryById(id);

  return {
    title: inquiry
      ? `${inquiry.title} | 문의 검토`
      : "문의 검토 | FREERIDE KOREA",
  };
}

export default async function InquiryDetailPage({
  params,
  searchParams,
}: InquiryDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const actionMode = resolvedSearchParams?.mode;
  const { item: inquiry, mode } = await getInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            문의 상세 검토
          </p>
          <h1 className="mt-3 text-4xl font-black">{inquiry.title}</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            이 화면에서는 문의 처리를 위해 필요한 원문과 연락처를 확인합니다.
            목록 화면에서는 개인정보가 마스킹되어 노출됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={getStatusTone(inquiry.status)}>
            {inquiryStatusLabels[inquiry.status]}
          </Badge>
          <Badge tone="blue">{inquiryTypeLabels[inquiry.type]}</Badge>
          <Badge tone="neutral">
            {mode === "supabase" ? "Supabase" : "Mock"}
          </Badge>
          <Link
            href="/admin/contact-join"
            className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            목록으로
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            문의자 정보
          </p>
          <div className="mt-5 grid gap-4">
            {[
              ["이름", inquiry.name],
              ["이메일", inquiry.email],
              ["전화번호", inquiry.phone ?? "미입력"],
              ["접수일", inquiry.createdAt],
              ["담당자", inquiry.assignedTo ?? "미지정"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-t border-zinc-100 pt-3"
              >
                <p className="text-xs font-black uppercase text-zinc-500">
                  {label}
                </p>
                <p className="font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            문의 원문
          </p>
          <div className="mt-5 border-t border-zinc-100 pt-4">
            <p className="text-xs font-black uppercase text-zinc-500">제목</p>
            <p className="mt-2 text-xl font-black">{inquiry.title}</p>
          </div>
          <div className="mt-6 border-t border-zinc-100 pt-4">
            <p className="text-xs font-black uppercase text-zinc-500">내용</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-zinc-700">
              {inquiry.message}
            </p>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            처리 흐름
          </p>
          <h2 className="mt-3 text-2xl font-black">상태 변경 기준</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            실제 DB 연결 후에는 이 화면에서 담당자 지정, 상태 변경, 답변 기록,
            열람 로그를 저장하게 됩니다.
          </p>
          {result ? (
            <div
              className={`mt-5 border p-4 text-sm font-bold leading-6 ${
                result === "invalid"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {actionResultMessages[result] ?? "문의 처리 액션이 확인되었습니다."}
              {actionMode === "mock" ? (
                <span className="mt-2 block">
                  현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
                  처리되었습니다.
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["신규", "처음 접수된 문의"],
            ["검토중", "담당자가 내용을 확인중"],
            ["답변 필요", "문의자에게 답변 필요"],
            ["종료", "처리가 완료된 문의"],
          ].map(([title, text]) => (
            <article key={title} className="border border-zinc-200 bg-white p-4">
              <p className="font-black">{title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            문의 처리
          </p>
          <h2 className="mt-3 text-2xl font-black">문의 처리</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            상태 변경과 담당자 지정 사유를 기록합니다. Supabase 연결 후에는
            `inquiry_entries` 상태가 변경되고 `inquiry_events`에 처리 기록이
            남습니다.
          </p>
        </div>
        <form action={submitInquiryAction} className="grid gap-4 border border-zinc-200 bg-white p-5">
          <input type="hidden" name="inquiryId" value={inquiry.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                다음 상태
              </span>
              <select
                name="toStatus"
                defaultValue={inquiry.status}
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
              >
                {Object.entries(inquiryStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase text-zinc-500">
                담당자
              </span>
              <input
                name="assignedTo"
                defaultValue={inquiry.assignedTo ?? ""}
                className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
                placeholder="예: 회원 담당 / 투어 담당"
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              관리자 메모
            </span>
            <textarea
              name="note"
              className="min-h-28 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
              placeholder="상태 변경 사유, 답변 방향, 담당자 메모를 기록해 주세요."
            />
          </label>
          <div>
            <button
              type="submit"
              className="border border-zinc-300 bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              문의 상태 저장
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
