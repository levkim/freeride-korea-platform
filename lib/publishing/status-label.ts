import type { PublishStatus } from "@/lib/types/content";

export const publishStatusLabels: Record<PublishStatus, string> = {
  draft: "Draft",
  review: "Review",
  needs_revision: "Needs Revision",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
  hidden: "Hidden",
  archived: "Archived",
};
