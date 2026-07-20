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

  const timestamp = Date.now();
  let memberId;
  let contentId;
  let commentId;
  let commentEventId;

  try {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .insert({
        email: `qa-comment-${timestamp}@freeride.kr`,
        name: "QA 댓글 회원",
        member_type: "general",
        status: "active",
      })
      .select("id")
      .single();

    if (memberError) {
      throw new Error(`member insert failed: ${memberError.message}`);
    }

    memberId = member.id;

    const { data: content, error: contentError } = await supabase
      .from("content_entries")
      .insert({
        kind: "culture",
        status: "published",
        title_ko: "QA 댓글 대상 콘텐츠",
        title_en: "QA Comment Target",
        summary_ko: "댓글 관리 QA 대상입니다.",
        summary_en: "Comment moderation QA target.",
        body_ko: "댓글 관리 QA 대상입니다.",
        body_en: "Comment moderation QA target.",
        metadata: { qa: true },
      })
      .select("id")
      .single();

    if (contentError) {
      throw new Error(`content insert failed: ${contentError.message}`);
    }

    contentId = content.id;

    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .insert({
        target_type: "category-content",
        target_content_id: contentId,
        author_id: memberId,
        body: "댓글 관리 Supabase 연결 QA입니다. 테스트 후 정리됩니다.",
        status: "reported",
        report_count: 1,
      })
      .select("id,status,pinned")
      .single();

    if (commentError) {
      throw new Error(`comment insert failed: ${commentError.message}`);
    }

    commentId = comment.id;

    const { error: updateError } = await supabase
      .from("comments")
      .update({
        status: "hidden",
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (updateError) {
      throw new Error(`comment moderation failed: ${updateError.message}`);
    }

    const { data: commentEvent, error: eventError } = await supabase
      .from("comment_events")
      .insert({
        comment_id: commentId,
        action: "hide",
        from_status: "reported",
        to_status: "hidden",
        note: "QA 댓글 숨김 처리",
      })
      .select("id")
      .single();

    if (eventError) {
      throw new Error(`comment event insert failed: ${eventError.message}`);
    }

    commentEventId = commentEvent.id;

    const [{ data: updatedComment }, { data: events }] = await Promise.all([
      supabase.from("comments").select("status").eq("id", commentId).single(),
      supabase.from("comment_events").select("id,action").eq("comment_id", commentId),
    ]);

    const failures = [];

    if (updatedComment?.status !== "hidden") {
      failures.push("comment status was not hidden");
    }

    if (!events?.some((event) => event.action === "hide")) {
      failures.push("hide comment event was not recorded");
    }

    console.log(
      JSON.stringify(
        {
          checked: ["comments.update", "comment_events.insert"],
          commentId,
          contentId,
          memberId,
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
    if (commentEventId) {
      await supabase.from("comment_events").delete().eq("id", commentEventId);
    }

    if (commentId) {
      await supabase.from("comments").delete().eq("id", commentId);
    }

    if (contentId) {
      await supabase.from("content_entries").delete().eq("id", contentId);
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
