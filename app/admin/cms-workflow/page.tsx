import { AdminShell } from "@/components/admin/AdminShell";
import { updateContentWorkflowPolicyAction } from "@/app/admin/cms-workflow/actions";
import { Badge } from "@/components/ui/Badge";
import { workflowTransitions } from "@/lib/workflow/content-policy";
import { listWorkflowPolicies } from "@/lib/repositories/workflow-policies";
import type { ContentWorkflowPolicy } from "@/lib/types/workflow";

const roleLabels = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
  admin: "관리자",
};

const memberRoleOptions = [
  ["general", "일반회원"],
  ["regular", "정회원"],
  ["athlete", "선수회원"],
  ["supporting", "스폰서십 회원"],
  ["executive", "임원회원"],
] as const;

const publisherRoleOptions = [
  ["executive", "임원회원"],
  ["admin", "관리자"],
] as const;

const publishStatusOptions = [
  ["draft", "초안"],
  ["review", "검토중"],
  ["published", "바로 게시"],
  ["hidden", "숨김"],
] as const;

function resultMessage(result?: string, mode?: string) {
  if (result === "updated") {
    return `작성 권한 정책을 저장했습니다. (${mode ?? "supabase"})`;
  }

  if (result === "invalid") {
    return "정책 값을 다시 확인해 주세요. 메모는 5자 이상 필요합니다.";
  }

  return null;
}

function PolicyRow({ policy }: { policy: ContentWorkflowPolicy }) {
  return (
    <tr className="border-t border-zinc-100 align-top">
      <td className="px-4 py-4">
        <p className="font-black">{policy.label}</p>
        <p className="mt-1 text-xs uppercase text-zinc-500">{policy.kind}</p>
      </td>
      <td className="px-4 py-4">
        <form action={updateContentWorkflowPolicyAction} className="grid gap-3">
          <input type="hidden" name="kind" value={policy.kind} />
          <input type="hidden" name="actorRole" value="admin" />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-1">
              <span className="text-xs font-black text-zinc-500">
                최소 작성 권한
              </span>
              <select
                name="authorMinimumRole"
                defaultValue={policy.authorMinimumRole}
                className="h-10 border border-zinc-300 bg-white px-2 text-sm font-bold text-zinc-950"
              >
                {memberRoleOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-black text-zinc-500">게시 권한</span>
              <select
                name="publisherRole"
                defaultValue={policy.publisherRole}
                className="h-10 border border-zinc-300 bg-white px-2 text-sm font-bold text-zinc-950"
              >
                {publisherRoleOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-black text-zinc-500">
                정책 변경 권한
              </span>
              <select
                name="policyEditorRole"
                defaultValue={policy.policyEditorRole}
                className="h-10 border border-zinc-300 bg-white px-2 text-sm font-bold text-zinc-950"
              >
                {publisherRoleOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-black text-zinc-500">기본 상태</span>
              <select
                name="defaultStatus"
                defaultValue={policy.defaultStatus}
                className="h-10 border border-zinc-300 bg-white px-2 text-sm font-bold text-zinc-950"
              >
                {publishStatusOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
            <input
              name="requiresReview"
              type="checkbox"
              defaultChecked={policy.requiresReview}
              className="h-4 w-4 accent-[var(--color-fk-red)]"
            />
            관리자 검토 후 게시
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-black text-zinc-500">운영 메모</span>
            <textarea
              name="notes"
              defaultValue={policy.notes}
              rows={3}
              className="border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-800"
            />
          </label>
          <button
            type="submit"
            className="h-10 justify-self-start border border-zinc-300 bg-zinc-100 px-4 text-xs font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            정책 저장
          </button>
        </form>
      </td>
    </tr>
  );
}

type AdminCmsWorkflowPageProps = {
  searchParams?: Promise<{
    result?: string;
    mode?: string;
  }>;
};

export default async function AdminCmsWorkflowPage({
  searchParams,
}: AdminCmsWorkflowPageProps) {
  const policies = await listWorkflowPolicies();
  const params = await searchParams;
  const message = resultMessage(params?.result, params?.mode);

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
        <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
          작성 권한 정책은 관리자와 임원회원이 변경할 수 있도록 설계했습니다.
          현재 접근키 기반 관리자 모드에서는 관리자가 저장하고, 이후 회원 로그인과
          임원회원 계정이 연결되면 같은 정책 저장 흐름을 임원회원에게도 열 수 있습니다.
        </p>
      </div>

      {message ? (
        <div className="mt-5 border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
          {message}
        </div>
      ) : null}

      <section className="mt-8 overflow-hidden border border-zinc-200 bg-white">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="w-[180px] px-4 py-3">콘텐츠</th>
              <th className="px-4 py-3">권한 정책 편집</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <PolicyRow key={policy.kind} policy={policy} />
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="border border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-black">변경 가능 주체</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-zinc-600">
            정책 변경 권한은 관리자 또는 임원회원으로 둘 수 있습니다. 실제 회원
            로그인 연결 전까지는 관리자 접근키를 통과한 운영자가 변경합니다.
          </p>
        </article>
        <article className="border border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-black">저장 위치</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-zinc-600">
            Supabase Storage의 운영 설정 JSON에 저장합니다. Storage 연결이 없으면
            화면은 기본 정책으로 동작하고 저장은 mock으로 표시됩니다.
          </p>
        </article>
        <article className="border border-zinc-200 bg-white p-5">
          <h2 className="text-xl font-black">적용 범위</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-zinc-600">
            뉴스, 비디오, 이벤트, 카테고리 콘텐츠 초안 등록 시 검토 큐의 필요
            작성 등급과 게시 권한에 반영됩니다.
          </p>
        </article>
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
