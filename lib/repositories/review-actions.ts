import type { PublishStatus } from "@/lib/types/content";
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
};

type ReviewQueueRow = {
  id: string;
  status: PublishStatus;
  content_id: string | null;
};

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
    .select("id, status, content_id")
    .eq("id", input.reviewId)
    .single();

  if (reviewItemError) {
    throw new Error(reviewItemError.message);
  }

  const currentReviewItem = reviewItem as ReviewQueueRow;

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
  };
}
