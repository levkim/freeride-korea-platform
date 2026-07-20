import { z } from "zod";

export const memberStatusLookupSchema = z.object({
  email: z.string().trim().email("올바른 이메일을 입력해 주세요."),
  phone: z.string().trim().min(7, "가입/문의 시 입력한 전화번호를 입력해 주세요."),
});

export type MemberStatusLookupInput = z.infer<typeof memberStatusLookupSchema>;
