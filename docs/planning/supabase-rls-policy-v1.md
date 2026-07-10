# Supabase RLS Policy v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 웹사이트와 관리자 플랫폼의 Supabase Row Level Security 정책을 정의한다.

목표는 공개 사용자, 일반회원, 정회원, 임원회원, 선수회원, 후원회원, 관리자, service role이 각각 어떤 데이터에 접근할 수 있는지 명확히 나누는 것이다.

기준 문서:

- `website/database-schema-v1.md`
- `website/database-migration-plan-v1.md`
- `website/adr/0003-separate-content-authoring-and-publishing-permissions.md`
- `website/admin-cms-requirements-v1.md`

## RLS Principles / RLS 원칙

1. 기본값은 닫혀 있어야 한다.
2. 공개 콘텐츠는 `published + public + not deleted` 조건일 때만 누구나 읽을 수 있다.
3. 회원은 자기 프로필, 자기 신청, 자기 초안만 접근할 수 있다.
4. 회원은 직접 `published` 상태를 만들 수 없다.
5. 관리자 접근은 `admin_users.status = active`를 기준으로 한다.
6. 관리자 역할별 세부 권한은 RLS와 application layer를 함께 사용한다.
7. service role은 서버 작업 전용이며 클라이언트에 노출하지 않는다.
8. AI와 공식 소스 모니터링은 자동 게시 권한을 갖지 않는다.

## Role Groups / 접근 주체

### Public Visitor

로그인하지 않은 방문자.

허용:

- 공개 게시 콘텐츠 읽기
- 공개 이벤트 읽기
- 공개 프로그램 / 투어 읽기
- 공개 컬쳐 콘텐츠 읽기
- 공개 리소스 읽기
- 공개 SHOP / Marketplace 게시물 읽기
- Contact / Join 문의 생성

금지:

- 회원 프로필 읽기
- 신청자 정보 읽기
- 초안 / 검토 중 콘텐츠 읽기
- 관리자 메모 읽기
- Review Queue 읽기

### Authenticated General Member

로그인한 일반회원.

허용:

- 자기 `member_profiles` 읽기
- 자기 프로필 일부 수정
- 자기 신청서 생성 / 읽기
- Culture 제보 초안 생성
- Marketplace listing 초안 생성
- 자기 초안 읽기
- 회원 등급 전환 요청 생성

금지:

- 직접 게시
- 다른 회원 데이터 읽기
- News / Video / Events 초안 작성
- Program / Tour 초안 작성
- 관리자 메모 읽기

### Regular Member

정회원.

추가 허용:

- Freeride Tour 초안 작성
- Athlete Program / Safety Education 초안 작성

금지:

- 직접 게시
- 안전 교육 / WFR 내용을 전문가 검토 없이 게시
- News / Video / Events 초안 작성

### Executive Member

임원회원.

추가 허용:

- News 초안 작성
- Video 초안 작성
- Events 초안 작성

금지:

- 직접 게시
- 공식 대회 정보 자동 확정
- 출처 검토 없이 FWT / FIS 정보 게시

### Athlete Member

선수회원.

기본적으로 정회원 이상의 기능을 가질 수 있다.

추가 권한은 운영 정책에 따라 `content_permission_rules`에서 부여한다.

### Supporting Member / Sponsorship Member

후원회원. 단순 개인 후원뿐 아니라 브랜드, 기업, 단체의 스폰서십 회원 성격을 포함한다.

기본 콘텐츠 작성 권한은 일반회원과 동일하게 시작한다.

공식 스폰서 표시, 로고 노출, 브랜드 협업, 선수 후원, 이벤트 스폰서십 관련 권한은 관리자 승인과 스폰서십 정책에 따라 별도 부여한다.

### Admin

관리자.

허용:

- 관리자 역할에 따른 콘텐츠 조회 / 수정 / 게시
- Review Queue 처리
- 회원 등급 전환 검토
- 공식 소스 후보 검토
- AI output 검토
- 권한 규칙 관리
- 감사 로그 조회

관리자 역할:

```text
super_admin
content_admin
event_admin
program_admin
tour_admin
membership_admin
commerce_admin
```

### Service Role

서버 전용 권한.

허용:

- AI output 저장
- 공식 소스 모니터링 결과 저장
- scheduled job 실행
- audit log 기록
- system notification 생성

금지:

- 클라이언트 브라우저에서 사용
- 일반 사용자 세션에서 사용

## Helper Functions / 정책 helper 함수

실제 SQL migration에서 만들 수 있는 helper 후보:

```sql
is_admin()
is_admin_with_role(role_key text)
current_member_type()
member_rank(member_type text)
can_author_content(content_type text, subtype text)
can_publish_content(content_type text, subtype text)
```

권장 판단:

- `is_admin()`과 `current_member_type()`은 RLS에서 사용하기 좋다.
- `can_author_content()`는 RLS와 application layer에서 함께 사용한다.
- `can_publish_content()`는 관리자 action API에서 강하게 검증한다.

회원 등급 순서:

```text
general = 10
supporting = 15
regular = 20
athlete = 25
executive = 30
```

주의:

- 선수회원과 후원회원은 단순 상하 관계가 아니라 성격이 다른 등급이다.
- 따라서 중요한 권한은 `content_permission_rules` 기준으로 판단한다.

## Public Content Policy / 공개 콘텐츠 읽기

적용 테이블:

```text
posts
events
programs
tours
culture_stories
resources
products
marketplace_listings
```

공개 읽기 조건:

```sql
status = 'published'
and visibility = 'public'
and deleted_at is null
```

예시 policy:

```sql
create policy "public can read published posts"
on posts for select
using (
  status = 'published'
  and visibility = 'public'
  and deleted_at is null
);
```

주의:

- Marketplace는 `sold` 상태의 공개 여부를 운영 정책으로 정해야 한다.
- v1에서는 `published`만 공개 기본값으로 둔다.

## Member Profile Policies

### member_profiles

회원 본인:

| Action | Allowed |
|---|---|
| select | own row |
| insert | service role or signup trigger |
| update | own editable fields only |
| delete | no direct delete |

관리자:

| Action | Allowed |
|---|---|
| select | role allowed |
| update | membership admin / super admin |
| delete | soft delete only via admin flow |

회원이 직접 수정 가능한 필드:

```text
name
phone
preferred_language
riding_experience
skiing_or_snowboarding
interested_programs
country
region
emergency_contact
marketing_opt_in
```

회원이 직접 수정하면 안 되는 필드:

```text
member_type
status
notes
last_login_at
privacy_agreed_at
```

중요:

- Supabase RLS만으로 컬럼 단위 update 제한이 어려울 수 있다.
- 프로필 수정은 서버 action/API에서 허용 필드만 업데이트하는 방식이 좋다.

## Member Upgrade Request Policies

### member_upgrade_requests

회원:

| Action | Allowed |
|---|---|
| select | own requests |
| insert | own request |
| update | only when status is new/needs_info and only limited fields |
| delete | no |

관리자:

| Action | Allowed |
|---|---|
| select | membership admin / super admin |
| update | membership admin / super admin |

승인 / 거절:

- 관리자 API action에서 처리
- `member_profiles.member_type` 변경
- `member_upgrade_requests.status` 변경
- `audit_logs` 기록

AI 제한:

- AI는 누락 정보, 요약, 검토 메모 초안만 생성한다.

## Content Draft Policies

적용 테이블:

```text
posts
events
programs
tours
culture_stories
marketplace_listings
```

회원 insert 기본 규칙:

```text
created_by = auth.uid()
author_user_id = auth.uid()
status in ('draft', 'review')
published_at is null
review_required = true
```

회원 update 기본 규칙:

```text
created_by = auth.uid()
status in ('draft', 'review')
published_at is null
```

회원 금지:

```text
status = 'published'
visibility = 'public' with published status
published_at 직접 설정
review_required = false
authoring_permission_rule_id 임의 변경
publishing_permission_rule_id 임의 변경
```

권장 구현:

- RLS는 최소 안전장치를 둔다.
- 실제 작성 가능 여부는 서버 action에서 `content_permission_rules`를 확인한다.
- insert 시 Review Queue 항목을 함께 생성한다.

## Content-Specific Authoring Rules

### posts

News / Video:

```text
minimum author: executive
publisher: admin
```

일반회원 / 정회원:

- read published only
- own draft는 권한 없으면 생성 불가

임원회원:

- news/video draft 생성 가능
- review 상태 제출 가능
- publish 불가

관리자:

- 역할에 따라 작성 / 수정 / 게시 가능

### events

Events:

```text
minimum author: executive
publisher: admin
```

추가 규칙:

- `is_cancelled`는 관리자만 변경
- FWT / FIS 공식 정보는 관리자 검토 후 게시
- `source_alert_id` 연결은 관리자 또는 service role 후보 생성으로 처리

### programs

Athlete Program / Safety Education:

```text
minimum author: regular
publisher: admin
expert review: required for safety_education, avalanche_safety, wfr
```

추가 규칙:

- `expert_reviewed_at`은 관리자 / 전문가 검토 action에서만 설정
- WFR / 눈사태 안전 교육 본문은 AI 자동 게시 금지

### tours

Freeride Tour:

```text
minimum author: regular
publisher: admin
```

추가 규칙:

- 취소 / 환불 규정은 관리자 검토 필요
- 가격, 예약금, 일정 확정은 관리자 검토 필요

### culture_stories

Culture:

```text
minimum author: general
publisher: admin
```

운영 방향:

- 커뮤니티 제보는 열어둔다.
- 공개 게시 전 브랜드 톤, 안전성, 초상권, 저작권 검토가 필요하다.

### marketplace_listings

Marketplace:

```text
minimum author: general
publisher: admin
```

추가 규칙:

- `safety_gear_flag = true`면 고지 체크 필수
- 관리자 검토 후 게시
- AI는 위험 키워드 표시만 가능
- 안전장비 상태를 보증하지 않는다

## Applications and Inquiries Policies

### inquiries

공개 사용자:

- insert 가능
- select 불가

관리자:

- inquiry type에 따른 조회 / 처리 가능

AI:

- 문의 분류 초안
- 답변 초안
- 자동 발송 금지

### applications

회원:

- 자기 신청 생성 가능
- 자기 신청 조회 가능
- 신청 상태 직접 확정 불가

비회원:

- MVP에서 guest application을 허용할 경우 insert 가능
- 조회는 이메일 인증 또는 관리자 처리 전까지 제한

관리자:

- program admin / tour admin / super admin이 신청자 관리

보호 필드:

```text
medical_notes
emergency_contact
admin_notes
payment_status
```

주의:

- 의료 메모와 비상 연락처는 공개 콘텐츠와 절대 연결하지 않는다.

## Review Queue Policies

### review_queue_items

회원:

- 자기 제출 항목의 제한된 상태만 조회 가능
- 관리자 검토 메모 전체는 조회 불가

관리자:

- 역할에 따라 조회 / 처리 가능

권장:

- 회원 화면에는 별도 view 또는 API response로 필요한 상태만 노출한다.
- Review Queue 원본 테이블은 관리자 중심으로 보호한다.

처리 가능 관리자:

```text
content_admin: posts, culture, resources
event_admin: events, source candidates
program_admin: programs, safety education
tour_admin: tours
membership_admin: member upgrades
commerce_admin: marketplace
super_admin: all
```

## AI and Source Monitor Policies

### ai_outputs

회원:

- 직접 접근 불가

관리자:

- 관련 권한이 있는 관리자만 조회 / 검토

service role:

- insert 가능

금지:

- AI output이 콘텐츠를 직접 publish
- AI output이 회원 승인 / 거절
- AI output이 안전 판단

### source_monitors

관리자:

- event admin / super admin 관리

service role:

- scheduled check 실행
- last_checked_at / last_hash 업데이트

회원 / 공개 사용자:

- 직접 접근 불가

### source_change_alerts

관리자:

- source 후보 검토
- 이벤트 / 뉴스 후보 생성
- 무시 / 보류 처리

service role:

- detected alert 생성

공개 사용자 / 회원:

- 직접 접근 불가

## Admin Policies

### admin_users

관리자:

- 본인 admin profile 조회 가능
- super admin은 전체 관리자 관리 가능

일반회원:

- 접근 불가

### roles

관리자:

- super admin 관리
- 다른 관리자는 read-only 또는 접근 제한

중요:

- 관리자 권한 변경은 audit log 대상이다.

## Media and Storage Policies

### media_files

공개:

- 공개 콘텐츠에 연결된 public media만 조회

회원:

- 본인이 업로드한 media metadata 조회
- 자기 초안에 첨부한 파일 조회

관리자:

- media library 접근 가능

Storage bucket 권장:

```text
public-assets
content-media
private-submissions
proof-files
admin-only
```

주의:

- 회원 등급 증빙, 의료 관련 자료, 신청 관련 파일은 public bucket에 넣지 않는다.

## Audit Log Policies

### audit_logs

공개 사용자:

- 접근 불가

회원:

- 접근 불가

관리자:

- super admin 전체 조회
- 역할별 제한 조회 가능

service role:

- insert 가능

중요:

- audit log 삭제는 원칙적으로 금지한다.
- 보존 기간 정책은 별도 ADR로 정한다.

## Policy Matrix / 권한 매트릭스

| Table | Public | Member | Regular | Executive | Admin | Service Role |
|---|---|---|---|---|---|---|
| member_profiles | no | own read/update limited | own | own | role based | system |
| member_upgrade_requests | no | own create/read | own | own | membership admin | system |
| posts | published read | published read | published read | draft create | role based publish | system |
| events | published read | published read | published read | draft create | role based publish | system |
| programs | published read | published read | draft create | draft create | role based publish | system |
| tours | published read | published read | draft create | draft create | role based publish | system |
| culture_stories | published read | draft create | draft create | draft create | role based publish | system |
| resources | published read | read published | read published | read published | role based | system |
| inquiries | create only | create only | create only | create only | role based | system |
| applications | no | own create/read | own | own | role based | system |
| review_queue_items | no | own status summary only | own summary | own summary | role based | system |
| ai_outputs | no | no | no | no | role based review | create |
| source_monitors | no | no | no | no | event admin | update |
| source_change_alerts | no | no | no | no | event admin | create |
| marketplace_listings | published read | draft create | draft create | draft create | commerce admin | system |
| audit_logs | no | no | no | no | super admin / limited | create |

## Example Policy Names / 정책 이름 규칙

권장 네이밍:

```text
public_read_published_posts
member_read_own_profile
member_update_own_profile
member_create_own_application
member_read_own_application
member_create_allowed_post_draft
member_read_own_post_draft
admin_read_posts
admin_publish_posts
service_insert_ai_outputs
service_insert_source_alerts
```

이름 규칙:

```text
{actor}_{action}_{scope}_{table}
```

## Implementation Notes / 구현 메모

RLS로 처리하기 좋은 것:

- 공개 콘텐츠 읽기 제한
- 본인 데이터 조회 제한
- 관리자 여부 확인
- service role 작업 제한

Application layer에서 함께 처리할 것:

- 컬럼 단위 업데이트 제한
- 콘텐츠 타입별 작성 가능 등급 판단
- 관리자 역할별 복잡한 publish action
- Review Queue 생성
- audit log 생성
- AI output 수락 / 거절 action

이유:

- RLS에 모든 운영 규칙을 넣으면 정책이 너무 복잡해져 유지보수가 어려워진다.
- 중요한 운영 action은 서버 API에서 검증하고 audit log를 남기는 편이 안전하다.

## Test Scenarios / 테스트 시나리오

필수 테스트:

1. 비로그인 사용자는 published/public 콘텐츠만 읽을 수 있다.
2. 비로그인 사용자는 draft/review 콘텐츠를 읽을 수 없다.
3. 일반회원은 자기 프로필만 읽을 수 있다.
4. 일반회원은 다른 회원 신청서를 읽을 수 없다.
5. 일반회원은 Culture 초안을 만들 수 있다.
6. 일반회원은 News 초안을 만들 수 없다.
7. 정회원은 Tour / Program 초안을 만들 수 있다.
8. 임원회원은 News / Video / Events 초안을 만들 수 있다.
9. 회원은 어떤 콘텐츠도 직접 published로 만들 수 없다.
10. 관리자는 역할에 맞는 Review Queue를 볼 수 있다.
11. Event Admin은 source alert를 검토할 수 있다.
12. AI output은 공개 사용자와 회원에게 노출되지 않는다.
13. service role만 source monitor 결과를 insert할 수 있다.
14. audit log는 일반 회원에게 보이지 않는다.
15. safety education 콘텐츠는 expert review 없이 published 처리되지 않는다.

## Open Decisions / 추후 결정 필요

추후 ADR 또는 구현 단계에서 결정할 항목:

- 의료 정보 암호화 방식
- 회원 등급별 마이페이지 노출 범위
- 관리자 역할별 세부 permission JSON 구조
- Guest application 허용 여부
- Marketplace 판매 완료 매물 공개 유지 여부
- Storage bucket 공개 / 비공개 세부 정책
- audit log 보존 기간
- 개인정보 삭제 / 익명화 요청 처리 방식

## Next Deliverable / 다음 산출물

다음 문서는 `admin-permission-matrix-v1.md`가 적합하다.

이 문서에서는 Super Admin, Content Admin, Event Admin, Program Admin, Tour Admin, Membership Admin, Commerce Admin이 관리자 화면에서 각각 어떤 메뉴와 액션을 사용할 수 있는지 더 구체적으로 정리한다.
