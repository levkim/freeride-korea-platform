import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import ts from "typescript";

const projectRoot = process.cwd();
const seedSourcePath = path.join(projectRoot, "content", "seed", "site-data.ts");
const outputPath = path.join(
  projectRoot,
  "docs",
  "database",
  "supabase-seed-v1.sql",
);

const allowedStatuses = new Set([
  "draft",
  "review",
  "needs_revision",
  "approved",
  "published",
  "rejected",
  "hidden",
  "archived",
]);

let uuidCounter = 1;
const uuidBySeedId = new Map();

function getSeedModule() {
  const source = fs.readFileSync(seedSourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  }).outputText;

  const moduleExports = {};
  const context = {
    exports: moduleExports,
    module: { exports: moduleExports },
    require() {
      throw new Error("The seed file should not require runtime modules.");
    },
  };

  vm.runInNewContext(output, context, {
    filename: seedSourcePath,
  });

  return context.module.exports;
}

function getUuid(seedId) {
  if (!uuidBySeedId.has(seedId)) {
    uuidBySeedId.set(
      seedId,
      `00000000-0000-4000-8000-${String(uuidCounter).padStart(12, "0")}`,
    );
    uuidCounter += 1;
  }

  return uuidBySeedId.get(seedId);
}

function sqlString(value) {
  if (value === null || value === undefined || value === "") {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function localizedText(value, fallback = "") {
  if (typeof value === "string") {
    return {
      ko: value,
      en: value,
    };
  }

  return {
    ko: value?.ko || value?.en || fallback,
    en: value?.en || value?.ko || fallback,
  };
}

function normalizeStatus(status) {
  return allowedStatuses.has(status) ? status : "draft";
}

function publishedAtFor(item) {
  if (item.status !== "published") {
    return null;
  }

  for (const candidate of [item.publishedAt, item.startsAt]) {
    if (candidate && !Number.isNaN(Date.parse(candidate))) {
      return candidate;
    }
  }

  return "2026-07-20T00:00:00.000Z";
}

function compactMetadata(item, extra = {}) {
  const excluded = new Set([
    "id",
    "kind",
    "title",
    "name",
    "summary",
    "body",
    "description",
    "status",
    "imageUrl",
    "sourceUrl",
    "youtubeUrl",
    "publishedAt",
    "officialLink",
    "registrationLink",
    "replayOrResultsLink",
    "relatedLinks",
  ]);

  const metadata = {
    seedId: item.id,
    ...extra,
  };

  for (const [key, value] of Object.entries(item)) {
    if (!excluded.has(key) && value !== undefined) {
      metadata[key] = value;
    }
  }

  return metadata;
}

function contentEntrySql(item, kind, options = {}) {
  const id = getUuid(item.id);
  const title = localizedText(options.title || item.title || item.name, item.id);
  const summary = localizedText(item.summary, "");
  const body = localizedText(options.body || item.body || item.description, "");
  const status = normalizeStatus(item.status || "published");

  return `(${[
    sqlString(id),
    sqlString(kind),
    sqlString(status),
    sqlString(title.ko),
    sqlString(title.en),
    sqlString(summary.ko),
    sqlString(summary.en),
    sqlString(body.ko),
    sqlString(body.en),
    sqlString(item.imageUrl),
    sqlString(item.sourceUrl || item.officialLink || item.applicationUrl),
    sqlString(item.youtubeUrl),
    sqlJson(compactMetadata(item, options.metadata)),
    sqlString(publishedAtFor({ ...item, status })),
  ].join(", ")})`;
}

function memberSql(member) {
  return `(${[
    sqlString(getUuid(member.id)),
    sqlString(member.email),
    sqlString(localizedText(member.name).ko),
    sqlString(member.memberType),
    sqlString(member.status),
    sqlString(member.joinedAt),
  ].join(", ")})`;
}

function eventSql(event) {
  return `(${[
    sqlString(getUuid(event.id)),
    sqlString(event.series),
    sqlString(event.officiality),
    sqlString(event.season),
    sqlString(event.country),
    sqlString(event.location),
    sqlString(event.resort),
    sqlString(event.startsAt),
    sqlString(event.endsAt),
    sqlString(event.timezone),
    event.cancelled ? "true" : "false",
    sqlString(event.officialLink),
    sqlString(event.registrationLink),
    sqlString(event.replayOrResultsLink),
  ].join(", ")})`;
}

function contentLinkSql(event, link, index) {
  return `(${[
    sqlString(getUuid(event.id)),
    sqlString(link.label),
    sqlString(link.url),
    String(index),
  ].join(", ")})`;
}

function buildSeedSql() {
  const seed = getSeedModule();
  const contentRows = [];
  const eventRows = [];
  const linkRows = [];

  const members = seed.mockMembers || [];
  const newsVideoItems = seed.newsVideoItems || [];
  const events = seed.upcomingEvents || [];
  const categoryItems = seed.categoryContentItems || [];

  for (const item of newsVideoItems) {
    contentRows.push(
      contentEntrySql(item, item.kind, {
        metadata: {
          tags: item.tags || [],
        },
      }),
    );
  }

  for (const event of events) {
    contentRows.push(contentEntrySql(event, "event"));
    eventRows.push(eventSql(event));

    for (const [index, link] of (event.relatedLinks || []).entries()) {
      linkRows.push(contentLinkSql(event, link, index));
    }
  }

  for (const item of categoryItems) {
    contentRows.push(
      contentEntrySql(item, item.kind, {
        metadata: {
          subtype: item.subtype,
          tags: item.tags || [],
        },
      }),
    );
  }

  const seededContentIds = [
    ...newsVideoItems.map((item) => getUuid(item.id)),
    ...events.map((item) => getUuid(item.id)),
    ...categoryItems.map((item) => getUuid(item.id)),
  ];

  return `-- FREERIDE KOREA Supabase seed v1
-- Generated from content/seed/site-data.ts.
-- Run after docs/database/supabase-schema-v1.sql and docs/database/supabase-rls-hotfix-v1.sql.

begin;

insert into members (
  id,
  email,
  name,
  member_type,
  status,
  joined_at
) values
${members.map(memberSql).join(",\n")}
on conflict (email) do update set
  name = excluded.name,
  member_type = excluded.member_type,
  status = excluded.status,
  updated_at = now();

insert into content_entries (
  id,
  kind,
  status,
  title_ko,
  title_en,
  summary_ko,
  summary_en,
  body_ko,
  body_en,
  image_url,
  source_url,
  youtube_url,
  metadata,
  published_at
) values
${contentRows.join(",\n")}
on conflict (id) do update set
  kind = excluded.kind,
  status = excluded.status,
  title_ko = excluded.title_ko,
  title_en = excluded.title_en,
  summary_ko = excluded.summary_ko,
  summary_en = excluded.summary_en,
  body_ko = excluded.body_ko,
  body_en = excluded.body_en,
  image_url = excluded.image_url,
  source_url = excluded.source_url,
  youtube_url = excluded.youtube_url,
  metadata = excluded.metadata,
  published_at = excluded.published_at,
  updated_at = now();

insert into event_entries (
  content_id,
  series,
  officiality,
  season,
  country,
  location,
  resort,
  starts_at,
  ends_at,
  timezone,
  cancelled,
  official_link,
  registration_link,
  replay_or_results_link
) values
${eventRows.join(",\n")}
on conflict (content_id) do update set
  series = excluded.series,
  officiality = excluded.officiality,
  season = excluded.season,
  country = excluded.country,
  location = excluded.location,
  resort = excluded.resort,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  timezone = excluded.timezone,
  cancelled = excluded.cancelled,
  official_link = excluded.official_link,
  registration_link = excluded.registration_link,
  replay_or_results_link = excluded.replay_or_results_link;

delete from content_links
where content_id in (${seededContentIds.map(sqlString).join(", ")});

${
  linkRows.length
    ? `insert into content_links (
  content_id,
  label,
  url,
  sort_order
) values
${linkRows.join(",\n")};`
    : "-- No seeded content links."
}

commit;
`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buildSeedSql(), "utf8");
console.log(`Wrote ${path.relative(projectRoot, outputPath)}`);
