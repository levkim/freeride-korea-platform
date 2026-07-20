import { ensureGeneralMember } from "@/lib/repositories/members";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import {
  createSupabaseAuthServerClient,
  getMissingSupabaseAuthEnv,
  hasSupabaseAuthEnv,
} from "@/lib/supabase/auth";
import type { Member, MemberStatus, MemberType } from "@/lib/types/member";

type MemberRow = {
  id: string;
  email: string;
  name: string;
  member_type: MemberType;
  status: MemberStatus;
  joined_at: string;
};

function getMetadataMemberId(metadata: Record<string, unknown> | undefined) {
  const memberId = metadata?.memberId;
  return typeof memberId === "string" && memberId ? memberId : null;
}

function mapMemberRow(row: MemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    memberType: row.member_type,
    status: row.status,
    joinedAt: row.joined_at.slice(0, 10),
  };
}

export async function getCurrentMemberSession() {
  if (!hasSupabaseAuthEnv()) {
    return {
      mode: "not-configured" as const,
      missingEnv: getMissingSupabaseAuthEnv(),
      user: null,
      member: null,
    };
  }

  const authClient = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return {
      mode: "anonymous" as const,
      missingEnv: [],
      user: null,
      member: null,
    };
  }

  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "auth-only" as const,
      missingEnv: [],
      user,
      member: null,
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id,email,name,member_type,status,joined_at")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    if (getMetadataMemberId(user.user_metadata) !== (data as MemberRow).id) {
      await authClient.auth.updateUser({
        data: {
          ...user.user_metadata,
          memberId: (data as MemberRow).id,
        },
      });
    }

    return {
      mode: "authenticated" as const,
      missingEnv: [],
      user,
      member: mapMemberRow(data as MemberRow),
    };
  }

  const metadataMemberId = getMetadataMemberId(user.user_metadata);

  if (metadataMemberId) {
    const { data: memberById, error: memberByIdError } = await supabase
      .from("members")
      .select("id,email,name,member_type,status,joined_at")
      .eq("id", metadataMemberId)
      .maybeSingle();

    if (memberByIdError) {
      throw new Error(memberByIdError.message);
    }

    if (memberById) {
      if ((memberById as MemberRow).email !== user.email.toLowerCase()) {
        const { error: updateEmailError } = await supabase
          .from("members")
          .update({
            email: user.email.toLowerCase(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", metadataMemberId);

        if (updateEmailError) {
          throw new Error(updateEmailError.message);
        }

        return {
          mode: "authenticated" as const,
          missingEnv: [],
          user,
          member: mapMemberRow({
            ...(memberById as MemberRow),
            email: user.email.toLowerCase(),
          }),
        };
      }

      return {
        mode: "authenticated" as const,
        missingEnv: [],
        user,
        member: mapMemberRow(memberById as MemberRow),
      };
    }
  }

  const created = await ensureGeneralMember({
    name:
      typeof user.user_metadata?.nickname === "string" &&
      user.user_metadata.nickname
        ? user.user_metadata.nickname
        : typeof user.user_metadata?.name === "string" && user.user_metadata.name
          ? user.user_metadata.name
          : user.email,
    email: user.email,
  });

  if (created.member?.id) {
    await authClient.auth.updateUser({
      data: {
        ...user.user_metadata,
        memberId: created.member.id,
      },
    });
  }

  return {
    mode: "authenticated" as const,
    missingEnv: [],
    user,
    member: created.member ?? null,
  };
}
