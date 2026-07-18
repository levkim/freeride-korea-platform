"use server";

import { redirect } from "next/navigation";
import { persistInquiryAction } from "@/lib/repositories/inquiries";
import { inquiryActionInputSchema } from "@/lib/validation/inquiry-action";

export async function submitInquiryAction(formData: FormData) {
  const parsed = inquiryActionInputSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    toStatus: formData.get("toStatus"),
    assignedTo: formData.get("assignedTo"),
    note: formData.get("note"),
  });

  const inquiryId = String(formData.get("inquiryId") ?? "");

  if (!parsed.success) {
    redirect(`/admin/contact-join/${inquiryId}?result=invalid`);
  }

  const result = await persistInquiryAction(parsed.data);

  redirect(
    `/admin/contact-join/${parsed.data.inquiryId}?result=${parsed.data.toStatus}&mode=${result.mode}`,
  );
}
