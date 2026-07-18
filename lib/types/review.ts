import type { ContentKind, PublishStatus } from "./content";
import type { MemberType } from "./member";

export type ReviewSubjectKind =
  | "content"
  | "member-upgrade"
  | "source-alert"
  | "ai-draft"
  | "inquiry";

export type ReviewActionKind =
  | "submit"
  | "approve"
  | "request_revision"
  | "reject"
  | "publish"
  | "hide"
  | "archive"
  | "assign"
  | "comment";

export type ReviewQueueItem = {
  id: string;
  kind: ContentKind | Exclude<ReviewSubjectKind, "content">;
  title: string;
  submittedBy: string;
  status: PublishStatus | "new" | "reviewing";
  requiredAuthorRole: MemberType | "admin";
  requiredPublishRole: "admin";
  risk: "low" | "medium" | "high";
  createdAt: string;
};

export type ReviewEventItem = {
  id: string;
  action: ReviewActionKind;
  fromStatus?: PublishStatus | null;
  toStatus?: PublishStatus | null;
  actor: string;
  note: string;
  createdAt: string;
};
