import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  listAdminComments,
  summarizeCommentThreads,
} from "@/lib/repositories/comments";
import { listInquiries } from "@/lib/repositories/inquiries";
import { listMembers } from "@/lib/repositories/members";
import { listReviewQueueItems } from "@/lib/repositories/review-queue";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

function getUrgencyTone(count: number) {
  if (count > 0) {
    return "amber" as const;
  }

  return "green" as const;
}

export default async function AdminPage() {
  const [reviewQueueItems, membersResult, inquiriesResult, commentsResult] =
    await Promise.all([
      listReviewQueueItems(),
      listMembers(),
      listInquiries(),
      listAdminComments(),
    ]);
  const comments = commentsResult.items;
  const commentThreads = summarizeCommentThreads(comments);
  const supabaseStatus = getSupabaseAdminStatus();
  const reviewNeededCount = reviewQueueItems.filter((item) =>
    ["new", "reviewing", "review", "needs_revision"].includes(item.status),
  ).length;
  const memberUpgradeCount = reviewQueueItems.filter(
    (item) =>
      item.kind === "member-upgrade" &&
      ["new", "reviewing", "review"].includes(item.status),
  ).length;
  const pendingMembers = membersResult.items.filter(
    (member) => member.status === "reviewing",
  ).length;
  const openInquiryCount = inquiriesResult.items.filter(
    (item) => item.status !== "closed",
  ).length;
  const reportedCommentCount = comments.filter(
    (comment) => comment.status === "reported",
  ).length;

  const dashboardCards = [
    {
      title: "검토 필요",
      count: reviewNeededCount,
      status: "reviewing",
      href: "/admin/review-queue",
      note: "콘텐츠, 회원 전환, 소스 알림",
    },
    {
      title: "회원 전환",
      count: memberUpgradeCount,
      status: "new",
      href: "/admin/review-queue?type=member-upgrade",
      note: `승인 대기 회원 ${pendingMembers}명`,
    },
    {
      title: "미처리 문의",
      count: openInquiryCount,
      status: "medium",
      href: "/admin/contact-join",
      note: "회원가입, 투어, 교육, 스폰서십",
    },
    {
      title: "신고 댓글",
      count: reportedCommentCount,
      status: "reported",
      href: "/admin/comments?status=reported",
      note: `댓글 스레드 ${commentThreads.length}개`,
    },
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
        {dashboardCards.map((card) => (
          <article key={card.title} className="border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-zinc-500">{card.title}</p>
              <Badge tone={getUrgencyTone(card.count)}>
                {card.count > 0 ? "처리 필요" : "정상"}
              </Badge>
            </div>
            <p className="mt-3 text-4xl font-black">{card.count}</p>
            <p className="mt-3 min-h-10 text-sm font-bold leading-5 text-zinc-600">
              {card.note}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <StatusBadge status={card.status} />
              <Button
                href={card.href}
                variant="secondary"
                className="h-9 bg-zinc-100 px-3 text-xs text-zinc-950 hover:bg-zinc-200"
              >
                바로가기
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            오늘의 운영 순서
          </p>
          <div className="mt-5 grid gap-3">
            {[
              ["1", "회원 전환 요청을 먼저 확인하고 승인 또는 반려합니다."],
              ["2", "회원가입, 투어, 교육, 스폰서십 문의를 담당자 기준으로 분류합니다."],
              ["3", "뉴스, 이벤트, 카테고리 콘텐츠 검토 항목을 게시 여부에 따라 처리합니다."],
              ["4", "신고 댓글과 중고장터 관련 댓글을 확인해 숨김 또는 공개 상태를 정리합니다."],
            ].map(([step, text]) => (
              <div
                key={step}
                className="grid grid-cols-[36px_1fr] gap-3 border border-zinc-200 bg-zinc-50 p-3"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-zinc-950 text-sm font-black text-white">
                  {step}
                </span>
                <p className="text-sm font-bold leading-6 text-zinc-700">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                운영 데이터 요약
              </p>
              <h2 className="mt-3 text-2xl font-black">실제 저장소 기준</h2>
            </div>
            <Badge tone={supabaseStatus.isConfigured ? "green" : "amber"}>
              {supabaseStatus.isConfigured ? "Supabase" : "Mock"}
            </Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["회원", membersResult.items.length, membersResult.mode],
              ["문의", inquiriesResult.items.length, inquiriesResult.mode],
              ["검토", reviewQueueItems.length, "review queue"],
              ["댓글", comments.length, commentsResult.mode],
              ["댓글 스레드", commentThreads.length, "thread"],
              ["신고", reportedCommentCount, "reported"],
            ].map(([label, value, mode]) => (
              <div key={label} className="border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">{mode}</p>
              </div>
            ))}
          </div>
        </article>
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
