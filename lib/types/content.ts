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
  | "resource"
  | "shop";

export type UpdateItem = {
  id: string;
  kind: ContentKind;
  title: LocalizedText;
  summary: LocalizedText;
  status: PublishStatus;
  date: string;
};

export type NewsVideoKind = "news" | "video";

export type NewsVideoItem = {
  id: string;
  kind: NewsVideoKind;
  title: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText;
  publishedAt: string;
  status: PublishStatus;
  imageUrl: string;
  youtubeUrl?: string;
  sourceUrl?: string;
  tags: string[];
};

export type CategoryContentKind =
  | "program"
  | "tour"
  | "culture"
  | "marketplace"
  | "resource"
  | "shop";

export type CategoryContentItem = {
  id: string;
  kind: CategoryContentKind;
  subtype: string;
  title: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText;
  status: PublishStatus;
  imageUrl: string;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: string;
  price?: string;
  instructor?: string;
  operator?: string;
  difficulty?: string;
  requiredGear?: string;
  insuranceNote?: string;
  cancellationPolicy?: string;
  tourGuide?: string;
  itinerary?: string;
  includedItems?: string;
  excludedItems?: string;
  requiredLevel?: string;
  athleteLevel?: string;
  targetEvents?: string;
  seasonGoal?: string;
  coachingFormat?: string;
  videoReview?: string;
  selectionCriteria?: string;
  cultureFormat?: string;
  communityScope?: string;
  ethicsNote?: string;
  relatedLink?: string;
  shopItemType?: string;
  memberRequirement?: string;
  fulfillmentMethod?: string;
  inventoryStatus?: string;
  benefitSummary?: string;
  applicationUrl?: string;
  policyNote?: string;
  tags: string[];
};
