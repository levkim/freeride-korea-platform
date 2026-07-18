import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { mockMembers } from "@/content/seed/site-data";
import { listReviewQueueItems } from "@/lib/repositories/review-queue";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const reviewQueueItems = await listReviewQueueItems();
  const supabaseStatus = getSupabaseAdminStatus();
  const pendingMembers = mockMembers.filter(
    (member) => member.status === "reviewing",
  ).length;

  const dashboardCards = [
    ["검토 대기", reviewQueueItems.length, "reviewing"],
    ["승인 대기 회원", pendingMembers, "new"],
    ["소스 알림", 1, "medium"],
    ["AI 초안", 0, "draft"],
  ];

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            운영 대시보드
          </p>
          <h1 className="mt-3 text-4xl font-black">FREERIDE KOREA 관리자</h1>
          <p className="mt-3 text-zinc-600">
            검토 대기열, 회원 승인, 콘텐츠 운영, 공식 소스 후보를 한곳에서
            관리합니다.
          </p>
        </div>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-4">
        {dashboardCards.map(([title, count, status]) => (
          <article key={title} className="border border-zinc-200 bg-white p-5">
            <p className="text-sm font-bold text-zinc-500">{title}</p>
            <p className="mt-3 text-4xl font-black">{count}</p>
            <div className="mt-4">
              <StatusBadge status={String(status)} />
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              데이터 저장 상태
            </p>
            <h2 className="mt-3 text-2xl font-black">
              {supabaseStatus.isConfigured
                ? "Supabase DB 연결 준비 완료"
                : "Mock / seed 데이터 모드"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
              {supabaseStatus.isConfigured
                ? "환경변수가 설정되어 관리자 작성, 문의, 검토 기록이 Supabase 저장소를 사용할 수 있습니다."
                : "현재는 로컬 seed 데이터와 mock 검증 흐름으로 화면을 확인합니다. Supabase 환경변수를 설정하면 실제 DB 저장 모드로 전환됩니다."}
            </p>
          </div>
          <Badge tone={supabaseStatus.isConfigured ? "green" : "amber"}>
            {supabaseStatus.mode}
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-black uppercase text-zinc-500">
              현재 저장 기준
            </p>
            <p className="mt-2 font-black text-zinc-950">
              {supabaseStatus.isConfigured ? "Supabase" : "content/seed"}
            </p>
          </div>
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-black uppercase text-zinc-500">
              스키마 문서
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">
              docs/database/supabase-schema-v1.sql
            </p>
          </div>
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-black uppercase text-zinc-500">
              누락 환경변수
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">
              {supabaseStatus.missingEnv.length
                ? supabaseStatus.missingEnv.join(", ")
                : "없음"}
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
