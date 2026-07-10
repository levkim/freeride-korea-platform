import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { reviewQueueItems } from "@/content/seed/site-data";

export default function AdminPage() {
  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            Operations Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-black">FREERIDE KOREA Admin</h1>
          <p className="mt-3 text-zinc-600">
            Review Queue, 회원 승인, 콘텐츠 운영, 공식 소스 후보를 관리합니다.
          </p>
        </div>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          ["Review Queue", reviewQueueItems.length, "reviewing"],
          ["Pending Members", 1, "new"],
          ["Source Alerts", 1, "medium"],
          ["AI Drafts", 0, "draft"],
        ].map(([title, count, status]) => (
          <article key={title} className="border border-zinc-200 bg-white p-5">
            <p className="text-sm font-bold text-zinc-500">{title}</p>
            <p className="mt-3 text-4xl font-black">{count}</p>
            <div className="mt-4">
              <StatusBadge status={String(status)} />
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
