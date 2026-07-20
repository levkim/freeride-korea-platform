import { mockMembers } from "@/content/seed/site-data";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type {
  Member,
  MemberContentActivity,
  MemberStatus,
  MemberType,
} from "@/lib/types/member";
import type { MemberUpdateActionInput } from "@/lib/validation/member-action";

type MemberRow = {
  id: string;
  email: string;
  name: string;
  member_type: MemberType;
  status: MemberStatus;
  joined_at: string;
};

type EnsureGeneralMemberInput = {
  name: string;
  email: string;
};

type EnsureGeneralMemberResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  member?: Member;
  created: boolean;
};

type UpdateMemberResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
};

type MemberProfileNameResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
};

type MemberContentRow = {
  id: string;
  kind: string;
  status: string;
  title_ko: string | null;
  title_en: string | null;
  created_at: string;
};

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

export async function listMembers(): Promise<{
  items: Member[];
  mode: "supabase" | "mock";
}> {
  if (!hasSupabaseAdminEnv()) {
    return {
      items: mockMembers,
      mode: "mock",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id,email,name,member_type,status,joined_at")
    .order("joined_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data as MemberRow[]).map(mapMemberRow),
    mode: "supabase",
  };
}

export async function ensureGeneralMember(
  input: EnsureGeneralMemberInput,
): Promise<EnsureGeneralMemberResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      member: {
        id: "mock-member-registration",
        name: input.name,
        email: input.email,
        memberType: "general",
        status: "active",
        joinedAt: new Date().toISOString().slice(0, 10),
      },
      created: false,
    };
  }

  const supabase = createSupabaseAdminClient();
  const normalizedEmail = input.email.toLowerCase();

  const { data: existingMember, error: readError } = await supabase
    .from("members")
    .select("id,email,name,member_type,status,joined_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existingMember) {
    return {
      mode: "supabase",
      member: mapMemberRow(existingMember as MemberRow),
      created: false,
    };
  }

  const { data, error } = await supabase
    .from("members")
    .insert({
      email: normalizedEmail,
      name: input.name,
      member_type: "general",
      status: "active",
    })
    .select("id,email,name,member_type,status,joined_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    member: mapMemberRow(data as MemberRow),
    created: true,
  };
}

export async function updateMember(
  input: MemberUpdateActionInput,
): Promise<UpdateMemberResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("members")
    .update({
      member_type: input.memberType,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.memberId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
  };
}

export async function updateMemberDisplayName(
  memberId: string,
  nickname: string,
): Promise<MemberProfileNameResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("members")
    .update({
      name: nickname,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
  };
}

export async function listMemberContentActivities(
  memberId?: string | null,
): Promise<{
  items: MemberContentActivity[];
  mode: "supabase" | "mock";
}> {
  if (!memberId || !hasSupabaseAdminEnv()) {
    return {
      items: [],
      mode: hasSupabaseAdminEnv() ? "supabase" : "mock",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("id,kind,status,title_ko,title_en,created_at")
    .eq("author_id", memberId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    items: ((data ?? []) as MemberContentRow[]).map((row) => ({
      id: row.id,
      kind: row.kind,
      status: row.status,
      title: row.title_ko || row.title_en || "제목 없음",
      createdAt: row.created_at.slice(0, 10),
    })),
  };
}
