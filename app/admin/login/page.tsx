import Link from "next/link";

import { verifyAdminAccess } from "@/app/admin/login/actions";
import { Badge } from "@/components/ui/Badge";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    loggedOut?: string;
    next?: string;
  }>;
};

export const metadata = {
  title: "관리자 접근 | FREERIDE KOREA Admin",
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const isProtected = Boolean(process.env.ADMIN_ACCESS_KEY);
  const nextPath = params.next?.startsWith("/admin") ? params.next : "/admin";

  return (
    <main className="min-h-screen bg-zinc-100 p-5 md:p-8">
      <section className="mx-auto mt-10 max-w-xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-diffused)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              Admin Access
            </p>
            <h1 className="mt-3 text-4xl font-black">관리자 접근</h1>
          </div>
          <Badge tone={isProtected ? "green" : "amber"}>
            {isProtected ? "보호 설정됨" : "개발 모드"}
          </Badge>
        </div>

        <p className="mt-5 text-sm font-bold leading-6 text-zinc-600">
          Supabase Auth를 붙이기 전까지 사용하는 임시 관리자 보호 화면입니다.
          운영 배포 전에는 `ADMIN_ACCESS_KEY` 환경변수를 설정해 관리자 화면을
          외부에 열어두지 않도록 합니다.
        </p>

        {params.error === "invalid" ? (
          <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
            관리자 접근 키가 올바르지 않습니다.
          </div>
        ) : null}

        {params.loggedOut === "1" ? (
          <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-700">
            관리자 세션이 종료되었습니다.
          </div>
        ) : null}

        {isProtected ? (
          <form action={verifyAdminAccess} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="grid gap-2">
              <span className="text-sm font-black text-zinc-700">
                관리자 접근 키
              </span>
              <input
                name="accessKey"
                type="password"
                required
                autoComplete="current-password"
                className="border border-zinc-300 bg-white px-4 py-3 text-base font-bold outline-none focus:border-zinc-950"
              />
            </label>
            <button
              type="submit"
              className="bg-zinc-200 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-white"
            >
              관리자 화면으로 이동
            </button>
          </form>
        ) : (
          <div className="mt-6 border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-800">
              현재 `ADMIN_ACCESS_KEY`가 없어 관리자 화면이 열려 있습니다.
            </p>
            <Link
              href={nextPath}
              className="mt-4 inline-flex bg-zinc-200 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-white"
            >
              개발 모드로 계속 이동
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
