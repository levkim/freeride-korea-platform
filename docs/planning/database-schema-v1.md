# Database Schema v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 웹사이트와 관리자 플랫폼의 Supabase/PostgreSQL 1차 데이터베이스 구조를 정의한다.

기준 문서:

- `website/backend-data-model-v1.md`
- `website/project-structure-v1.md`
- `website/admin-cms-requirements-v1.md`
- `website/adr/0003-separate-content-authoring-and-publishing-permissions.md`
- `website/adr/0004-select-custom-web-app-stack.md`

## Schema Principle / 설계 원칙

1. Supabase Auth의 `auth.users`를 계정 기준으로 사용한다.
2. 서비스 프로필 정보는 `member_profiles`에 분리한다.
3. 작성 권한과 게시 권한은 `content_permission_rules`로 분리 관리한다.
4. 회원이 작성한 공개 콘텐츠는 기본적으로 `review_queue_items`를 거친다.
5. KO / EN 동시 표기를 위해 주요 콘텐츠에는 한글/영문 필드를 함께 둔다.
6. AI 결과물과 공식 소스 모니터링 결과는 바로 게시하지 않고 별도 테이블에 저장한다.
7. 안전, 법률, 환불, 보험, 회원 승인, 중고 안전장비 판단은 사람이 최종 승인한다.

## PostgreSQL Conventions / DB 규칙

공통 타입:

```text
id: uuid primary key default gen_random_uuid()
created_at: timestamptz default now()
updated_at: timestamptz default now()
created_by: uuid nullable references auth.users(id)
updated_by: uuid nullable references auth.users(id)
deleted_at: timestamptz nullable
admin_notes: text nullable
```

공통 콘텐츠 상태:

```text
draft
review
published
hidden
archived
```

공통 검토 상태:

```text
new
reviewing
needs_revision
approved
rejected
published
ignored
snoozed
```

회원 등급:

```text
general
regular
executive
athlete
supporting
```

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

권장 enum 방식:

- v1에서는 PostgreSQL enum보다 `text + check constraint`를 우선한다.
- 이유는 초기 운영 중 상태값이 바뀔 가능성이 높기 때문이다.
- 상태값이 안정되면 enum 또는 lookup table로 전환할 수 있다.

## Phase 1 Tables / 인증과 권한 기반

### member_profiles

Supabase Auth 계정의 서비스 회원 정보.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | references auth.users(id), unique |
| email | text | auth email mirror |
| name | text | 회원 이름 |
| phone | text | optional |
| preferred_language | text | `ko`, `en`, `both` |
| member_type | text | `general`, `regular`, `executive`, `athlete`, `supporting` |
| status | text | `active`, `pending`, `suspended`, `deleted` |
| riding_experience | text | 라이딩 경험 |
| skiing_or_snowboarding | text | ski / snowboard / both |
| interested_programs | text[] | 관심 프로그램 |
| country | text | 국가 |
| region | text | 지역 |
| emergency_contact | jsonb | 비상 연락처 |
| marketing_opt_in | boolean | 마케팅 수신 동의 |
| privacy_agreed_at | timestamptz | 개인정보 동의 시각 |
| last_login_at | timestamptz | 마지막 로그인 |
| notes | text | 관리자 메모 |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

기본 규칙:

- 신규 가입자는 `general`로 시작한다.
- 회원 등급 변경은 `member_upgrade_requests`와 관리자 승인으로 처리한다.
- `supporting`은 후원회원과 스폰서십 회원을 함께 포함하는 운영 키로 사용한다.
- 개인 후원, 브랜드 스폰서십, 기업 / 단체 스폰서십, 장비 후원, 서비스 후원, 이벤트 스폰서십, 선수 후원은 모두 `supporting` 범주에서 시작하고, 세부 유형은 전환 요청 메모 또는 추후 sponsorship 관련 테이블에서 관리한다.

### roles

관리자 권한 그룹.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| role_key | text | unique, e.g. `super_admin` |
| name_ko | text | 역할명 |
| name_en | text | English name |
| permissions | jsonb | 권한 목록 |
| description | text | 설명 |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### admin_users

관리자 계정.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | references auth.users(id), unique |
| role_id | uuid | references roles(id) |
| display_name | text | 관리자 표시명 |
| status | text | `active`, `disabled` |
| two_factor_enabled | boolean | future |
| last_login_at | timestamptz | 마지막 로그인 |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### member_upgrade_requests

회원 등급 전환 요청.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | references auth.users(id) |
| current_member_type | text | 현재 등급 |
| requested_member_type | text | 요청 등급 |
| reason | text | 요청 사유 |
| proof_files | uuid[] | media_files ids |
| fwt_qualifier_level | text | 선수회원 검토용 |
| payment_note | text | 정회원 회비 / 후원 / 스폰서십 메모 |
| status | text | `new`, `reviewing`, `needs_info`, `approved`, `rejected`, `cancelled` |
| reviewed_by | uuid | references admin_users(id) |
| reviewed_at | timestamptz | 검토 완료 시각 |
| review_note | text | 관리자 검토 메모 |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

AI 제한:

- AI는 누락 정보와 검토 메모 초안만 만들 수 있다.
- 승인 / 거절은 관리자만 가능하다.

### content_permission_rules

콘텐츠 타입별 작성 가능 등급과 게시 가능 권한.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| content_type | text | `post`, `event`, `program`, `tour`, `culture_story`, `marketplace_listing`, `resource` |
| subtype | text | optional, e.g. `news`, `video`, `wfr` |
| minimum_author_member_type | text | 작성 가능 최소 회원 등급 |
| allowed_author_roles | text[] | 작성 가능한 관리자 역할 |
| allowed_publisher_roles | text[] | 게시 가능한 관리자 역할 |
| review_required | boolean | 기본 true |
| expert_review_required | boolean | 안전 / WFR 등 |
| is_active | boolean | active |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

초기 기본값:

```text
news/video/events: executive 이상 작성, 관리자 게시
program/tour: regular 이상 작성, 관리자 게시
culture: general 이상 제보, 관리자 게시
marketplace: general 이상 등록, 관리자 검토 후 게시
```

### audit_logs

관리자와 시스템의 주요 변경 기록.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| actor_user_id | uuid | references auth.users(id) |
| actor_admin_id | uuid | references admin_users(id) |
| action | text | created / updated / published / approved 등 |
| entity_type | text | table or domain name |
| entity_id | uuid | target id |
| before_data | jsonb | 변경 전 |
| after_data | jsonb | 변경 후 |
| ip_address | text | optional |
| user_agent | text | optional |
| created_at | timestamptz | created |

## Shared Tables / 공통 테이블

### media_files

이미지, 영상 썸네일, 문서, 증빙 파일.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| bucket | text | Supabase bucket |
| path | text | storage path |
| public_url | text | public URL if public |
| file_name | text | original name |
| file_type | text | image / video / document |
| mime_type | text | mime |
| size_bytes | bigint | file size |
| alt_ko | text | image alt ko |
| alt_en | text | image alt en |
| uploaded_by | uuid | references auth.users(id) |
| status | text | active / hidden / deleted |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### taxonomies

카테고리, 지역, 투어 타입, 리소스 타입 등 유연한 분류.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| taxonomy_type | text | `region`, `tour_type`, `event_series`, `resource_type`, `program_category` |
| slug | text | unique per taxonomy_type |
| name_ko | text | Korean label |
| name_en | text | English label |
| parent_id | uuid | references taxonomies(id) |
| sort_order | integer | order |
| is_active | boolean | active |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### tags

콘텐츠 태그.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| name_ko | text | Korean |
| name_en | text | English |
| created_at | timestamptz | created |

### content_tags

태그 연결용 join table.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| content_type | text | post / event / program 등 |
| content_id | uuid | target id |
| tag_id | uuid | references tags(id) |
| created_at | timestamptz | created |

### content_relations

뉴스, 이벤트, 리소스, 영상 등 관련 콘텐츠 연결.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| source_type | text | source content type |
| source_id | uuid | source id |
| target_type | text | target content type |
| target_id | uuid | target id |
| relation_type | text | related / replay / result / resource / news / video |
| sort_order | integer | order |
| created_at | timestamptz | created |

## Phase 2 Tables / 공개 웹사이트 핵심 콘텐츠

### posts

News & Video 공통 게시물.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| post_type | text | `news`, `video` |
| title_ko | text | title |
| title_en | text | title |
| summary_ko | text | summary |
| summary_en | text | summary |
| body_ko | text | body |
| body_en | text | body |
| youtube_url | text | video only |
| thumbnail_media_id | uuid | references media_files(id) |
| gallery_media_ids | uuid[] | gallery |
| source_url | text | original source |
| author_user_id | uuid | references auth.users(id) |
| submitted_by_member_type | text | submission snapshot |
| authoring_permission_rule_id | uuid | references content_permission_rules(id) |
| publishing_permission_rule_id | uuid | references content_permission_rules(id) |
| review_required | boolean | default true |
| seo_title | text | SEO |
| seo_description | text | SEO |
| status | text | draft/review/published/hidden/archived |
| visibility | text | public / members / hidden |
| published_at | timestamptz | published |
| created_by | uuid | references auth.users(id) |
| updated_by | uuid | references auth.users(id) |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |
| deleted_at | timestamptz | soft delete |

### events

국내외 프리라이드 대회 / 이벤트.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| event_name | text | 대회명 |
| event_group | text | `official_major`, `fwt_pathway_series`, `regional_unofficial` |
| series_category | text | `fis_world_championships`, `freeride_world_tour`, `fwt_challenger`, `fwt_qualifier`, `fwt_junior`, `freeride_asia` |
| official_status | text | `official`, `unofficial` |
| season | text | e.g. 2026 |
| country | text | 국가 |
| venue | text | 장소 |
| resort | text | 리조트 |
| start_at | timestamptz | 시작 |
| end_at | timestamptz | 종료 |
| is_cancelled | boolean | 관리자 수동 |
| featured_media_id | uuid | references media_files(id) |
| short_intro_ko | text | intro |
| short_intro_en | text | intro |
| description_ko | text | detail |
| description_en | text | detail |
| official_url | text | official link |
| registration_url | text | registration |
| replay_or_result_url | text | replay/result |
| source_alert_id | uuid | references source_change_alerts(id), nullable |
| author_user_id | uuid | references auth.users(id) |
| submitted_by_member_type | text | snapshot |
| authoring_permission_rule_id | uuid | references content_permission_rules(id) |
| publishing_permission_rule_id | uuid | references content_permission_rules(id) |
| review_required | boolean | default true |
| status | text | draft/review/published/hidden/archived |
| visibility | text | public / members / hidden |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |
| deleted_at | timestamptz | soft delete |

Computed status:

```text
if is_cancelled = true -> cancelled
else if now() < start_at -> upcoming
else if now() between start_at and end_at -> live
else -> completed
```

구현 메모:

- `computed_status`는 저장 컬럼보다 view 또는 application helper로 계산하는 것을 권장한다.
- 필터 성능이 필요하면 materialized field를 추가할 수 있다.

### programs

Athlete Program과 Safety Education 통합 강좌.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| parent_category | text | `athlete_program`, `safety_education` |
| subcategory | text | `freeride`, `backcountry`, `avalanche_safety`, `wfr` |
| title_ko | text | title |
| title_en | text | title |
| summary_ko | text | summary |
| summary_en | text | summary |
| description_ko | text | detail |
| description_en | text | detail |
| curriculum_ko | text | curriculum |
| curriculum_en | text | curriculum |
| target | text | 대상 |
| difficulty | text | 난이도 |
| format | text | online / offline / field / hybrid |
| start_at | timestamptz | 시작 |
| end_at | timestamptz | 종료 |
| location | text | 장소 |
| capacity | integer | 정원 |
| applicant_count | integer | cached count |
| price | numeric | 가격 |
| deposit | numeric | 예약금 |
| included | text | 포함 |
| not_included | text | 불포함 |
| instructor_ids | uuid[] | references later instructor profile |
| required_gear | text | 준비 장비 |
| requirements | text | 참가 조건 |
| cancellation_refund_policy | text | 취소 / 환불 |
| safety_review_required | boolean | 안전 검토 필요 |
| expert_reviewed_at | timestamptz | 전문가 검토 완료 |
| featured_media_id | uuid | references media_files(id) |
| author_user_id | uuid | references auth.users(id) |
| submitted_by_member_type | text | snapshot |
| authoring_permission_rule_id | uuid | references content_permission_rules(id) |
| publishing_permission_rule_id | uuid | references content_permission_rules(id) |
| review_required | boolean | default true |
| status | text | coming_soon/open/closed/in_progress/completed/cancelled |
| visibility | text | public / members / hidden |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |
| deleted_at | timestamptz | soft delete |

### tours

Freeride Tour 상품 / 원정 / 여행 프로그램.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| title_ko | text | title |
| title_en | text | title |
| summary_ko | text | summary |
| summary_en | text | summary |
| description_ko | text | detail |
| description_en | text | detail |
| region_taxonomy_id | uuid | references taxonomies(id) |
| country | text | 국가 |
| destination | text | 목적지 |
| tour_type | text | resort_based / backcountry / expedition / camp / custom |
| start_at | timestamptz | 시작 |
| end_at | timestamptz | 종료 |
| duration_days | integer | 기간 |
| difficulty | text | 난이도 |
| capacity | integer | 정원 |
| applicant_count | integer | cached count |
| price | numeric | 가격 |
| deposit | numeric | 예약금 |
| included_ko | text | 포함 |
| included_en | text | 포함 |
| not_included_ko | text | 불포함 |
| not_included_en | text | 불포함 |
| itinerary_ko | text | 일정 |
| itinerary_en | text | 일정 |
| safety_requirements_ko | text | 안전 조건 |
| safety_requirements_en | text | safety |
| guide_info_ko | text | 가이드 |
| guide_info_en | text | guide |
| cancellation_refund_policy_ko | text | 취소 / 환불 |
| cancellation_refund_policy_en | text | cancellation/refund |
| featured_media_id | uuid | references media_files(id) |
| author_user_id | uuid | references auth.users(id) |
| submitted_by_member_type | text | snapshot |
| authoring_permission_rule_id | uuid | references content_permission_rules(id) |
| publishing_permission_rule_id | uuid | references content_permission_rules(id) |
| review_required | boolean | default true |
| status | text | coming_soon/open/closed/in_progress/completed/cancelled |
| visibility | text | public / members / hidden |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |
| deleted_at | timestamptz | soft delete |

지역 카테고리:

- 국내 / 일본 / 중앙아시아 / 유럽 / 맞춤 투어는 초기 seed로 넣는다.
- 이후 전세계 국가와 지역을 `taxonomies`에서 추가 / 삭제한다.

### culture_stories

컬쳐, 커뮤니티, 사진/영상, 산악 윤리 콘텐츠.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| title_ko | text | title |
| title_en | text | title |
| summary_ko | text | summary |
| summary_en | text | summary |
| body_ko | text | body |
| body_en | text | body |
| story_type | text | field_note / photo / video / ethics / community |
| youtube_url | text | optional |
| featured_media_id | uuid | references media_files(id) |
| gallery_media_ids | uuid[] | gallery |
| author_user_id | uuid | references auth.users(id) |
| submitted_by_member_type | text | snapshot |
| review_required | boolean | default true |
| status | text | draft/review/published/hidden/archived |
| visibility | text | public / members / hidden |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |
| deleted_at | timestamptz | soft delete |

### resources

앱, 웹사이트, 다운로드, 대회 공식 링크, 안전 자료.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| title_ko | text | title |
| title_en | text | title |
| summary_ko | text | summary |
| summary_en | text | summary |
| resource_type | text | link / download / app / official_site / document |
| url | text | external link |
| file_media_id | uuid | download file |
| related_area | text | athlete_program / freeride_tour / safety_education / events / culture |
| is_official | boolean | official source |
| last_checked_at | timestamptz | link check |
| status | text | draft/review/published/hidden/archived |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

## Operations Tables / 운영 테이블

### inquiries

Contact / Join 문의.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| inquiry_type | text | athlete / education / tour / partnership / media / membership / sponsor / general |
| name | text | name |
| email | text | email |
| phone | text | phone |
| organization | text | optional |
| message | text | message |
| preferred_language | text | ko / en / both |
| assigned_admin_id | uuid | references admin_users(id) |
| ai_category_suggestion | text | AI suggestion |
| status | text | new/reviewing/replied/closed/spam |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### applications

강좌 / 투어 신청.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | references auth.users(id), nullable for guest MVP |
| application_type | text | program / tour |
| program_id | uuid | references programs(id), nullable |
| tour_id | uuid | references tours(id), nullable |
| name | text | applicant |
| email | text | email |
| phone | text | phone |
| experience | text | experience |
| emergency_contact | jsonb | emergency |
| medical_notes | text | optional, protected |
| gear_notes | text | gear |
| status | text | new/reviewing/confirmed/waitlisted/cancelled/rejected/completed |
| payment_status | text | unpaid/deposit_paid/paid/refunded/manual |
| admin_notes | text | admin |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### review_queue_items

관리자 검토 대기열.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| queue_type | text | ai_draft/source_candidate/member_draft/marketplace/member_upgrade/safety_review |
| entity_type | text | post/event/program/tour/etc |
| entity_id | uuid | target id |
| submitted_by | uuid | references auth.users(id) |
| assigned_admin_id | uuid | references admin_users(id) |
| priority | integer | 1 high, 5 low |
| risk_level | text | low/medium/high |
| status | text | new/reviewing/needs_revision/approved/rejected/published/ignored/snoozed |
| due_at | timestamptz | optional |
| decision_note | text | admin note |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### ai_outputs

AI 초안 / 추천 / 요약 결과.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| entity_type | text | target type |
| entity_id | uuid | target id |
| ai_task_type | text | translation/summary/tags/source_summary/risk_keywords/reply_draft |
| input_snapshot | jsonb | AI input |
| output_data | jsonb | AI output |
| model_name | text | model |
| status | text | draft/reviewed/accepted/rejected/expired |
| reviewed_by | uuid | references admin_users(id) |
| reviewed_at | timestamptz | reviewed |
| created_at | timestamptz | created |

AI outputs rule:

- `accepted`는 해당 결과물을 사람이 참고했다는 뜻이지 자동 게시를 의미하지 않는다.
- 공개 콘텐츠 반영은 별도 콘텐츠 테이블의 관리자 저장 / 게시 액션으로 처리한다.

### source_monitors

공식 소스 모니터링 대상.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| source_name | text | FWT News, FWT Events 등 |
| source_type | text | news_video/events/challenger/qualifier/junior/world_championships |
| source_url | text | monitored URL |
| check_frequency | text | daily/manual/seasonal |
| last_checked_at | timestamptz | last check |
| last_hash | text | content hash |
| is_active | boolean | active |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

### source_change_alerts

공식 소스 변경 감지 알림.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| source_monitor_id | uuid | references source_monitors(id) |
| alert_type | text | new_item/updated_schedule/updated_link/result_added/replay_added |
| source_url | text | changed source |
| detected_title | text | detected title |
| detected_data | jsonb | extracted fields |
| ai_summary_ko | text | AI summary |
| ai_summary_en | text | AI summary |
| matched_entity_type | text | post/event |
| matched_entity_id | uuid | matched id |
| status | text | new/reviewing/created/updated/ignored/snoozed |
| reviewed_by | uuid | references admin_users(id) |
| reviewed_at | timestamptz | reviewed |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

## Marketplace / Commerce Tables

### marketplace_listings

회원 중고장터 매물.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| seller_user_id | uuid | references auth.users(id) |
| title | text | title |
| description | text | description |
| category | text | ski/snowboard/boots/bindings/avalanche_safety/apparel/etc |
| price | numeric | price |
| currency | text | KRW default |
| condition | text | new/like_new/good/fair/for_parts |
| safety_gear_flag | boolean | avalanche beacon, airbag, etc |
| safety_disclaimer_checked | boolean | required for safety gear |
| image_media_ids | uuid[] | images |
| location | text | location |
| contact_method | text | contact |
| status | text | draft/review/published/hidden/sold/rejected |
| review_required | boolean | default true |
| risk_keywords | text[] | AI/admin flags |
| published_at | timestamptz | published |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

중요:

- 중고 안전장비의 상태 판단은 플랫폼이나 AI가 보증하지 않는다.
- 안전장비 카테고리는 관리자 검토와 고지 문구가 필요하다.

### products

SHOP 상품. MVP에서는 Coming Soon 가능.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| slug | text | unique |
| title_ko | text | title |
| title_en | text | title |
| description_ko | text | detail |
| description_en | text | detail |
| price | numeric | price |
| currency | text | KRW |
| image_media_ids | uuid[] | images |
| status | text | draft/published/hidden/sold_out |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

## Notifications

### notifications

관리자 / 회원 알림.

| Column | Type | Note |
|---|---|---|
| id | uuid | primary key |
| recipient_user_id | uuid | references auth.users(id) |
| recipient_admin_id | uuid | references admin_users(id) |
| notification_type | text | review/source/member/application/system |
| title | text | title |
| body | text | body |
| entity_type | text | target |
| entity_id | uuid | target |
| read_at | timestamptz | read |
| created_at | timestamptz | created |

## Recommended Indexes / 권장 인덱스

초기 인덱스:

```text
member_profiles(user_id)
member_profiles(member_type, status)
admin_users(user_id, status)
posts(status, published_at)
posts(post_type, status)
events(status, start_at)
events(series_category, start_at)
programs(parent_category, subcategory, status)
tours(region_taxonomy_id, status, start_at)
review_queue_items(status, priority, created_at)
review_queue_items(entity_type, entity_id)
source_change_alerts(status, created_at)
applications(application_type, status)
marketplace_listings(status, created_at)
```

## RLS Draft / Supabase Row Level Security 초안

### Public read

공개 사용자는 다음 조건만 읽을 수 있다.

```text
status = 'published'
visibility = 'public'
deleted_at is null
```

적용 대상:

- posts
- events
- programs
- tours
- culture_stories
- resources
- products
- marketplace_listings

### Member read/write

로그인 회원:

- 자신의 `member_profiles` 읽기 / 일부 수정 가능
- 자신의 `applications` 읽기 가능
- 자신의 `review` 또는 `draft` 콘텐츠 읽기 가능
- 권한 규칙을 만족할 때 콘텐츠 초안 생성 가능
- 자신의 marketplace draft 생성 가능

회원이 직접 할 수 없는 것:

- `published` 상태 직접 변경
- 다른 회원 신청서 읽기
- 다른 회원 등급 변경
- 관리자 메모 읽기

### Admin access

관리자:

- `admin_users.status = active`이고 role permission이 있으면 관리자 화면 접근 가능
- 역할별로 관리 가능한 테이블과 액션을 제한한다
- Super Admin은 모든 관리자 기능 접근 가능

### Service role

서버 전용:

- source monitor 실행
- AI output 저장
- scheduled job
- admin audit log write

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하지 않는다.

## Migration Order / 마이그레이션 순서

권장 순서:

1. Extensions
   - `pgcrypto`
2. Shared helper functions
   - `updated_at` trigger
3. Identity
   - roles
   - member_profiles
   - admin_users
   - member_upgrade_requests
4. Permissions
   - content_permission_rules
5. Shared
   - media_files
   - taxonomies
   - tags
   - content_tags
   - content_relations
6. Core content
   - posts
   - events
   - programs
   - tours
   - culture_stories
   - resources
7. Operations
   - inquiries
   - applications
   - review_queue_items
8. Automation
   - ai_outputs
   - source_monitors
   - source_change_alerts
9. Commerce
   - marketplace_listings
   - products
10. Notifications / audit
   - notifications
   - audit_logs
11. RLS policies
12. Seed data

## Seed Data / 초기 데이터

초기 roles:

```text
super_admin
content_admin
event_admin
program_admin
tour_admin
membership_admin
commerce_admin
```

초기 event series:

```text
Official Major
- FIS Freeride World Championships
- Freeride World Tour

FWT Pathway Series
- FWT Challenger
- FWT Qualifier
- FWT Junior

Regional / Unofficial
- Freeride Asia
```

초기 tour regions:

```text
Domestic
Japan
Central Asia
Europe
Custom Tour
```

초기 content permission rules:

```text
post/news: executive author, admin publish
post/video: executive author, admin publish
event: executive author, admin publish
program/athlete_program: regular author, admin publish
program/safety_education: regular author, admin publish, expert review
tour: regular author, admin publish
culture_story: general author, admin publish
marketplace_listing: general author, admin publish
resource: admin author, admin publish
```

## Open Decisions / 추후 결정 필요

아직 결정하지 않은 항목:

- 실제 결제 시스템 도입 여부와 시점
- 정회원 연회비 결제 방식
- 이메일 / SMS 알림 공급자
- 파일 저장 공개 / 비공개 bucket 분리 정책
- 개인정보 보관 기간
- 의료 정보와 비상 연락처 암호화 수준
- 운영 배포 환경
- 공식 소스 모니터링 구현 방식

위 항목은 실제 구현 전 ADR로 별도 기록한다.

## Next Deliverable / 다음 산출물

다음 문서는 `database-migration-plan-v1.md`가 적합하다.

이 문서에서는 위 schema를 실제 Supabase SQL migration 파일 순서로 나누고, 각 migration의 목적과 포함 테이블, RLS 적용 순서를 정리한다.
