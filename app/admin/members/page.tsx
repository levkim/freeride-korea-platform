import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { listMembers } from "@/lib/repositories/members";
import type { ContentKind } from "@/lib/types/content";
import type { Member, MemberType } from "@/lib/types/member";
import {
  canAuthorContent,
  contentWorkflowPolicies,
} from "@/lib/workflow/content-policy";

export const dynamic = "force-dynamic";

const memberTypeLabels: Record<MemberType, string> = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
};

const memberTypeOrder: MemberType[] = [
  "general",
  "regular",
  "executive",
  "athlete",
  "supporting",
];

const contentKinds: ContentKind[] = [
  "news",
  "video",
  "event",
  "program",
  "tour",
  "culture",
  "marketplace",
  "resource",
  "shop",
];

const contentKindLabels: Record<ContentKind, string> = {
  news: "뉴스",
  video: "비디오",
  event: "이벤트",
  program: "교육/프로그램",
  tour: "투어",
  culture: "컬쳐",
  marketplace: "중고장터",
  resource: "자료실",
  shop: "샵",
};

const memberStatusLabels = {
  active: "활성",
  reviewing: "검토중",
  suspended: "정지",
};

function getMemberCount(members: Member[], memberType: MemberType) {
  return members.filter((member) => member.memberType === memberType).length;
}

function MemberDescription({ memberType }: { memberType: MemberType }) {
  if (memberType === "regular") {
    return (
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        연 회비를 납부한 공식 회원입니다. &lt;일반회원권한&gt; + 투어와
        선수 프로그램을 제안, 다양한 교육/훈련/투어 우선 참가 및 할인 혜택,
        아웃도어 활동에 도움이 되는 전용앱 사용(아웃도어 기상정보, 눈사태
        사면 평가앱, WFR야생 안전앱 등), 그 외 운영에 대한 다양한 참여 및
        제안 등을 할 수 있습니다.
      </p>
    );
  }

  if (memberType === "executive") {
    return (
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        정회원 자격 1년 이상 된 회원 중 자력 또는 운영진 추천으로 가능합니다.
        &lt;정회원 권한&gt; + 운영과 편집에 참여하는 회원입니다. 뉴스, 비디오,
        이벤트 초안과 교육 콘텐츠를 작성할 수 있습니다.
      </p>
    );
  }

  if (memberType === "athlete") {
    return (
      <div className="mt-3 text-sm leading-6 text-zinc-600">
        <p>
          정회원 가입 후 아래와 같은 경력의 자격을 갖춘 사람을 임원진과
          운영진의 승인 후 활동하는 선수 회원입니다.
        </p>
        <ul className="mt-3 grid gap-2 pl-4">
          <li>- FWT Qualifier Level 3 대회 1회 이상 참가자</li>
          <li>- FWT Qualifier Level 2 대회 6회 이상 참가자</li>
          <li>
            - 대한민국 프리스타일 스키/보드 국가대표 출신 또는 FIS 대회 1회
            이상 참가자
          </li>
          <li>
            - 대한민국 프리스타일 스키/보드 분야 전국체전 및 상금 1000만원
            이상 대회 3위 이상 수상자
          </li>
        </ul>
      </div>
    );
  }

  if (memberType === "supporting") {
    return (
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        선수 육성, 안전 교육, 프리라이드 문화 확산을 후원하는 스폰서십
        회원입니다.
      </p>
    );
  }

  return (
    <p className="mt-3 text-sm leading-6 text-zinc-600">
      무료 기본 회원입니다. 소식 확인, 커뮤니티 참여, 이벤트 안내, 중고장터
      이용을 기준으로 합니다.
    </p>
  );
}

export default async function AdminMembersPage() {
  const { items: members, mode } = await listMembers();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            회원 관리
          </p>
          <h1 className="mt-3 text-4xl font-black">회원</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            회원 등급, 승인 상태, 등급별 작성 가능 콘텐츠를 관리합니다. 모든
            게시물은 회원이 작성하더라도 최종 공개는 관리자 승인 후 진행합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">등급별 작성 권한</Badge>
          <Badge tone="amber">관리자 승인</Badge>
          <Badge tone="neutral">
            {mode === "supabase" ? "Supabase 회원 데이터" : "Mock 회원 데이터"}
          </Badge>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {memberTypeOrder.map((memberType) => (
          <article key={memberType} className="border border-zinc-200 bg-white p-5">
            <p className="text-xs font-black uppercase text-zinc-500">
              {memberType}
            </p>
            <p className="mt-3 text-2xl font-black">
              {memberTypeLabels[memberType]}
            </p>
            <MemberDescription memberType={memberType} />
            <p className="mt-5 text-3xl font-black">
              {getMemberCount(members, memberType)}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-5">
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            회원 목록
          </p>
          <h2 className="mt-2 text-2xl font-black">등록 회원</h2>
        </div>
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">회원 등급</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">가입일</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-zinc-100">
                <td className="px-4 py-4 font-black">{member.name}</td>
                <td className="px-4 py-4 text-zinc-600">{member.email}</td>
                <td className="px-4 py-4">
                  <Badge tone={member.memberType === "executive" ? "blue" : "neutral"}>
                    {memberTypeLabels[member.memberType]}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge tone={member.status === "reviewing" ? "amber" : "green"}>
                    {memberStatusLabels[member.status]}
                  </Badge>
                </td>
                <td className="px-4 py-4 font-bold">{member.joinedAt}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    className="border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-black uppercase text-zinc-950 transition-colors hover:bg-zinc-200"
                  >
                    검토
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center font-bold text-zinc-500" colSpan={6}>
                  아직 등록된 회원이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            권한 매트릭스
          </p>
          <h2 className="mt-3 text-2xl font-black">작성 권한</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            회원은 등급에 따라 작성 가능한 콘텐츠가 달라집니다. 실제 게시는
            관리자만 승인할 수 있습니다.
          </p>
        </div>
        <div className="overflow-hidden border border-zinc-200 bg-white">
          <table className="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">회원 등급</th>
                {contentKinds.map((kind) => (
                  <th key={kind} className="px-4 py-3">
                    {contentKindLabels[kind]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memberTypeOrder.map((memberType) => (
                <tr key={memberType} className="border-t border-zinc-100">
                  <td className="px-4 py-4 font-black">
                    {memberTypeLabels[memberType]}
                  </td>
                  {contentKinds.map((kind) => (
                    <td key={kind} className="px-4 py-4">
                      <span
                        className={`inline-flex h-7 min-w-12 items-center justify-center border px-2 text-xs font-black uppercase ${
                          canAuthorContent(memberType, kind)
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-zinc-200 bg-zinc-50 text-zinc-400"
                        }`}
                      >
                        {canAuthorContent(memberType, kind) ? "가능" : "불가"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        {contentWorkflowPolicies.map((policy) => (
          <article key={policy.kind} className="border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-black">{policy.label}</p>
              <Badge tone="amber">관리자 게시 승인</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{policy.notes}</p>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
