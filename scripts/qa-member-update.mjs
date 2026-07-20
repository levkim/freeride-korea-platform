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

  const email = `qa-member-update-${Date.now()}@freeride.kr`;
  let memberId;

  try {
    const { data: member, error: insertError } = await supabase
      .from("members")
      .insert({
        email,
        name: "QA 회원 등급 변경",
        member_type: "general",
        status: "active",
      })
      .select("id,member_type,status")
      .single();

    if (insertError) {
      throw new Error(`member insert failed: ${insertError.message}`);
    }

    memberId = member.id;

    const { error: updateError } = await supabase
      .from("members")
      .update({
        member_type: "regular",
        status: "reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    if (updateError) {
      throw new Error(`member update failed: ${updateError.message}`);
    }

    const { data: updatedMember, error: readError } = await supabase
      .from("members")
      .select("member_type,status")
      .eq("id", memberId)
      .single();

    if (readError) {
      throw new Error(`member read failed: ${readError.message}`);
    }

    const failures = [];

    if (updatedMember.member_type !== "regular") {
      failures.push("member_type was not updated to regular");
    }

    if (updatedMember.status !== "reviewing") {
      failures.push("status was not updated to reviewing");
    }

    console.log(
      JSON.stringify(
        {
          checked: ["members.update"],
          memberCreated: Boolean(memberId),
          memberType: updatedMember.member_type,
          status: updatedMember.status,
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
    if (memberId) {
      await supabase.from("members").delete().eq("id", memberId);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
