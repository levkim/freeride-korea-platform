import { inquiryItems } from "@/content/seed/site-data";
import type { InquiryItem, InquiryStatus, InquiryType } from "@/lib/types/inquiry";
import type { InquiryActionInput } from "@/lib/validation/inquiry-action";
import type { InquiryInput } from "@/lib/validation/inquiry";
import {
  createSupabaseAdminClient,
  getMissingSupabaseAdminEnv,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type PersistInquiryResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  inquiryId?: string;
};

type PersistInquiryActionResult = {
  mode: "supabase" | "mock";
  missingEnv?: string[];
  inquiryEventId?: string;
};

export async function persistInquiry(
  input: InquiryInput,
): Promise<PersistInquiryResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiry_entries")
    .insert({
      inquiry_type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone,
      riding_experience: input.ridingExperience,
      requested_member_type: input.requestedMemberType,
      title: input.title,
      message: input.message,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    inquiryId: data.id as string,
  };
}

type InquiryRow = {
  id: string;
  inquiry_type: InquiryType;
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  title: string;
  message: string;
  assigned_to: string | null;
  created_at: string;
};

function mapInquiryRow(row: InquiryRow): InquiryItem {
  return {
    id: row.id,
    type: row.inquiry_type,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    title: row.title,
    message: row.message,
    status: row.status,
    assignedTo: row.assigned_to ?? undefined,
    createdAt: row.created_at.slice(0, 10),
  };
}

export async function listInquiries(): Promise<{
  items: InquiryItem[];
  mode: "supabase" | "mock";
}> {
  if (!hasSupabaseAdminEnv()) {
    return {
      items: inquiryItems,
      mode: "mock",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiry_entries")
    .select(
      "id,inquiry_type,status,name,email,phone,title,message,assigned_to,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    items: (data as InquiryRow[]).map(mapInquiryRow),
    mode: "supabase",
  };
}

export async function getInquiryById(id: string): Promise<{
  item: InquiryItem | null;
  mode: "supabase" | "mock";
}> {
  if (!hasSupabaseAdminEnv()) {
    return {
      item: inquiryItems.find((item) => item.id === id) ?? null,
      mode: "mock",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("inquiry_entries")
    .select(
      "id,inquiry_type,status,name,email,phone,title,message,assigned_to,created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    item: data ? mapInquiryRow(data as InquiryRow) : null,
    mode: "supabase",
  };
}

export async function persistInquiryAction(
  input: InquiryActionInput,
): Promise<PersistInquiryActionResult> {
  if (!hasSupabaseAdminEnv()) {
    return {
      mode: "mock",
      missingEnv: getMissingSupabaseAdminEnv(),
    };
  }

  const supabase = createSupabaseAdminClient();

  const { data: inquiry, error: readError } = await supabase
    .from("inquiry_entries")
    .select("status")
    .eq("id", input.inquiryId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  const fromStatus = inquiry?.status ?? null;

  const { error: updateError } = await supabase
    .from("inquiry_entries")
    .update({
      status: input.toStatus,
      assigned_to: input.assignedTo || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.inquiryId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { data, error } = await supabase
    .from("inquiry_events")
    .insert({
      inquiry_id: input.inquiryId,
      from_status: fromStatus,
      to_status: input.toStatus,
      note: input.note,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    mode: "supabase",
    inquiryEventId: data.id as string,
  };
}
