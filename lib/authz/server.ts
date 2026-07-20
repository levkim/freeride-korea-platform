import { cookies } from "next/headers";

import { adminCookieName, verifyAdminAccessToken } from "@/lib/admin/access-key";
import { getCurrentMemberSession } from "@/lib/repositories/member-auth";
import type { ContentKind } from "@/lib/types/content";
import type { Member, MemberType } from "@/lib/types/member";

const memberRank: Record<MemberType, number> = {
  general: 0,
  supporting: 0,
  regular: 1,
  athlete: 1,
  executive: 2,
};

export class AuthorizationError extends Error {
  constructor(message = "권한이 없습니다.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function hasAdminAccessCookie() {
  const configuredKey = process.env.ADMIN_ACCESS_KEY;

  if (!configuredKey) {
    return true;
  }

  const cookieStore = await cookies();
  const grantedToken = cookieStore.get(adminCookieName)?.value;

  return verifyAdminAccessToken(grantedToken, configuredKey);
}

export async function requireAdminAction() {
  if (!(await hasAdminAccessCookie())) {
    throw new AuthorizationError("관리자 접근 권한이 필요합니다.");
  }
}

export async function getSignedInMemberOrThrow() {
  const session = await getCurrentMemberSession();

  if (!session.user?.email || !session.member?.id) {
    throw new AuthorizationError("로그인 회원만 이용할 수 있습니다.");
  }

  return {
    session,
    member: session.member,
  };
}

export function hasMinimumMemberRole(
  member: Member,
  minimumRole: MemberType,
) {
  return memberRank[member.memberType] >= memberRank[minimumRole];
}

export function getMemberAuthorMinimumRole(
  kind: ContentKind,
  subtype?: string,
): MemberType | null {
  if (kind === "culture" || kind === "marketplace") {
    return "general";
  }

  if (kind === "resource") {
    return "regular";
  }

  if (kind === "tour") {
    return "regular";
  }

  if (kind === "program") {
    return ["Avalanche Safety", "Freeriding", "Backcountry", "WFR"].includes(
      subtype || "",
    )
      ? "executive"
      : "regular";
  }

  if (kind === "news" || kind === "video" || kind === "event") {
    return "executive";
  }

  if (kind === "shop") {
    return "regular";
  }

  return null;
}

export function assertMemberCanAuthor(
  member: Member,
  kind: ContentKind,
  subtype?: string,
) {
  const minimumRole = getMemberAuthorMinimumRole(kind, subtype);

  if (!minimumRole || !hasMinimumMemberRole(member, minimumRole)) {
    throw new AuthorizationError("이 콘텐츠를 작성할 회원 권한이 없습니다.");
  }
}

export async function requireExecutiveOrAdminAction() {
  if (await hasAdminAccessCookie()) {
    return;
  }

  const { member } = await getSignedInMemberOrThrow();

  if (!hasMinimumMemberRole(member, "executive")) {
    throw new AuthorizationError("임원회원 이상 권한이 필요합니다.");
  }
}
