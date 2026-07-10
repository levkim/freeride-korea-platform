export type LocalizedText = {
  ko: string;
  en: string;
};

export type PublishStatus =
  | "draft"
  | "review"
  | "needs_revision"
  | "approved"
  | "published"
  | "rejected"
  | "hidden"
  | "archived";

export type ContentKind =
  | "news"
  | "video"
  | "event"
  | "program"
  | "tour"
  | "culture"
  | "marketplace"
  | "resource";

export type UpdateItem = {
  id: string;
  kind: ContentKind;
  title: LocalizedText;
  summary: LocalizedText;
  status: PublishStatus;
  date: string;
};
