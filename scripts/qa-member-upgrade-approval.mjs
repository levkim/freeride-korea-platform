import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const memberTypeByRequestLabel = {
  일반회원: "general",
  정회원: "regular",
  임원회원: "executive",
  선수회원: "athlete",
  "스폰서십 회원": "supporting",
  후원회원: "supporting",
};

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(envPath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");

    if (!process.env[key]) {
      process.env[key] = valueParts.join("=");
    }
  }
}

function assertEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

async function main() {
  loadLocalEnv();

  const supabase = createClient(
    assertEnv("NEXT_PUBLIC_SUPABASE_URL"),
    assertEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const timestamp = Date.now();
  const email = `qa-member-upgrade-${timestamp}@freeride.kr`;
  const name = "QA 회원전환 승인";
  const requestedMemberType = "선수회원";
  const nextMemberType = memberTypeByRequestLabel[requestedMemberType];
  const now = new Date().toISOString();

  let memberId;
  let inquiryId;
  let reviewItemId;
  let reviewEventId;

  try {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert({
        email,
        name,
        member_type: "general",
        status: "reviewing",
      })
      .select("id")
      .single();

    if (memberError) {
      throw new Error(`member insert failed: ${memberError.message}`);
    }

    memberId = member.id;

    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiry_entries")
      .insert({
        inquiry_type: "membership",
        name,
        email,
        phone: "010-0000-0000",
        riding_experience: "QA approval workflow",
        requested_member_type: requestedMemberType,
        title: "QA 선수회원 전환 승인",
        message:
          "회원 등급 전환 승인 자동 반영을 확인하기 위한 QA 문의입니다. 테스트 후 정리됩니다.",
      })
      .select("id")
      .single();

    if (inquiryError) {
      throw new Error(`inquiry insert failed: ${inquiryError.message}`);
    }

    inquiryId = inquiry.id;

    const { data: reviewItem, error: reviewError } = await supabase
      .from("review_queue_items")
      .insert({
        subject_kind: "member-upgrade",
        member_id: memberId,
        inquiry_id: inquiryId,
        title: `${requestedMemberType} 전환 요청 · ${name}`,
        status: "review",
        risk: "low",
        required_author_role: "general",
        required_publish_role: "admin",
        submitted_by: memberId,
      })
      .select("id,status")
      .single();

    if (reviewError) {
      throw new Error(`review queue insert failed: ${reviewError.message}`);
    }

    reviewItemId = reviewItem.id;

    const { error: queueUpdateError } = await supabase
      .from("review_queue_items")
      .update({ status: "approved" })
      .eq("id", reviewItemId);

    if (queueUpdateError) {
      throw new Error(`review queue approval failed: ${queueUpdateError.message}`);
    }

    const { error: memberUpdateError } = await supabase
      .from("members")
      .update({
        member_type: nextMemberType,
        status: "active",
        updated_at: now,
      })
      .eq("id", memberId);

    if (memberUpdateError) {
      throw new Error(`member upgrade failed: ${memberUpdateError.message}`);
    }

    const { error: inquiryUpdateError } = await supabase
      .from("inquiry_entries")
      .update({
        status: "closed",
        updated_at: now,
      })
      .eq("id", inquiryId);

    if (inquiryUpdateError) {
      throw new Error(`inquiry close failed: ${inquiryUpdateError.message}`);
    }

    const { data: reviewEvent, error: eventError } = await supabase
      .from("review_events")
      .insert({
        review_item_id: reviewItemId,
        action: "approve",
        from_status: "review",
        to_status: "approved",
        note: "QA 회원 등급 전환 승인 테스트",
      })
      .select("id")
      .single();

    if (eventError) {
      throw new Error(`review event insert failed: ${eventError.message}`);
    }

    reviewEventId = reviewEvent.id;

    const [{ data: updatedMember }, { data: updatedInquiry }, { data: updatedReview }] =
      await Promise.all([
        supabase
          .from("members")
          .select("member_type,status")
          .eq("id", memberId)
          .single(),
        supabase
          .from("inquiry_entries")
          .select("status")
          .eq("id", inquiryId)
          .single(),
        supabase
          .from("review_queue_items")
          .select("status")
          .eq("id", reviewItemId)
          .single(),
      ]);

    const failures = [];

    if (updatedMember?.member_type !== nextMemberType) {
      failures.push(`member_type was not updated to ${nextMemberType}`);
    }

    if (updatedMember?.status !== "active") {
      failures.push("member status was not updated to active");
    }

    if (updatedInquiry?.status !== "closed") {
      failures.push("inquiry status was not closed");
    }

    if (updatedReview?.status !== "approved") {
      failures.push("review queue item was not approved");
    }

    console.log(
      JSON.stringify(
        {
          checked: [
            "review_queue_items.approve",
            "members.member_type",
            "members.status",
            "inquiry_entries.status",
            "review_events.insert",
          ],
          requestedMemberType,
          nextMemberType,
          reviewItemId,
          memberId,
          inquiryId,
          cleanupPlanned: true,
          failures,
        },
        null,
        2,
      ),
    );

    if (failures.length) {
      process.exitCode = 1;
    }
  } finally {
    if (reviewEventId) {
      await supabase.from("review_events").delete().eq("id", reviewEventId);
    }

    if (reviewItemId) {
      await supabase.from("review_queue_items").delete().eq("id", reviewItemId);
    }

    if (inquiryId) {
      await supabase.from("inquiry_entries").delete().eq("id", inquiryId);
    }

    if (memberId) {
      await supabase.from("members").delete().eq("id", memberId);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
