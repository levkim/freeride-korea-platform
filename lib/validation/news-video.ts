import { z } from "zod";

const localizedTextSchema = z
  .object({
    ko: z.string().trim().min(1),
    en: z.string().trim().optional().or(z.literal("")),
  })
  .transform((value) => ({
    ko: value.ko,
    en: value.en || value.ko,
  }));

const optionalUrlSchema = z
  .string()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const newsVideoInputSchema = z
  .object({
    kind: z.enum(["news", "video"]),
    title: localizedTextSchema,
    summary: localizedTextSchema,
    body: localizedTextSchema,
    publishedAt: z.string().date(),
    imageUrl: z.string().min(1),
    youtubeUrl: optionalUrlSchema,
    sourceUrl: optionalUrlSchema,
    tags: z.array(z.string().min(1)).default([]),
  })
  .refine((item) => item.kind !== "video" || Boolean(item.youtubeUrl), {
    message: "Video posts should include a YouTube URL.",
    path: ["youtubeUrl"],
  });

export type NewsVideoInput = z.infer<typeof newsVideoInputSchema>;
