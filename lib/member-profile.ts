import type { User } from "@supabase/supabase-js";
import type { Member, MemberProfile } from "@/lib/types/member";

function readMetadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

export function getMemberProfileFromUser(
  user: User | null | undefined,
  member: Member | null,
): MemberProfile {
  const metadata = user?.user_metadata;

  return {
    realName: readMetadataString(metadata, "name"),
    nickname:
      readMetadataString(metadata, "nickname") ||
      member?.name ||
      user?.email ||
      "",
    phone: readMetadataString(metadata, "phone"),
    location: readMetadataString(metadata, "location"),
    ridingLevel: readMetadataString(metadata, "ridingLevel"),
    preferredDiscipline: readMetadataString(metadata, "preferredDiscipline"),
    bio: readMetadataString(metadata, "bio"),
  };
}
