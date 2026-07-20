"use server";

import { lookupMemberStatus } from "@/lib/repositories/member-status";
import { memberStatusLookupSchema } from "@/lib/validation/member-status";

export type MemberStatusLookupState = {
  status: "idle" | "success" | "not_found" | "invalid" | "error";
  message?: string;
  result?: Awaited<ReturnType<typeof lookupMemberStatus>>;
};

export async function lookupMemberStatusAction(
  _previousState: MemberStatusLookupState,
  formData: FormData,
): Promise<MemberStatusLookupState> {
  const parsed = memberStatusLookupSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      status: "invalid",
      message: parsed.error.issues[0]?.message ?? "입력값을 다시 확인해 주세요.",
    };
  }

  try {
    const result = await lookupMemberStatus(parsed.data);

    if (!result.found) {
      return {
        status: "not_found",
        message:
          "입력한 이메일과 전화번호로 확인되는 회원가입/문의 기록이 없습니다.",
      };
    }

    return {
      status: "success",
      result,
    };
  } catch {
    return {
      status: "error",
      message:
        "회원 상태를 확인하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
