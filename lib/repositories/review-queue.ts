import { reviewQueueItems } from "@/content/seed/site-data";
import type { ContentKind, PublishStatus } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";
import type {
  ReviewActionKind,
  ReviewEventItem,
  ReviewQueueItem,
  ReviewSubjectKind,
  ReviewSubjectContext,
} from "@/lib/types/review";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type ReviewQueueRow = {
  id: string;
  subject_kind: ReviewSubjectKind;
  content_id: string | null;
  member_id?: string | null;
  inquiry_id?: string | null;
  title: string;
  status: ReviewQueueItem["status"];
  risk: ReviewQueueItem["risk"];
  required_author_role: MemberType | null;
  required_publish_role: string;
  submitted_by: string | null;
  created_at: string;
};

type ContentKindRow = {
  id: string;
  kind: ContentKind;
};

type ReviewEventRow = {
  id: string;
  action: ReviewActionKind;
  from_status: ReviewEventItem["fromStatus"];
  to_status: ReviewEventItem["toStatus"];
  actor_id: string | null;
  note: string;
  created_at: string;
};

type ReviewSubjectRow = {
  id: string;
  subject_kind: ReviewSubjectKind;
  member_id: string | null;
  inquiry_id: string | null;
};

type ReviewMemberRow = {
  id: string;
  name: string;
  email: string;
  member_type: MemberType;
  status: string;
  joined_at: string;
};

type ReviewInquiryRow = {
  id: string;
  title: string;
  phone: string | null;
  riding_experience: string | null;
  requested_member_type: string | null;
  message: string;
  created_at: string;
};

const contentKinds = new Set<ContentKind>([
  "news",
  "video",
  "event",
  "program",
  "tour",
  "culture",
  "marketplace",
  "resource",
  "shop",
]);

const publishStatuses = new Set<PublishStatus>([
  "draft",
  "review",
  "needs_revision",
  "approved",
  "published",
  "rejected",
  "hidden",
  "archived",
]);

function toPublishStatus(status: ReviewQueueItem["status"]) {
  return publishStatuses.has(status as PublishStatus)
    ? (status as PublishStatus)
    : undefined;
}

function getSubmittedByLabel(row: ReviewQueueRow) {
  if (row.subject_kind === "source-alert") {
    return "소스 모니터";
  }

  if (row.subject_kind === "ai-draft") {
    return "AI 초안";
  }

  if (row.submitted_by) {
    return "회원 제출";
  }

  return "운영 관리자";
}

function getReviewKind(
  row: ReviewQueueRow,
  contentKindById: Map<string, ContentKind>,
): ReviewQueueItem["kind"] {
  if (row.subject_kind === "content") {
    return row.content_id
      ? contentKindById.get(row.content_id) ?? "resource"
      : "resource";
  }

  return row.subject_kind;
}

function rowToReviewQueueItem(
  row: ReviewQueueRow,
  contentKindById: Map<string, ContentKind>,
): ReviewQueueItem {
  return {
    id: row.id,
    kind: getReviewKind(row, contentKindById),
    title: row.title,
    submittedBy: getSubmittedByLabel(row),
    status: row.status,
    requiredAuthorRole: row.required_author_role ?? "admin",
    requiredPublishRole: "admin",
    risk: row.risk,
    createdAt: row.created_at.slice(0, 10),
  };
}

async function getContentKindMap(contentIds: string[]) {
  if (!contentIds.length) {
    return new Map<string, ContentKind>();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("id, kind")
    .in("id", contentIds);

  if (error || !data?.length) {
    return new Map<string, ContentKind>();
  }

  return new Map(
    (data as ContentKindRow[])
      .filter((row) => contentKinds.has(row.kind))
      .map((row) => [row.id, row.kind]),
  );
}

export async function listReviewQueueItems(): Promise<ReviewQueueItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return reviewQueueItems;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("review_queue_items")
    .select(
      "id, subject_kind, content_id, title, status, risk, required_author_role, required_publish_role, submitted_by, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return reviewQueueItems;
  }

  const rows = data as ReviewQueueRow[];
  const contentIds = rows
    .map((row) => row.content_id)
    .filter((id): id is string => Boolean(id));
  const contentKindById = await getContentKindMap(contentIds);

  return rows.map((row) => rowToReviewQueueItem(row, contentKindById));
}

export async function getReviewQueueItemById(
  id: string,
): Promise<ReviewQueueItem | null> {
  const seededItem = reviewQueueItems.find((item) => item.id === id) ?? null;

  if (!hasSupabaseAdminEnv()) {
    return seededItem;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("review_queue_items")
    .select(
      "id, subject_kind, content_id, title, status, risk, required_author_role, required_publish_role, submitted_by, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return seededItem;
  }

  const row = data as ReviewQueueRow;
  const contentKindById = await getContentKindMap(
    row.content_id ? [row.content_id] : [],
  );

  return rowToReviewQueueItem(row, contentKindById);
}

export async function getReviewSubjectContext(
  id: string,
): Promise<ReviewSubjectContext> {
  if (!hasSupabaseAdminEnv()) {
    return { kind: "none" };
  }

  const supabase = createSupabaseAdminClient();
  const { data: reviewData, error: reviewError } = await supabase
    .from("review_queue_items")
    .select("id, subject_kind, member_id, inquiry_id")
    .eq("id", id)
    .maybeSingle();

  if (reviewError || !reviewData) {
    return { kind: "none" };
  }

  const reviewRow = reviewData as ReviewSubjectRow;

  if (reviewRow.subject_kind !== "member-upgrade") {
    return { kind: "none" };
  }

  const [memberResult, inquiryResult] = await Promise.all([
    reviewRow.member_id
      ? supabase
          .from("members")
          .select("id, name, email, member_type, status, joined_at")
          .eq("id", reviewRow.member_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    reviewRow.inquiry_id
      ? supabase
          .from("inquiry_entries")
          .select(
            "id, title, phone, riding_experience, requested_member_type, message, created_at",
          )
          .eq("id", reviewRow.inquiry_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const memberRow =
    !memberResult.error && memberResult.data
      ? (memberResult.data as ReviewMemberRow)
      : null;
  const inquiryRow =
    !inquiryResult.error && inquiryResult.data
      ? (inquiryResult.data as ReviewInquiryRow)
      : null;

  return {
    kind: "member-upgrade",
    member: memberRow
      ? {
          id: memberRow.id,
          name: memberRow.name,
          email: memberRow.email,
          memberType: memberRow.member_type,
          status: memberRow.status,
          joinedAt: memberRow.joined_at.slice(0, 10),
        }
      : undefined,
    inquiry: inquiryRow
      ? {
          id: inquiryRow.id,
          title: inquiryRow.title,
          phone: inquiryRow.phone ?? undefined,
          ridingExperience: inquiryRow.riding_experience ?? undefined,
          requestedMemberType: inquiryRow.requested_member_type ?? undefined,
          message: inquiryRow.message,
          createdAt: inquiryRow.created_at.slice(0, 10),
        }
      : undefined,
  };
}

export async function listReviewEvents(
  reviewId: string,
  fallbackItem?: ReviewQueueItem | null,
): Promise<ReviewEventItem[]> {
  const fallbackEvents: ReviewEventItem[] = fallbackItem
    ? [
        {
          id: `${fallbackItem.id}-submitted`,
          action: "submit",
          toStatus: "review",
          actor: fallbackItem.submittedBy,
          note: "초안이 제출되었습니다.",
          createdAt: fallbackItem.createdAt,
        },
        {
          id: `${fallbackItem.id}-queued`,
          action: "comment",
          toStatus: toPublishStatus(fallbackItem.status),
          actor: "시스템",
          note: "검토 대기열에 등록되었습니다.",
          createdAt: fallbackItem.createdAt,
        },
      ]
    : [];

  if (!hasSupabaseAdminEnv()) {
    return fallbackEvents;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("review_events")
    .select("id, action, from_status, to_status, actor_id, note, created_at")
    .eq("review_item_id", reviewId)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return fallbackEvents;
  }

  return (data as ReviewEventRow[]).map((row) => ({
    id: row.id,
    action: row.action,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    actor: row.actor_id ? "관리자" : "운영 관리자",
    note: row.note,
    createdAt: row.created_at.slice(0, 10),
  }));
}
