import { inquiryItems, mockMembers } from "@/content/seed/site-data";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { InquiryStatus, InquiryType } from "@/lib/types/inquiry";
import type { MemberStatus, MemberType } from "@/lib/types/member";
import type { MemberStatusLookupInput } from "@/lib/validation/member-status";

export type MemberStatusLookupResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  found: boolean;
  member?: {
    name: string;
    email: string;
    memberType: MemberType;
    status: MemberStatus;
    joinedAt: string;
  };
  inquiries: {
    type: InquiryType;
    status: InquiryStatus;
    title: string;
    createdAt: string;
  }[];
  upgradeReviews: {
    title: string;
    status: string;
    createdAt: string;
  }[];
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function lookupMemberStatus(
  input: MemberStatusLookupInput,
): Promise<MemberStatusLookupResult> {
  const normalizedEmail = input.email.toLowerCase();
  const normalizedPhone = normalizePhone(input.phone);

  if (!hasSupabaseAdminEnv()) {
    const matchedInquiries = inquiryItems.filter(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        normalizePhone(item.phone ?? "") === normalizedPhone,
    );
    const member = mockMembers.find(
      (item) => item.email.toLowerCase() === normalizedEmail,
    );

    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      found: Boolean(member || matchedInquiries.length),
      member,
      inquiries: matchedInquiries.map((item) => ({
        type: item.type,
        status: item.status,
        title: item.title,
        createdAt: item.createdAt,
      })),
      upgradeReviews: [],
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: inquiries, error: inquiryError } = await supabase
    .from("inquiry_entries")
    .select("id,inquiry_type,status,title,created_at,phone")
    .eq("email", normalizedEmail)
    .order("created_at", { ascending: false })
    .limit(10);

  if (inquiryError) {
    throw new Error(inquiryError.message);
  }

  const matchedInquiries = (inquiries ?? []).filter(
    (item) => normalizePhone(item.phone ?? "") === normalizedPhone,
  );

  if (!matchedInquiries.length) {
    return {
      mode: "supabase",
      found: false,
      inquiries: [],
      upgradeReviews: [],
    };
  }

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id,email,name,member_type,status,joined_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (memberError) {
    throw new Error(memberError.message);
  }

  const memberId = member?.id;
  const { data: reviewItems, error: reviewError } = memberId
    ? await supabase
        .from("review_queue_items")
        .select("title,status,created_at")
        .eq("subject_kind", "member-upgrade")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: [], error: null };

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  return {
    mode: "supabase",
    found: Boolean(member || matchedInquiries.length),
    member: member
      ? {
          name: member.name,
          email: member.email,
          memberType: member.member_type,
          status: member.status,
          joinedAt: member.joined_at.slice(0, 10),
        }
      : undefined,
    inquiries: matchedInquiries.map((item) => ({
      type: item.inquiry_type,
      status: item.status,
      title: item.title,
      createdAt: item.created_at.slice(0, 10),
    })),
    upgradeReviews: (reviewItems ?? []).map((item) => ({
      title: item.title,
      status: item.status,
      createdAt: item.created_at.slice(0, 10),
    })),
  };
}
