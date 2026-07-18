import type {
  CommentItem,
  CommentStatus,
  CommentTargetType,
  CommentThreadSummary,
} from "@/lib/types/comment";
import type { CommentActionInput } from "@/lib/validation/comment-action";

type PersistCommentActionResult = {
  mode: "mock";
  commentId: string;
  action: CommentActionInput["action"];
};

const commentItems: CommentItem[] = [
  {
    id: "comment-1",
    targetType: "news-video",
    targetId: "news-video-1",
    targetTitle: "프리라이드 코리아 시즌 소식",
    authorName: "일반회원 예시",
    authorType: "general",
    body: "영상 잘 봤습니다. 다음 훈련 일정도 공유되면 좋겠습니다.",
    status: "visible",
    createdAt: "2026-01-12T09:30:00.000Z",
    reportCount: 0,
  },
  {
    id: "comment-2",
    targetType: "event",
    targetId: "event-1",
    targetTitle: "2026 FWT Event",
    authorName: "정회원 예시",
    authorType: "regular",
    body: "참가 등록 링크가 열리면 알림 받을 수 있으면 좋겠습니다.",
    status: "visible",
    createdAt: "2026-01-13T11:10:00.000Z",
    reportCount: 0,
  },
  {
    id: "comment-3",
    targetType: "category-content",
    targetId: "fun-respect-safety-culture",
    targetTitle: "Fun Respect Safety Culture",
    authorName: "관리자",
    authorType: "executive",
    body: "위치 공개와 안전 장비 관련 내용은 커뮤니티 기준에 맞춰 관리하겠습니다.",
    status: "visible",
    createdAt: "2026-01-14T15:20:00.000Z",
    reportCount: 0,
    pinned: true,
  },
  {
    id: "comment-4",
    targetType: "category-content",
    targetId: "member-marketplace-guideline",
    targetTitle: "중고장터 운영 가이드",
    authorName: "회원 예시",
    authorType: "general",
    body: "개인 연락처가 노출된 댓글 예시입니다. 관리자 확인이 필요합니다.",
    status: "reported",
    createdAt: "2026-01-15T08:45:00.000Z",
    reportCount: 2,
  },
];

const visibleStatuses: CommentStatus[] = ["visible", "reported"];

export function listCommentsForTarget(
  targetType: CommentTargetType,
  targetId: string,
) {
  return commentItems
    .filter(
      (comment) =>
        comment.targetType === targetType &&
        comment.targetId === targetId &&
        visibleStatuses.includes(comment.status),
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) {
        return -1;
      }

      if (!a.pinned && b.pinned) {
        return 1;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function listAdminComments() {
  return [...commentItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function persistCommentAction(
  input: CommentActionInput,
): Promise<PersistCommentActionResult> {
  return {
    mode: "mock",
    commentId: input.commentId,
    action: input.action,
  };
}

export function listCommentThreadSummaries(): CommentThreadSummary[] {
  const grouped = new Map<string, CommentItem[]>();

  for (const comment of commentItems) {
    const key = `${comment.targetType}:${comment.targetId}`;
    grouped.set(key, [...(grouped.get(key) ?? []), comment]);
  }

  return Array.from(grouped.values())
    .map((items) => {
      const latest = [...items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      return {
        targetType: latest.targetType,
        targetId: latest.targetId,
        targetTitle: latest.targetTitle,
        totalCount: items.length,
        visibleCount: items.filter((item) => item.status === "visible").length,
        reportedCount: items.filter((item) => item.status === "reported").length,
        latestAt: latest.createdAt,
      };
    })
    .sort(
      (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
    );
}
