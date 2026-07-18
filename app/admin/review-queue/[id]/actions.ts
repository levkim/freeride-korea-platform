"use server";

import { redirect } from "next/navigation";
import { persistReviewAction } from "@/lib/repositories/review-actions";
import {
  reviewActionInputSchema,
  reviewActionStatusMap,
} from "@/lib/validation/review-action";

export async function submitReviewAction(formData: FormData) {
  const parsed = reviewActionInputSchema.safeParse({
    reviewId: formData.get("reviewId"),
    action: formData.get("action"),
    note: formData.get("note"),
  });

  const reviewId = String(formData.get("reviewId") ?? "");

  if (!parsed.success) {
    redirect(`/admin/review-queue/${reviewId}?result=invalid`);
  }

  const nextStatus = reviewActionStatusMap[parsed.data.action];
  const result = await persistReviewAction({
    ...parsed.data,
    nextStatus,
  });

  redirect(
    `/admin/review-queue/${parsed.data.reviewId}?result=${parsed.data.action}&next=${nextStatus}&mode=${result.mode}`,
  );
}
