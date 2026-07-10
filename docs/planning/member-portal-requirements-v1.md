# Member Portal Requirements v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 회원 포털, 즉 로그인 후 마이페이지 영역의 1차 요구사항을 정의한다.

회원 포털은 단순한 개인정보 수정 화면이 아니라, 회원 등급, 프로그램 / 투어 신청, 콘텐츠 초안 제출, 중고장터 매물 관리, 등급 전환 요청, 알림을 한곳에서 관리하는 회원 운영 허브다.

기준 문서:

- `website/contact-join-definition-v1.md`
- `website/supabase-rls-policy-v1.md`
- `website/admin-workflow-v1.md`
- `website/admin-permission-matrix-v1.md`
- `website/backend-data-model-v1.md`

## Member Portal Principles / 회원 포털 원칙

1. 모든 신규 가입자는 일반회원으로 시작한다.
2. 정회원, 임원회원, 선수회원, 후원회원 전환은 별도 요청과 관리자 승인을 거친다.
3. 회원이 작성한 공개 콘텐츠는 바로 게시되지 않고 Review Queue로 이동한다.
4. 회원은 자기 정보, 자기 신청, 자기 초안, 자기 매물만 볼 수 있다.
5. 안전, WFR, 눈사태 안전, 투어, 중고 안전장비 관련 정보는 주의 문구와 관리자 검토를 포함한다.
6. 회원 포털은 KO / EN 동시 표기 확장을 고려하되, 초기 운영은 한국어 중심으로 시작할 수 있다.

## Account Routes / 회원 영역 라우트

권장 라우트:

```text
/account
/account/profile
/account/membership
/account/upgrade
/account/applications
/account/submissions
/account/marketplace
/account/notifications
/account/settings
```

추후 확장:

```text
/account/payments
/account/certificates
/account/athlete-profile
/account/sponsor
```

## Member Types / 회원 등급

### General Member / 일반회원

무료 기본 회원.

주요 기능:

- 프로필 관리
- 뉴스 / 이벤트 / 프로그램 소식 수신
- 프로그램 / 투어 신청
- Culture 제보 초안 제출
- 중고장터 매물 등록
- 정회원 / 선수회원 / 후원회원 전환 요청

제한:

- News / Video / Events 초안 작성 불가
- Freeride Tour / Program 초안 작성 불가
- 직접 게시 불가

### Regular Member / 정회원

연 회비 납부 공식 회원.

추가 기능:

- Freeride Tour 초안 작성
- Athlete Program / Safety Education 초안 작성
- 정회원 대상 프로그램 / 이벤트 우선 안내
- 정회원 혜택 안내 확인

제한:

- News / Video / Events 초안 작성 불가
- 직접 게시 불가
- 안전 교육 콘텐츠는 전문가 / 관리자 검토 필요

### Executive Member / 임원회원

운영진 또는 공식 활동에 관여하는 회원 등급.

추가 기능:

- News 초안 작성
- Video 초안 작성
- Events 초안 작성
- 공식 소식 제보 / 이벤트 정보 정리 참여

제한:

- 직접 게시 불가
- 공식 대회 정보는 관리자 검토 후 게시

### Athlete Member / 선수회원

FWT Qualifier Level 3 진출자 이상 기준의 선수 회원.

주요 기능:

- 선수 프로필 관리, 추후 확장
- 대회 참가 이력 / 영상 포트폴리오 관리, 추후 확장
- Athlete Program 관련 우선 안내
- 후원 / 미디어 / 팀 관련 문의 연결, 추후 확장

기준:

- FWT Qualifier Level 3 이상
- 운영진 승인형

### Supporting Member / 후원회원 / Sponsorship Member

선수 육성, 안전 교육, 프리라이드 문화 확산을 후원하거나 스폰서십 형태로 참여하는 개인, 브랜드, 기업, 단체 회원.

이 등급은 단순 기부 회원만 의미하지 않는다. 공식 후원, 브랜드 스폰서십, 장비 후원, 서비스 후원, 이벤트 스폰서십, 선수 후원, 미디어 / 콘텐츠 협업까지 포함하는 스폰서십 회원 등급으로 운영한다.

주요 기능:

- 후원 / 스폰서십 상태 확인, 추후 확장
- 후원 / 스폰서십 관련 소식 수신
- 후원 방식 / 스폰서십 유형 / 후원 내역 관리, 결제 도입 후 확장
- 브랜드 / 기업 / 단체 정보 관리, 추후 확장
- 스폰서십 제안서, 계약 상태, 제공 혜택 관리, 추후 확장

초기 정책:

- 콘텐츠 작성 권한은 일반회원과 동일하게 시작한다.
- 브랜드 노출, 로고 사용, 공식 파트너 표기, 후원 혜택은 관리자 승인 후 적용한다.
- 추가 권한은 운영 정책과 스폰서십 계약 범위에 따라 별도 부여한다.

## Dashboard / 마이페이지 홈

목적:

회원이 현재 상태와 해야 할 일을 빠르게 확인하는 첫 화면.

포함 요소:

- 회원 이름
- 현재 회원 등급
- 등급 전환 요청 상태
- 진행 중인 프로그램 신청
- 진행 중인 투어 신청
- 내가 제출한 초안 상태
- 중고장터 매물 상태
- 최신 알림
- 추천 CTA

추천 CTA:

```text
프로필 완성하기
정회원 전환 신청
선수회원 전환 신청
프로그램 신청 보기
투어 신청 보기
중고장터 매물 등록
Culture 제보하기
```

등급별 Dashboard 차이:

- 일반회원: 등급 전환 CTA 중심
- 정회원: 프로그램 / 투어 작성 및 신청 중심
- 임원회원: News / Events 초안 작성 CTA 노출
- 선수회원: 선수 프로필 / 프로그램 / 대회 관련 정보 중심
- 후원회원: 후원 / 스폰서십 상태, 파트너십 안내, 후원 관련 소식 중심

## Profile / 프로필 관리

회원이 수정 가능한 필드:

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
newsletter_opt_in
community_event_opt_in
```

회원이 직접 수정할 수 없는 필드:

```text
member_type
status
admin_notes
last_login_at
privacy_agreed_at
```

프로필 완성도:

회원 포털에는 프로필 완성도를 보여줄 수 있다.

예:

```text
기본 연락처 완료
라이딩 정보 완료
비상 연락처 완료
관심 분야 선택 완료
```

주의:

- 비상 연락처는 프로그램 / 투어 신청과 연결될 수 있으나 공개 콘텐츠에는 노출하지 않는다.
- 의료 메모가 필요한 경우 신청서 영역에서만 관리한다.

## Membership / 회원 등급 화면

목적:

회원이 현재 등급과 등급 전환 가능성을 이해하고 신청하도록 돕는다.

포함 요소:

- 현재 회원 등급
- 등급별 설명
- 내 등급에서 가능한 기능
- 전환 가능한 등급
- 진행 중인 전환 요청
- 과거 전환 요청 기록

등급 전환 옵션:

```text
정회원 전환 신청
임원회원 전환 신청
선수회원 전환 신청
후원회원 전환 신청
```

초기에는 임원회원 전환은 공개 신청보다 운영진 초대 / 관리자 승인형으로 두는 것이 좋다.

## Membership Upgrade / 등급 전환 요청

공통 필드:

- 요청 등급
- 요청 사유
- 연락처
- 관련 파일 / 증빙
- 관리자에게 전달할 메시지

정회원 전환 필드:

- 연 회비 납부 상태
- 입금자명, 결제 도입 전 수동 관리
- 정회원 신청 사유

선수회원 전환 필드:

- FWT Qualifier Level
- 대회 참가 이력
- 결과 링크
- 영상 포트폴리오 링크
- 현재 활동 계획
- 소속 팀 / 코치

후원회원 / 스폰서십 회원 전환 필드:

- 회원 유형
  - 개인 후원
  - 브랜드 스폰서십
  - 기업 / 단체 스폰서십
  - 장비 후원
  - 서비스 후원
  - 이벤트 스폰서십
  - 선수 후원
- 후원 / 스폰서십 방식
- 후원 목적
- 브랜드 / 기업 / 단체명
- 담당자 정보
- 웹사이트 / SNS 링크
- 로고 파일, 추후 업로드
- 희망 노출 방식
- 공개 후원자 / 공식 스폰서 표시 여부
- 제안 내용 또는 협업 희망 사항

요청 상태:

```text
New
Reviewing
Needs Info
Approved
Rejected
Cancelled
```

회원이 할 수 있는 일:

- 새 요청 생성
- 자기 요청 상태 확인
- Needs Info 상태에서 추가 자료 제출
- 요청 취소

회원이 할 수 없는 일:

- 직접 등급 변경
- 관리자 검토 메모 전체 조회
- 다른 회원 요청 조회

## Applications / 신청 내역

대상:

- Athlete Program
- Safety Education
- Freeride Tour

목록 필드:

- 신청 유형
- 프로그램 / 투어명
- 일정
- 상태
- 결제 상태, 수동 관리
- 신청일
- 관리자 메시지

신청 상태:

```text
New
Reviewing
Confirmed
Waitlisted
Cancelled
Rejected
Completed
```

회원 기능:

- 신청 내역 보기
- 신청 상세 보기
- 추가 정보 제출
- 취소 요청
- 관리자 안내 확인

제한:

- Confirmed / Rejected / Completed 상태는 회원이 직접 변경하지 못한다.
- 결제 상태는 MVP에서 관리자 수동 관리로 시작한다.
- 의료 메모와 비상 연락처는 보호 정보로 취급한다.

## Submissions / 내 초안과 제보

목적:

회원이 제출한 콘텐츠 초안과 제보 상태를 확인하는 화면.

대상 콘텐츠:

```text
Culture submission
Marketplace listing
Freeride Tour draft
Program draft
News draft
Video draft
Event draft
```

등급별 작성 가능:

```text
General Member:
- Culture submission
- Marketplace listing

Regular Member:
- Culture submission
- Marketplace listing
- Freeride Tour draft
- Athlete Program / Safety Education draft

Executive Member:
- News draft
- Video draft
- Event draft
- Regular Member permissions

Athlete Member:
- Regular Member permissions by default
- Additional permissions by policy

Supporting Member / Sponsorship Member:
- General Member permissions by default
- Sponsor / partner visibility is managed by admin approval
```

초안 상태:

```text
Draft
Review
Needs Revision
Approved
Published
Rejected
Hidden
Archived
```

회원 기능:

- 작성 중 초안 저장
- 검토 요청 제출
- 관리자 수정 요청 확인
- Needs Revision 상태에서 수정 후 재제출
- Published 콘텐츠 링크 확인

금지:

- 직접 게시
- 관리자 메모 전체 조회
- 권한 규칙 임의 변경

## Marketplace / 중고장터 관리

회원 기능:

- 매물 등록
- 이미지 업로드
- 가격 / 지역 / 상태 입력
- 판매 상태 업데이트 요청
- 자기 매물 상태 확인
- 관리자 반려 사유 확인

매물 상태:

```text
Draft
Review
Published
Needs Revision
Rejected
Hidden
Sold
Archived
```

필수 필드:

- 상품명
- 카테고리
- 설명
- 가격
- 상태
- 지역
- 연락 방식
- 이미지

안전장비 매물 추가 필드:

- 안전장비 여부
- 안전 고지 확인
- 사용 기간
- 점검 이력, 선택
- 상태 설명

주의 문구:

```text
FREERIDE KOREA는 중고 안전장비의 성능이나 안전성을 보증하지 않습니다.
구매자는 장비 상태를 직접 확인해야 하며, 안전장비는 전문가 점검을 권장합니다.
```

AI 역할:

- 위험 키워드 감지
- 누락 필드 감지
- 카테고리 추천

AI 금지:

- 안전장비 상태 보증
- 자동 게시
- 가격 적정성 최종 판단

## Notifications / 알림

알림 유형:

- 회원 등급 전환 상태 변경
- 프로그램 / 투어 신청 상태 변경
- 초안 검토 결과
- 수정 요청
- 중고장터 매물 검토 결과
- 공식 공지
- 정회원 / 후원회원 / 스폰서십 관련 안내

알림 채널:

```text
MVP:
- 마이페이지 알림
- 이메일

Later:
- 카카오톡
- SMS
- App push
```

회원 기능:

- 알림 목록 보기
- 읽음 처리
- 이메일 수신 설정
- 마케팅 / 커뮤니티 안내 수신 설정

## Settings / 계정 설정

포함 기능:

- 이메일 확인
- 비밀번호 변경
- 연락처 변경
- 선호 언어
- 알림 설정
- 마케팅 수신 동의
- 개인정보 동의 내역
- 계정 비활성화 요청

주의:

- 계정 삭제 / 익명화는 관리자 검토와 개인정보 정책에 따라 처리한다.
- 회원이 직접 영구 삭제하는 기능은 초기 MVP에서 제공하지 않는다.

## Member Portal UI Direction / 화면 방향

회원 포털 디자인은 공개 웹사이트보다 더 실용적이어야 한다.

방향:

- 공식성 60%, 프리미엄 아웃도어 40%
- 정보가 명확한 대시보드
- 상태 배지 중심
- 신청 / 제출 / 검토 흐름이 잘 보이는 구조
- 과한 장식보다 신뢰감과 사용성 우선

권장 구성:

```text
Left navigation
Top member status bar
Main content table or form
Right help / status panel
```

주요 상태 배지:

```text
General
Regular
Executive
Athlete
Supporting
Reviewing
Needs Info
Confirmed
Published
Needs Revision
```

## Data Requirements / 데이터 요구사항

필요 테이블:

- member_profiles
- member_upgrade_requests
- applications
- posts
- events
- programs
- tours
- culture_stories
- marketplace_listings
- review_queue_items
- notifications
- media_files

회원 포털에서 직접 보여줄 수 있는 데이터:

- 자기 프로필
- 자기 등급 전환 요청
- 자기 신청 내역
- 자기 제출 초안
- 자기 중고장터 매물
- 자기 알림

회원 포털에서 직접 보여주면 안 되는 데이터:

- 다른 회원 정보
- 관리자 내부 메모
- Review Queue 전체
- AI output 원본 전체
- 다른 신청자 정보
- 비공개 증빙 자료

## MVP Scope / MVP 범위

MVP에 포함:

- 로그인 / 회원가입
- 일반회원 자동 생성
- 프로필 관리
- 등급 전환 요청
- 신청 내역 확인
- Culture 제보
- Marketplace 매물 등록
- 자기 제출 초안 상태 확인
- 알림 기본 목록

MVP 이후:

- 온라인 회비 결제
- 후원 결제
- 선수 프로필 공개 페이지
- 인증서 / 교육 수료증
- 모바일 앱 push
- 회원 전용 콘텐츠
- 포인트 / 배지 시스템

## Security / 보안과 개인정보

보호 대상:

- 연락처
- 비상 연락처
- 의료 메모
- 회원 등급 증빙
- 결제 / 회비 기록
- 선수회원 증빙 자료

원칙:

- 자기 데이터만 조회 가능
- 관리자 메모는 회원에게 직접 노출하지 않음
- 증빙 파일은 public bucket에 저장하지 않음
- 의료 메모는 공개 콘텐츠와 연결하지 않음
- service role key는 클라이언트에 노출하지 않음

## Test Scenarios / 테스트 시나리오

필수 테스트:

1. 신규 가입자는 자동으로 일반회원이 된다.
2. 일반회원은 자기 프로필만 볼 수 있다.
3. 일반회원은 정회원 전환 요청을 만들 수 있다.
4. 일반회원은 Culture 제보를 제출할 수 있다.
5. 일반회원은 News 초안을 만들 수 없다.
6. 정회원은 Freeride Tour 초안을 만들 수 있다.
7. 정회원은 Safety Education 초안을 만들 수 있지만 직접 게시할 수 없다.
8. 임원회원은 Events 초안을 만들 수 있다.
9. 임원회원도 직접 게시할 수 없다.
10. 선수회원 전환 요청에는 대회 이력 또는 증빙 필드가 필요하다.
11. 후원회원 / 스폰서십 회원 전환 요청에는 후원 유형, 스폰서십 방식, 공개 표시 여부 필드가 필요하다.
12. 회원은 자기 신청 내역만 볼 수 있다.
13. 회원은 다른 회원의 중고장터 초안을 볼 수 없다.
14. 안전장비 매물은 고지 체크 없이 제출할 수 없다.
15. 관리자 반려 후 Needs Revision 상태에서 회원이 수정 재제출할 수 있다.

## Open Decisions / 추후 결정 필요

추후 결정할 항목:

- 정회원 연회비 결제 방식
- 후원회원 / 스폰서십 회원 결제, 계약, 후원 내역 관리 방식
- 선수회원 공개 프로필 범위
- 회원 탈퇴 / 익명화 정책
- 회원 전용 콘텐츠 제공 여부
- 교육 수료증 발급 여부
- 회원 등급별 혜택 상세
- 임원회원 전환을 신청형으로 열지 초대형으로 둘지 여부

## Next Deliverable / 다음 산출물

다음 문서는 `frontend-implementation-plan-v1.md`가 적합하다.

이 문서에서는 지금까지 정리한 공개 웹사이트, 관리자 모드, 회원 포털을 실제 Next.js 화면과 컴포넌트 단위로 어떤 순서로 구현할지 정리한다.
