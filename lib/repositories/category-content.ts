import type { CategoryContentInput } from "@/lib/validation/category-content";
import type {
  CategoryContentItem,
  CategoryContentKind,
  LocalizedText,
  PublishStatus,
} from "@/lib/types/content";
import { categoryContentItems } from "@/content/seed/site-data";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { getWorkflowPolicyForKind } from "@/lib/repositories/workflow-policies";

type PersistCategoryDraftResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  contentId?: string;
  reviewItemId?: string;
  directPublished?: boolean;
};

type UpdateCategoryContentStatusResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  contentId?: string;
};

type CategoryContentRow = {
  id: string;
  kind: CategoryContentKind;
  status: PublishStatus;
  title_ko: string | null;
  title_en: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  body_ko: string | null;
  body_en: string | null;
  image_url: string | null;
  source_url: string | null;
  published_at: string | null;
  metadata: Record<string, unknown> | null;
};

const publicStatuses: PublishStatus[] = ["approved", "published"];
const educationSubtypes = new Set([
  "Avalanche Safety",
  "Freeriding",
  "Backcountry",
  "WFR",
]);
const directPublishKinds = new Set<CategoryContentKind>([
  "culture",
  "marketplace",
  "resource",
]);

function getInitialCategoryStatus(kind: CategoryContentKind): PublishStatus {
  return directPublishKinds.has(kind) ? "published" : "review";
}

function getInitialPublishedAt(kind: CategoryContentKind) {
  return directPublishKinds.has(kind) ? new Date().toISOString() : null;
}

function shouldCreateReviewQueueItem(kind: CategoryContentKind) {
  return !directPublishKinds.has(kind);
}

function localized(ko: string | null, en: string | null): LocalizedText {
  return {
    ko: ko || en || "제목 없음",
    en: en || ko || "Untitled",
  };
}

function rowToCategoryContentItem(row: CategoryContentRow): CategoryContentItem {
  const metadata = row.metadata || {};

  return {
    id: row.id,
    kind: row.kind,
    subtype: typeof metadata.subtype === "string" ? metadata.subtype : row.kind,
    title: localized(row.title_ko, row.title_en),
    summary: localized(row.summary_ko, row.summary_en),
    body: localized(row.body_ko, row.body_en),
    status: row.status,
    imageUrl: row.image_url || "/brand/hero-training.png",
    location: typeof metadata.location === "string" ? metadata.location : undefined,
    startsAt:
      typeof metadata.startsAt === "string"
        ? metadata.startsAt
        : row.published_at || undefined,
    endsAt: typeof metadata.endsAt === "string" ? metadata.endsAt : undefined,
    capacity: typeof metadata.capacity === "string" ? metadata.capacity : undefined,
    price: typeof metadata.price === "string" ? metadata.price : undefined,
    applicationUrl: row.source_url || "/contact-join",
    instructor:
      typeof metadata.instructor === "string" ? metadata.instructor : undefined,
    operator: typeof metadata.operator === "string" ? metadata.operator : undefined,
    difficulty:
      typeof metadata.difficulty === "string" ? metadata.difficulty : undefined,
    requiredGear:
      typeof metadata.requiredGear === "string"
        ? metadata.requiredGear
        : undefined,
    insuranceNote:
      typeof metadata.insuranceNote === "string"
        ? metadata.insuranceNote
        : undefined,
    cancellationPolicy:
      typeof metadata.cancellationPolicy === "string"
        ? metadata.cancellationPolicy
        : undefined,
    tourGuide:
      typeof metadata.tourGuide === "string" ? metadata.tourGuide : undefined,
    itinerary:
      typeof metadata.itinerary === "string" ? metadata.itinerary : undefined,
    includedItems:
      typeof metadata.includedItems === "string"
        ? metadata.includedItems
        : undefined,
    excludedItems:
      typeof metadata.excludedItems === "string"
        ? metadata.excludedItems
        : undefined,
    requiredLevel:
      typeof metadata.requiredLevel === "string"
        ? metadata.requiredLevel
        : undefined,
    athleteLevel:
      typeof metadata.athleteLevel === "string"
        ? metadata.athleteLevel
        : undefined,
    targetEvents:
      typeof metadata.targetEvents === "string"
        ? metadata.targetEvents
        : undefined,
    seasonGoal:
      typeof metadata.seasonGoal === "string" ? metadata.seasonGoal : undefined,
    coachingFormat:
      typeof metadata.coachingFormat === "string"
        ? metadata.coachingFormat
        : undefined,
    videoReview:
      typeof metadata.videoReview === "string"
        ? metadata.videoReview
        : undefined,
    selectionCriteria:
      typeof metadata.selectionCriteria === "string"
        ? metadata.selectionCriteria
        : undefined,
    cultureFormat:
      typeof metadata.cultureFormat === "string"
        ? metadata.cultureFormat
        : undefined,
    communityScope:
      typeof metadata.communityScope === "string"
        ? metadata.communityScope
        : undefined,
    ethicsNote:
      typeof metadata.ethicsNote === "string" ? metadata.ethicsNote : undefined,
    relatedLink:
      typeof metadata.relatedLink === "string" ? metadata.relatedLink : undefined,
    shopItemType:
      typeof metadata.shopItemType === "string"
        ? metadata.shopItemType
        : undefined,
    memberRequirement:
      typeof metadata.memberRequirement === "string"
        ? metadata.memberRequirement
        : undefined,
    fulfillmentMethod:
      typeof metadata.fulfillmentMethod === "string"
        ? metadata.fulfillmentMethod
        : undefined,
    inventoryStatus:
      typeof metadata.inventoryStatus === "string"
        ? metadata.inventoryStatus
        : undefined,
    benefitSummary:
      typeof metadata.benefitSummary === "string"
        ? metadata.benefitSummary
        : undefined,
    policyNote:
      typeof metadata.policyNote === "string"
        ? metadata.policyNote
        : "관리자 승인 후 게시된 카테고리 콘텐츠입니다. 세부 모집 조건은 운영진 확인을 기준으로 합니다.",
    tags: [row.kind],
  };
}

function getCategoryMetadata(input: CategoryContentInput) {
  const isAthleteProgram = input.kind === "program" && input.subtype === "Freeride";

  return {
    subtype: input.subtype,
    location: input.location || null,
    startsAt: input.startsAt || null,
    endsAt: input.endsAt || null,
    capacity: input.capacity || null,
    price: isAthleteProgram ? null : input.price || null,
    instructor: input.instructor || null,
    operator: input.operator || null,
    difficulty: input.difficulty || null,
    requiredGear: input.requiredGear || null,
    insuranceNote: input.insuranceNote || null,
    cancellationPolicy: input.cancellationPolicy || null,
    tourGuide: input.tourGuide || null,
    itinerary: input.itinerary || null,
    includedItems: input.includedItems || null,
    excludedItems: input.excludedItems || null,
    requiredLevel: input.requiredLevel || null,
    athleteLevel: input.athleteLevel || null,
    targetEvents: input.targetEvents || null,
    seasonGoal: input.seasonGoal || null,
    coachingFormat: input.coachingFormat || null,
    videoReview: input.videoReview || null,
    selectionCriteria: input.selectionCriteria || null,
    cultureFormat: input.cultureFormat || null,
    communityScope: input.communityScope || null,
    ethicsNote: input.ethicsNote || null,
    relatedLink: input.relatedLink || null,
    shopItemType: input.shopItemType || null,
    memberRequirement: input.memberRequirement || null,
    fulfillmentMethod: input.fulfillmentMethod || null,
    inventoryStatus: input.inventoryStatus || null,
    benefitSummary: input.benefitSummary || null,
    policyNote: input.policyNote || null,
  };
}

export async function updateCategoryDraft(
  id: string,
  input: CategoryContentInput,
): Promise<PersistCategoryDraftResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      contentId: id,
      directPublished: directPublishKinds.has(input.kind),
    };
  }

  const supabase = createSupabaseAdminClient();
  const workflowPolicy = await getEffectiveCategoryWorkflowPolicy(input);
  const status = workflowPolicy.defaultStatus;
  const { error: contentError } = await supabase
    .from("content_entries")
    .update({
      kind: input.kind,
      status,
      title_ko: input.title.ko,
      title_en: input.title.en,
      summary_ko: input.summary.ko,
      summary_en: input.summary.en,
      body_ko: input.body.ko,
      body_en: input.body.en,
      image_url: input.imageUrl || null,
      source_url: input.applicationUrl || null,
      published_at: getInitialPublishedAt(input.kind),
      metadata: getCategoryMetadata(input),
    })
    .eq("id", id);

  if (contentError) {
    throw new Error(contentError.message);
  }

  if (!workflowPolicy.requiresReview) {
    return {
      mode: "supabase",
      contentId: id,
      directPublished: true,
    };
  }

  const { data: reviewItem, error: reviewError } = await supabase
    .from("review_queue_items")
    .insert({
      subject_kind: "content",
      content_id: id,
      title: `${input.title.ko} 수정`,
      status: "review",
      risk: input.kind === "marketplace" ? "high" : "medium",
      required_author_role: workflowPolicy.authorMinimumRole,
      required_publish_role: workflowPolicy.publisherRole,
    })
    .select("id")
    .single();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  return {
    mode: "supabase",
    contentId: id,
    reviewItemId: reviewItem.id as string,
  };
}

export async function updateCategoryContentStatus(
  id: string,
  status: PublishStatus,
): Promise<UpdateCategoryContentStatusResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      contentId: id,
    };
  }

  const updatePayload: {
    status: PublishStatus;
    published_at?: string | null;
  } = { status };

  if (status === "published") {
    updatePayload.published_at = new Date().toISOString();
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("content_entries")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    contentId: id,
  };
}

export async function listCategoryContent(
  kind?: CategoryContentKind,
): Promise<CategoryContentItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return categoryContentItems.filter((item) => !kind || item.kind === kind);
  }

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, published_at, metadata",
    )
    .in("kind", ["program", "tour", "culture", "marketplace", "resource", "shop"])
    .in("status", publicStatuses)
    .order("published_at", { ascending: false });

  if (kind) {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return categoryContentItems.filter((item) => !kind || item.kind === kind);
  }

  return (data as CategoryContentRow[]).map(rowToCategoryContentItem);
}

export async function listAdminCategoryContent(): Promise<CategoryContentItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return categoryContentItems;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, published_at, metadata",
    )
    .in("kind", ["program", "tour", "culture", "marketplace", "resource", "shop"])
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return categoryContentItems;
  }

  return (data as CategoryContentRow[]).map(rowToCategoryContentItem);
}

export async function getCategoryContentById(
  id: string,
): Promise<CategoryContentItem | null> {
  const seededItem = categoryContentItems.find((item) => item.id === id) || null;

  if (!hasSupabaseAdminEnv()) {
    return seededItem;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, published_at, metadata",
    )
    .eq("id", id)
    .in("kind", ["program", "tour", "culture", "marketplace", "resource", "shop"])
    .in("status", publicStatuses)
    .maybeSingle();

  if (error || !data) {
    return seededItem;
  }

  return rowToCategoryContentItem(data as CategoryContentRow);
}

export async function getAdminCategoryContentById(
  id: string,
): Promise<CategoryContentItem | null> {
  const seededItem = categoryContentItems.find((item) => item.id === id) || null;

  if (!hasSupabaseAdminEnv()) {
    return seededItem;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, published_at, metadata",
    )
    .eq("id", id)
    .in("kind", ["program", "tour", "culture", "marketplace", "resource", "shop"])
    .maybeSingle();

  if (error || !data) {
    return seededItem;
  }

  return rowToCategoryContentItem(data as CategoryContentRow);
}

export async function persistCategoryDraft(
  input: CategoryContentInput,
): Promise<PersistCategoryDraftResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
      directPublished: directPublishKinds.has(input.kind),
    };
  }

  const supabase = createSupabaseAdminClient();
  const workflowPolicy = await getEffectiveCategoryWorkflowPolicy(input);
  const status = workflowPolicy.defaultStatus;
  const { data: content, error: contentError } = await supabase
    .from("content_entries")
    .insert({
      kind: input.kind,
      status,
      title_ko: input.title.ko,
      title_en: input.title.en,
      summary_ko: input.summary.ko,
      summary_en: input.summary.en,
      body_ko: input.body.ko,
      body_en: input.body.en,
      image_url: input.imageUrl || null,
      source_url: input.applicationUrl || null,
      published_at: getInitialPublishedAt(input.kind),
      metadata: getCategoryMetadata(input),
    })
    .select("id")
    .single();

  if (contentError) {
    throw new Error(contentError.message);
  }

  if (!workflowPolicy.requiresReview) {
    return {
      mode: "supabase",
      contentId: content.id as string,
      directPublished: true,
    };
  }

  const { data: reviewItem, error: reviewError } = await supabase
    .from("review_queue_items")
    .insert({
      subject_kind: "content",
      content_id: content.id,
      title: input.title.ko,
      status: "review",
      risk: input.kind === "marketplace" ? "high" : "medium",
      required_author_role: workflowPolicy.authorMinimumRole,
      required_publish_role: workflowPolicy.publisherRole,
    })
    .select("id")
    .single();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  return {
    mode: "supabase",
    contentId: content.id as string,
    reviewItemId: reviewItem.id as string,
  };
}

async function getEffectiveCategoryWorkflowPolicy(input: CategoryContentInput) {
  const policy = await getWorkflowPolicyForKind(input.kind);
  const fallback = {
    authorMinimumRole: getFallbackCategoryRequiredAuthorRole(input),
    publisherRole: "admin" as const,
    defaultStatus: getInitialCategoryStatus(input.kind),
    requiresReview: shouldCreateReviewQueueItem(input.kind),
  };

  if (!policy) {
    return fallback;
  }

  return {
    ...policy,
    authorMinimumRole:
      input.kind === "program" && educationSubtypes.has(input.subtype)
        ? "executive"
        : policy.authorMinimumRole,
  };
}

function getFallbackCategoryRequiredAuthorRole(input: CategoryContentInput) {
  if (input.kind === "culture" || input.kind === "marketplace") {
    return "general";
  }

  if (input.kind === "program" && educationSubtypes.has(input.subtype)) {
    return "executive";
  }

  return "regular";
}
