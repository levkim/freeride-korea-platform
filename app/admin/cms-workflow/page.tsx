import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import {
  contentWorkflowPolicies,
  workflowTransitions,
} from "@/lib/workflow/content-policy";

const roleLabels = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
  admin: "관리자",
};

export default function AdminCmsWorkflowPage() {
  return (
    <AdminShell>
      <div>
        <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
          CMS Workflow v1
        </p>
        <h1 className="mt-3 text-4xl font-black">게시 승인 규칙</h1>
        <p className="mt-3 max-w-3xl text-zinc-600">
          회원 작성, 임원회원 초안 작성, 관리자 게시 승인을 분리해 운영합니다.
          더 많은 콘텐츠를 받을 수 있으면서도 공식 사이트의 관리 기준은 유지합니다.
        </p>
      </div>

      <section className="mt-8 overflow-hidden border border-zinc-200 bg-white">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">콘텐츠</th>
              <th className="px-4 py-3">최소 작성 권한</th>
              <th className="px-4 py-3">게시 권한</th>
              <th className="px-4 py-3">기본 상태</th>
              <th className="px-4 py-3">운영 규칙</th>
            </tr>
          </thead>
          <tbody>
            {contentWorkflowPolicies.map((policy) => (
              <tr key={policy.kind} className="border-t border-zinc-100 align-top">
                <td className="px-4 py-4">
                  <p className="font-black">{policy.label}</p>
                  <p className="mt-1 text-xs uppercase text-zinc-500">
                    {policy.kind}
                  </p>
                </td>
                <td className="px-4 py-4 font-bold">
                  {roleLabels[policy.authorMinimumRole]}
                </td>
                <td className="px-4 py-4 font-bold">
                  {roleLabels[policy.publisherRole]}
                </td>
                <td className="px-4 py-4">
                  <Badge tone="amber">{policy.defaultStatus}</Badge>
                </td>
                <td className="px-4 py-4 text-zinc-600">{policy.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            상태 흐름
          </p>
          <h2 className="mt-3 text-2xl font-black">검토 및 승인 흐름</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            데이터베이스에는 모든 상태 변경이 검토 기록으로 남습니다. 관리자는
            누가 제출했고, 누가 수정 요청을 했으며, 누가 승인 또는 게시했는지
            확인할 수 있습니다.
          </p>
        </div>
        <div className="grid gap-3">
          {workflowTransitions.map((transition) => (
            <div
              key={`${transition.from}-${transition.to}-${transition.note}`}
              className="grid gap-3 border border-zinc-200 bg-white p-4 md:grid-cols-[180px_1fr]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{transition.from}</Badge>
                <span className="text-xs font-black text-zinc-400">→</span>
                <Badge tone="blue">{transition.to}</Badge>
              </div>
              <div>
                <p className="text-sm font-black">
                  처리 권한: {roleLabels[transition.actor]}
                </p>
                <p className="mt-1 text-sm text-zinc-600">{transition.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
