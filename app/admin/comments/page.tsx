import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateCommentAction } from "@/app/admin/comments/actions";
import {
  listAdminComments,
  summarizeCommentThreads,
} from "@/lib/repositories/comments";
import type { CommentStatus, CommentTargetType } from "@/lib/types/comment";

const statusLabels: Record<CommentStatus, string> = {
  visible: "공개",
  hidden: "숨김",
  reported: "신고됨",
  deleted: "삭제됨",
};

const targetLabels: Record<CommentTargetType, string> = {
  "news-video": "뉴스·영상",
  event: "대회·이벤트",
  "category-content": "카테고리 콘텐츠",
};

const statusFilters = [
  { value: "all", label: "전체 상태" },
  { value: "visible", label: "공개" },
  { value: "reported", label: "신고됨" },
  { value: "hidden", label: "숨김" },
  { value: "deleted", label: "삭제됨" },
] as const;

const targetFilters = [
  { value: "all", label: "전체 대상" },
  { value: "news-video", label: "뉴스·영상" },
  { value: "event", label: "대회·이벤트" },
  { value: "category-content", label: "카테고리 콘텐츠" },
] as const;

type StatusFilter = (typeof statusFilters)[number]["value"];
type TargetFilter = (typeof targetFilters)[number]["value"];

function isStatusFilter(value?: string): value is StatusFilter {
  return statusFilters.some((filter) => filter.value === value);
}

function isTargetFilter(value?: string): value is TargetFilter {
  return targetFilters.some((filter) => filter.value === value);
}

function getFilterHref(status: StatusFilter, target: TargetFilter) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (target !== "all") {
    params.set("target", target);
  }

  const query = params.toString();

  return query ? `/admin/comments?${query}` : "/admin/comments";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusTone(status: CommentStatus) {
  if (status === "reported") {
    return "amber" as const;
  }

  if (status === "hidden" || status === "deleted") {
    return "neutral" as const;
  }

  return "green" as const;
}

type AdminCommentsPageProps = {
  searchParams?: Promise<{
    status?: string;
    target?: string;
    result?: string;
    mode?: string;
  }>;
};

export default async function AdminCommentsPage({
  searchParams,
}: AdminCommentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeStatus = isStatusFilter(resolvedSearchParams?.status)
    ? resolvedSearchParams.status
    : "all";
  const activeTarget = isTargetFilter(resolvedSearchParams?.target)
    ? resolvedSearchParams.target
    : "all";
  const actionResult = resolvedSearchParams?.result;
  const actionMode = resolvedSearchParams?.mode;
  const { items: comments, mode: commentsMode } = await listAdminComments();
  const filteredComments = comments.filter((comment) => {
    const matchesStatus =
      activeStatus === "all" || comment.status === activeStatus;
    const matchesTarget =
      activeTarget === "all" || comment.targetType === activeTarget;

    return matchesStatus && matchesTarget;
  });
  const threads = summarizeCommentThreads(comments);
  const reportedCount = comments.filter(
    (comment) => comment.status === "reported",
  ).length;
  const visibleCount = comments.filter(
    (comment) => comment.status === "visible",
  ).length;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            댓글 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">회원 댓글 운영 v1</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            뉴스·영상, 이벤트, 카테고리 상세글에 달리는 회원 댓글을 관리하는
            화면입니다. 실제 작성과 저장은 인증/Supabase 연결 후 활성화하고,
            이 화면은 댓글 노출, 신고, 숨김, 삭제, 고정 운영 기준을 먼저
            잡습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="green">공개 {visibleCount}</Badge>
          <Badge tone={reportedCount ? "amber" : "neutral"}>
            신고 {reportedCount}
          </Badge>
          <Badge tone="blue">로그인 회원 작성</Badge>
        </div>
      </div>

      {actionResult ? (
        <div className="mt-6 border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
          {actionResult === "comment-action"
            ? `댓글 관리 액션을 확인했습니다. (${actionMode ?? "mock"})`
            : "댓글 관리 요청을 처리하지 못했습니다. 입력값을 다시 확인해 주세요."}
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["전체 댓글", comments.length],
          ["댓글 스레드", threads.length],
          ["신고 확인", reportedCount],
          ["공개 댓글", visibleCount],
        ].map(([label, value]) => (
          <article key={label} className="border border-zinc-200 bg-white p-4">
            <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            운영 기준
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "댓글 작성은 로그인한 일반회원 이상으로 제한합니다.",
              "교육, 투어, 선수 프로그램 글은 게시글별 댓글 허용 여부를 관리합니다.",
              "중고장터 댓글은 개인정보, 가격 분쟁, 외부 거래 유도 여부를 중점 확인합니다.",
              "신고된 댓글은 공개 상태를 유지하더라도 관리자 확인 대상으로 표시합니다.",
            ].map((rule) => (
              <p
                key={rule}
                className="border border-zinc-200 bg-zinc-50 p-3 text-sm font-bold leading-6"
              >
                {rule}
              </p>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            스레드 요약
          </p>
          <div className="mt-5 grid gap-3">
            {threads.map((thread) => (
              <div
                key={`${thread.targetType}-${thread.targetId}`}
                className="border border-zinc-200 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{targetLabels[thread.targetType]}</Badge>
                  {thread.reportedCount ? (
                    <Badge tone="amber">신고 {thread.reportedCount}</Badge>
                  ) : null}
                </div>
                <p className="mt-3 font-black">{thread.targetTitle}</p>
                <p className="mt-2 text-sm font-bold text-zinc-600">
                  전체 {thread.totalCount}개 · 공개 {thread.visibleCount}개 ·
                  최근 {formatDate(thread.latestAt)}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              댓글 목록
            </p>
            <h2 className="mt-2 text-2xl font-black">최근 댓글</h2>
          </div>
          <p className="text-sm font-bold text-zinc-500">
            현재 댓글 저장소: {commentsMode}
          </p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-zinc-100 pt-4 lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs font-black uppercase text-zinc-500">
              상태 필터
            </p>
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                href={getFilterHref(filter.value, activeTarget)}
                variant="secondary"
                className={
                  activeStatus === filter.value
                    ? "h-10 border-zinc-400 bg-zinc-200 px-4 text-xs text-zinc-950 hover:bg-zinc-300"
                    : "h-10 px-4 text-xs"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs font-black uppercase text-zinc-500">
              대상 필터
            </p>
            {targetFilters.map((filter) => (
              <Button
                key={filter.value}
                href={getFilterHref(activeStatus, filter.value)}
                variant="secondary"
                className={
                  activeTarget === filter.value
                    ? "h-10 border-zinc-400 bg-zinc-200 px-4 text-xs text-zinc-950 hover:bg-zinc-300"
                    : "h-10 px-4 text-xs"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-black uppercase text-zinc-500">
                <th className="py-3 pr-4">댓글</th>
                <th className="py-3 pr-4">대상</th>
                <th className="py-3 pr-4">작성자</th>
                <th className="py-3 pr-4">상태</th>
                <th className="py-3 text-right">관리 액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="border-b border-zinc-100 align-top">
                  <td className="max-w-md py-4 pr-4">
                    <p className="font-bold leading-6">{comment.body}</p>
                    <p className="mt-2 text-xs font-bold text-zinc-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge tone="blue">{targetLabels[comment.targetType]}</Badge>
                    <p className="mt-2 text-sm font-black">
                      {comment.targetTitle}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-black">{comment.authorName}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {comment.authorType}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge tone={getStatusTone(comment.status)}>
                      {statusLabels[comment.status]}
                    </Badge>
                    {comment.reportCount ? (
                      <p className="mt-2 text-xs font-bold text-amber-700">
                        신고 {comment.reportCount}건
                      </p>
                    ) : null}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {[
                        ["mark_visible", "공개"],
                        ["hide", "숨김"],
                        ["delete", "삭제"],
                        [comment.pinned ? "unpin" : "pin", comment.pinned ? "고정 해제" : "고정"],
                      ].map(([action, label]) => (
                        <form key={action} action={updateCommentAction}>
                          <input
                            type="hidden"
                            name="commentId"
                            value={comment.id}
                          />
                          <input type="hidden" name="action" value={action} />
                          <input
                            type="hidden"
                            name="returnTo"
                            value={getFilterHref(activeStatus, activeTarget)}
                          />
                          <button
                            type="submit"
                            className="h-10 border border-zinc-300 bg-zinc-100 px-3 text-xs font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                          >
                            {label}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredComments.length ? (
            <div className="border-b border-zinc-100 py-8 text-center text-sm font-bold text-zinc-500">
              선택한 조건에 해당하는 댓글이 없습니다.
            </div>
          ) : null}
        </div>
      </section>
    </AdminShell>
  );
}
