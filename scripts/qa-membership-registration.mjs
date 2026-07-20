import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

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

  const testEmail = `qa-membership-${Date.now()}@freeride.kr`;
  const testName = "QA 회원가입 테스트";
  const requestedMemberType = "정회원";
  const title = "QA 정회원 전환 요청";
  const message =
    "회원가입 v1 운영 확인을 위한 자동 테스트 문의입니다. 테스트 후 정리됩니다.";

  let memberId;
  let inquiryId;
  let reviewItemId;

  try {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert({
        email: testEmail,
        name: testName,
        member_type: "general",
        status: "active",
      })
      .select("id,email,member_type,status")
      .single();

    if (memberError) {
      throw new Error(`member insert failed: ${memberError.message}`);
    }

    memberId = member.id;

    const { data: inquiry, error: inquiryError } = await supabase
      .from("inquiry_entries")
      .insert({
        inquiry_type: "membership",
        name: testName,
        email: testEmail,
        requested_member_type: requestedMemberType,
        title,
        message,
      })
      .select("id,inquiry_type,email,requested_member_type")
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
        title: `${requestedMemberType} 전환 요청 · ${testName}`,
        status: "review",
        risk: "low",
        required_author_role: "general",
        required_publish_role: "admin",
        submitted_by: memberId,
      })
      .select("id,subject_kind,status")
      .single();

    if (reviewError) {
      throw new Error(`review queue insert failed: ${reviewError.message}`);
    }

    reviewItemId = reviewItem.id;

    const failures = [];

    if (member.member_type !== "general" || member.status !== "active") {
      failures.push("member row did not use active general defaults");
    }

    if (inquiry.inquiry_type !== "membership") {
      failures.push("inquiry row was not saved as membership");
    }

    if (reviewItem.subject_kind !== "member-upgrade") {
      failures.push("review queue item was not saved as member-upgrade");
    }

    console.log(
      JSON.stringify(
        {
          checked: ["members", "inquiry_entries", "review_queue_items"],
          memberCreated: Boolean(memberId),
          inquiryCreated: Boolean(inquiryId),
          reviewQueueCreated: Boolean(reviewItemId),
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
