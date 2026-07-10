export type MemberType =
  | "general"
  | "regular"
  | "executive"
  | "athlete"
  | "supporting";

export type MemberStatus = "active" | "reviewing" | "suspended";

export type Member = {
  id: string;
  name: string;
  email: string;
  memberType: MemberType;
  status: MemberStatus;
  joinedAt: string;
};
