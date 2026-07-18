import { z } from "zod";

export const categoryContentKindSchema = z.enum([
  "program",
  "tour",
  "culture",
  "marketplace",
  "resource",
  "shop",
]);

function localizedKoreanFirstSchema(
  koRule: z.ZodString,
  fallbackMessage: string,
) {
  return z
    .object({
      ko: koRule,
      en: z.string().trim().optional().or(z.literal("")),
    })
    .transform((value) => ({
      ko: value.ko,
      en: value.en || value.ko,
    }))
    .refine((value) => value.en.length > 0, {
      message: fallbackMessage,
      path: ["en"],
    });
}

export const categoryContentInputSchema = z.object({
  kind: categoryContentKindSchema,
  subtype: z.string().trim().min(1, "세부 유형을 입력해 주세요."),
  title: localizedKoreanFirstSchema(
    z.string().trim().min(2, "제목을 입력해 주세요."),
    "제목을 입력해 주세요.",
  ),
  summary: localizedKoreanFirstSchema(
    z.string().trim().min(10, "요약을 10자 이상 입력해 주세요."),
    "요약을 입력해 주세요.",
  ),
  body: localizedKoreanFirstSchema(
    z.string().trim().min(20, "상세 내용을 20자 이상 입력해 주세요."),
    "상세 내용을 입력해 주세요.",
  ),
  location: z.string().trim().optional(),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
  capacity: z.string().trim().optional(),
  price: z.string().trim().optional(),
  instructor: z.string().trim().optional(),
  operator: z.string().trim().optional(),
  difficulty: z.string().trim().optional(),
  requiredGear: z.string().trim().optional(),
  insuranceNote: z.string().trim().optional(),
  cancellationPolicy: z.string().trim().optional(),
  tourGuide: z.string().trim().optional(),
  itinerary: z.string().trim().optional(),
  includedItems: z.string().trim().optional(),
  excludedItems: z.string().trim().optional(),
  requiredLevel: z.string().trim().optional(),
  athleteLevel: z.string().trim().optional(),
  targetEvents: z.string().trim().optional(),
  seasonGoal: z.string().trim().optional(),
  coachingFormat: z.string().trim().optional(),
  videoReview: z.string().trim().optional(),
  selectionCriteria: z.string().trim().optional(),
  cultureFormat: z.string().trim().optional(),
  communityScope: z.string().trim().optional(),
  ethicsNote: z.string().trim().optional(),
  relatedLink: z.string().trim().optional(),
  shopItemType: z.string().trim().optional(),
  memberRequirement: z.string().trim().optional(),
  fulfillmentMethod: z.string().trim().optional(),
  inventoryStatus: z.string().trim().optional(),
  benefitSummary: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  applicationUrl: z.string().trim().url("신청 링크는 URL 형식이어야 합니다.").optional().or(z.literal("")),
  policyNote: z.string().trim().optional(),
});

export type CategoryContentInput = z.infer<typeof categoryContentInputSchema>;
