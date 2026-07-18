import { newsVideoItems } from "@/content/seed/site-data";
import type { NewsVideoInput } from "@/lib/validation/news-video";
import type { NewsVideoItem, PublishStatus } from "@/lib/types/content";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type PersistNewsVideoDraftResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  contentId?: string;
  reviewItemId?: string;
};

type NewsVideoRow = {
  id: string;
  kind: "news" | "video";
  status: PublishStatus;
  title_ko: string | null;
  title_en: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  body_ko: string | null;
  body_en: string | null;
  image_url: string | null;
  source_url: string | null;
  youtube_url: string | null;
  published_at: string | null;
  metadata: Record<string, unknown> | null;
};

const publicStatuses: PublishStatus[] = ["approved", "published"];

function rowToNewsVideoItem(row: NewsVideoRow): NewsVideoItem {
  const metadata = row.metadata || {};

  return {
    id: row.id,
    kind: row.kind,
    title: {
      ko: row.title_ko || row.title_en || "제목 없음",
      en: row.title_en || row.title_ko || "Untitled",
    },
    summary: {
      ko: row.summary_ko || row.summary_en || "",
      en: row.summary_en || row.summary_ko || "",
    },
    body: {
      ko: row.body_ko || row.body_en || "",
      en: row.body_en || row.body_ko || "",
    },
    publishedAt: row.published_at?.slice(0, 10) || "",
    status: row.status,
    imageUrl: row.image_url || "/brand/hero-training.png",
    youtubeUrl: row.youtube_url || undefined,
    sourceUrl: row.source_url || undefined,
    tags: Array.isArray(metadata.tags)
      ? metadata.tags.filter((tag): tag is string => typeof tag === "string")
      : [row.kind],
  };
}

export async function listNewsVideoItems(): Promise<NewsVideoItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return newsVideoItems.filter((item) => publicStatuses.includes(item.status));
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, youtube_url, published_at, metadata",
    )
    .in("kind", ["news", "video"])
    .in("status", publicStatuses)
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return newsVideoItems.filter((item) => publicStatuses.includes(item.status));
  }

  return (data as NewsVideoRow[]).map(rowToNewsVideoItem);
}

export async function listAdminNewsVideoItems(): Promise<NewsVideoItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return newsVideoItems;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, youtube_url, published_at, metadata",
    )
    .in("kind", ["news", "video"])
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return newsVideoItems;
  }

  return (data as NewsVideoRow[]).map(rowToNewsVideoItem);
}

export async function getNewsVideoItemById(
  id: string,
): Promise<NewsVideoItem | null> {
  const seededItem =
    newsVideoItems.find(
      (item) => item.id === id && publicStatuses.includes(item.status),
    ) ?? null;

  if (!hasSupabaseAdminEnv()) {
    return seededItem;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select(
      "id, kind, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url, source_url, youtube_url, published_at, metadata",
    )
    .eq("id", id)
    .in("kind", ["news", "video"])
    .in("status", publicStatuses)
    .maybeSingle();

  if (error || !data) {
    return seededItem;
  }

  return rowToNewsVideoItem(data as NewsVideoRow);
}

export async function persistNewsVideoDraft(
  input: NewsVideoInput,
): Promise<PersistNewsVideoDraftResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: content, error: contentError } = await supabase
    .from("content_entries")
    .insert({
      kind: input.kind,
      status: "review",
      title_ko: input.title.ko,
      title_en: input.title.en,
      summary_ko: input.summary.ko,
      summary_en: input.summary.en,
      body_ko: input.body.ko,
      body_en: input.body.en,
      image_url: input.imageUrl,
      source_url: input.sourceUrl || null,
      youtube_url: input.youtubeUrl || null,
      published_at: input.publishedAt,
      metadata: {
        tags: input.tags,
      },
    })
    .select("id")
    .single();

  if (contentError) {
    throw new Error(contentError.message);
  }

  const { data: reviewItem, error: reviewError } = await supabase
    .from("review_queue_items")
    .insert({
      subject_kind: "content",
      content_id: content.id,
      title: input.title.ko,
      status: "review",
      risk: input.kind === "video" ? "medium" : "low",
      required_author_role: "executive",
      required_publish_role: "admin",
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
