import Link from "next/link";

const adminNav = [
  ["대시보드", "/admin"],
  ["DB 연결 준비", "/admin/data-setup"],
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
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-zinc-200 bg-[var(--color-fk-black)] p-5 text-white">
          <p className="text-lg font-black">FK 관리자</p>
          <nav className="mt-8 grid gap-2">
            {adminNav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
