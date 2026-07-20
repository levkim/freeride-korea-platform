import fs from "node:fs";
import path from "node:path";

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
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

loadEnvFile(".env.local");
loadEnvFile(".env");

const checks = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: true,
    validate(value) {
      if (!value) return "missing";
      if (value.includes("localhost")) return "localhost-url";
      try {
        const url = new URL(value);
        return url.protocol === "https:" ? "ok" : "not-https";
      } catch {
        return "invalid-url";
      }
    },
  },
  {
    key: "ADMIN_ACCESS_KEY",
    required: true,
    validate(value) {
      if (!value) return "missing";
      return value.length >= 16 ? "ok" : "too-short";
    },
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    validate(value) {
      if (!value) return "missing";
      try {
        const url = new URL(value);
        return url.protocol === "https:" ? "ok" : "not-https";
      } catch {
        return "invalid-url";
      }
    },
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    required: true,
    validate(value) {
      if (!value) return "missing";
      return value.length >= 32 ? "ok" : "too-short";
    },
  },
  {
    key: "SUPABASE_STORAGE_CONTENT_BUCKET",
    required: false,
    validate(value) {
      if (!value) return "default-content-images";
      return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) ? "ok" : "invalid-bucket-name";
    },
  },
];

const blockingStatuses = new Set([
  "missing",
  "localhost-url",
  "not-https",
  "invalid-url",
  "too-short",
  "invalid-bucket-name",
]);

const results = checks.map((check) => {
  const value = process.env[check.key] || "";
  const status = check.validate(value);
  const isReady = !blockingStatuses.has(status);

  return {
    key: check.key,
    required: check.required,
    status,
    ready: isReady,
  };
});

const failures = results.filter((result) => result.required && !result.ready);
const warnings = results.filter((result) => !result.required && !result.ready);

console.log(
  JSON.stringify(
    {
      mode: "deployment-environment",
      ready: failures.length === 0,
      results,
      failures,
      warnings,
    },
    null,
    2,
  ),
);

if (failures.length > 0) {
  process.exitCode = 1;
}
