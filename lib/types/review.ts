import type { ContentKind, PublishStatus } from "./content";
import type { MemberType } from "./member";

export type ReviewQueueItem = {
  id: string;
  kind: ContentKind | "member-upgrade" | "source-alert" | "ai-draft";
  title: string;
  submittedBy: string;
  status: PublishStatus | "new" | "reviewing";
  requiredAuthorRole: MemberType | "admin";
  requiredPublishRole: "admin";
  risk: "low" | "medium" | "high";
  createdAt: string;
};
