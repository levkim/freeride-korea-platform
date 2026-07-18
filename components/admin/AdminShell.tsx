import Link from "next/link";

import { signOutAdminAccess } from "@/app/admin/actions";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

const adminNav = [
  ["대시보드", "/admin"],
  ["DB 연결 준비", "/admin/data-setup"],
  ["배포 점검", "/admin/deployment"],
  ["뉴스 / 비디오", "/admin/news-video"],
  ["대회 / 이벤트", "/admin/events"],
  ["카테고리 운영", "/admin/site-categories"],
  ["CMS 게시 규칙", "/admin/cms-workflow"],
  ["검토 대기열", "/admin/review-queue"],
  ["댓글 관리", "/admin/comments"],
  ["회원 관리", "/admin/members"],
  ["문의 / 참여", "/admin/contact-join"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const supabaseStatus = getSupabaseAdminStatus();
  const isSupabase = supabaseStatus.isConfigured;
  const hasAdminAccessKey = Boolean(process.env.ADMIN_ACCESS_KEY);

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-zinc-200 bg-[var(--color-fk-black)] p-5 text-white">
          <div>
            <p className="text-lg font-black">FK 관리자</p>
            <p className="mt-1 text-xs font-bold text-zinc-400">
              FREERIDE KOREA 운영 콘솔
            </p>
          </div>

          <nav className="mt-8 grid gap-2">
            {adminNav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 border border-white/10 bg-white/5 p-4 lg:mt-auto">
            <p className="text-xs font-black uppercase text-zinc-400">
              데이터 모드
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  isSupabase ? "bg-emerald-400" : "bg-amber-300",
                ].join(" ")}
              />
              <p className="font-black">
                {isSupabase ? "Supabase" : "Mock / seed"}
              </p>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-zinc-400">
              {isSupabase
                ? "환경변수가 설정되어 실제 DB 저장 모드로 전환할 수 있습니다."
                : "Supabase 프로젝트 연결 전까지는 검증 모드로 동작합니다."}
            </p>
            <Link
              href="/admin/data-setup"
              className="mt-4 inline-flex border border-white/15 bg-zinc-200 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-white"
            >
              DB 점검 보기
            </Link>
          </div>

          <div className="mt-3 border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-black uppercase text-zinc-400">
              관리자 보호
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  hasAdminAccessKey ? "bg-emerald-400" : "bg-amber-300",
                ].join(" ")}
              />
              <p className="font-black">
                {hasAdminAccessKey ? "접근 키 설정됨" : "개발 모드"}
              </p>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-zinc-400">
              {hasAdminAccessKey
                ? "관리자 화면 접근 시 키 확인을 거칩니다."
                : "운영 배포 전 ADMIN_ACCESS_KEY를 설정해야 합니다."}
            </p>
            {hasAdminAccessKey ? (
              <form action={signOutAdminAccess} className="mt-4">
                <button
                  type="submit"
                  className="border border-white/15 bg-zinc-200 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-white"
                >
                  로그아웃
                </button>
              </form>
            ) : null}
          </div>
        </aside>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
