# Admin Permission Matrix v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 관리자 모드에서 각 관리자 역할이 어떤 메뉴와 액션을 사용할 수 있는지 정의한다.

목표는 관리자 권한을 너무 넓게 열지 않고, 콘텐츠 발행, 회원 승인, 신청자 관리, 공식 소스 검토, AI 초안 검토, 중고장터 검수 같은 운영 업무를 역할별로 나누는 것이다.

기준 문서:

- `website/admin-screen-structure-v1.md`
- `website/admin-cms-requirements-v1.md`
- `website/supabase-rls-policy-v1.md`
- `website/adr/0003-separate-content-authoring-and-publishing-permissions.md`

## Admin Roles / 관리자 역할

초기 관리자 역할:

```text
Super Admin
Content Admin
Event Admin
Program Admin
Tour Admin
Membership Admin
Commerce Admin
```

역할 원칙:

1. Super Admin은 모든 권한을 가진다.
2. 각 Admin은 자기 업무 영역의 콘텐츠와 신청 / 검토만 처리한다.
3. 회원 등급 승인, 관리자 권한 변경, 권한 규칙 변경은 제한적으로 허용한다.
4. 안전, 법률, 환불, 보험, WFR, 눈사태 안전, 중고 안전장비 관련 항목은 일괄 승인하지 않는다.
5. AI 초안은 사람이 검토해야 하며 AI 결과만으로 게시할 수 없다.

## Permission Levels / 액션 레벨

권한 표기:

```text
View: 목록 / 상세 조회
Create: 새 항목 작성
Edit: 기존 항목 수정
Review: 검토 상태 변경
Publish: 공개 게시
Hide: 숨김 처리
Delete: 삭제 또는 보관 처리
Assign: 담당자 배정
Approve: 승인
Reject: 거절
Settings: 설정 변경
```

삭제 원칙:

- v1에서는 물리 삭제보다 `Hidden`, `Archived`, `Deleted at` 기반 soft delete를 우선한다.
- 실제 영구 삭제는 Super Admin만 별도 확인 후 가능하도록 한다.

## Menu Access Matrix / 메뉴 접근 매트릭스

| Admin Menu | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| Dashboard | Full | Limited | Limited | Limited | Limited | Limited | Limited |
| Review Queue | Full | Content | Events | Programs | Tours | Members | Commerce |
| Official Source Monitor | Full | View | Full | View | View | No | No |
| News & Video | Full | Full | View | No | No | No | No |
| Events | Full | View | Full | No | No | No | No |
| Programs | Full | No | No | Full | No | No | No |
| Safety Education | Full | No | No | Full | No | No | No |
| Freeride Tour | Full | No | No | No | Full | No | No |
| Members | Full | No | No | No | No | Full | No |
| Member Upgrades | Full | No | No | No | No | Full | No |
| Contact / Join | Full | Media only | Event only | Program only | Tour only | Membership/Partner | Shop only |
| Culture | Full | Full | View | No | No | No | No |
| Resources | Full | Full | Event resources | Program resources | Tour resources | No | No |
| SHOP | Full | No | No | No | No | No | Full |
| Member Marketplace | Full | No | No | No | No | No | Full |
| Media Library | Full | Full | Event media | Program media | Tour media | Member proof view | Shop media |
| AI Assistant | Full | Content scope | Event scope | Program scope | Tour scope | Member scope | Commerce scope |
| Settings | Full | No | No | No | No | No | No |
| Audit Log | Full | Limited | Limited | Limited | Limited | Limited | Limited |

## Dashboard Permissions / 대시보드

Super Admin:

- 모든 운영 지표 조회
- 모든 긴급 항목 접근

Content Admin:

- News / Video 검토 대기
- Culture 제보
- Resources 링크 상태
- Media 작업

Event Admin:

- 공식 소스 변경 알림
- Events 검토 대기
- Upcoming Events
- 결과 / 리플레이 링크 누락

Program Admin:

- Athlete Program 신청자
- Safety Education 신청자
- 안전 검토 필요 콘텐츠
- 모집 중 강좌

Tour Admin:

- Freeride Tour 신청자
- 출발 예정 투어
- 투어 취소 / 환불 검토 필요 항목

Membership Admin:

- 신규 회원
- 회원 등급 전환 요청
- 선수회원 승인 대기
- 파트너 / 협력 문의

Commerce Admin:

- 중고장터 검토 대기
- 위험 키워드 감지 매물
- SHOP 상품 상태
- 신고 매물

## Review Queue Permissions / 검토 대기열

| Queue Type | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| AI Draft | Full | Own scope | Own scope | Own scope | Own scope | Own scope | Own scope |
| Official Source Candidate | Full | View | Full | View | View | No | No |
| News / Video Review | Full | Full | View | No | No | No | No |
| Event Candidate | Full | View | Full | No | No | No | No |
| Program Review | Full | No | No | Full | No | No | No |
| Safety Content Review | Full | No | No | Full | No | No | No |
| Tour Review | Full | No | No | No | Full | No | No |
| Culture Submission | Full | Full | No | No | No | No | No |
| Marketplace Listing | Full | No | No | No | No | No | Full |
| Marketplace Report | Full | No | No | No | No | No | Full |
| Member Upgrade | Full | No | No | No | No | Full | No |
| Athlete Member Approval | Full | No | No | No | No | Full | No |
| Resource Link Issue | Full | Full | Event scope | Program scope | Tour scope | No | No |

중요 규칙:

- 안전, WFR, 눈사태 안전, 환불, 보험, 회원 승인, 중고 안전장비 항목은 bulk approve 금지.
- AI Draft는 원문 확인 없이 게시 금지.
- Official Source Candidate는 공식 링크를 확인한 뒤 반영한다.

## Content Publishing Permissions / 콘텐츠 게시 권한

### News & Video

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View | Yes | Yes | Yes | No | No | No | No |
| Create | Yes | Yes | No | No | No | No | No |
| Edit | Yes | Yes | No | No | No | No | No |
| Review member draft | Yes | Yes | View only | No | No | No | No |
| Publish | Yes | Yes | No | No | No | No | No |
| Hide | Yes | Yes | No | No | No | No | No |
| Archive | Yes | Yes | No | No | No | No | No |

### Events

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View | Yes | Yes | Yes | No | No | No | No |
| Create | Yes | No | Yes | No | No | No | No |
| Edit | Yes | No | Yes | No | No | No | No |
| Review source candidate | Yes | View | Yes | No | No | No | No |
| Publish | Yes | No | Yes | No | No | No | No |
| Cancel event | Yes | No | Yes | No | No | No | No |
| Update result/replay link | Yes | No | Yes | No | No | No | No |

Events 특별 규칙:

- `Cancelled`는 Event Admin 또는 Super Admin만 수동 변경.
- FIS Freeride World Championships와 FWT 계열 정보는 공식 링크 확인 후 게시.

### Programs / Safety Education

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View | Yes | No | No | Yes | No | No | No |
| Create | Yes | No | No | Yes | No | No | No |
| Edit | Yes | No | No | Yes | No | No | No |
| Review member draft | Yes | No | No | Yes | No | No | No |
| Mark expert reviewed | Yes | No | No | Yes | No | No | No |
| Publish | Yes | No | No | Yes | No | No | No |
| Cancel program | Yes | No | No | Yes | No | No | No |
| Manage applicants | Yes | No | No | Yes | No | No | No |

Safety 특별 규칙:

- WFR / 눈사태 안전교육 / 안전 관련 본문은 `expert_reviewed_at`이 필요하다.
- AI 초안만으로 안전 교육 본문을 게시하지 않는다.

### Freeride Tour

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View | Yes | No | No | No | Yes | No | No |
| Create | Yes | No | No | No | Yes | No | No |
| Edit | Yes | No | No | No | Yes | No | No |
| Review member draft | Yes | No | No | No | Yes | No | No |
| Publish | Yes | No | No | No | Yes | No | No |
| Cancel tour | Yes | No | No | No | Yes | No | No |
| Manage applicants | Yes | No | No | No | Yes | No | No |
| Update refund policy | Yes | No | No | No | Yes | No | No |

Tour 특별 규칙:

- 가격, 예약금, 일정, 취소 / 환불 규정은 게시 전 관리자 확인이 필요하다.

### Culture

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View | Yes | Yes | No | No | No | No | No |
| Create | Yes | Yes | No | No | No | No | No |
| Edit | Yes | Yes | No | No | No | No | No |
| Review submission | Yes | Yes | No | No | No | No | No |
| Publish | Yes | Yes | No | No | No | No | No |
| Hide | Yes | Yes | No | No | No | No | No |

Culture 특별 규칙:

- 커뮤니티 제보는 초상권, 저작권, 안전성, 브랜드 톤 검토 후 게시한다.

## Membership Permissions / 회원 관리 권한

| Action | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| View member list | Yes | No | No | No | No | Yes | No |
| View member detail | Yes | No | No | No | No | Yes | No |
| Edit member profile admin fields | Yes | No | No | No | No | Yes | No |
| Approve Regular Member | Yes | No | No | No | No | Yes | No |
| Approve Executive Member | Yes | No | No | No | No | Yes | No |
| Approve Athlete Member | Yes | No | No | No | No | Yes | No |
| Approve Supporting / Sponsorship Member | Yes | No | No | No | No | Yes | No |
| Suspend member | Yes | No | No | No | No | Yes | No |
| Delete / anonymize member | Yes | No | No | No | No | Request only | No |

회원 관리 특별 규칙:

- 회원 등급 변경은 audit log 필수.
- 선수회원은 FWT Qualifier Level 3 이상 기준 확인 필드 필요.
- 회원 삭제 / 익명화는 개인정보 정책 ADR 이후 구체화한다.

## Contact / Join Permissions

| Inquiry Type | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| General | Yes | View | No | No | No | Yes | No |
| Athlete | Yes | No | No | Program scope | No | Yes | No |
| Education | Yes | No | No | Yes | No | No | No |
| Tour | Yes | No | No | No | Yes | No | No |
| Partnership | Yes | No | No | No | No | Yes | No |
| Media | Yes | Yes | No | No | No | No | No |
| Sponsor | Yes | No | No | No | No | Yes | No |
| Shop | Yes | No | No | No | No | No | Yes |

문의 처리 규칙:

- AI 답변 초안은 자동 발송하지 않는다.
- 개인정보가 포함된 문의는 관련 관리자 외 접근을 제한한다.

## Commerce Permissions

### SHOP

| Action | Super | Commerce |
|---|---:|---:|
| View products | Yes | Yes |
| Create product | Yes | Yes |
| Edit product | Yes | Yes |
| Publish product | Yes | Yes |
| Hide product | Yes | Yes |
| Archive product | Yes | Yes |

### Member Marketplace

| Action | Super | Commerce |
|---|---:|---:|
| View listings | Yes | Yes |
| Review listing | Yes | Yes |
| Publish listing | Yes | Yes |
| Reject listing | Yes | Yes |
| Hide listing | Yes | Yes |
| Handle reports | Yes | Yes |
| Safety gear risk review | Yes | Yes |

Marketplace 특별 규칙:

- 안전장비 매물은 고지 체크 필수.
- AI는 위험 키워드 표시만 가능.
- 플랫폼은 중고 안전장비 상태를 보증하지 않는다.

## AI Assistant Permissions

| AI Task | Super | Content | Event | Program | Tour | Membership | Commerce |
|---|---:|---:|---:|---:|---:|---:|---:|
| Translation draft | Yes | Own scope | Own scope | Own scope | Own scope | Own scope | Own scope |
| Summary draft | Yes | Own scope | Own scope | Own scope | Own scope | Own scope | Own scope |
| Tag suggestions | Yes | Own scope | Own scope | Own scope | Own scope | No | Own scope |
| Source change summary | Yes | View | Yes | View | View | No | No |
| Risk keyword flag | Yes | Own scope | Own scope | Own scope | Own scope | Own scope | Yes |
| Inquiry classification | Yes | Media scope | Event scope | Program scope | Tour scope | Member scope | Shop scope |
| Reply draft | Yes | Media scope | Event scope | Program scope | Tour scope | Member scope | Shop scope |

AI 금지:

- 자동 게시
- 회원 승인 / 거절
- 안전 판단
- 환불 / 보험 / 법률 문구 최종 결정
- 중고 안전장비 상태 판단

## Settings Permissions

| Settings Area | Super | Others |
|---|---:|---:|
| Admin users | Yes | No |
| Roles / permissions | Yes | No |
| Content permission rules | Yes | View own scope only |
| Taxonomies | Yes | Request change |
| Source monitor settings | Yes | Event Admin request/edit with approval |
| Site global settings | Yes | No |
| Storage settings | Yes | No |
| AI settings | Yes | No |

중요:

- `content_permission_rules` 변경은 Super Admin만 확정한다.
- 운영상 필요하면 각 담당 Admin이 변경 요청을 만들고 Super Admin이 승인한다.

## Audit Log Permissions

| Action | Super | Other Admins |
|---|---:|---:|
| View all audit logs | Yes | No |
| View own scope logs | Yes | Yes |
| Export audit logs | Yes | No |
| Delete audit logs | No by default | No |

감사 로그 원칙:

- 감사 로그 삭제는 기본적으로 금지한다.
- 보존 기간과 익명화 정책은 별도 ADR로 결정한다.

## Dangerous Actions / 위험 액션

항상 추가 확인이 필요한 액션:

```text
Publish safety education
Mark expert reviewed
Cancel event
Cancel tour
Approve athlete member
Approve executive member
Change content permission rules
Change admin role
Hide published official event
Reject marketplace safety gear listing
Update refund policy
Delete or anonymize member data
Export personal data
```

권장 UI:

- 확인 모달
- 변경 사유 입력
- audit log 자동 기록
- 필요한 경우 두 번째 관리자 확인

## Permission JSON Draft / 권한 JSON 초안

`roles.permissions`에 저장할 수 있는 초기 구조:

```json
{
  "news_video": ["view", "create", "edit", "review", "publish", "hide"],
  "events": ["view", "create", "edit", "review", "publish", "cancel"],
  "programs": ["view", "create", "edit", "review", "publish", "manage_applicants"],
  "tours": ["view", "create", "edit", "review", "publish", "manage_applicants"],
  "members": ["view", "edit", "approve_upgrade", "suspend"],
  "marketplace": ["view", "review", "publish", "reject", "hide"],
  "settings": ["view", "edit"],
  "audit_log": ["view_scope"]
}
```

구현 메모:

- 실제 권한은 역할별 seed에서 필요한 key만 넣는다.
- RLS는 관리자 여부를 확인하고, 세부 action은 서버 action/API에서 `roles.permissions`로 검증한다.

## Test Scenarios / 테스트 시나리오

필수 테스트:

1. Content Admin은 News를 게시할 수 있다.
2. Content Admin은 회원 등급을 승인할 수 없다.
3. Event Admin은 Events를 게시할 수 있다.
4. Event Admin은 Program을 수정할 수 없다.
5. Program Admin은 Safety Education을 게시할 수 있다.
6. Program Admin은 expert review 없이 WFR 콘텐츠를 게시할 수 없다.
7. Tour Admin은 투어 신청자를 볼 수 있다.
8. Tour Admin은 회원 등급을 변경할 수 없다.
9. Membership Admin은 정회원 / 임원회원 / 선수회원 / 후원회원 / 스폰서십 회원 전환을 처리할 수 있다.
10. Membership Admin은 Events를 게시할 수 없다.
11. Commerce Admin은 Marketplace 매물을 게시할 수 있다.
12. Commerce Admin은 News를 게시할 수 없다.
13. Super Admin만 content permission rules를 변경 확정할 수 있다.
14. AI output은 어떤 관리자도 원클릭 자동 게시할 수 없다.
15. 위험 액션은 사유 입력과 audit log를 남긴다.

## Open Decisions / 추후 결정 필요

추후 결정할 항목:

- 두 번째 관리자 승인(two-person approval)이 필요한 액션 범위
- 개인정보 export 허용 여부
- 세부 관리자 역할 추가 여부
- 전문가 검토자 역할을 별도 role로 둘지 여부
- 파트너 / 협력업체 계정 권한 구조
- 관리자 2FA 필수 적용 시점

## Next Deliverable / 다음 산출물

다음 문서는 `admin-workflow-v1.md`가 적합하다.

이 문서에서는 Review Queue, 회원 등급 승인, 콘텐츠 게시, 공식 소스 후보 검토, AI 초안 검토, 프로그램 / 투어 신청자 처리 흐름을 실제 운영 순서로 정리한다.
