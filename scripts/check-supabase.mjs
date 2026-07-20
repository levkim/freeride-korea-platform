import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const tables = [
  "members",
  "content_entries",
  "event_entries",
  "content_links",
  "review_queue_items",
  "inquiry_entries",
  "review_events",
  "inquiry_events",
  "comments",
  "comment_events",
];

const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const ensureStorage = process.argv.includes("--ensure-storage");

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function tone(ok) {
  return ok ? "ok" : "check";
}

function serializeError(error) {
  if (!error) return undefined;

  const detail = {
    name: error.name,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
    statusCode: error.statusCode,
  };

  const compact = Object.fromEntries(
    Object.entries(detail).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(compact).length) {
    return compact;
  }

  try {
    return JSON.parse(JSON.stringify(error));
  } catch {
    return { message: String(error) };
  }
}

function getKeySummary(key) {
  if (key.startsWith("eyJ")) {
    try {
      const [, payload] = key.split(".");
      const decoded = JSON.parse(
        Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64")
          .toString("utf8"),
      );

      return {
        type: "jwt",
        role: decoded.role,
        issuer: decoded.iss,
      };
    } catch {
      return {
        type: "jwt",
        role: "unreadable",
      };
    }
  }

  return {
    type: key.includes("secret") ? "secret-key" : "unknown",
    role: "not-jwt",
  };
}

async function getRestProbe(table) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );

    const text = await response.text();

    return {
      table,
      status: response.status,
      ok: response.ok,
      body: text.slice(0, 500),
    };
  } catch (error) {
    return {
      table,
      ok: false,
      error: serializeError(error),
    };
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.log(
    JSON.stringify(
      {
        mode: "supabase-check",
        ready: false,
        missingEnv,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const tableResults = [];

for (const table of tables) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  tableResults.push({
    table,
    status: tone(!error),
    count: error ? null : count,
    error: serializeError(error),
  });
}

const bucketName =
  process.env.SUPABASE_STORAGE_CONTENT_BUCKET || "content-images";
let { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
let bucketExists = buckets?.some((bucket) => bucket.name === bucketName) || false;
let bucketCreated = false;

if (!bucketError && !bucketExists && ensureStorage) {
  const { error: createBucketError } = await supabase.storage.createBucket(
    bucketName,
    {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
  );

  if (createBucketError) {
    bucketError = createBucketError;
  } else {
    bucketCreated = true;
    const refreshed = await supabase.storage.listBuckets();
    buckets = refreshed.data;
    bucketError = refreshed.error;
    bucketExists =
      buckets?.some((bucket) => bucket.name === bucketName) || false;
  }
}

const seededMinimums = {
  members: 5,
  content_entries: 20,
  event_entries: 8,
};

const seedFailures = Object.entries(seededMinimums)
  .map(([table, minimum]) => {
    const result = tableResults.find((item) => item.table === table);
    return {
      table,
      minimum,
      count: result?.count ?? 0,
      ok: (result?.count ?? 0) >= minimum,
    };
  })
  .filter((item) => !item.ok);

const failures = [
  ...tableResults.filter((result) => result.status !== "ok"),
  ...seedFailures,
];

if (bucketError || !bucketExists) {
  failures.push({
    bucket: bucketName,
    error: bucketError?.message || "Storage bucket is missing.",
  });
}

const restProbe = failures.length ? await getRestProbe("content_entries") : null;

const report = {
  mode: "supabase-check",
  ready: failures.length === 0,
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: getKeySummary(process.env.SUPABASE_SERVICE_ROLE_KEY),
  restProbe,
  tables: tableResults,
  seedMinimums: seededMinimums,
  storage: {
    bucket: bucketName,
    status: tone(!bucketError && bucketExists),
    exists: bucketExists,
    created: bucketCreated,
    error: bucketError?.message,
  },
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (!report.ready) {
  process.exitCode = 1;
}
