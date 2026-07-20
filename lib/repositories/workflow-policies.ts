import type { ContentKind, PublishStatus } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";
import type {
  ContentWorkflowPolicy,
  PolicyEditorRole,
  PublicationActorRole,
} from "@/lib/types/workflow";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  getSupabaseAdminConfig,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { contentWorkflowPolicies } from "@/lib/workflow/content-policy";

const settingsObjectPath = "_settings/workflow-policies.json";

type PolicySettingsDocument = {
  version: 1;
  updatedAt: string;
  updatedByRole: PolicyEditorRole;
  policies: ContentWorkflowPolicy[];
};

export type WorkflowPolicySaveInput = {
  kind: ContentKind;
  authorMinimumRole: MemberType;
  publisherRole: PublicationActorRole;
  policyEditorRole: PolicyEditorRole;
  defaultStatus: PublishStatus;
  requiresReview: boolean;
  notes: string;
  actorRole: PolicyEditorRole;
};

export type WorkflowPolicySaveResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
};

const contentKindSet = new Set(contentWorkflowPolicies.map((policy) => policy.kind));
const memberTypeSet = new Set<MemberType>([
  "general",
  "regular",
  "executive",
  "athlete",
  "supporting",
]);
const publisherRoleSet = new Set<PublicationActorRole>(["executive", "admin"]);
const policyEditorRoleSet = new Set<PolicyEditorRole>(["executive", "admin"]);
const publishStatusSet = new Set<PublishStatus>([
  "draft",
  "review",
  "needs_revision",
  "approved",
  "published",
  "rejected",
  "hidden",
  "archived",
]);

function sanitizePolicy(policy: Partial<ContentWorkflowPolicy>) {
  if (!policy.kind || !contentKindSet.has(policy.kind)) {
    return null;
  }

  const fallback = contentWorkflowPolicies.find((item) => item.kind === policy.kind);

  if (!fallback) {
    return null;
  }

  return {
    ...fallback,
    authorMinimumRole:
      policy.authorMinimumRole && memberTypeSet.has(policy.authorMinimumRole)
        ? policy.authorMinimumRole
        : fallback.authorMinimumRole,
    publisherRole:
      policy.publisherRole && publisherRoleSet.has(policy.publisherRole)
        ? policy.publisherRole
        : fallback.publisherRole,
    policyEditorRole:
      policy.policyEditorRole && policyEditorRoleSet.has(policy.policyEditorRole)
        ? policy.policyEditorRole
        : fallback.policyEditorRole,
    defaultStatus:
      policy.defaultStatus && publishStatusSet.has(policy.defaultStatus)
        ? policy.defaultStatus
        : fallback.defaultStatus,
    requiresReview: Boolean(policy.requiresReview),
    notes: typeof policy.notes === "string" ? policy.notes : fallback.notes,
  };
}

function mergeWithDefaults(savedPolicies: ContentWorkflowPolicy[]) {
  const savedByKind = new Map(
    savedPolicies
      .map((policy) => sanitizePolicy(policy))
      .filter((policy): policy is ContentWorkflowPolicy => Boolean(policy))
      .map((policy) => [policy.kind, policy]),
  );

  return contentWorkflowPolicies.map(
    (policy) => savedByKind.get(policy.kind) ?? policy,
  );
}

async function readStoredWorkflowPolicies() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { contentImageBucket } = getSupabaseAdminConfig();
  const { data, error } = await supabase.storage
    .from(contentImageBucket)
    .download(settingsObjectPath);

  if (error || !data) {
    return null;
  }

  try {
    const document = JSON.parse(await data.text()) as PolicySettingsDocument;

    if (document.version !== 1 || !Array.isArray(document.policies)) {
      return null;
    }

    return mergeWithDefaults(document.policies);
  } catch {
    return null;
  }
}

async function writeStoredWorkflowPolicies(
  policies: ContentWorkflowPolicy[],
  updatedByRole: PolicyEditorRole,
) {
  const supabase = createSupabaseAdminClient();
  const { contentImageBucket } = getSupabaseAdminConfig();
  const payload: PolicySettingsDocument = {
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedByRole,
    policies,
  };

  const { error } = await supabase.storage
    .from(contentImageBucket)
    .upload(settingsObjectPath, JSON.stringify(payload, null, 2), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listWorkflowPolicies() {
  const storedPolicies = await readStoredWorkflowPolicies();

  return storedPolicies ?? contentWorkflowPolicies;
}

export async function getWorkflowPolicyForKind(kind: ContentKind) {
  const policies = await listWorkflowPolicies();

  return policies.find((policy) => policy.kind === kind);
}

export async function updateWorkflowPolicy(
  input: WorkflowPolicySaveInput,
): Promise<WorkflowPolicySaveResult> {
  if (!policyEditorRoleSet.has(input.actorRole)) {
    throw new Error("작성 권한 정책은 관리자 또는 임원회원만 변경할 수 있습니다.");
  }

  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const currentPolicies = await listWorkflowPolicies();
  const nextPolicy = sanitizePolicy({
    ...input,
    notes: input.notes.trim(),
  });

  if (!nextPolicy) {
    throw new Error("알 수 없는 콘텐츠 정책입니다.");
  }

  const nextPolicies = currentPolicies.map((policy) =>
    policy.kind === nextPolicy.kind ? nextPolicy : policy,
  );

  await writeStoredWorkflowPolicies(nextPolicies, input.actorRole);

  return { mode: "supabase" };
}
