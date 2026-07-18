"use server";

import { redirect } from "next/navigation";
import { persistEventDraft } from "@/lib/repositories/events";
import { parseEventFormData } from "@/lib/validation/event-form";

export async function submitEventDraft(formData: FormData) {
  const parsed = parseEventFormData(formData);

  if (!parsed.success) {
    redirect("/admin/events/new?result=invalid");
  }

  const result = await persistEventDraft(parsed.data);

  redirect(`/admin/events/new?result=submitted&mode=${result.mode}`);
}
