import { z } from "zod";

export const inquiryTypeSchema = z.enum([
  "athlete-program",
  "education",
  "freeride-tour",
  "membership",
  "business-partner",
  "sponsorship",
  "media",
  "general",
]);

export const inquiryStatusSchema = z.enum([
  "new",
  "reviewing",
  "needs_reply",
  "closed",
]);

const optionalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const inquiryInputSchema = z.object({
  type: inquiryTypeSchema,
  name: z.string().trim().min(1, "이름을 입력해 주세요."),
  email: z.string().trim().email("올바른 이메일을 입력해 주세요."),
  phone: optionalPhoneSchema,
  ridingExperience: z.string().trim().optional(),
  requestedMemberType: z.string().trim().optional(),
  title: z.string().trim().min(2, "문의 제목을 입력해 주세요."),
  message: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해 주세요.")
    .max(3000, "문의 내용은 3000자 이하로 입력해 주세요."),
  privacyAccepted: z.literal(true, {
    error: "개인정보 수집 및 이용에 동의해 주세요.",
  }),
});

export type InquiryInput = z.infer<typeof inquiryInputSchema>;
