import { upcomingEvents } from "@/content/seed/site-data";
import type { PublishStatus } from "@/lib/types/content";
import type { EventInput } from "@/lib/validation/event";
import type { EventItem } from "@/lib/types/event";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type PersistEventDraftResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  contentId?: string;
  reviewItemId?: string;
};

type EventEntryRow = {
  content_id: string;
  series: EventItem["series"];
  officiality: EventItem["officiality"];
  season: string;
  country: string;
  location: string;
  resort: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  cancelled: boolean;
  official_link: string | null;
  registration_link: string | null;
  replay_or_results_link: string | null;
  content_entries:
    | {
        id: string;
        status: PublishStatus;
        title_ko: string | null;
        title_en: string | null;
        summary_ko: string | null;
        summary_en: string | null;
        body_ko: string | null;
        body_en: string | null;
        image_url: string | null;
      }
    | {
        id: string;
        status: PublishStatus;
        title_ko: string | null;
        title_en: string | null;
        summary_ko: string | null;
        summary_en: string | null;
        body_ko: string | null;
        body_en: string | null;
        image_url: string | null;
      }[];
};

type ContentLinkRow = {
  content_id: string;
  label: string;
  url: string;
};

const publicStatuses: PublishStatus[] = ["approved", "published"];

function getContent(row: EventEntryRow) {
  return Array.isArray(row.content_entries)
    ? row.content_entries[0]
    : row.content_entries;
}

function rowToEventItem(
  row: EventEntryRow,
  linksByContentId: Map<string, ContentLinkRow[]>,
): EventItem {
  const content = getContent(row);

  return {
    id: row.content_id,
    name: {
      ko: content?.title_ko || content?.title_en || "제목 없음",
      en: content?.title_en || content?.title_ko || "Untitled",
    },
    series: row.series,
    officiality: row.officiality,
    season: row.season,
    country: row.country,
    location: row.location,
    resort: row.resort || undefined,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    cancelled: row.cancelled,
    imageUrl: content?.image_url || "/brand/hero-event.png",
    summary: {
      ko: content?.summary_ko || content?.summary_en || "",
      en: content?.summary_en || content?.summary_ko || "",
    },
    description: {
      ko: content?.body_ko || content?.body_en || "",
      en: content?.body_en || content?.body_ko || "",
    },
    officialLink: row.official_link || undefined,
    registrationLink: row.registration_link || undefined,
    replayOrResultsLink: row.replay_or_results_link || undefined,
    relatedLinks: (linksByContentId.get(row.content_id) || []).map((link) => ({
      label: link.label,
      url: link.url,
    })),
  };
}

async function getRelatedLinks(contentIds: string[]) {
  if (!contentIds.length) {
    return new Map<string, ContentLinkRow[]>();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("content_links")
    .select("content_id, label, url")
    .in("content_id", contentIds)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return new Map<string, ContentLinkRow[]>();
  }

  return (data as ContentLinkRow[]).reduce((map, link) => {
    const links = map.get(link.content_id) || [];
    links.push(link);
    map.set(link.content_id, links);

    return map;
  }, new Map<string, ContentLinkRow[]>());
}

export async function listEvents(): Promise<EventItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return upcomingEvents;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("event_entries")
    .select(
      "content_id, series, officiality, season, country, location, resort, starts_at, ends_at, timezone, cancelled, official_link, registration_link, replay_or_results_link, content_entries!inner(id, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url)",
    )
    .in("content_entries.status", publicStatuses)
    .order("starts_at", { ascending: true });

  if (error || !data?.length) {
    return upcomingEvents;
  }

  const rows = data as EventEntryRow[];
  const linksByContentId = await getRelatedLinks(rows.map((row) => row.content_id));

  return rows.map((row) => rowToEventItem(row, linksByContentId));
}

export async function listAdminEvents(): Promise<EventItem[]> {
  if (!hasSupabaseAdminEnv()) {
    return upcomingEvents;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("event_entries")
    .select(
      "content_id, series, officiality, season, country, location, resort, starts_at, ends_at, timezone, cancelled, official_link, registration_link, replay_or_results_link, content_entries!inner(id, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url)",
    )
    .order("starts_at", { ascending: true });

  if (error || !data?.length) {
    return upcomingEvents;
  }

  const rows = data as EventEntryRow[];
  const linksByContentId = await getRelatedLinks(rows.map((row) => row.content_id));

  return rows.map((row) => rowToEventItem(row, linksByContentId));
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const seededEvent = upcomingEvents.find((event) => event.id === id) || null;

  if (!hasSupabaseAdminEnv()) {
    return seededEvent;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("event_entries")
    .select(
      "content_id, series, officiality, season, country, location, resort, starts_at, ends_at, timezone, cancelled, official_link, registration_link, replay_or_results_link, content_entries!inner(id, status, title_ko, title_en, summary_ko, summary_en, body_ko, body_en, image_url)",
    )
    .eq("content_id", id)
    .in("content_entries.status", publicStatuses)
    .maybeSingle();

  if (error || !data) {
    return seededEvent;
  }

  const linksByContentId = await getRelatedLinks([id]);

  return rowToEventItem(data as EventEntryRow, linksByContentId);
}

export async function persistEventDraft(
  input: EventInput,
): Promise<PersistEventDraftResult> {
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
      kind: "event",
      status: "review",
      title_ko: input.name.ko,
      title_en: input.name.en,
      summary_ko: input.summary.ko,
      summary_en: input.summary.en,
      body_ko: input.description.ko,
      body_en: input.description.en,
      image_url: input.imageUrl || "/brand/hero-event.png",
      source_url: input.officialLink || null,
      metadata: {
        series: input.series,
        season: input.season,
      },
    })
    .select("id")
    .single();

  if (contentError) {
    throw new Error(contentError.message);
  }

  const { error: eventError } = await supabase.from("event_entries").insert({
    content_id: content.id,
    series: input.series,
    officiality: input.officiality,
    season: input.season,
    country: input.country,
    location: input.location,
    resort: input.resort || null,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    timezone: input.timezone,
    cancelled: input.cancelled,
    official_link: input.officialLink || null,
    registration_link: input.registrationLink || null,
    replay_or_results_link: input.replayOrResultsLink || null,
  });

  if (eventError) {
    throw new Error(eventError.message);
  }

  if (input.relatedLinks.length) {
    const { error: linkError } = await supabase.from("content_links").insert(
      input.relatedLinks.map((link, index) => ({
        content_id: content.id,
        label: link.label,
        url: link.url,
        sort_order: index,
      })),
    );

    if (linkError) {
      throw new Error(linkError.message);
    }
  }

  const { data: reviewItem, error: reviewError } = await supabase
    .from("review_queue_items")
    .insert({
      subject_kind: "content",
      content_id: content.id,
      title: input.name.ko,
      status: "review",
      risk: input.cancelled ? "high" : "medium",
      required_author_role: "executive",
      required_publish_role: "admin",
      source_url: input.officialLink || null,
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
