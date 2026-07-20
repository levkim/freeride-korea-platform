import type { PublishStatus } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";
import type { ReviewActionInput } from "@/lib/validation/review-action";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type PersistReviewActionInput = ReviewActionInput & {
  nextStatus: PublishStatus;
};

type PersistReviewActionResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  reviewEventId?: string;
  memberUpgradeApplied?: boolean;
  unsupportedRequestedMemberType?: string;
};

type ReviewQueueRow = {
  id: string;
  status: PublishStatus;
  content_id: string | null;
  subject_kind: string;
  member_id: string | null;
  inquiry_id: string | null;
};

type InquiryUpgradeRow = {
  requested_member_type: string | null;
};

const memberTypeByRequestLabel: Record<string, MemberType> = {
  일반회원: "general",
  정회원: "regular",
  임원회원: "executive",
  선수회원: "athlete",
  "스폰서십 회원": "supporting",
  후원회원: "supporting",
};

function toMemberType(requestedMemberType?: string | null) {
  if (!requestedMemberType) {
    return undefined;
  }

  return memberTypeByRequestLabel[requestedMemberType.trim()];
}

export async function persistReviewAction(
  input: PersistReviewActionInput,
): Promise<PersistReviewActionResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: reviewItem, error: reviewItemError } = await supabase
    .from("review_queue_items")
    .select("id, status, content_id, subject_kind, member_id, inquiry_id")
    .eq("id", input.reviewId)
    .single();

  if (reviewItemError) {
    throw new Error(reviewItemError.message);
  }

  const currentReviewItem = reviewItem as ReviewQueueRow;
  let memberUpgradeApplied = false;
  let unsupportedRequestedMemberType: string | undefined;

  const { error: queueError } = await supabase
    .from("review_queue_items")
    .update({
      status: input.nextStatus,
    })
    .eq("id", input.reviewId);

  if (queueError) {
    throw new Error(queueError.message);
  }

  if (currentReviewItem.content_id) {
    const contentUpdate: {
      status: PublishStatus;
      published_at?: string;
    } = {
      status: input.nextStatus,
    };

    if (input.nextStatus === "published") {
      contentUpdate.published_at = new Date().toISOString();
    }

    const { error: contentError } = await supabase
      .from("content_entries")
      .update(contentUpdate)
      .eq("id", currentReviewItem.content_id);

    if (contentError) {
      throw new Error(contentError.message);
    }
  }

  if (
    input.action === "approve" &&
    currentReviewItem.subject_kind === "member-upgrade" &&
    currentReviewItem.member_id &&
    currentReviewItem.inquiry_id
  ) {
    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiry_entries")
      .select("requested_member_type")
      .eq("id", currentReviewItem.inquiry_id)
      .maybeSingle();

    if (inquiryError) {
      throw new Error(inquiryError.message);
    }

    const requestedMemberType = (inquiry as InquiryUpgradeRow | null)
      ?.requested_member_type;
    const nextMemberType = toMemberType(requestedMemberType);

    if (nextMemberType) {
      const { error: memberError } = await supabase
        .from("members")
        .update({
          member_type: nextMemberType,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentReviewItem.member_id);

      if (memberError) {
        throw new Error(memberError.message);
      }

      const { error: inquiryUpdateError } = await supabase
        .from("inquiry_entries")
        .update({
          status: "closed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentReviewItem.inquiry_id);

      if (inquiryUpdateError) {
        throw new Error(inquiryUpdateError.message);
      }

      memberUpgradeApplied = true;
    } else if (requestedMemberType) {
      unsupportedRequestedMemberType = requestedMemberType;
    }
  }

  const { data, error } = await supabase
    .from("review_events")
    .insert({
      review_item_id: input.reviewId,
      action: input.action,
      from_status: currentReviewItem.status,
      to_status: input.nextStatus,
      note: input.note,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    reviewEventId: data.id as string,
    memberUpgradeApplied,
    unsupportedRequestedMemberType,
  };
}
