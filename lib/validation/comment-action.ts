import { z } from "zod";

export const commentActionSchema = z.enum([
  "mark_visible",
  "hide",
  "delete",
  "pin",
  "unpin",
]);

export const commentActionInputSchema = z.object({
  commentId: z.string().trim().min(1, "댓글 ID가 필요합니다."),
  action: commentActionSchema,
  returnTo: z.string().trim().min(1).default("/admin/comments"),
});

export type CommentActionInput = z.infer<typeof commentActionInputSchema>;
