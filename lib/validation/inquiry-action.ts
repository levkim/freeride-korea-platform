import { z } from "zod";
import { inquiryStatusSchema } from "@/lib/validation/inquiry";

export const inquiryActionInputSchema = z.object({
  inquiryId: z.string().trim().min(1, "문의 ID가 필요합니다."),
  toStatus: inquiryStatusSchema,
  assignedTo: z.string().trim().optional(),
  note: z.string().trim().min(5, "관리자 메모를 5자 이상 입력해 주세요."),
});

export type InquiryActionInput = z.infer<typeof inquiryActionInputSchema>;
