import {
  createMemberCommentAction,
  reportMemberCommentAction,
} from "@/app/culture/actions";
import { Badge } from "@/components/ui/Badge";
import { listCommentsForTarget } from "@/lib/repositories/comments";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";
import type { CommentTargetType } from "@/lib/types/comment";

type CommentSectionProps = {
  targetType: CommentTargetType;
  targetId: string;
  allowComments?: boolean;
  returnTo?: string;
};

const authorTypeLabels = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getDefaultReturnTo(targetType: CommentTargetType, targetId: string) {
  if (targetType === "event") {
    return `/events/${targetId}`;
  }

  if (targetType === "news-video") {
    return `/news-video/${targetId}`;
  }

  return `/culture/${targetId}`;
}

export async function CommentSection({
  targetType,
  targetId,
  allowComments = true,
  returnTo,
}: CommentSectionProps) {
  const [comments, session] = await Promise.all([
    listCommentsForTarget(targetType, targetId),
    getCurrentMemberSession(),
  ]);
  const isSignedIn = Boolean(session.user?.email && session.member?.id);
  const resolvedReturnTo = returnTo || getDefaultReturnTo(targetType, targetId);

  return (
    <section className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            댓글
          </p>
          <h2 className="mt-2 text-3xl font-black">회원 의견</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            댓글은 로그인 회원이 작성할 수 있습니다. 신고된 댓글은 관리자 댓글
            관리 화면에서 숨김, 삭제, 고정 처리할 수 있습니다.
          </p>
        </div>
        <Badge tone={allowComments ? "green" : "neutral"}>
          {allowComments ? "댓글 허용" : "댓글 닫힘"}
        </Badge>
      </div>

      {allowComments ? (
        isSignedIn ? (
          <form
            action={createMemberCommentAction}
            className="mt-6 border border-zinc-200 bg-zinc-50 p-4"
          >
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="returnTo" value={resolvedReturnTo} />
            <label className="grid gap-2 text-sm font-bold">
              댓글 작성
              <textarea
                name="body"
                rows={4}
                required
                className="resize-y border border-zinc-300 bg-white px-3 py-3 text-sm font-bold text-zinc-900 outline-none focus:border-[var(--color-fk-red)]"
              />
            </label>
            <button
              type="submit"
              className="mt-3 h-11 border border-zinc-300 bg-zinc-100 px-5 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              댓글 등록
            </button>
          </form>
        ) : (
          <div className="mt-6 border border-dashed border-zinc-300 bg-zinc-50 p-4">
            <p className="text-sm font-black text-zinc-900">
              댓글은 로그인한 회원만 작성할 수 있습니다.
            </p>
            <a
              href="/account"
              className="mt-3 inline-flex h-10 items-center border border-zinc-300 bg-zinc-100 px-4 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              로그인/가입
            </a>
          </div>
        )
      ) : null}

      <div className="mt-6 grid gap-3">
        {comments.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="border-t border-zinc-200 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                {comment.pinned ? <Badge tone="blue">관리자 고정</Badge> : null}
                {comment.status === "reported" ? (
                  <Badge tone="amber">신고 확인중</Badge>
                ) : null}
                <p className="text-sm font-black text-zinc-950">
                  {comment.authorName}
                </p>
                <span className="text-xs font-bold text-zinc-500">
                  {authorTypeLabels[comment.authorType]}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  {formatCommentDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-zinc-700">
                {comment.body}
              </p>
              {isSignedIn ? (
                <form action={reportMemberCommentAction} className="mt-3">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="returnTo" value={resolvedReturnTo} />
                  <button
                    type="submit"
                    className="text-xs font-black text-zinc-500 underline-offset-4 hover:text-[var(--color-fk-red)] hover:underline"
                  >
                    신고
                  </button>
                </form>
              ) : null}
            </article>
          ))
        ) : (
          <div className="border-t border-zinc-200 pt-4 text-sm font-bold text-zinc-500">
            아직 등록된 댓글이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
