import type { ContentKind } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";

const memberRank: Record<MemberType, number> = {
  general: 0,
  supporting: 0,
  regular: 1,
  athlete: 1,
  executive: 2,
};

export function canAuthor(memberType: MemberType, kind: ContentKind) {
  if (kind === "culture" || kind === "marketplace") {
    return true;
  }

  if (kind === "tour" || kind === "program") {
    return memberRank[memberType] >= memberRank.regular;
  }

  if (kind === "news" || kind === "video" || kind === "event") {
    return memberRank[memberType] >= memberRank.executive;
  }

  return false;
}
