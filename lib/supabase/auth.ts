import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseAuthConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getMissingSupabaseAuthEnv() {
  const config = getSupabaseAuthConfig();
  const missing: string[] = [];

  if (!config.url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!config.anonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function hasSupabaseAuthEnv() {
  return getMissingSupabaseAuthEnv().length === 0;
}

export async function createSupabaseAuthServerClient() {
  const config = getSupabaseAuthConfig();

  if (!config.url || !config.anonKey) {
    throw new Error(
      `Missing Supabase auth env: ${getMissingSupabaseAuthEnv().join(", ")}`,
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components can read auth cookies but cannot always write them.
        }
      },
    },
  });
}
