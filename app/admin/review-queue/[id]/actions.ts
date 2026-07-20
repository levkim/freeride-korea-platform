"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import { persistReviewAction } from "@/lib/repositories/review-actions";
import {
  reviewActionInputSchema,
  reviewActionStatusMap,
} from "@/lib/validation/review-action";

export async function submitReviewAction(formData: FormData) {
  const reviewId = String(formData.get("reviewId") ?? "");

  try {
    await requireAdminAction();
  } catch {
    redirect(`/admin/login?error=forbidden&next=/admin/review-queue/${reviewId}`);
  }

  const parsed = reviewActionInputSchema.safeParse({
    reviewId: formData.get("reviewId"),
    action: formData.get("action"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    redirect(`/admin/review-queue/${reviewId}?result=invalid`);
  }

  const nextStatus = reviewActionStatusMap[parsed.data.action];
  const result = await persistReviewAction({
    ...parsed.data,
    nextStatus,
  });
  const resultParams = new URLSearchParams({
    result: parsed.data.action,
    next: nextStatus,
    mode: result.mode,
  });

  if (result.memberUpgradeApplied) {
    resultParams.set("memberUpgrade", "updated");
  }

  if (result.unsupportedRequestedMemberType) {
    resultParams.set("memberUpgrade", "unsupported");
  }

  redirect(`/admin/review-queue/${parsed.data.reviewId}?${resultParams}`);
}
