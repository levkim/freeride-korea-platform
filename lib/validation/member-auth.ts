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

export const memberProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "이름은 2자 이상 입력해 주세요."),
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상 입력해 주세요.")
    .max(20, "닉네임은 20자 이하로 입력해 주세요."),
  phone: z.string().trim().max(30, "연락처는 30자 이하로 입력해 주세요.").optional(),
  location: z.string().trim().max(80, "활동 지역은 80자 이하로 입력해 주세요.").optional(),
  ridingLevel: z
    .string()
    .trim()
    .max(80, "라이딩 레벨은 80자 이하로 입력해 주세요.")
    .optional(),
  preferredDiscipline: z
    .string()
    .trim()
    .max(80, "관심 분야는 80자 이하로 입력해 주세요.")
    .optional(),
  bio: z.string().trim().max(500, "프로필 소개는 500자 이하로 입력해 주세요.").optional(),
});

export const memberEmailUpdateSchema = z.object({
  email: z.string().trim().email("올바른 새 이메일을 입력해 주세요."),
});

export const memberPasswordUpdateSchema = z
  .object({
    password: z.string().min(8, "새 비밀번호는 8자 이상 입력해 주세요."),
    passwordConfirm: z.string().min(8, "새 비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "새 비밀번호와 확인 값이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const memberWithdrawalRequestSchema = z.object({
  reason: z.string().trim().max(1000, "탈퇴 요청 사유는 1000자 이하로 입력해 주세요.").optional(),
});

export type MemberProfileUpdateInput = z.infer<typeof memberProfileUpdateSchema>;
export type MemberEmailUpdateInput = z.infer<typeof memberEmailUpdateSchema>;
export type MemberPasswordUpdateInput = z.infer<typeof memberPasswordUpdateSchema>;
export type MemberWithdrawalRequestInput = z.infer<
  typeof memberWithdrawalRequestSchema
>;
