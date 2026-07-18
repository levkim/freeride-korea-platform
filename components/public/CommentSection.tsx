import { Badge } from "@/components/ui/Badge";
import { listCommentsForTarget } from "@/lib/repositories/comments";
import type { CommentTargetType } from "@/lib/types/comment";

type CommentSectionProps = {
  targetType: CommentTargetType;
  targetId: string;
  allowComments?: boolean;
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

export function CommentSection({
  targetType,
  targetId,
  allowComments = true,
}: CommentSectionProps) {
  const comments = listCommentsForTarget(targetType, targetId);

  return (
    <section className="border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            댓글
          </p>
          <h2 className="mt-2 text-3xl font-black">회원 의견</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            댓글은 로그인한 회원 이상 작성할 수 있도록 설계합니다. 신고,
            숨김, 삭제, 관리자 고정 댓글은 관리자 모드에서 관리합니다.
          </p>
        </div>
        <Badge tone={allowComments ? "green" : "neutral"}>
          {allowComments ? "댓글 허용" : "댓글 닫힘"}
        </Badge>
      </div>

      <div className="mt-6 border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm font-black text-zinc-900">
          회원 로그인 연결 후 댓글 작성 폼이 활성화됩니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          현재 v1에서는 데이터 모델과 표시 구조를 먼저 준비하고, 실제 작성과
          저장은 인증/Supabase 연결 단계에서 활성화합니다.
        </p>
      </div>

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
