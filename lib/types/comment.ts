import type { MemberType } from "@/lib/types/member";

export type CommentTargetType = "news-video" | "event" | "category-content";

export type CommentStatus = "visible" | "hidden" | "reported" | "deleted";

export type CommentItem = {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  targetTitle: string;
  authorName: string;
  authorType: MemberType;
  body: string;
  status: CommentStatus;
  createdAt: string;
  reportCount: number;
  pinned?: boolean;
};

export type CommentThreadSummary = {
  targetType: CommentTargetType;
  targetId: string;
  targetTitle: string;
  totalCount: number;
  visibleCount: number;
  reportedCount: number;
  latestAt: string;
};
