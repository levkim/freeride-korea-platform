import {
  createSupabaseAdminClient,
  getSupabaseAdminConfig,
  getSupabaseAdminStatus,
} from "@/lib/supabase/admin";

type DiagnosticTone = "green" | "amber" | "red";

type TableCheck = {
  table: string;
  label: string;
  tone: DiagnosticTone;
  status: string;
  detail: string;
};

type StorageCheck = {
  bucket: string;
  tone: DiagnosticTone;
  status: string;
  detail: string;
};

const tableChecks = [
  ["members", "회원 계정"],
  ["content_entries", "공통 콘텐츠"],
  ["event_entries", "대회/이벤트"],
  ["content_links", "콘텐츠 링크"],
  ["review_queue_items", "검토 대기열"],
  ["inquiry_entries", "문의 접수"],
  ["review_events", "검토 이력"],
  ["inquiry_events", "문의 처리 이력"],
  ["comments", "댓글"],
  ["comment_events", "댓글 처리 이력"],
];

function getCountColumn(table: string) {
  return table === "event_entries" ? "content_id" : "id";
}

function formatError(errorMessage: string) {
  if (errorMessage.length <= 120) {
    return errorMessage;
  }

  return `${errorMessage.slice(0, 117)}...`;
}

export async function getSupabaseDiagnostics() {
  const adminStatus = getSupabaseAdminStatus();
  const config = getSupabaseAdminConfig();

  if (!adminStatus.isConfigured) {
    return {
      mode: adminStatus.mode,
      isConfigured: false,
      missingEnv: adminStatus.missingEnv,
      tableChecks: tableChecks.map(([table, label]) => ({
        table,
        label,
        tone: "amber" as const,
        status: "대기",
        detail: "Supabase 환경변수 설정 후 점검할 수 있습니다.",
      })),
      storageCheck: {
        bucket: config.contentImageBucket,
        tone: "amber" as const,
        status: "대기",
        detail: "Storage bucket은 Supabase 연결 후 확인합니다.",
      },
    };
  }

  const client = createSupabaseAdminClient();

  const resolvedTableChecks: TableCheck[] = await Promise.all(
    tableChecks.map(async ([table, label]) => {
      const { count, error } = await client
        .from(table)
        .select(getCountColumn(table), { count: "exact", head: true });

      if (error) {
        return {
          table,
          label,
          tone: "red" as const,
          status: "확인 필요",
          detail: formatError(error.message),
        };
      }

      return {
        table,
        label,
        tone: "green" as const,
        status: "정상",
        detail: `테이블 응답 확인, 현재 ${count ?? 0}건`,
      };
    }),
  );

  const { data: buckets, error: bucketError } =
    await client.storage.listBuckets();
  const bucketExists = buckets?.some(
    (bucket) => bucket.name === config.contentImageBucket,
  );

  const storageCheck: StorageCheck = bucketError
    ? {
        bucket: config.contentImageBucket,
        tone: "red",
        status: "확인 필요",
        detail: formatError(bucketError.message),
      }
    : bucketExists
      ? {
          bucket: config.contentImageBucket,
          tone: "green",
          status: "정상",
          detail: "Storage bucket이 존재합니다.",
        }
      : {
          bucket: config.contentImageBucket,
          tone: "amber",
          status: "생성 필요",
          detail: "Supabase Storage에서 해당 bucket을 생성해야 합니다.",
        };

  return {
    mode: adminStatus.mode,
    isConfigured: true,
    missingEnv: adminStatus.missingEnv,
    tableChecks: resolvedTableChecks,
    storageCheck,
  };
}
