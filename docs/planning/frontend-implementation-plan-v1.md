# Frontend Implementation Plan v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 공개 웹사이트, 회원 포털, 관리자 모드를 실제 Next.js 화면과 컴포넌트 단위로 어떤 순서로 구현할지 정의한다.

이전 문서들이 `무엇을 운영할 것인가`를 정리했다면, 이 문서는 개발자가 바로 프로젝트를 생성하고 화면을 쌓아갈 수 있도록 `어떤 구조로 만들 것인가`를 정리한다.

기준 문서:

- `website/project-structure-v1.md`
- `website/website-screen-structure-v1.md`
- `website/admin-screen-structure-v1.md`
- `website/member-portal-requirements-v1.md`
- `website/admin-permission-matrix-v1.md`
- `website/supabase-rls-policy-v1.md`

## Stack Baseline / 기술 기준

권장 구현 스택:

```text
Framework:
- Next.js App Router
- TypeScript

Styling:
- Tailwind CSS
- CSS variables for brand tokens

Data:
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage

Operations:
- Custom Admin
- Review Queue
- Human-in-the-loop AI assistant
- Official source monitor
```

초기 프론트엔드는 Supabase 연결 전에도 화면을 확인할 수 있도록 typed mock data로 시작한다. 이후 실제 DB schema가 확정되면 mock data 타입을 Supabase query 타입으로 교체한다.

## Implementation Principles / 구현 원칙

1. 구조를 먼저 만들고, 고급 시각 디자인은 구조가 안정된 뒤 다듬는다.
2. 공개 웹사이트, 회원 포털, 관리자 모드는 같은 데이터 모델을 공유한다.
3. KO / EN 동시 표기를 기본 구조로 둔다.
4. 공개 웹사이트는 공식성 60%, 프리미엄 아웃도어 40%의 브랜드 인상을 유지한다.
5. 관리자 화면은 장식보다 테이블, 필터, 상태 배지, 검토 흐름을 우선한다.
6. 회원 포털은 현재 등급, 신청 상태, 제출 초안, 알림이 빠르게 보이도록 만든다.
7. AI는 초안, 요약, 번역, 태그 추천, 누락 필드 감지까지만 담당한다.
8. AI 결과물과 공식 소스 모니터 결과는 자동 게시하지 않는다.
9. 모든 회원 작성 공개 콘텐츠는 Review Queue를 거친다.
10. 작성 권한과 게시 권한은 분리한다.

## Route Groups / 라우트 그룹

권장 App Router 구조:

```text
app/
  (public)/
    page.tsx
    about/
    news-video/
    events/
    freeride-tour/
    athlete-program/
    safety-education/
    culture/
    shop/
    marketplace/
    contact-join/
    resources/
  account/
    page.tsx
    profile/
    membership/
    upgrade/
    applications/
    submissions/
    marketplace/
    notifications/
    settings/
  admin/
    page.tsx
    review-queue/
    source-monitor/
    news-video/
    events/
    programs/
    safety-education/
    freeride-tour/
    members/
    member-upgrades/
    contact-join/
    culture/
    resources/
    shop/
    marketplace/
    media-library/
    ai-assistant/
    settings/
    audit-log/
  api/
  layout.tsx
  globals.css
```

## Frontend Build Phases / 프론트 구현 단계

### Phase 0. Project Bootstrap

목표:

- Next.js 프로젝트 생성
- TypeScript / Tailwind 설정
- 기본 폴더 구조 생성
- 브랜드 토큰 등록
- mock data 구조 생성

산출물:

```text
app/layout.tsx
app/globals.css
components/ui/*
content/seed/*
lib/types/*
```

### Phase 1. Public Route Shell

목표:

- 공개 사이트 공통 레이아웃 생성
- Header / Footer / Mobile Navigation 생성
- KO / EN 동시 표기 패턴 적용
- 로고와 대표 컬러 연결

우선 화면:

```text
/
/about
/contact-join
```

### Phase 2. Public Content Pages

목표:

- News & Video, Events, Freeride Tour, Athlete Program, Safety Education, Culture, SHOP 화면 생성
- 카드, 필터, 상태 배지, 상세 페이지 패턴 확정
- Related Resources 노출 패턴 적용

우선순위:

1. Home
2. About
3. Contact / Join
4. Athlete Program
5. Safety Education
6. Freeride Tour
7. Events
8. News & Video
9. Culture
10. SHOP / Marketplace
11. Resources detail

### Phase 3. Forms and Applications

목표:

- 문의 폼
- 회원가입 진입 폼
- 프로그램 신청 폼
- 투어 신청 폼
- Culture 제보 폼
- 중고장터 매물 등록 폼

초기에는 실제 저장 전까지 mock submit / local validation으로 구현한다. Supabase 연결 후 DB insert와 Review Queue 생성을 붙인다.

### Phase 4. Auth and Account Shell

목표:

- 로그인 / 회원가입 화면
- 회원 포털 레이아웃
- 회원 상태 카드
- 보호 라우트 기준 생성

화면:

```text
/account
/account/profile
/account/membership
/account/upgrade
```

### Phase 5. Member Portal MVP

목표:

- 회원이 자기 정보, 등급, 신청, 제출 초안, 매물, 알림을 확인할 수 있게 한다.

화면:

```text
/account/applications
/account/submissions
/account/marketplace
/account/notifications
/account/settings
```

핵심 규칙:

- 신규 가입자는 일반회원으로 시작한다.
- 정회원, 임원회원, 선수회원, 후원회원 / 스폰서십 회원 전환은 관리자 승인형이다.
- 후원회원은 개인 후원뿐 아니라 브랜드, 기업, 단체 스폰서십 회원을 포함한다.
- 회원은 자기 신청과 자기 제출물만 볼 수 있다.

### Phase 6. Admin Shell

목표:

- 관리자 공통 레이아웃
- 좌측 사이드바
- 상단바
- 빠른 검색
- 상태 요약
- 권한별 메뉴 표시 구조

화면:

```text
/admin
/admin/review-queue
/admin/settings
/admin/audit-log
```

### Phase 7. Admin CMS Core

목표:

- 핵심 CMS 화면을 만든다.
- 목록, 필터, 상세 패널, 편집 폼 패턴을 공통화한다.

우선순위:

1. Contact / Join Admin
2. Members Admin
3. Programs Admin
4. Freeride Tour Admin
5. Events Admin
6. News & Video Admin
7. Resources Admin
8. Culture Admin
9. SHOP Admin
10. Marketplace Admin

### Phase 8. Review Queue and Permissions

목표:

- 회원 작성 콘텐츠, 공식 소스 후보, AI 초안, 등급 전환 요청, 중고장터 매물을 하나의 검토 대기열에서 처리한다.

필수 기능:

- Type filter
- Status filter
- Risk flag
- Submitted by
- Required author role
- Required publish role
- Approve
- Request Revision
- Reject
- Publish
- Assign

중요:

안전, 법률, 환불, 보험, 회원 승인, 중고 안전장비 관련 항목은 일괄 승인 기능을 제공하지 않는다.

### Phase 9. Source Monitor and AI Assistant UI

목표:

- 공식 소스 변경 알림과 AI 보조 결과를 관리자에게 보여준다.

화면:

```text
/admin/source-monitor
/admin/ai-assistant
```

역할:

- FWT / FIS 공식 페이지 변경 감지 결과 표시
- 신규 뉴스 / 영상 / 이벤트 후보 표시
- 번역 초안
- 요약 초안
- 태그 추천
- 누락 필드 감지
- 위험 키워드 표시

금지:

- 자동 게시
- 회원 승인 자동 결정
- 안전 판단 자동 결정
- 환불 / 보험 / 법률 문구 최종 결정

### Phase 10. Marketplace and Shop UI

목표:

- 공식 SHOP과 회원 중고장터를 구분한다.
- 초기 SHOP은 Coming Soon / Interest Form 중심으로 운영한다.
- 중고장터는 회원 등록, 관리자 검토, 게시 흐름으로 만든다.

### Phase 11. Responsive and QA Pass

목표:

- 모바일 메뉴
- 태블릿 레이아웃
- 데스크톱 관리자 테이블
- 폼 접근성
- 상태 배지 가독성
- KO / EN 텍스트 길이 대응
- 이미지 비율 고정
- 버튼 텍스트 overflow 확인

## Component Structure / 컴포넌트 구조

### UI Components

```text
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Textarea.tsx
components/ui/Select.tsx
components/ui/Checkbox.tsx
components/ui/Toggle.tsx
components/ui/Badge.tsx
components/ui/StatusBadge.tsx
components/ui/Tabs.tsx
components/ui/Dialog.tsx
components/ui/Table.tsx
components/ui/EmptyState.tsx
components/ui/Toast.tsx
components/ui/FileUpload.tsx
```

### Public Components

```text
components/public/SiteHeader.tsx
components/public/SiteFooter.tsx
components/public/PageHero.tsx
components/public/ContentCard.tsx
components/public/EventCard.tsx
components/public/ProgramCard.tsx
components/public/TourCard.tsx
components/public/ResourceList.tsx
components/public/CTASection.tsx
components/public/LatestUpdates.tsx
components/public/RelatedContent.tsx
```

### Admin Components

```text
components/admin/AdminShell.tsx
components/admin/AdminSidebar.tsx
components/admin/AdminTopbar.tsx
components/admin/DataTable.tsx
components/admin/FilterBar.tsx
components/admin/DetailPanel.tsx
components/admin/ReviewQueueTable.tsx
components/admin/RiskFlagBadge.tsx
components/admin/AuditTrail.tsx
components/admin/PermissionRuleEditor.tsx
```

### Account Components

```text
components/account/AccountShell.tsx
components/account/AccountSidebar.tsx
components/account/MemberStatusCard.tsx
components/account/ApplicationList.tsx
components/account/SubmissionList.tsx
components/account/UpgradeRequestForm.tsx
components/account/MarketplaceListingForm.tsx
components/account/NotificationList.tsx
```

## Feature Modules / 기능 모듈

권장 기능 모듈:

```text
features/auth
features/members
features/content
features/news-video
features/events
features/programs
features/tours
features/culture
features/resources
features/marketplace
features/applications
features/review-queue
features/source-monitor
features/ai-assistant
features/shop
```

각 feature는 가능한 한 다음 구조를 가진다.

```text
types.ts
data.ts
queries.ts
actions.ts
components/
```

초기 mock 단계에서는 `data.ts`를 사용하고, Supabase 연결 후 `queries.ts`와 `actions.ts`로 이동한다.

## Data Access Helpers / 데이터 접근 헬퍼

권장 파일:

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/admin.ts
lib/auth/get-current-user.ts
lib/permissions/can-author.ts
lib/permissions/can-publish.ts
lib/publishing/status.ts
lib/dates/event-status.ts
lib/validation/forms.ts
lib/validation/content.ts
```

핵심 규칙:

- `can-author`는 작성 가능 여부를 판단한다.
- `can-publish`는 게시 가능 여부를 판단한다.
- 두 판단은 절대 하나로 합치지 않는다.
- 이벤트 상태는 시작 / 종료 일시 기준으로 계산하고, Cancelled만 수동 상태로 둔다.

## Public Page Implementation Notes / 공개 페이지 구현 메모

### Home

Home은 브랜드 소개 페이지가 아니라 운영형 첫 화면이다.

노출:

- Hero
- Core Pathways
- Latest Updates
- Featured Programs
- Featured Tours
- Upcoming Events
- Culture Preview
- SHOP / Marketplace Preview
- Final CTA

### News & Video

카드형 아카이브로 만든다.

필터:

- All
- News
- Video

Video는 YouTube URL 기반으로 시작한다.

### Events

FIS Freeride World Championships는 Freeride World Tour의 하위가 아니라 Official Major 안에서 Freeride World Tour와 동등한 위치로 둔다.

상태:

- Upcoming
- Live
- Completed
- Cancelled

Cancelled만 관리자 수동 선택이다.

### Freeride Tour

지역 카테고리는 고정값이 아니라 관리자 추가 / 삭제 / 숨김 / 정렬 가능한 taxonomy로 설계한다.

필수 노출:

- 일정
- 난이도
- 모집 인원
- 포함 / 불포함
- 필수 장비
- 보험
- 취소 / 환불 규정
- 신청 CTA

### Athlete Program and Safety Education

두 메뉴는 하나의 Program / Course CMS를 공유한다.

다만 공개 화면에서는 목적이 다르게 보이도록 분리한다.

- Athlete Program: 선수 성장, 훈련, 대회 준비
- Safety Education: 눈사태 안전, WFR, 산악 응급 대응

### Culture

자유게시판이 아니라 큐레이션된 문화 매거진으로 시작한다.

회원 제보는 받되, 공개 게시 전 관리자 검토를 거친다.

### SHOP

초기에는 완전한 커머스가 아니라 Coming Soon, Interest Form, Collaboration Inquiry, Member Marketplace 중심으로 구현한다.

## Admin Implementation Notes / 관리자 구현 메모

관리자 화면은 공개 사이트보다 더 조밀하고 실무적으로 만든다.

공통 패턴:

- Page title
- Primary action
- Status summary
- Filters
- Data table
- Right detail panel
- Activity log

관리자 MVP에서 가장 중요한 축:

1. Dashboard
2. Review Queue
3. Members
4. Contact / Join
5. Programs
6. Tours
7. Events
8. Source Monitor
9. AI Assistant

## Account Implementation Notes / 회원 포털 구현 메모

회원 포털 첫 화면은 “내가 지금 무엇을 해야 하는가”가 보여야 한다.

Dashboard 노출:

- 현재 회원 등급
- 등급 전환 요청 상태
- 진행 중인 신청
- 내가 제출한 초안
- 중고장터 매물 상태
- 알림
- 추천 CTA

회원 등급:

```text
General Member / 일반회원
Regular Member / 정회원
Executive Member / 임원회원
Athlete Member / 선수회원
Supporting Member / 후원회원 / Sponsorship Member
```

## Mock Data Strategy / 목 데이터 전략

초기 화면 구현은 다음 mock data로 시작한다.

```text
mockMembers
mockPosts
mockEvents
mockPrograms
mockTours
mockResources
mockApplications
mockReviewQueueItems
mockMarketplaceListings
mockNotifications
```

주의:

- mock data 타입은 DB 문서의 필드명과 최대한 맞춘다.
- KO / EN 필드를 처음부터 분리한다.
- 상태값은 문서에 정의한 enum과 맞춘다.
- mock data는 이후 seed data로 전환할 수 있게 관리한다.

## Design System Notes / 디자인 시스템 메모

브랜드 토큰:

```text
Red: Taegeuk-inspired red
Blue: Taegeuk-inspired blue
Black: primary text / one-color logo
White: snow / clean background
Neutral gray: admin and forms
```

공개 사이트:

- 이미지 중심
- 강한 로고 노출
- 절제된 타이포그래피
- 명확한 카드와 CTA
- 과한 장식보다 산, 눈, 라이딩, 공식성을 보여주는 실제 이미지 우선

관리자:

- 고밀도 정보
- 테이블 중심
- 상태 배지 중심
- 위험 플래그 명확화
- 작업 속도 우선

회원 포털:

- 상태 확인 중심
- 신청 / 제출 / 알림을 한눈에 보여주는 구조
- 복잡한 설명보다 다음 행동 CTA 우선

## Accessibility and Responsive Checklist / 접근성 및 반응형 체크

필수 확인:

- 모든 버튼에 명확한 label이 있는가
- 모바일에서 메뉴가 겹치지 않는가
- 카드 텍스트가 overflow 되지 않는가
- KO / EN 병기 시 줄바꿈이 자연스러운가
- 관리자 테이블이 작은 화면에서 깨지지 않는가
- 상태 배지가 색상만으로 의미를 전달하지 않는가
- 이미지에 alt text가 있는가
- 폼 오류 메시지가 필드와 연결되는가
- 키보드로 주요 폼을 이동할 수 있는가

## Testing Checklist / 테스트 체크리스트

초기 테스트:

1. Home이 최신 뉴스, 이벤트, 프로그램, 투어 mock data를 표시한다.
2. News와 Video 필터가 정상 동작한다.
3. Events 상태가 일정 기준으로 자동 계산된다.
4. Cancelled 이벤트는 수동 상태가 우선한다.
5. Freeride Tour 지역 taxonomy가 mock data 기준으로 표시된다.
6. Contact / Join 폼이 문의 유형별 필드를 다르게 보여준다.
7. 회원 포털은 자기 데이터만 표시하는 구조로 분리되어 있다.
8. 일반회원은 News / Events 초안 작성 CTA가 보이지 않는다.
9. 정회원은 Tour / Program 초안 작성 CTA가 보인다.
10. 임원회원은 News / Video / Events 초안 작성 CTA가 보인다.
11. Review Queue는 회원 제출물과 AI 후보를 같은 테이블에서 구분한다.
12. AI Assistant 화면에 Publish 버튼이 없다.

## MVP Exclusions / MVP 제외 범위

1차 프론트 구현에서 제외하거나 placeholder로 둔다.

- 온라인 결제
- 배송 관리
- 실제 AI API 연동
- 실제 크롤링 / 자동 소스 체크 실행
- AI 자동 게시
- 안전 판단 자동화
- 환불 / 보험 / 법률 문구 자동 확정
- 모바일 앱
- 완전한 다국어 전환 시스템
- 고급 애니메이션

## ADR Checkpoints / ADR 체크포인트

새 ADR이 필요한 시점:

- 배포 플랫폼 확정
- 결제 시스템 도입
- AI API 공급자 확정
- 공식 소스 모니터링 방식 확정
- 다국어 구조를 동시 표기에서 완전 전환형으로 변경
- 회원 등급 정책 변경
- 관리자 권한 체계 변경
- SHOP을 실제 결제형 커머스로 전환

## Next Deliverable / 다음 산출물

다음 문서는 `nextjs-project-bootstrap-v1.md`가 적합하다.

이 문서에서는 실제 Next.js 프로젝트를 만들기 전에 필요한 생성 명령, 폴더 생성 순서, 초기 패키지, 환경변수, mock data 파일, 첫 화면 구현 범위를 정리한다.
