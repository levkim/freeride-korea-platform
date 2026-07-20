"use server";

import { redirect } from "next/navigation";

import { requireExecutiveOrAdminAction } from "@/lib/authz/server";
import { updateWorkflowPolicy } from "@/lib/repositories/workflow-policies";
import type { ContentKind, PublishStatus } from "@/lib/types/content";
import type { MemberType } from "@/lib/types/member";
import type {
  PolicyEditorRole,
  PublicationActorRole,
} from "@/lib/types/workflow";

const contentKinds = new Set<ContentKind>([
  "news",
  "video",
  "event",
  "program",
  "tour",
  "culture",
  "marketplace",
  "resource",
  "shop",
]);
const memberTypes = new Set<MemberType>([
  "general",
  "regular",
  "executive",
  "athlete",
  "supporting",
]);
const publisherRoles = new Set<PublicationActorRole>(["executive", "admin"]);
const editorRoles = new Set<PolicyEditorRole>(["executive", "admin"]);
const publishStatuses = new Set<PublishStatus>([
  "draft",
  "review",
  "needs_revision",
  "approved",
  "published",
  "rejected",
  "hidden",
  "archived",
]);

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || "");
}

export async function updateContentWorkflowPolicyAction(formData: FormData) {
  try {
    await requireExecutiveOrAdminAction();
  } catch {
    redirect("/admin/login?error=forbidden&next=/admin/cms-workflow");
  }

  const kind = getFormValue(formData, "kind") as ContentKind;
  const authorMinimumRole = getFormValue(
    formData,
    "authorMinimumRole",
  ) as MemberType;
  const publisherRole = getFormValue(
    formData,
    "publisherRole",
  ) as PublicationActorRole;
  const policyEditorRole = getFormValue(
    formData,
    "policyEditorRole",
  ) as PolicyEditorRole;
  const defaultStatus = getFormValue(formData, "defaultStatus") as PublishStatus;
  const actorRole = getFormValue(formData, "actorRole") as PolicyEditorRole;
  const notes = getFormValue(formData, "notes");

  if (
    !contentKinds.has(kind) ||
    !memberTypes.has(authorMinimumRole) ||
    !publisherRoles.has(publisherRole) ||
    !editorRoles.has(policyEditorRole) ||
    !publishStatuses.has(defaultStatus) ||
    !editorRoles.has(actorRole) ||
    notes.trim().length < 5
  ) {
    redirect("/admin/cms-workflow?result=invalid");
  }

  const result = await updateWorkflowPolicy({
    kind,
    authorMinimumRole,
    publisherRole,
    policyEditorRole,
    defaultStatus,
    requiresReview: formData.get("requiresReview") === "on",
    notes,
    actorRole,
  });

  redirect(`/admin/cms-workflow?result=updated&mode=${result.mode}`);
}
