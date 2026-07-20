import type {
  CommentItem,
  CommentStatus,
  CommentTargetType,
  CommentThreadSummary,
} from "@/lib/types/comment";
import type { CommentActionInput } from "@/lib/validation/comment-action";
import type { MemberType } from "@/lib/types/member";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type PersistCommentActionResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  commentId: string;
  action: CommentActionInput["action"];
};

type CommentRow = {
  id: string;
  target_type: CommentTargetType;
  target_content_id: string | null;
  target_event_id: string | null;
  author_id: string;
  body: string;
  status: CommentStatus;
  report_count: number;
  pinned: boolean;
  created_at: string;
};

type MemberRow = {
  id: string;
  name: string;
  member_type: MemberType;
};

type ContentTitleRow = {
  id: string;
  title_ko: string | null;
  title_en: string | null;
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

function getCommentTargetId(row: CommentRow) {
  return row.target_type === "event"
    ? row.target_event_id
    : row.target_content_id;
}

function getTargetTitle(row: CommentRow, contentTitleById: Map<string, string>) {
  const targetId = getCommentTargetId(row);

  if (!targetId) {
    return "연결 대상 없음";
  }

  return contentTitleById.get(targetId) ?? "콘텐츠 제목 확인 필요";
}

function rowToCommentItem(
  row: CommentRow,
  memberById: Map<string, MemberRow>,
  contentTitleById: Map<string, string>,
): CommentItem {
  const member = memberById.get(row.author_id);

  return {
    id: row.id,
    targetType: row.target_type,
    targetId: getCommentTargetId(row) ?? row.id,
    targetTitle: getTargetTitle(row, contentTitleById),
    authorName: member?.name ?? "회원 정보 확인 필요",
    authorType: member?.member_type ?? "general",
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
    reportCount: row.report_count,
    pinned: row.pinned,
  };
}

async function getCommentRows() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id,target_type,target_content_id,target_event_id,author_id,body,status,report_count,pinned,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CommentRow[];
}

async function getMembersById(authorIds: string[]) {
  if (!authorIds.length) {
    return new Map<string, MemberRow>();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id,name,member_type")
    .in("id", authorIds);

  if (error || !data?.length) {
    return new Map<string, MemberRow>();
  }

  return new Map((data as MemberRow[]).map((row) => [row.id, row]));
}

async function getContentTitlesById(contentIds: string[]) {
  if (!contentIds.length) {
    return new Map<string, string>();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("id,title_ko,title_en")
    .in("id", contentIds);

  if (error || !data?.length) {
    return new Map<string, string>();
  }

  return new Map(
    (data as ContentTitleRow[]).map((row) => [
      row.id,
      row.title_ko || row.title_en || "제목 없음",
    ]),
  );
}

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

export async function listAdminComments(): Promise<{
  items: CommentItem[];
  mode: "supabase" | "mock";
}> {
  if (!hasSupabaseAdminEnv()) {
    return {
      items: [...commentItems].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
      mode: "mock",
    };
  }

  const rows = await getCommentRows();

  if (!rows.length) {
    return {
      items: [],
      mode: "supabase",
    };
  }

  const authorIds = Array.from(new Set(rows.map((row) => row.author_id)));
  const contentIds = Array.from(
    new Set(
      rows.map(getCommentTargetId).filter((id): id is string => Boolean(id)),
    ),
  );
  const [memberById, contentTitleById] = await Promise.all([
    getMembersById(authorIds),
    getContentTitlesById(contentIds),
  ]);

  return {
    items: rows.map((row) => rowToCommentItem(row, memberById, contentTitleById)),
    mode: "supabase",
  };
}

export async function listCommentsByAuthorId(
  authorId?: string | null,
): Promise<{
  items: CommentItem[];
  mode: "supabase" | "mock";
}> {
  if (!authorId || !hasSupabaseAdminEnv()) {
    return {
      items: [],
      mode: hasSupabaseAdminEnv() ? "supabase" : "mock",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id,target_type,target_content_id,target_event_id,author_id,body,status,report_count,pinned,created_at",
    )
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as CommentRow[];

  if (!rows.length) {
    return {
      items: [],
      mode: "supabase",
    };
  }

  const contentIds = Array.from(
    new Set(
      rows.map(getCommentTargetId).filter((id): id is string => Boolean(id)),
    ),
  );
  const [memberById, contentTitleById] = await Promise.all([
    getMembersById([authorId]),
    getContentTitlesById(contentIds),
  ]);

  return {
    items: rows.map((row) => rowToCommentItem(row, memberById, contentTitleById)),
    mode: "supabase",
  };
}

export async function persistCommentAction(
  input: CommentActionInput,
): Promise<PersistCommentActionResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      commentId: input.commentId,
      action: input.action,
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: comment, error: readError } = await supabase
    .from("comments")
    .select("id,status,pinned")
    .eq("id", input.commentId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!comment) {
    return {
      mode: "supabase",
      commentId: input.commentId,
      action: input.action,
    };
  }

  const nextStatus =
    input.action === "mark_visible"
      ? "visible"
      : input.action === "hide"
        ? "hidden"
        : input.action === "delete"
          ? "deleted"
          : comment.status;
  const nextPinned =
    input.action === "pin"
      ? true
      : input.action === "unpin"
        ? false
        : comment.pinned;

  const { error: updateError } = await supabase
    .from("comments")
    .update({
      status: nextStatus,
      pinned: nextPinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.commentId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: eventError } = await supabase.from("comment_events").insert({
    comment_id: input.commentId,
    action: input.action,
    from_status: comment.status,
    to_status: nextStatus,
    note: `관리자 댓글 액션: ${input.action}`,
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  return {
    mode: "supabase",
    commentId: input.commentId,
    action: input.action,
  };
}

export function summarizeCommentThreads(
  comments: CommentItem[],
): CommentThreadSummary[] {
  const grouped = new Map<string, CommentItem[]>();

  for (const comment of comments) {
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

export function listCommentThreadSummaries(): CommentThreadSummary[] {
  return summarizeCommentThreads(commentItems);
}
