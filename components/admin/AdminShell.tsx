import Link from "next/link";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Review Queue", "/admin/review-queue"],
  ["Members", "/admin/members"],
  ["Contact / Join", "/admin/contact-join"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-zinc-200 bg-[var(--color-fk-black)] p-5 text-white">
          <p className="text-lg font-black">FK Admin</p>
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
