import { z } from "zod";

export const categoryStatusActionSchema = z.enum([
  "review",
  "published",
  "hidden",
  "archived",
]);

export const categoryStatusActionInputSchema = z.object({
  contentId: z.string().trim().min(1, "콘텐츠 ID가 필요합니다."),
  status: categoryStatusActionSchema,
  returnTo: z
    .string()
    .trim()
    .startsWith("/admin/site-categories")
    .default("/admin/site-categories"),
});

export type CategoryStatusActionInput = z.infer<
  typeof categoryStatusActionInputSchema
>;
