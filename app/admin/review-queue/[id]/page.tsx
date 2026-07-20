import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { reviewQueueItems } from "@/content/seed/site-data";
import {
  getReviewQueueItemById,
  getReviewSubjectContext,
  listReviewEvents,
} from "@/lib/repositories/review-queue";
import type { MemberType } from "@/lib/types/member";
import type { ReviewActionKind, ReviewQueueItem } from "@/lib/types/review";
import { submitReviewAction } from "./actions";

type ReviewDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    result?: string;
    next?: string;
    mode?: string;
    memberUpgrade?: string;
  }>;
};

const reviewKindLabels: Record<ReviewQueueItem["kind"], string> = {
  news: "뉴스",
  video: "비디오",
  event: "이벤트",
  program: "교육/프로그램",
  tour: "투어",
  culture: "컬쳐",
  marketplace: "중고장터",
  resource: "자료실",
  shop: "샵",
  "member-upgrade": "회원 등급 전환",
  "source-alert": "소스 알림",
  "ai-draft": "AI 초안",
  inquiry: "문의 처리",
};

const memberRoleLabels: Record<MemberType | "admin", string> = {
  general: "일반회원",
  regular: "정회원",
  executive: "임원회원",
  athlete: "선수회원",
  supporting: "스폰서십 회원",
  admin: "관리자",
};

const reviewActionLabels: Record<ReviewActionKind, string> = {
  submit: "초안 제출",
  approve: "승인",
  request_revision: "수정 요청",
  reject: "반려",
  publish: "게시",
  hide: "숨김",
  archive: "보관",
  assign: "담당자 지정",
  comment: "메모",
};

const reviewActions = [
  {
    value: "approve",
    title: "승인",
    text: "내용과 권한, 위험도를 확인한 뒤 approved 상태로 전환합니다.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    value: "request_revision",
    title: "수정 요청",
    text: "필수 정보가 부족하거나 표현 수정이 필요하면 작성자에게 되돌립니다.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    value: "reject",
    title: "반려",
    text: "브랜드 기준, 안전 기준, 운영 정책에 맞지 않으면 rejected 처리합니다.",
    className: "border-red-200 bg-red-50 text-red-800",
  },
  {
    value: "publish",
    title: "게시",
    text: "승인된 항목만 published 상태로 공개 페이지에 노출합니다.",
    className: "border-zinc-300 bg-zinc-100 text-zinc-950",
  },
];

const resultMessages: Record<string, string> = {
  approve: "승인 액션이 검증되었습니다. 실제 저장 연결 후 approved 상태로 기록됩니다.",
  request_revision:
    "수정 요청 액션이 검증되었습니다. 실제 저장 연결 후 needs_revision 상태로 기록됩니다.",
  reject: "반려 액션이 검증되었습니다. 실제 저장 연결 후 rejected 상태로 기록됩니다.",
  publish: "게시 액션이 검증되었습니다. 실제 저장 연결 후 published 상태로 공개됩니다.",
  invalid: "관리자 코멘트를 5자 이상 입력한 뒤 다시 시도해 주세요.",
};

function getMemberTypeLabel(memberType?: MemberType) {
  if (!memberType) {
    return "확인 필요";
  }

  return memberRoleLabels[memberType];
}

export function generateStaticParams() {
  return reviewQueueItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  const item = await getReviewQueueItemById(id);

  return {
    title: item
      ? `${item.title} | 검토 대기열`
      : "검토 상세 | FREERIDE KOREA",
  };
}

export default async function ReviewQueueDetailPage({
  params,
  searchParams,
}: ReviewDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const result = resolvedSearchParams?.result;
  const persistenceMode = resolvedSearchParams?.mode;
  const memberUpgradeResult = resolvedSearchParams?.memberUpgrade;
  const item = await getReviewQueueItemById(id);

  if (!item) {
    notFound();
  }

  const [reviewEvents, subjectContext] = await Promise.all([
    listReviewEvents(item.id, item),
    getReviewSubjectContext(item.id),
  ]);
  const isHighRisk = item.risk === "high";

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            검토 상세
          </p>
          <h1 className="mt-3 text-4xl font-black">{item.title}</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            이 화면은 초안의 작성 권한, 게시 권한, 위험도, 처리 액션을 한 번에
            확인하는 관리자 검토 화면입니다. 실제 저장 연결 후에는 모든 상태
            변경이 리뷰 이벤트로 기록됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={item.status} />
          <StatusBadge status={item.risk} />
          <Badge tone="blue">{reviewKindLabels[item.kind]}</Badge>
          <Link
            href="/admin/review-queue"
            className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            목록으로
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            검토 메타정보
          </p>
          <div className="mt-5 grid gap-4">
            {[
              ["검토 유형", reviewKindLabels[item.kind]],
              ["제출자", item.submittedBy],
              ["작성 권한", memberRoleLabels[item.requiredAuthorRole]],
              ["게시 권한", memberRoleLabels[item.requiredPublishRole]],
              ["등록일", item.createdAt],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-t border-zinc-100 pt-3"
              >
                <p className="text-xs font-black uppercase text-zinc-500">
                  {label}
                </p>
                <p className="font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5">
          <p className="text-sm font-black uppercase text-zinc-500">
            검토 기준
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "작성자 등급이 해당 콘텐츠 작성 기준을 충족하는지 확인합니다.",
              "안전, 환불, 일정, 가격, 공식 링크 등 필수 운영 정보가 있는지 확인합니다.",
              "브랜드 톤과 공식성 기준에 맞는 표현인지 확인합니다.",
              "공개 전 개인정보, 저작권, 외부 링크 위험을 점검합니다.",
            ].map((text) => (
              <div key={text} className="border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-bold leading-6">{text}</p>
              </div>
            ))}
          </div>
          {isHighRisk ? (
            <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800">
              위험도가 높은 항목입니다. 공개 전 안전, 거래, 개인정보, 저작권
              요소를 운영진이 한 번 더 확인해야 합니다.
            </div>
          ) : null}
        </article>
      </section>

      {subjectContext.kind === "member-upgrade" ? (
        <section className="mt-8 border border-zinc-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
                회원 전환 신청 정보
              </p>
              <h2 className="mt-3 text-2xl font-black">
                신청자와 요청 등급을 확인하세요
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                이 항목은 문의/참여 폼에서 생성된 회원 등급 전환 요청입니다.
                승인 전 신청자의 현재 등급, 요청 등급, 라이딩 경험, 문의 내용을
                확인한 뒤 회원 관리 화면에서 등급을 저장합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjectContext.inquiry ? (
                <Link
                  href={`/admin/contact-join/${subjectContext.inquiry.id}`}
                  className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  문의 상세 보기
                </Link>
              ) : null}
              <Link
                href="/admin/members"
                className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-black text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                회원 관리로 이동
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase text-zinc-500">
                신청 회원
              </p>
              <p className="mt-2 text-xl font-black">
                {subjectContext.member?.name ?? "회원 정보 확인 필요"}
              </p>
              <p className="mt-2 text-sm font-bold text-zinc-600">
                {subjectContext.member?.email ?? "이메일 정보 없음"}
              </p>
              <p className="mt-4 text-sm font-bold text-zinc-700">
                현재 등급: {getMemberTypeLabel(subjectContext.member?.memberType)}
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-700">
                상태: {subjectContext.member?.status ?? "확인 필요"}
              </p>
            </div>

            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase text-zinc-500">
                요청 정보
              </p>
              <p className="mt-2 text-xl font-black">
                {subjectContext.inquiry?.requestedMemberType ?? "요청 등급 확인 필요"}
              </p>
              <p className="mt-4 text-sm font-bold text-zinc-700">
                연락처: {subjectContext.inquiry?.phone ?? "미입력"}
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-700">
                신청일: {subjectContext.inquiry?.createdAt ?? item.createdAt}
              </p>
            </div>

            <div className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase text-zinc-500">
                라이딩 경험
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">
                {subjectContext.inquiry?.ridingExperience || "입력된 라이딩 경험이 없습니다."}
              </p>
            </div>
          </div>

          <div className="mt-4 border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-black uppercase text-zinc-500">
              신청 내용
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">
              {subjectContext.inquiry?.message ?? "연결된 문의 내용을 찾지 못했습니다."}
            </p>
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            검토 처리
          </p>
          <h2 className="mt-3 text-2xl font-black">처리 액션</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            관리자 코멘트와 액션 타입을 먼저 검증합니다. Supabase 연결 후에는
            이 입력값이 상태 변경, 코멘트 저장, 작성자 알림, 공개 게시 처리로
            이어집니다.
          </p>
          {result ? (
            <div
              className={`mt-5 border p-4 text-sm font-bold leading-6 ${
                result === "invalid"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {resultMessages[result] ?? "검토 액션이 확인되었습니다."}
              {persistenceMode === "mock" ? (
                <span className="mt-2 block">
                  현재 Supabase 환경변수가 없어 DB 저장 없이 검증 모드로
                  처리되었습니다.
                </span>
              ) : null}
              {memberUpgradeResult === "updated" ? (
                <span className="mt-2 block">
                  회원 등급 전환 신청이 승인되어 회원 등급과 문의 상태까지 함께
                  저장되었습니다.
                </span>
              ) : null}
              {memberUpgradeResult === "unsupported" ? (
                <span className="mt-2 block text-amber-800">
                  요청 등급을 자동 매핑하지 못했습니다. 회원 관리 화면에서
                  등급을 직접 확인해 주세요.
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <form action={submitReviewAction} className="grid gap-4">
          <input type="hidden" name="reviewId" value={item.id} />
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              관리자 코멘트
            </span>
            <textarea
              name="note"
              className="min-h-28 border border-zinc-300 bg-white px-3 py-2 text-sm font-bold leading-6 text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
              placeholder="승인, 수정 요청, 반려, 게시 사유를 기록해 주세요."
            />
          </label>
          <div className="grid gap-3 md:grid-cols-4">
          {reviewActions.map((action) => (
            <button
              key={action.title}
              type="submit"
              name="action"
              value={action.value}
              className={`border p-4 text-left transition-opacity hover:opacity-80 ${action.className}`}
            >
              <p className="font-black">{action.title}</p>
              <p className="mt-2 text-xs font-bold leading-5">{action.text}</p>
            </button>
          ))}
          </div>
        </form>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-black uppercase text-zinc-500">
          처리 기록
        </p>
        <div className="mt-5 grid gap-3">
          {reviewEvents.map((event) => (
            <div
              key={event.id}
              className="grid gap-2 border-l-4 border-zinc-300 bg-zinc-50 p-4 md:grid-cols-[1fr_160px_140px]"
            >
              <div>
                <p className="font-black">
                  {reviewActionLabels[event.action]}
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-zinc-600">
                  {event.note}
                </p>
                {event.fromStatus || event.toStatus ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {event.fromStatus ? (
                      <StatusBadge status={event.fromStatus} />
                    ) : null}
                    {event.fromStatus && event.toStatus ? (
                      <span className="text-xs font-black text-zinc-400">
                        →
                      </span>
                    ) : null}
                    {event.toStatus ? (
                      <StatusBadge status={event.toStatus} />
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p className="text-sm font-bold text-zinc-600">{event.actor}</p>
              <p className="text-sm font-bold text-zinc-600">
                {event.createdAt}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
