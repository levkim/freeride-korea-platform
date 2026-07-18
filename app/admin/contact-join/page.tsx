import { AdminShell } from "@/components/admin/AdminShell";
import { InquiryTable } from "@/components/admin/InquiryTable";
import { Badge } from "@/components/ui/Badge";
import { listInquiries } from "@/lib/repositories/inquiries";

const intakeTypes = [
  "선수 프로그램",
  "교육",
  "프리라이드 투어",
  "회원가입 / 등급 전환",
  "협력업체",
  "스폰서십",
  "미디어",
  "일반 문의",
];

export const dynamic = "force-dynamic";

export default async function AdminContactJoinPage() {
  const { items, mode } = await listInquiries();
  const needsReplyCount = items.filter(
    (item) => item.status === "needs_reply",
  ).length;
  const activeCount = items.filter((item) => item.status !== "closed").length;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            문의 / 참여 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">문의 접수함</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            선수 프로그램, 교육, 투어, 회원가입, 협력업체, 스폰서십, 미디어
            문의를 한곳에서 분류하고 담당자와 처리 상태를 관리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">진행중 {activeCount}</Badge>
          <Badge tone="red">답변 필요 {needsReplyCount}</Badge>
          <Badge tone="neutral">
            {mode === "supabase" ? "Supabase" : "Mock"} 문의함
          </Badge>
        </div>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            접수 유형
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {intakeTypes.map((type) => (
              <div
                key={type}
                className="border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold"
              >
                {type}
              </div>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            처리 규칙
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            모든 문의는 먼저 검토 대기 상태로 접수됩니다. 운영자는 문의 유형을
            확인해 담당자를 지정하고, 답변 필요, 검토중, 종료 상태로 관리합니다.
            회원 등급 전환 요청은 회원 관리와 검토 대기열에 함께 연결될 수
            있도록 설계합니다.
          </p>
        </article>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            문의 목록
          </p>
          <h2 className="mt-2 text-2xl font-black">접수된 문의</h2>
        </div>
        <InquiryTable items={items} />
      </section>
    </AdminShell>
  );
}
