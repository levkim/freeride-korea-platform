import type { ContentKind, PublishStatus } from "./content";
import type { MemberType } from "./member";

export type AdminRole = "admin";

export type AuthorRole = MemberType | AdminRole;

export type PublicationActorRole = AdminRole;

export type WorkflowTransition = {
  from: PublishStatus;
  to: PublishStatus;
  actor: AuthorRole;
  note: string;
};

export type ContentWorkflowPolicy = {
  kind: ContentKind;
  label: string;
  authorMinimumRole: MemberType;
  publisherRole: PublicationActorRole;
  defaultStatus: PublishStatus;
  requiresReview: boolean;
  notes: string;
};
