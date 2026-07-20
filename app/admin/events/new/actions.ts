"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import { persistEventDraft } from "@/lib/repositories/events";
import { parseEventFormData } from "@/lib/validation/event-form";

export async function submitEventDraft(formData: FormData) {
  try {
    await requireAdminAction();
  } catch {
    redirect("/admin/login?error=forbidden&next=/admin/events/new");
  }

  const parsed = parseEventFormData(formData);

  if (!parsed.success) {
    redirect("/admin/events/new?result=invalid");
  }

  const result = await persistEventDraft(parsed.data);

  redirect(`/admin/events/new?result=submitted&mode=${result.mode}`);
}
