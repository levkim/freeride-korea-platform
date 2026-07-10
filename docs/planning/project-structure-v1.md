# Project Structure v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 웹사이트와 관리자 플랫폼을 `Next.js + TypeScript + Supabase/PostgreSQL + Custom Admin` 기준으로 개발하기 위한 1차 프로젝트 구조를 정의한다.

목표는 실제 개발을 시작할 때 공개 웹사이트, 관리자 모드, 회원 영역, 데이터베이스, AI 자동화, 공식 소스 모니터링이 서로 다른 방향으로 흩어지지 않도록 기준선을 만드는 것이다.

## Stack Baseline / 기술 기준

```text
Frontend:
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Edge Functions or scheduled jobs

Operations:
- Custom Admin
- Review Queue
- Human-in-the-loop AI automation
- Official source monitor
```

ADR 기준:

- `website/adr/0004-select-custom-web-app-stack.md`
- `website/technology-stack-implementation-v1.md`
- `website/mvp-development-roadmap-v1.md`

## Repository Layout / 저장소 구조

권장 구조:

```text
freeride-korea-webapp/
├─ app/
│  ├─ (public)/
│  ├─ admin/
│  ├─ account/
│  ├─ api/
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ public/
│  ├─ admin/
│  ├─ account/
│  ├─ forms/
│  ├─ media/
│  └─ ui/
├─ features/
│  ├─ auth/
│  ├─ members/
│  ├─ content/
│  ├─ news-video/
│  ├─ events/
│  ├─ programs/
│  ├─ tours/
│  ├─ culture/
│  ├─ resources/
│  ├─ marketplace/
│  ├─ applications/
│  ├─ review-queue/
│  ├─ source-monitor/
│  └─ ai-assistant/
├─ lib/
│  ├─ supabase/
│  ├─ auth/
│  ├─ permissions/
│  ├─ publishing/
│  ├─ validation/
│  ├─ dates/
│  └─ utils/
├─ content/
│  ├─ constants/
│  ├─ seed/
│  └─ copy/
├─ database/
│  ├─ migrations/
│  ├─ seed/
│  ├─ policies/
│  └─ functions/
├─ docs/
│  ├─ adr/
│  ├─ planning/
│  └─ operations/
├─ public/
│  ├─ brand/
│  ├─ images/
│  └─ icons/
├─ scripts/
├─ tests/
├─ .env.example
├─ README.md
└─ package.json
```

## App Routes / 주요 라우트

### Public Website

```text
/
/about
/news-video
/news-video/[slug]
/events
/events/[slug]
/freeride-tour
/freeride-tour/[slug]
/athlete-program
/athlete-program/freeride
/athlete-program/backcountry
/athlete-program/[slug]
/safety-education
/safety-education/avalanche-safety
/safety-education/wfr
/safety-education/[slug]
/culture
/culture/[slug]
/shop
/marketplace
/marketplace/[slug]
/contact-join
/resources/[slug]
```

### Account / Member Area

```text
/account
/account/profile
/account/membership
/account/upgrade
/account/applications
/account/submissions
/account/marketplace
/account/settings
```

회원 영역의 원칙:

- 신규 가입자는 기본적으로 일반회원이 된다.
- 정회원, 임원회원, 선수회원, 후원회원 / 스폰서십 회원 전환은 요청과 관리자 승인을 거친다.
- 회원이 작성한 공개 콘텐츠는 바로 게시되지 않고 Review Queue로 이동한다.

### Admin

```text
/admin
/admin/review-queue
/admin/source-monitor
/admin/news-video
/admin/events
/admin/programs
/admin/safety-education
/admin/freeride-tour
/admin/members
/admin/member-upgrades
/admin/contact-join
/admin/culture
/admin/resources
/admin/shop
/admin/marketplace
/admin/media-library
/admin/ai-assistant
/admin/settings
/admin/settings/permissions
/admin/audit-log
```

관리자 영역의 원칙:

- 관리자 모드는 실무형 운영 화면으로 만든다.
- 게시 권한은 관리자 권한을 기본으로 한다.
- AI 결과물은 항상 초안, 추천, 검토 필요 상태로 표시한다.
- 안전, 법률, 환불, 보험, 회원 승인, 중고 안전장비 판단은 자동화하지 않는다.

## Feature Modules / 기능 모듈

### auth

역할:

- 로그인
- 회원가입
- 세션 관리
- 관리자 접근 보호
- 회원 등급 확인

### members

역할:

- 일반회원
- 정회원
- 임원회원
- 선수회원
- 후원회원 / 스폰서십 회원
- 등급 전환 요청
- 운영진 승인

### content

역할:

- 공통 게시 상태
- 작성자 정보
- KO / EN 동시 표기 필드
- 공개 여부
- 관련 콘텐츠 연결

### news-video

역할:

- 뉴스 게시물
- 비디오 게시물
- YouTube 링크
- 이미지 업로드
- Featured 콘텐츠

### events

역할:

- FIS Freeride World Championships
- Freeride World Tour
- FWT Challenger
- FWT Qualifier
- FWT Junior
- Freeride Asia
- 일정 기반 상태 자동 계산
- Cancelled 수동 선택

### programs

역할:

- Athlete Program
- Freeride
- Backcountry
- Safety Education
- Avalanche Safety
- WFR
- 강좌 등록
- 신청자 관리

### tours

역할:

- 국내 / 일본 / 중앙아시아 / 유럽 / 맞춤 투어 등 지역 taxonomy
- 지역 추가 / 삭제
- 일정
- 난이도
- 포함 / 불포함
- 취소 / 환불 규정
- 투어 신청

### review-queue

역할:

- 회원 작성 초안 검토
- 공식 소스 후보 검토
- AI 초안 검토
- 중고장터 매물 검토
- 회원 등급 전환 검토

### source-monitor

역할:

- 공식 FWT / FIS 페이지 변경 감지
- 신규 뉴스 / 영상 / 이벤트 후보 생성
- 일정 / 장소 / 등록 링크 / 결과 링크 변경 알림
- 관리자 검토 후 반영

### ai-assistant

역할:

- 번역 초안
- 요약 초안
- 태그 추천
- 누락 필드 감지
- 위험 키워드 표시
- 문의 분류
- 공식 소스 변경 요약

AI 금지 영역:

- 자동 게시
- 회원 승인 / 거절
- 안전 판단
- 법률 / 환불 / 보험 문구 최종 결정
- 중고 안전장비 상태 판단

## Database Start Order / DB 시작 순서

Phase 1에서 먼저 만들 테이블:

```text
users
member_profiles
member_upgrade_requests
admin_users
roles
content_permission_rules
media_files
audit_logs
```

Phase 2에서 추가할 테이블:

```text
posts
events
programs
tours
culture_stories
resources
inquiries
applications
review_queue_items
```

Phase 3 이후:

```text
source_monitors
source_change_alerts
ai_outputs
marketplace_listings
products
notifications
content_relations
tags
taxonomies
```

## Permission Baseline / 권한 기준

초기 작성 가능 등급:

```text
News / Video:
- Executive Member 이상 작성 가능
- 관리자 게시

Events:
- Executive Member 이상 작성 가능
- 관리자 게시

Freeride Tour:
- Regular Member 이상 작성 가능
- 관리자 게시

Athlete Program / Safety Education:
- Regular Member 이상 작성 가능
- 관리자 게시

Culture:
- 회원 제보 가능
- 관리자 게시

Marketplace:
- 회원 등록 가능
- 관리자 검토 후 게시
```

중요 원칙:

- 작성 가능 등급과 게시 가능 등급은 분리한다.
- 관리자는 콘텐츠 타입별로 작성 가능 등급과 게시 가능 등급을 설정할 수 있어야 한다.
- 회원 작성 콘텐츠는 기본적으로 `Review` 상태로 들어간다.

## Environment Variables / 환경변수

초기 `.env.example`에 포함할 항목:

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

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에 노출하지 않는다.
- AI API Key와 Source Monitor Secret은 서버 전용으로 관리한다.
- 실제 운영 전에는 키 관리와 배포 환경 ADR을 별도로 작성한다.

## Development Order / 개발 시작 순서

1. Next.js 프로젝트 생성
2. TypeScript / Tailwind / 기본 레이아웃 설정
3. 브랜드 에셋 연결
4. Public route shell 생성
5. Admin route shell 생성
6. Supabase 프로젝트 연결
7. Auth 기본 연결
8. 회원 프로필 생성 흐름 구현
9. 관리자 접근 보호
10. 기본 DB migration 작성
11. Seed 데이터 작성
12. Home / About 공개 페이지 구현
13. Review Queue 구조 생성

## Design Implementation Note / 디자인 구현 메모

현재 1차 웹사이트 디자인은 정보 구조와 브랜드 방향을 확인하기 위한 초안이다.

개발 MVP에서는 다음을 우선한다.

- 메뉴 구조가 정확한가
- KO / EN 동시 표기가 무리 없이 들어가는가
- 콘텐츠 타입이 관리 가능한가
- 관리자 승인 흐름이 가능한가
- 신청 / 문의 / 회원가입 흐름이 끊기지 않는가

고급 UI 다듬기는 공개 웹사이트와 관리자 구조가 안정된 뒤 별도 단계에서 진행한다.

## ADR Checkpoints / ADR 체크포인트

새 ADR이 필요한 경우:

- 배포 플랫폼 확정
- 결제 시스템 도입
- AI API 공급자 확정
- 공식 소스 모니터링 방식 확정
- 관리자 권한 체계 변경
- 회원 등급 정책 변경
- 온라인 결제 / 환불 자동화 도입
- 모바일 앱 개발 착수

## Next Deliverable / 다음 산출물

다음 문서는 `database-schema-v1.md`가 적합하다.

이 문서에서는 `backend-data-model-v1.md`를 실제 Supabase/PostgreSQL 테이블 기준으로 풀어 쓰고, 컬럼명, 타입, 관계, 상태값, RLS 초안을 정리한다.
