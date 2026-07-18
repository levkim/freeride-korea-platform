import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

export const metadata = {
  title: "상태 확인 | FREERIDE KOREA",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function HealthPage() {
  const supabaseStatus = getSupabaseAdminStatus();
  const generatedAt = new Date().toISOString();

  const rows = [
    ["서비스", "freeride-korea-webapp"],
    ["사이트 URL", getSiteUrl()],
    ["데이터 모드", supabaseStatus.mode],
    ["Supabase 설정", supabaseStatus.isConfigured ? "설정됨" : "미설정"],
    ["응답 시간", generatedAt],
  ];

  return (
    <main className="min-h-screen bg-zinc-100 p-5 md:p-8">
      <section className="mx-auto max-w-3xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              Health Check
            </p>
            <h1 className="mt-3 text-4xl font-black">상태 확인</h1>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-zinc-600">
              사람이 확인하기 위한 상태 페이지입니다. 외부 모니터링 도구는
              JSON endpoint인 <code className="font-black">/healthz</code>를
              사용합니다.
            </p>
          </div>
          <Badge tone="green">정상</Badge>
        </div>

        <div className="mt-6 grid gap-3">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[160px_1fr]"
            >
              <p className="text-sm font-black text-zinc-500">{label}</p>
              <p className="break-all text-sm font-black text-zinc-950">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/healthz"
            className="bg-zinc-200 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-white"
          >
            JSON 보기
          </Link>
          <Link
            href="/"
            className="border border-zinc-300 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-white"
          >
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}
