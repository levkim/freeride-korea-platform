"use server";

import { redirect } from "next/navigation";

import { getMemberProfileFromUser } from "@/lib/member-profile";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";
import { persistWithdrawalRequest } from "@/lib/repositories/inquiries";
import {
  ensureGeneralMember,
  updateMemberDisplayName,
} from "@/lib/repositories/members";
import { lookupMemberStatus } from "@/lib/repositories/member-status";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth";
import {
  memberEmailUpdateSchema,
  memberPasswordUpdateSchema,
  memberProfileUpdateSchema,
  memberSignInSchema,
  memberSignUpSchema,
  memberWithdrawalRequestSchema,
} from "@/lib/validation/member-auth";
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

export async function signUpMemberAction(formData: FormData) {
  const parsed = memberSignUpSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    redirect("/account?auth=signup-invalid");
  }

  let nextPath = "/account?auth=signup-error";

  try {
    const supabase = await createSupabaseAuthServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      options: {
        data: {
          name: parsed.data.name,
          nickname: parsed.data.nickname,
        },
      },
    });

    if (!error) {
      const memberResult = await ensureGeneralMember({
        name: parsed.data.nickname,
        email: parsed.data.email,
      });

      if (data.session && memberResult.member?.id) {
        await supabase.auth.updateUser({
          data: {
            name: parsed.data.name,
            nickname: parsed.data.nickname,
            memberId: memberResult.member.id,
          },
        });
      }

      nextPath = data.session
        ? "/account?auth=signed-up"
        : "/account?auth=signup-check-email";
    }
  } catch {
    nextPath = "/account?auth=auth-not-configured";
  }

  redirect(nextPath);
}

export async function signInMemberAction(formData: FormData) {
  const parsed = memberSignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/account?auth=signin-invalid");
  }

  let nextPath = "/account?auth=signin-error";

  try {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
    });

    if (!error) {
      nextPath = "/account?auth=signed-in";
    }
  } catch {
    nextPath = "/account?auth=auth-not-configured";
  }

  redirect(nextPath);
}

export async function signOutMemberAction() {
  try {
    const supabase = await createSupabaseAuthServerClient();
    await supabase.auth.signOut();
  } catch {
    // Missing auth env should still land the visitor on the account page.
  }

  redirect("/account?auth=signed-out");
}

export async function updateMemberProfileAction(formData: FormData) {
  const parsed = memberProfileUpdateSchema.safeParse({
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    ridingLevel: formData.get("ridingLevel"),
    preferredDiscipline: formData.get("preferredDiscipline"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    redirect("/account?auth=profile-invalid");
  }

  let nextPath = "/account?auth=profile-error";

  try {
    const session = await getCurrentMemberSession();

    if (session.user?.email) {
      const supabase = await createSupabaseAuthServerClient();
      const profile = {
        name: parsed.data.name,
        nickname: parsed.data.nickname,
        phone: parsed.data.phone || "",
        location: parsed.data.location || "",
        ridingLevel: parsed.data.ridingLevel || "",
        preferredDiscipline: parsed.data.preferredDiscipline || "",
        bio: parsed.data.bio || "",
      };

      const { error } = await supabase.auth.updateUser({
        data: profile,
      });

      if (!error) {
        if (session.member?.id) {
          await updateMemberDisplayName(session.member.id, parsed.data.nickname);
        }

        nextPath = "/account?auth=profile-updated";
      }
    } else {
      nextPath = "/account?auth=signin-required";
    }
  } catch {
    nextPath = "/account?auth=profile-error";
  }

  redirect(nextPath);
}

export async function updateMemberEmailAction(formData: FormData) {
  const parsed = memberEmailUpdateSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    redirect("/account?auth=email-invalid");
  }

  let nextPath = "/account?auth=email-error";

  try {
    const session = await getCurrentMemberSession();
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.updateUser({
      email: parsed.data.email.toLowerCase(),
      data: {
        ...session.user?.user_metadata,
        memberId: session.member?.id,
      },
    });

    if (!error) {
      nextPath = "/account?auth=email-change-requested";
    }
  } catch {
    nextPath = "/account?auth=email-error";
  }

  redirect(nextPath);
}

export async function updateMemberPasswordAction(formData: FormData) {
  const parsed = memberPasswordUpdateSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    redirect("/account?auth=password-invalid");
  }

  let nextPath = "/account?auth=password-error";

  try {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (!error) {
      nextPath = "/account?auth=password-updated";
    }
  } catch {
    nextPath = "/account?auth=password-error";
  }

  redirect(nextPath);
}

export async function requestMemberWithdrawalAction(formData: FormData) {
  const parsed = memberWithdrawalRequestSchema.safeParse({
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    redirect("/account?auth=withdrawal-invalid");
  }

  let nextPath = "/account?auth=withdrawal-error";

  try {
    const session = await getCurrentMemberSession();

    if (session.user?.email) {
      const profile = getMemberProfileFromUser(session.user, session.member);
      await persistWithdrawalRequest({
        name: profile.realName || profile.nickname || session.user.email,
        email: session.user.email,
        phone: profile.phone,
        reason: parsed.data.reason,
      });

      nextPath = "/account?auth=withdrawal-requested";
    } else {
      nextPath = "/account?auth=signin-required";
    }
  } catch {
    nextPath = "/account?auth=withdrawal-error";
  }

  redirect(nextPath);
}
