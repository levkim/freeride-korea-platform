"use server";

import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/authz/server";
import { persistInquiryAction } from "@/lib/repositories/inquiries";
import { inquiryActionInputSchema } from "@/lib/validation/inquiry-action";

export async function submitInquiryAction(formData: FormData) {
  const inquiryId = String(formData.get("inquiryId") ?? "");

  try {
    await requireAdminAction();
  } catch {
    redirect(`/admin/login?error=forbidden&next=/admin/contact-join/${inquiryId}`);
  }

  const parsed = inquiryActionInputSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    toStatus: formData.get("toStatus"),
    assignedTo: formData.get("assignedTo"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    redirect(`/admin/contact-join/${inquiryId}?result=invalid`);
  }

  const result = await persistInquiryAction(parsed.data);

  redirect(
    `/admin/contact-join/${parsed.data.inquiryId}?result=${parsed.data.toStatus}&mode=${result.mode}`,
  );
}
