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

export type MemberProfile = {
  realName: string;
  nickname: string;
  phone: string;
  location: string;
  ridingLevel: string;
  preferredDiscipline: string;
  bio: string;
};

export type MemberContentActivity = {
  id: string;
  kind: string;
  status: string;
  title: string;
  createdAt: string;
};
