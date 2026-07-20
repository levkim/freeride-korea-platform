import { z } from "zod";

export const memberSignInSchema = z.object({
  email: z.string().trim().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상 입력해 주세요."),
});

export const memberSignUpSchema = memberSignInSchema
  .extend({
    name: z.string().trim().min(2, "이름은 2자 이상 입력해 주세요."),
    nickname: z
      .string()
      .trim()
      .min(2, "닉네임은 2자 이상 입력해 주세요.")
      .max(20, "닉네임은 20자 이하로 입력해 주세요."),
    passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type MemberSignInInput = z.infer<typeof memberSignInSchema>;
export type MemberSignUpInput = z.infer<typeof memberSignUpSchema>;
