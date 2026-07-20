import { z } from "zod";

export const memberUpdateActionSchema = z.object({
  memberId: z.string().uuid("회원 ID가 올바르지 않습니다."),
  memberType: z.enum(["general", "regular", "executive", "athlete", "supporting"]),
  status: z.enum(["active", "reviewing", "suspended"]),
});

export type MemberUpdateActionInput = z.infer<typeof memberUpdateActionSchema>;
