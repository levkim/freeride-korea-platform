import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";

const githubActionsUrl =
  "https://github.com/levkim/freeride-korea-platform/actions/workflows/ci.yml";

type ChecklistItem = {
  title: string;
  description: string;
  ready: boolean;
  status: string;
};

type EnvironmentItem = {
  key: string;
  purpose: string;
  source: string;
  required: boolean;
  isConfigured: boolean;
  displayValue: string;
};

function getEnvironmentItems(): EnvironmentItem[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY || "";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const storageBucket =
    process.env.SUPABASE_STORAGE_CONTENT_BUCKET || "content-images";

  return [
    {
      key: "NEXT_PUBLIC_SITE_URL",
      purpose: "사이트 주소, sitemap, robots, 배포 후 QA 기준 URL",
      source: "호스팅 서비스에서 확정한 운영 도메인",
      required: true,
      isConfigured: Boolean(siteUrl),
      displayValue: siteUrl || "미설정",
    },
    {
      key: "ADMIN_ACCESS_KEY",
      purpose: "Supabase Auth 전까지 관리자 화면을 보호하는 임시 접근 키",
      source: "운영자가 직접 정하는 16자 이상 비밀값",
      required: true,
      isConfigured: Boolean(adminAccessKey),
      displayValue: adminAccessKey ? "설정됨" : "미설정",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      purpose: "Supabase 프로젝트 API URL",
      source: "Supabase Project Settings > API",
      required: true,
      isConfigured: Boolean(supabaseUrl),
      displayValue: supabaseUrl || "미설정",
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      purpose: "서버 액션에서 문의, 게시물, 검토 기록을 저장하는 service role key",
      source: "Supabase Project Settings > API",
      required: true,
      isConfigured: Boolean(serviceRoleKey),
      displayValue: serviceRoleKey ? "설정됨" : "미설정",
    },
    {
      key: "SUPABASE_STORAGE_CONTENT_BUCKET",
      purpose: "관리자 이미지 업로드가 사용할 Storage bucket 이름",
      source: "기본값 content-images 사용 가능",
      required: false,
      isConfigured: true,
      displayValue: storageBucket,
    },
  ];
}

function getDeploymentChecklist(): ChecklistItem[] {
  const supabaseStatus = getSupabaseAdminStatus();
  const siteUrl = getSiteUrl();
  const hasSiteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  const hasAdminAccessKey = Boolean(process.env.ADMIN_ACCESS_KEY);

  return [
    {
      title: "GitHub main 브랜치",
      description:
        "현재 작업은 GitHub main 브랜치에 푸시하는 흐름으로 관리합니다. 배포 플랫폼은 이 브랜치를 기준으로 연결합니다.",
      ready: true,
      status: "진행중",
    },
    {
      title: "공개 사이트 URL",
      description:
        "운영 도메인이 정해지면 NEXT_PUBLIC_SITE_URL을 실제 사이트 주소로 설정합니다. sitemap과 robots가 이 값을 사용합니다.",
      ready: hasSiteUrl,
      status: hasSiteUrl ? siteUrl : "로컬 기본값 사용중",
    },
    {
      title: "관리자 접근 보호",
      description:
        "운영 배포 전 ADMIN_ACCESS_KEY를 설정해 /admin 화면이 외부에 그대로 열리지 않도록 합니다.",
      ready: hasAdminAccessKey,
      status: hasAdminAccessKey ? "설정됨" : "설정 필요",
    },
    {
      title: "Supabase 프로젝트",
      description:
        "실제 문의, 콘텐츠 작성, 검토 기록을 저장하려면 Supabase 프로젝트와 service role 환경변수가 필요합니다.",
      ready: supabaseStatus.isConfigured,
      status: supabaseStatus.isConfigured
        ? "Supabase 모드"
        : `Mock 모드: ${supabaseStatus.missingEnv.join(", ")}`,
    },
    {
      title: "Supabase RLS",
      description:
        "Supabase 테이블 생성 후 docs/database/supabase-rls-hotfix-v1.sql을 실행하고 Advisors 경고를 확인합니다.",
      ready: supabaseStatus.isConfigured,
      status: supabaseStatus.isConfigured ? "DB 점검 필요" : "Supabase 연결 후 확인",
    },
    {
      title: "Storage bucket",
      description:
        "콘텐츠 이미지 업로드를 위해 content-images bucket을 생성합니다. 이름은 SUPABASE_STORAGE_CONTENT_BUCKET으로 바꿀 수 있습니다.",
      ready: supabaseStatus.isConfigured,
      status: supabaseStatus.isConfigured ? "bucket 확인 필요" : "Supabase 연결 후 확인",
    },
    {
      title: "릴리즈 QA",
      description:
        "배포 직전 npm run qa:release와 npm run build를 통과해야 합니다. 링크, SEO, 빌드 오류를 함께 확인합니다.",
      ready: true,
      status: "명령 준비됨",
    },
    {
      title: "헬스 체크",
      description:
        "배포 후 /health 페이지는 사람이 확인하고, /healthz endpoint는 모니터링 도구가 앱 응답과 데이터 모드를 확인할 때 사용합니다.",
      ready: true,
      status: "/health, /healthz 준비됨",
    },
  ];
}

const qaCommands = [
  "npm run qa:preflight",
  "npm run qa:release",
  "npm run build",
  "npm run qa:deploy-env",
  "npm run qa:smoke",
  "curl http://localhost:3000/health",
  "curl http://localhost:3000/healthz",
  "QA_BASE_URL=https://your-domain.example npm run qa:smoke",
  "QA_BASE_URL=https://your-domain.example npm run qa:release",
];

export const metadata = {
  title: "배포 점검 | FREERIDE KOREA Admin",
};

export const dynamic = "force-dynamic";

export default function AdminDeploymentPage() {
  const checklist = getDeploymentChecklist();
  const environmentItems = getEnvironmentItems();
  const readyCount = checklist.filter((item) => item.ready).length;

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
            Deployment Readiness
          </p>
          <h1 className="mt-3 text-4xl font-black">배포 전 점검</h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            GitHub, 환경변수, Supabase, 관리자 보호, QA 명령을 운영 배포 전에
            한 화면에서 확인합니다. 실제 도메인과 Supabase 프로젝트가 정해지면
            이 페이지의 상태가 준비됨으로 바뀝니다.
          </p>
        </div>
        <Badge tone={readyCount === checklist.length ? "green" : "amber"}>
          {readyCount} / {checklist.length} 준비
        </Badge>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {checklist.map((item) => (
          <article key={item.title} className="border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                  {item.description}
                </p>
              </div>
              <Badge tone={item.ready ? "green" : "amber"}>
                {item.ready ? "준비됨" : "확인 필요"}
              </Badge>
            </div>
            <p className="mt-4 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black text-zinc-700">
              {item.status}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              GitHub Actions
            </p>
            <h2 className="mt-3 text-2xl font-black">CI 상태 확인</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
              GitHub에 push하면 CI가 자동으로 빌드, 릴리즈 QA, 스모크 QA를
              실행합니다. 배포 전에는 마지막 main 브랜치 실행 결과가 성공인지
              확인합니다.
            </p>
          </div>
          <a
            href={githubActionsUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-white"
          >
            Actions 열기
          </a>
        </div>
        <p className="mt-4 break-all border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black text-zinc-700">
          {githubActionsUrl}
        </p>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
              Environment Variables
            </p>
            <h2 className="mt-3 text-2xl font-black">운영 환경변수</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
              실제 배포 서비스의 Environment Variables 메뉴에 아래 값을 입력합니다.
              필수값이 비어 있으면 운영 배포 전 `npm run qa:deploy-env`에서
              실패하도록 했습니다.
            </p>
          </div>
          <Badge
            tone={
              environmentItems.every((item) => !item.required || item.isConfigured)
                ? "green"
                : "amber"
            }
          >
            {
              environmentItems.filter((item) => !item.required || item.isConfigured)
                .length
            }{" "}
            / {environmentItems.length} 확인
          </Badge>
        </div>

        <div className="mt-5 grid gap-3">
          {environmentItems.map((item) => (
            <article
              key={item.key}
              className="grid gap-4 border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-[220px_1fr_180px]"
            >
              <div>
                <code className="text-sm font-black text-zinc-950">
                  {item.key}
                </code>
                <div className="mt-2">
                  <Badge
                    tone={
                      item.required && !item.isConfigured ? "amber" : "green"
                    }
                  >
                    {item.required
                      ? item.isConfigured
                        ? "필수 설정됨"
                        : "필수 미설정"
                      : "선택"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-zinc-700">
                  {item.purpose}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-500">
                  {item.source}
                </p>
              </div>
              <p className="break-all border border-zinc-200 bg-white px-3 py-2 text-sm font-black text-zinc-700">
                {item.displayValue}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-black uppercase text-[var(--color-fk-blue)]">
          Release Commands
        </p>
        <h2 className="mt-3 text-2xl font-black">배포 직전 실행 명령</h2>
        <div className="mt-5 grid gap-3">
          {qaCommands.map((command) => (
            <code
              key={command}
              className="block border border-zinc-200 bg-zinc-950 px-4 py-3 text-sm font-bold text-white"
            >
              {command}
            </code>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
