import { createClient } from "@supabase/supabase-js";

type SupabaseAdminConfig = {
  url?: string;
  serviceRoleKey?: string;
  contentImageBucket: string;
};

export function getSupabaseAdminConfig(): SupabaseAdminConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    contentImageBucket:
      process.env.SUPABASE_STORAGE_CONTENT_BUCKET || "content-images",
  };
}

export function getMissingSupabaseAdminEnv() {
  const config = getSupabaseAdminConfig();
  const missing: string[] = [];

  if (!config.url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!config.serviceRoleKey) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return missing;
}

export function hasSupabaseAdminEnv() {
  return getMissingSupabaseAdminEnv().length === 0;
}

export function getSupabaseAdminStatus() {
  const missingEnv = getMissingSupabaseAdminEnv();

  return {
    mode: missingEnv.length ? "mock" : "supabase",
    missingEnv,
    isConfigured: missingEnv.length === 0,
  } as const;
}

export function createSupabaseAdminClient() {
  const config = getSupabaseAdminConfig();

  if (!config.url || !config.serviceRoleKey) {
    throw new Error(
      `Missing Supabase admin env: ${getMissingSupabaseAdminEnv().join(", ")}`,
    );
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
