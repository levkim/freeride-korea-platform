import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { getSiteUrl } from "@/lib/site-url";
import { getSupabaseAdminStatus } from "@/lib/supabase/admin";
import { getMissingSupabaseAuthEnv } from "@/lib/supabase/auth";

const githubActionsUrl =
  "https://github.com/levkim/freeride-korea-platform/actions/workflows/ci.yml";

const deploymentDocs = [
  [
    "Production launch checklist",
    "docs/deployment/production-launch-checklist-v1.md",
    "배포 당일 GitHub, Supabase, 호스팅, 환경변수, 배포 후 QA를 순서대로 체크합니다.",
  ],
  [
    "Hosting setup",
    "docs/deployment/hosting-setup-v1.md",
    "호스팅 서비스에 입력할 브랜치, Node 버전, build/start 명령, health check 경로를 확인합니다.",
  ],
  [
    "Supabase setup",
    "docs/database/supabase-schema-v1.sql",
    "DB 테이블 생성 기준입니다. 이후 RLS hotfix와 Storage 문서를 함께 적용합니다.",
  ],
  [
    "RLS hotfix",
    "docs/database/supabase-rls-hotfix-v1.sql",
    "Supabase Advisors의 public table RLS critical 경고를 처리하기 위한 SQL입니다.",
  ],
  [
    "Initial seed data",
    "docs/database/supabase-seed-v1.sql",
    "Supabase 연결 직후 공개 페이지가 비지 않도록 초기 뉴스/이벤트/카테고리 콘텐츠를 넣습니다.",
  ],
];

const hostingSettings = [
  ["Repository", "levkim/freeride-korea-platform"],
  ["Production branch", "main"],
  ["Node.js version", "20"],
  ["Install command", "npm ci"],
  ["Build command", "npm run build"],
  ["Runtime", "Sites production deployment"],
  ["Health check path", "/healthz"],
  [
    "Post-deploy smoke QA",
    "cmd /c \"set QA_BASE_URL=https://www.freeride.kr&& npm.cmd run qa:smoke\"",
  ],
];

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
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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
      purpose:
        "Supabase Auth 전까지 관리자 화면을 보호하는 임시 접근 키. 쿠키에는 원문 대신 해시 토큰만 저장합니다.",
      source: "운영자가 직접 정하는 16자 이상 비밀값. secret 환경변수로 저장하고 교체 시 재배포합니다.",
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
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      purpose:
        "회원가입, 로그인, 세션 확인에 사용하는 Supabase Auth 브라우저용 공개 키",
      source: "Supabase Project Settings > API > anon public key",
      required: true,
      isConfigured: Boolean(supabaseAnonKey),
      displayValue: supabaseAnonKey ? "설정됨" : "미설정",
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
  const missingAuthEnv = getMissingSupabaseAuthEnv();
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
        "운영 배포 전 ADMIN_ACCESS_KEY를 설정해 /admin 화면이 외부에 그대로 열리지 않도록 합니다. 브라우저에는 접근 키 원문이 아니라 해시 토큰만 저장됩니다.",
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
      title: "회원 로그인 Auth",
      description:
        "회원가입과 로그인은 Supabase Auth를 사용합니다. NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되어야 /account에서 실제 회원 세션이 작동합니다.",
      ready: missingAuthEnv.length === 0,
      status:
        missingAuthEnv.length === 0
          ? "Supabase Auth 준비됨"
          : `설정 필요: ${missingAuthEnv.join(", ")}`,
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
  [
    "전체 배포 전 점검",
    "npm.cmd run qa:preflight",
    "빌드, 타입, 링크, SEO, 런타임, 이미지, 스모크 체크를 한 번에 실행합니다.",
  ],
  [
    "운영 환경변수 점검",
    "npm.cmd run qa:deploy-env",
    "운영 도메인, 관리자 접근 키, Supabase URL, anon key, service role key 설정 여부를 확인합니다.",
  ],
  [
    "회원가입 저장 흐름",
    "npm.cmd run qa:membership",
    "회원가입 문의, 일반회원 생성, 회원 전환 검토 큐 생성 경로를 확인합니다.",
  ],
  [
    "회원 등급 수동 변경",
    "npm.cmd run qa:member-update",
    "관리자 회원 목록에서 등급과 상태를 저장할 수 있는 DB 경로를 확인합니다.",
  ],
  [
    "회원 전환 승인",
    "npm.cmd run qa:member-upgrade-approval",
    "검토 승인 후 회원 등급, 문의 상태, 검토 이력이 함께 반영되는지 확인합니다.",
  ],
  [
    "댓글 관리",
    "npm.cmd run qa:comment-moderation",
    "댓글 숨김 처리와 comment_events 기록이 Supabase에 저장되는지 확인합니다.",
  ],
  [
    "Supabase 테이블 점검",
    "npm.cmd run db:check",
    "주요 테이블과 Storage 연결 상태를 CLI에서 확인합니다.",
  ],
  [
    "Storage 버킷 확인",
    "npm.cmd run db:storage:ensure",
    "content-images 버킷 존재 여부를 확인하고 필요 시 생성 경계를 점검합니다.",
  ],
  [
    "운영 스모크 QA",
    "cmd /c \"set QA_BASE_URL=https://www.freeride.kr&& npm.cmd run qa:smoke\"",
    "배포 후 운영 도메인의 핵심 공개/관리자 경로 응답을 확인합니다.",
  ],
  [
    "운영 이미지 QA",
    "cmd /c \"set QA_BASE_URL=https://www.freeride.kr&& npm.cmd run qa:assets\"",
    "운영 도메인에서 로고와 핵심 브랜드 이미지가 깨지지 않는지 확인합니다.",
  ],
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
              Deployment Documents
            </p>
            <h2 className="mt-3 text-2xl font-black">배포 문서 바로가기</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
              실제 배포 작업은 아래 문서를 기준으로 진행합니다. 관리자 화면은
              상태 확인용이고, 이 문서들은 실행 순서와 설정값을 고정해 둔 기준입니다.
            </p>
          </div>
          <Badge tone="green">운영 기준 문서</Badge>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {deploymentDocs.map(([title, path, description]) => (
            <article key={path} className="border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="text-lg font-black text-zinc-950">{title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                {description}
              </p>
              <code className="mt-3 block break-all border border-zinc-200 bg-white px-3 py-2 text-sm font-black text-zinc-800">
                {path}
              </code>
            </article>
          ))}
        </div>
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
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black uppercase text-[var(--color-fk-red)]">
              Hosting Setup
            </p>
            <h2 className="mt-3 text-2xl font-black">호스팅 설정값</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
              Vercel, Netlify, Render 등 Next.js를 지원하는 호스팅 서비스에
              프로젝트를 연결할 때 사용하는 기본 설정입니다. 실제 도메인이 정해지면
              `NEXT_PUBLIC_SITE_URL`과 배포 후 QA 명령의 URL만 교체합니다.
            </p>
          </div>
          <Badge tone="green">Next.js 기준</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {hostingSettings.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[160px_1fr]"
            >
              <p className="text-sm font-black text-zinc-500">{label}</p>
              <code className="break-all text-sm font-black text-zinc-950">
                {value}
              </code>
            </div>
          ))}
        </div>
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
        <h2 className="mt-3 text-2xl font-black">운영 QA 명령</h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-zinc-600">
          Windows PowerShell에서는 `npm` 대신 `npm.cmd`를 사용합니다. 운영 도메인
          기준 QA는 `cmd /c &quot;set QA_BASE_URL=...&& npm.cmd run ...&quot;` 형식으로
          실행하면 환경변수 해석 문제가 적습니다.
        </p>
        <div className="mt-5 grid gap-3">
          {qaCommands.map(([title, command, description]) => (
            <article
              key={command}
              className="grid gap-3 border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-[220px_1fr]"
            >
              <div>
                <p className="font-black text-zinc-950">{title}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">
                  {description}
                </p>
              </div>
              <code className="block break-all border border-zinc-200 bg-zinc-950 px-4 py-3 text-sm font-bold text-white">
                {command}
              </code>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
