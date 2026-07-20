import type { ContentKind, PublishStatus } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";
import type {
  ContentWorkflowPolicy,
  WorkflowTransition,
} from "@/lib/types/workflow";

const memberRank: Record<MemberType, number> = {
  general: 0,
  supporting: 0,
  regular: 1,
  athlete: 1,
  executive: 2,
};

export const contentWorkflowPolicies: ContentWorkflowPolicy[] = [
  {
    kind: "news",
    label: "뉴스",
    authorMinimumRole: "executive",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "뉴스 게시물은 임원회원 이상이 작성할 수 있으며, 실제 게시는 관리자 승인 후 진행합니다.",
  },
  {
    kind: "video",
    label: "비디오",
    authorMinimumRole: "executive",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "비디오 게시물은 뉴스와 같은 승인 규칙을 적용하며, 유튜브 링크를 함께 등록할 수 있습니다.",
  },
  {
    kind: "event",
    label: "대회·이벤트",
    authorMinimumRole: "executive",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "공식/비공식 대회 정보는 임원회원 이상이 작성할 수 있고, 공개 전 관리자 검토를 거칩니다.",
  },
  {
    kind: "program",
    label: "선수 프로그램 / 교육",
    authorMinimumRole: "regular",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "선수 프로그램은 정회원 이상이 제안할 수 있습니다. Education 세부 유형(눈사태 안전교육, FREERIDING 교육, Backcountry, WFR)은 임원회원 이상만 작성할 수 있고, 관리자가 게시 여부를 결정합니다.",
  },
  {
    kind: "tour",
    label: "프리라이드 투어",
    authorMinimumRole: "regular",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "프리라이드 투어 제안은 정회원 이상부터 작성할 수 있고, 게시 전 관리자 승인이 필요합니다.",
  },
  {
    kind: "culture",
    label: "컬쳐",
    authorMinimumRole: "general",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "published",
    requiresReview: false,
    notes: "컬쳐 게시물은 일반회원도 작성할 수 있으며, 관리자 검토 대기 없이 바로 공개됩니다. 필요 시 관리자가 숨김/보관으로 사후 관리합니다.",
  },
  {
    kind: "marketplace",
    label: "중고장터",
    authorMinimumRole: "general",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "published",
    requiresReview: false,
    notes: "중고장터 게시물은 회원이 작성할 수 있으며, 관리자 검토 대기 없이 바로 공개됩니다. 거래 리스크가 있는 항목은 신고/숨김/보관으로 사후 관리합니다.",
  },
  {
    kind: "resource",
    label: "자료실",
    authorMinimumRole: "regular",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "published",
    requiresReview: false,
    notes: "자료실의 링크, 앱, 다운로드, 공식 참고 자료는 정회원 이상이 작성할 수 있으며, 관리자 검토 대기 없이 바로 공개됩니다. 부정확한 자료는 사후 수정 또는 숨김 처리합니다.",
  },
  {
    kind: "shop",
    label: "샵",
    authorMinimumRole: "regular",
    publisherRole: "admin",
    policyEditorRole: "executive",
    defaultStatus: "review",
    requiresReview: true,
    notes: "멤버십 회비, 교육/투어 결제, 굿즈 상품은 정회원 이상이 제안할 수 있고, 가격·재고·환불 기준 검토 후 관리자만 게시합니다.",
  },
];

export const workflowTransitions: WorkflowTransition[] = [
  {
    from: "draft",
    to: "review",
    actor: "general",
    note: "작성자가 초안을 검토 요청 상태로 제출합니다.",
  },
  {
    from: "review",
    to: "needs_revision",
    actor: "admin",
    note: "관리자가 승인 전에 수정 요청을 보냅니다.",
  },
  {
    from: "needs_revision",
    to: "review",
    actor: "general",
    note: "작성자가 수정한 콘텐츠를 다시 검토 요청합니다.",
  },
  {
    from: "review",
    to: "approved",
    actor: "admin",
    note: "관리자가 콘텐츠 게시를 승인합니다.",
  },
  {
    from: "approved",
    to: "published",
    actor: "admin",
    note: "관리자가 승인된 콘텐츠를 실제 사이트에 게시합니다.",
  },
  {
    from: "published",
    to: "hidden",
    actor: "admin",
    note: "관리자가 기록은 보존한 채 게시물을 숨김 처리합니다.",
  },
  {
    from: "hidden",
    to: "published",
    actor: "admin",
    note: "관리자가 숨김 처리된 게시물을 다시 공개합니다.",
  },
  {
    from: "review",
    to: "rejected",
    actor: "admin",
    note: "관리자가 수정 진행 없이 콘텐츠를 반려합니다.",
  },
  {
    from: "published",
    to: "archived",
    actor: "admin",
    note: "관리자가 오래되었거나 운영상 보관할 콘텐츠를 아카이브 처리합니다.",
  },
];

export function getPolicyForKind(kind: ContentKind) {
  return contentWorkflowPolicies.find((policy) => policy.kind === kind);
}

export function canAuthorContent(memberType: MemberType, kind: ContentKind) {
  const policy = getPolicyForKind(kind);

  if (!policy) {
    return false;
  }

  return memberRank[memberType] >= memberRank[policy.authorMinimumRole];
}

export function getInitialPublishStatus(kind: ContentKind): PublishStatus {
  return getPolicyForKind(kind)?.defaultStatus ?? "draft";
}
