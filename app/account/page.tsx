import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { mockMembers } from "@/content/seed/site-data";

export default function AccountPage() {
  const member = mockMembers[0];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            Member Portal
          </p>
          <h1 className="mt-3 text-4xl font-black">My FREERIDE KOREA</h1>
          <p className="mt-3 text-zinc-600">
            회원 등급, 신청, 제출 초안, 중고장터 매물, 알림을 확인합니다.
          </p>
        </div>
        <Button href="/">사이트로 돌아가기</Button>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="border border-zinc-200 bg-white p-6">
          <p className="text-sm font-bold text-zinc-500">Current Member</p>
          <h2 className="mt-3 text-2xl font-black">{member.name}</h2>
          <div className="mt-4">
            <StatusBadge status={member.memberType} />
          </div>
        </article>
        {["Upgrade Request", "Applications", "Submissions"].map((title) => (
          <article key={title} className="border border-zinc-200 bg-white p-6">
            <p className="text-sm font-bold text-zinc-500">{title}</p>
            <h2 className="mt-3 text-2xl font-black">Ready</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Supabase 연결 전 mock data로 상태 구조를 확인합니다.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
