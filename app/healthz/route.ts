import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export function GET() {
  const supabaseStatus = getSupabaseAdminStatus();

  return NextResponse.json(
    {
      ok: true,
      service: "freeride-korea-webapp",
      siteUrl: getSiteUrl(),
      dataMode: supabaseStatus.mode,
      supabaseConfigured: supabaseStatus.isConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
