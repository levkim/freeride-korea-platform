import { z } from "zod";
import type { PublishStatus } from "@/lib/types/content";

export const reviewActionSchema = z.enum([
  "approve",
  "request_revision",
  "reject",
  "publish",
]);

export const reviewActionInputSchema = z.object({
  reviewId: z.string().trim().min(1, "검토 항목 ID가 필요합니다."),
  action: reviewActionSchema,
  note: z.string().trim().min(5, "관리자 코멘트를 5자 이상 입력해 주세요."),
});

export const reviewActionStatusMap: Record<
  z.infer<typeof reviewActionSchema>,
  PublishStatus
> = {
  approve: "approved",
  request_revision: "needs_revision",
  reject: "rejected",
  publish: "published",
};

export type ReviewActionInput = z.infer<typeof reviewActionInputSchema>;
