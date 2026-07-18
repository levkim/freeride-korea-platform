import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

const schemaObjects = [
  ["members", "회원 계정, 등급, 승인 상태"],
  ["content_entries", "뉴스, 영상, 교육, 투어, 컬쳐, 샵 공통 콘텐츠"],
  ["event_entries", "대회 일정, 시리즈, 국가, 장소, 링크"],
  ["content_links", "콘텐츠 관련 외부 링크"],
  ["review_queue_items", "관리자 검토 대기열"],
  ["review_events", "승인, 게시, 수정요청, 반려 기록"],
  ["inquiry_entries", "문의/참여/회원 신청 접수"],
  ["inquiry_events", "문의 처리 상태 변경 기록"],
  ["comments", "회원 댓글, 신고 수, 고정 여부, 노출 상태"],
  ["comment_events", "댓글 공개, 숨김, 삭제, 신고, 고정 처리 기록"],
];

const storageObjects = [
  [
    "content-images",
    "이벤트, 뉴스/비디오, 카테고리 콘텐츠 대표 이미지 저장소",
  ],
];

const envRows = [
  [
    "NEXT_PUBLIC_SUPABASE_URL",
    "Supabase 프로젝트 URL",
    "브라우저와 서버 양쪽에서 Supabase 프로젝트 위치를 식별합니다.",
  ],
  [
    "SUPABASE_SERVICE_ROLE_KEY",
    "서버 전용 service role key",
    "관리자 server action에서만 사용합니다. 브라우저에 노출하면 안 됩니다.",
  ],
];

const storageEnvRows = [
  [
    "SUPABASE_STORAGE_CONTENT_BUCKET",
    "콘텐츠 이미지 Storage 버킷",
    "기본값은 content-images입니다. 관리자 이미지 업로드를 Supabase Storage에 연결할 때 사용합니다.",
  ],
];

const setupSteps = [
  [
    "1",
    "Supabase 프로젝트 생성",
    "프로젝트를 만들고 Project URL과 service role key를 확인합니다.",
  ],
  [
    "2",
    "스키마 SQL 적용",
    "docs/database/supabase-schema-v1.sql 내용을 Supabase SQL Editor에서 실행합니다.",
  ],
  [
    "3",
    ".env.local 작성",
    ".env.example을 복사해 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 값을 넣습니다.",
  ],
  [
    "4",
    "로컬 서버 재시작",
    "환경변수는 서버 시작 시 읽히므로 npm run dev를 다시 실행합니다.",
  ],
  [
    "5",
    "관리자 화면 확인",
    "/admin에서 데이터 저장 상태가 supabase로 바뀌는지 확인합니다.",
  ],
  [
    "6",
    "테스트 입력",
    "문의, 카테고리 초안, 검토 액션을 하나씩 입력해 실제 DB에 저장되는지 확인합니다.",
  ],
];

const persistenceAreas = [
  ["문의/참여", "inquiry_entries, inquiry_events", "이미 Supabase 저장 경계 구현"],
  ["카테고리 초안", "content_entries, review_queue_items", "이미 Supabase 저장 경계 구현"],
  ["검토 액션", "review_events, review_queue_items, content_entries", "이미 Supabase 상태 동기화 구현"],
  ["카테고리 목록/상세", "content_entries", "Supabase 읽기 + seed fallback 구현"],
  ["검토 대기열", "review_queue_items, review_events", "Supabase 읽기 + seed fallback 구현"],
  ["이벤트/뉴스 전용 CMS", "content_entries, event_entries", "다음 구현 후보"],
  ["댓글", "comments, comment_events", "스키마 준비 + mock 관리 액션 구현"],
  ["이미지 업로드", "storage bucket: content-images", "업로드 UI 준비 + Storage 연결 문서화"],
];

export const metadata = {
  title: "DB 연결 준비 | FREERIDE KOREA Admin",
};

export default function AdminDataSetupPage() {
  const supabaseStatus = getSupabaseAdminStatus();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            Supabase Setup
          </p>
          <h1 className="mt-3 text-4xl font-black">DB 연결 준비</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            현재 로컬 seed 데이터 기반 화면을 Supabase 저장 구조로 넘기기 위한
            체크리스트입니다. 실제 저장 전환 전에 환경변수, 스키마, 저장 영역을
            한 번에 확인합니다.
          </p>
        </div>
        <Badge tone={supabaseStatus.isConfigured ? "green" : "amber"}>
          {supabaseStatus.mode}
        </Badge>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
          <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
            현재 연결 상태
          </p>
          <h2 className="mt-3 text-2xl font-black">
            {supabaseStatus.isConfigured
              ? "Supabase 환경변수 설정 완료"
              : "Mock / seed 데이터 모드"}
          </h2>
          <p className="mt-3 text-sm font-bold leading-6 text-zinc-600">
            {supabaseStatus.isConfigured
              ? "서버 액션과 repository가 Supabase 저장소를 사용할 수 있는 상태입니다."
              : "아직 환경변수가 없어서 입력/검토 액션은 검증 모드로 처리되고, 화면은 seed 데이터 fallback을 사용합니다."}
          </p>
          <div className="mt-5 grid gap-3">
            {[...envRows, ...storageEnvRows].map(([name, label, description]) => {
              const isMissing = supabaseStatus.missingEnv.includes(name);

              return (
                <div
                  key={name}
                  className="border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black text-zinc-950">{name}</p>
                    <Badge tone={isMissing ? "amber" : "green"}>
                      {isMissing ? "필요" : "설정됨"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-black text-zinc-700">
                    {label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="border border-zinc-200 bg-white p-5 shadow-[var(--shadow-diffused)]">
          <p className="text-sm font-black uppercase text-zinc-500">
            적용 순서
          </p>
          <div className="mt-5 grid gap-3">
            {setupSteps.map(([number, title, text]) => (
              <div
                key={number}
                className="grid gap-3 border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[56px_1fr]"
              >
                <p className="fk-nav-type text-3xl leading-none text-[var(--color-fk-red)]">
                  {number}
                </p>
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-sm font-bold leading-6 text-zinc-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
          스키마 구성
        </p>
        <h2 className="mt-3 text-2xl font-black">
          docs/database/supabase-schema-v1.sql
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {schemaObjects.map(([name, description]) => (
            <div key={name} className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-black text-zinc-950">{name}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
          Storage 구성
        </p>
        <h2 className="mt-3 text-2xl font-black">
          docs/database/supabase-storage-v1.md
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {storageObjects.map(([name, description]) => (
            <div key={name} className="border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-black text-zinc-950">{name}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-hidden border border-zinc-200 bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">영역</th>
              <th className="px-4 py-3">주요 테이블</th>
              <th className="px-4 py-3">현재 구현 상태</th>
            </tr>
          </thead>
          <tbody>
            {persistenceAreas.map(([area, tables, status]) => (
              <tr key={area} className="border-t border-zinc-100">
                <td className="px-4 py-4 font-black">{area}</td>
                <td className="px-4 py-4 font-bold text-zinc-700">{tables}</td>
                <td className="px-4 py-4 font-bold text-zinc-600">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
