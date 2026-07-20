import type { ContentKind, PublishStatus } from "./content";
import type { MemberType } from "./member";

export type AdminRole = "admin";

export type AuthorRole = MemberType | AdminRole;

export type PublicationActorRole = "executive" | AdminRole;

export type PolicyEditorRole = "executive" | AdminRole;

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
  policyEditorRole: PolicyEditorRole;
  defaultStatus: PublishStatus;
  requiresReview: boolean;
  notes: string;
};
