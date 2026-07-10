# Next.js Project Bootstrap v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 웹앱을 실제로 생성하기 전에 필요한 부트스트랩 기준을 정의한다.

목표는 `Next.js + TypeScript + Tailwind CSS + Supabase 준비 구조`를 기반으로 공개 웹사이트, 회원 포털, 관리자 모드가 함께 확장될 수 있는 첫 프로젝트 구조를 만드는 것이다.

이 문서는 아직 실제 개발 명령을 실행한 결과가 아니라, 다음 단계에서 프로젝트를 생성할 때 따라야 할 실행 기준이다.

기준 문서:

- `website/frontend-implementation-plan-v1.md`
- `website/project-structure-v1.md`
- `website/database-schema-v1.md`
- `website/supabase-rls-policy-v1.md`
- `website/admin-permission-matrix-v1.md`
- `website/member-portal-requirements-v1.md`

## Project Name / 프로젝트명

권장 실제 웹앱 폴더명:

```text
freeride-korea-webapp
```

권장 위치:

```text
F:\Freeride korea\freeride-korea-brand\freeride-korea-webapp
```

현재 `freeride-korea-brand` 폴더는 브랜드 문서, 로고, 프리뷰, 웹사이트 설계 문서를 보관하는 상위 프로젝트 폴더로 유지한다.

실제 Next.js 앱은 그 안에 별도 하위 폴더로 만든다.

## Bootstrap Strategy / 생성 전략

초기 생성 원칙:

1. Next.js App Router를 사용한다.
2. TypeScript를 기본으로 사용한다.
3. Tailwind CSS를 기본 스타일 시스템으로 사용한다.
4. ESLint를 켠다.
5. import alias는 `@/*`를 사용한다.
6. Supabase는 바로 연결 가능한 구조만 만들고, 실제 키는 `.env.local`에서 관리한다.
7. 초기 화면은 실제 DB 없이 mock data로 동작하게 만든다.
8. 공개 웹사이트, 회원 포털, 관리자 모드 라우트를 처음부터 분리한다.

권장 생성 명령:

```powershell
npx create-next-app@latest freeride-korea-webapp --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"
```

생성 후 설치할 초기 패키지:

```powershell
npm install @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge zod
npm install -D prettier
```

선택 패키지, 나중에 필요 시:

```powershell
npm install date-fns
npm install react-hook-form @hookform/resolvers
npm install @tanstack/react-table
```

초기에는 패키지를 과하게 늘리지 않는다. 실제 필요가 생길 때 추가한다.

## Initial Folder Structure / 초기 폴더 구조

프로젝트 생성 후 권장 구조:

```text
freeride-korea-webapp/
  app/
    (public)/
      page.tsx
      about/
        page.tsx
      contact-join/
        page.tsx
    account/
      page.tsx
      profile/
        page.tsx
      membership/
        page.tsx
      upgrade/
        page.tsx
    admin/
      page.tsx
      review-queue/
        page.tsx
      members/
        page.tsx
      contact-join/
        page.tsx
    api/
    layout.tsx
    globals.css
  components/
    public/
    admin/
    account/
    forms/
    media/
    ui/
  features/
    auth/
    members/
    content/
    news-video/
    events/
    programs/
    tours/
    culture/
    resources/
    marketplace/
    applications/
    review-queue/
    source-monitor/
    ai-assistant/
    shop/
  lib/
    supabase/
    auth/
    permissions/
    publishing/
    validation/
    dates/
    utils/
    types/
  content/
    constants/
    seed/
    copy/
  database/
    migrations/
    seed/
    policies/
    functions/
  docs/
    adr/
    planning/
    operations/
  public/
    brand/
    images/
    icons/
  scripts/
  tests/
  .env.example
```

## Source Documents To Copy / 복사할 문서

실제 웹앱 프로젝트가 생성되면 다음 문서를 `docs/planning/`에 복사한다.

```text
docs/planning/sitemap-v1.md
docs/planning/frontend-implementation-plan-v1.md
docs/planning/project-structure-v1.md
docs/planning/database-schema-v1.md
docs/planning/supabase-rls-policy-v1.md
docs/planning/admin-permission-matrix-v1.md
docs/planning/member-portal-requirements-v1.md
docs/planning/ai-automation-planning-v1.md
```

ADR 문서는 다음 위치로 복사한다.

```text
docs/adr/0001-record-architecture-decisions.md
docs/adr/0002-use-human-in-the-loop-ai-automation.md
docs/adr/0003-separate-content-authoring-and-publishing-permissions.md
docs/adr/0004-select-custom-web-app-stack.md
```

## Brand Assets / 브랜드 에셋

초기 복사 대상:

```text
public/brand/logo-primary.png
public/brand/logo-secondary-emblem.png
public/brand/logo-black-one-color.png
public/brand/logo-secondary-wordmark.png
```

현재 기준 원본:

```text
F:\Freeride korea\freeride-korea-brand\assets\mockups\candidate-04.png
F:\Freeride korea\freeride-korea-brand\assets\mockups\secondary-emblem-logo.png
F:\Freeride korea\freeride-korea-brand\assets\mockups\black-a-candidate04-no-korean.png
F:\Freeride korea\freeride-korea-brand\assets\mockups\candidate-02.png
```

주의:

- 현재 로고는 PNG 기반이다.
- 최종 SVG / PDF / AI 파일은 사용자가 Illustrator에서 별도로 정리할 예정이다.
- 웹앱 초기 개발은 PNG 에셋으로 시작해도 충분하다.

## Environment Variables / 환경변수

`.env.example`에 포함할 항목:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
AI_API_KEY=
SOURCE_MONITOR_SECRET=
ADMIN_ALERT_EMAIL=
```

초기 원칙:

- `.env.local`은 Git에 포함하지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용으로만 사용한다.
- AI API Key는 클라이언트에 노출하지 않는다.
- Source Monitor Secret은 scheduled job 또는 Edge Function에서만 사용한다.

## Design Tokens / 디자인 토큰

초기 CSS 변수:

```css
:root {
  --color-fk-red: #d71920;
  --color-fk-blue: #0057b8;
  --color-fk-black: #0b0d10;
  --color-fk-white: #ffffff;
  --color-fk-snow: #f5f7fa;
  --color-fk-stone: #d8dde5;
  --color-fk-muted: #667085;
}
```

토큰 방향:

- Red / Blue는 태극 문양에서 온 대표 컬러로 사용한다.
- Black은 로고, 헤딩, 관리자 UI 중심에 사용한다.
- Snow / Stone 계열은 공개 웹사이트와 관리자 배경에 사용한다.
- 전체가 단색 계열로 보이지 않도록 Red, Blue, Black, White의 균형을 유지한다.

## Initial Type Files / 초기 타입 파일

권장 파일:

```text
lib/types/member.ts
lib/types/content.ts
lib/types/event.ts
lib/types/program.ts
lib/types/tour.ts
lib/types/resource.ts
lib/types/review.ts
lib/types/marketplace.ts
```

초기 enum 기준:

```ts
export type MemberType =
  | "general"
  | "regular"
  | "executive"
  | "athlete"
  | "supporting";

export type PublishStatus =
  | "draft"
  | "review"
  | "needs_revision"
  | "approved"
  | "published"
  | "rejected"
  | "hidden"
  | "archived";

export type EventStatus =
  | "upcoming"
  | "live"
  | "completed"
  | "cancelled";
```

중요:

- DB key는 `supporting`으로 유지한다.
- 운영상 의미는 `후원회원 / Sponsorship Member`이며, 개인 후원과 브랜드 / 기업 / 단체 스폰서십을 포함한다.

## Mock Data Files / 목 데이터 파일

초기 mock 파일:

```text
content/seed/mock-members.ts
content/seed/mock-posts.ts
content/seed/mock-events.ts
content/seed/mock-programs.ts
content/seed/mock-tours.ts
content/seed/mock-resources.ts
content/seed/mock-applications.ts
content/seed/mock-review-queue.ts
content/seed/mock-marketplace.ts
content/seed/mock-notifications.ts
```

mock data 원칙:

1. KO / EN 필드를 처음부터 분리한다.
2. 상태값은 문서화된 enum만 사용한다.
3. 실제 DB 필드명과 최대한 맞춘다.
4. 관리자 화면과 공개 화면이 같은 mock data를 공유한다.
5. 나중에 Supabase seed data로 옮길 수 있게 만든다.

## First Routes To Build / 첫 구현 라우트

1차 구현 라우트:

```text
/
/about
/contact-join
/account
/admin
/admin/review-queue
```

이유:

- Home은 전체 브랜드와 최신 콘텐츠 구조를 검증한다.
- About은 브랜드 목적과 철학을 고정한다.
- Contact / Join은 회원, 문의, 파트너십, 스폰서십 진입점이다.
- Account는 회원 포털 구조의 기준점이다.
- Admin은 운영 화면의 기준점이다.
- Review Queue는 회원 작성, AI 초안, 공식 소스 후보를 검토하는 핵심 운영 흐름이다.

## First Components To Build / 첫 컴포넌트

공통 UI:

```text
components/ui/Button.tsx
components/ui/Badge.tsx
components/ui/StatusBadge.tsx
components/ui/Input.tsx
components/ui/Select.tsx
components/ui/Textarea.tsx
components/ui/Table.tsx
components/ui/EmptyState.tsx
```

공개 웹사이트:

```text
components/public/SiteHeader.tsx
components/public/SiteFooter.tsx
components/public/PageHero.tsx
components/public/ContentCard.tsx
components/public/CTASection.tsx
components/public/LatestUpdates.tsx
```

회원 포털:

```text
components/account/AccountShell.tsx
components/account/MemberStatusCard.tsx
components/account/ApplicationList.tsx
components/account/SubmissionList.tsx
```

관리자:

```text
components/admin/AdminShell.tsx
components/admin/AdminSidebar.tsx
components/admin/AdminTopbar.tsx
components/admin/DataTable.tsx
components/admin/ReviewQueueTable.tsx
components/admin/DetailPanel.tsx
```

## Helper Functions / 헬퍼 함수

초기 구현 대상:

```text
lib/utils/cn.ts
lib/dates/event-status.ts
lib/permissions/can-author.ts
lib/permissions/can-publish.ts
lib/publishing/status-label.ts
lib/validation/contact-form.ts
```

중요 로직:

- 이벤트 상태는 `startDateTime`, `endDateTime`, `cancelled` 값을 기준으로 계산한다.
- `cancelled === true`이면 일정과 무관하게 `cancelled`가 우선한다.
- `can-author`와 `can-publish`는 분리한다.
- 일반회원은 Culture 제보와 Marketplace 등록만 기본 허용한다.
- 정회원은 Tour / Program 초안 작성이 가능하다.
- 임원회원은 News / Video / Events 초안 작성이 가능하다.
- 모든 회원 작성 공개 콘텐츠는 Review Queue로 들어간다.

## Initial Page Scope / 첫 화면 범위

### Home

초기 섹션:

- Hero
- Core Pathways
- Latest Updates
- Featured Programs
- Featured Tours
- Upcoming Events
- Culture Preview
- Final CTA

### About

초기 섹션:

- Brand statement
- Purpose
- Positioning: 공식성 60%, 프리미엄 아웃도어 40%
- Fun / Respect / Safety
- What We Build
- Contact / Join CTA

### Contact / Join

초기 섹션:

- Inquiry pathway cards
- Smart form shell
- Membership guide
- Sponsorship / partnership guide
- Privacy notice

### Account

초기 섹션:

- Member status card
- Upgrade request status
- Applications summary
- Submissions summary
- Marketplace summary
- Notifications summary

### Admin

초기 섹션:

- Today summary
- Review Queue summary
- Pending members
- Pending inquiries
- Upcoming events
- AI / source monitor placeholder

### Review Queue

초기 섹션:

- Filter bar
- Queue table
- Status badges
- Risk flag
- Right detail panel placeholder
- Actions placeholder

## Supabase Connection Timing / Supabase 연결 시점

권장 순서:

1. Next.js 화면과 mock data 구조 생성
2. 타입과 권한 헬퍼 정리
3. Supabase 프로젝트 생성
4. `.env.local` 연결
5. Auth 기본 연결
6. `member_profiles` 생성 흐름 연결
7. RLS 정책 적용
8. Contact / Join 저장 연결
9. Review Queue 저장 연결
10. CMS 테이블 순차 연결

처음부터 Supabase에 모든 화면을 붙이지 않는다. 먼저 UI와 데이터 구조가 맞는지 확인한 뒤 연결한다.

## Development Commands / 개발 명령

프로젝트 생성 후 기본 명령:

```powershell
npm run dev
npm run lint
npm run build
```

권장 확인 순서:

1. `npm run dev`로 로컬 화면 확인
2. `npm run lint`로 문법 / 규칙 확인
3. 주요 화면 구현 후 `npm run build` 확인

## First QA Checklist / 첫 QA 체크리스트

1. Home이 로고, CTA, 최신 콘텐츠 mock data를 표시한다.
2. Header가 모바일에서 깨지지 않는다.
3. KO / EN 동시 표기가 과하게 겹치지 않는다.
4. Contact / Join 폼이 문의 유형별로 다른 필드를 보여준다.
5. Account Dashboard가 회원 등급을 표시한다.
6. Admin Dashboard가 운영 요약을 표시한다.
7. Review Queue가 콘텐츠 타입과 상태를 구분한다.
8. `can-author`와 `can-publish`가 별도 함수로 존재한다.
9. AI Assistant 관련 화면에 Publish 버튼이 없다.
10. `npm run lint`가 통과한다.
11. `npm run build`가 통과한다.

## Design Skill Timing / 디자인 스킬 사용 시점

지금 단계에서는 문서와 구조 정리가 우선이다.

`design-taste-frontend` 스킬은 다음 시점에 사용하는 것이 적합하다.

1. Home / Header / Footer / About / Contact 화면이 한 번 구현된 뒤
2. 공개 웹사이트의 첫인상을 고급화할 때
3. 관리자 화면의 정보 밀도와 사용성을 다듬을 때
4. 회원 포털의 상태 카드, 신청 흐름, 등급 전환 UX를 개선할 때

즉, 프로젝트 생성과 기본 화면 구현은 먼저 진행하고, 첫 화면이 브라우저에서 보이는 시점에 디자인 스킬을 적용한다.

## Out of Scope / 이번 단계 제외

이번 부트스트랩 단계에서는 제외한다.

- 실제 Supabase DB migration 실행
- 실제 AI API 연동
- 실제 공식 소스 모니터링 실행
- 온라인 결제
- 메일 발송 자동화
- 카카오톡 / SMS 알림
- 실제 배포
- 고급 모션 디자인

## Bootstrap Completion Criteria / 완료 기준

부트스트랩 완료 기준:

1. Next.js 프로젝트가 생성되어 있다.
2. 기본 폴더 구조가 생성되어 있다.
3. 브랜드 로고와 컬러 토큰이 연결되어 있다.
4. mock data가 생성되어 있다.
5. Home, About, Contact / Join, Account, Admin, Review Queue 첫 화면이 존재한다.
6. `npm run dev`로 로컬 확인이 가능하다.
7. `npm run lint`가 통과한다.
8. `npm run build`가 통과한다.
9. Supabase 연결 전에도 화면 구조를 검토할 수 있다.

## Next Deliverable / 다음 산출물

다음 단계는 실제 `freeride-korea-webapp` 프로젝트 생성이다.

프로젝트 생성 후에는 `ui-design-system-v1.md` 또는 `initial-public-site-implementation-v1.md` 중 하나를 이어서 작성한다.

권장 순서:

1. 실제 Next.js 프로젝트 생성
2. 기본 폴더와 에셋 복사
3. 첫 라우트와 mock data 구현
4. 브라우저에서 Home / About / Contact / Admin 확인
5. 그다음 `design-taste-frontend` 스킬로 공개 사이트 1차 디자인 고도화
