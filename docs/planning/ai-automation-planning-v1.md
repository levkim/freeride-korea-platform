# AI Automation Planning v1

Date: 2026-07-10

## Purpose / 목적

이 문서는 FREERIDE KOREA 웹사이트와 관리자 CMS에 적용할 AI 자동화 방향을 정의한다.

FREERIDE KOREA의 AI는 운영자를 대체하는 시스템이 아니라, 콘텐츠 작성, 번역, 분류, 요약, 링크 점검, 문의 분류, 검수 보조를 담당하는 운영 보조 시스템으로 설계한다.

특히 눈사태 안전, WFR, 프리라이드 투어, 회원 승인, 중고 안전장비 거래처럼 책임과 위험이 큰 영역은 AI가 자동 판단하거나 자동 게시하지 않는다.

## Core Principle / 핵심 원칙

1. Human-in-the-loop를 기본 원칙으로 한다.
2. AI는 초안, 제안, 점검, 분류까지만 담당한다.
3. 안전, 법적 책임, 환불, 보험, 회원 승인, 중고 안전장비 상태 판단은 사람이 최종 결정한다.
4. AI가 만든 결과물은 출처, 생성 시간, 사용 기능, 검토자, 승인 상태를 기록한다.
5. 한글과 영문을 동시에 운영할 수 있도록 번역 초안과 톤 정리를 지원한다.
6. MVP 단계에서는 자동 게시보다 관리자 검수 대기열을 우선 만든다.

## Automation Levels / 자동화 단계

### Level 0. No AI / AI 사용 안 함

AI를 사용하지 않는 영역.

- 회원 승인 / 거절
- 선수회원 자격 승인
- 환불 / 보험 / 법적 문구 최종 결정
- 투어 안전 공지 최종 결정
- 눈사태 위험 판단
- WFR / 응급 처치 지침 최종 게시
- 중고 안전장비 상태 보증

### Level 1. Suggestion Only / 제안만

AI가 후보를 제안하지만, 저장 또는 반영은 관리자가 한다.

- 태그 추천
- 관련 자료 추천
- 카테고리 추천
- 누락 필드 감지
- 위험 키워드 감지
- 문의 유형 분류

### Level 2. Draft Creation / 초안 생성

AI가 본문 초안을 만들고, 관리자가 수정 후 저장한다.

- 한글 / 영문 번역 초안
- 뉴스 요약 초안
- 영상 설명문 초안
- 프로그램 소개문 초안
- 투어 소개문 초안
- 상품 설명문 초안
- 답변 메일 초안

### Level 3. Admin-approved Publishing / 승인 후 게시

AI가 만든 초안을 관리자가 검토하고, 승인하면 게시한다.

- News & Video 게시물
- Events 소개문
- Culture 스토리
- Resources 설명문
- SHOP 상품 설명

### Level 4. Background Check / 백그라운드 점검

AI 또는 자동화 시스템이 주기적으로 점검하고 관리자에게 알림만 보낸다.

- 외부 링크 정상 여부
- 오래된 자료 경고
- 유튜브 링크 누락 감지
- 행사 일정과 상태값 불일치 감지
- 중복 게시물 감지
- 중고장터 위험 키워드 감지

MVP 단계에서는 Level 4도 자동 수정하지 않고 관리자 알림까지만 담당한다.

## Cross-site AI Functions / 공통 AI 기능

모든 CMS 모듈에 공통으로 적용할 수 있는 기능:

- 한글 / 영문 번역 초안
- 문체 정리: 공식성 60%, 프리미엄 아웃도어 40%
- 짧은 요약문 생성
- SEO 제목 / 설명 초안
- 태그 추천
- 카테고리 추천
- 관련 Resources 추천
- 이미지 alt text 초안
- 링크 정상 여부 점검
- 중복 콘텐츠 감지
- 누락 필드 감지
- 게시 전 체크리스트 생성

## Module Planning / 메뉴별 AI 자동화 계획

### 1. News & Video

AI가 도울 수 있는 일:

- YouTube URL 기반 영상 설명문 초안
- 영상 제목 / 요약 한글화
- 뉴스 본문 요약
- 한글 / 영문 제목 초안
- 태그 추천
- 썸네일 alt text 초안
- 관련 Events / Athlete Program / Culture 연결 추천

관리자 승인 필요:

- 게시 여부
- 제목 최종 문구
- 본문 최종 문구
- 인물 이름, 대회명, 장소명 정확성
- 이미지 / 영상 사용 권한

자동 게시 금지:

- 외부 기사 요약을 검토 없이 게시
- 선수 발언 또는 인터뷰를 검토 없이 게시
- 안전 관련 영상 설명을 검토 없이 게시

### 2. Events

AI가 도울 수 있는 일:

- 공식 링크 내용을 바탕으로 대회 소개문 초안 작성
- 대회명, 국가, 장소, 일정 후보 추출
- 시리즈 카테고리 후보 추천
- 관련 뉴스 / 영상 / Resources 추천
- 일정과 상태값 불일치 감지
- 등록 링크, 결과 링크, 리플레이 링크 누락 감지
- 공식 소스 모니터링에서 감지된 변경사항 요약
- 새 이벤트 후보를 관리자 검토 대기열에 생성

Event category rule:

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

관리자 승인 필요:

- 공식 / 비공식 여부
- 대회 일정
- 등록 링크
- 결과 / 리플레이 링크
- 취소 상태

자동 게시 금지:

- 외부 사이트를 크롤링한 정보를 검토 없이 게시
- 공식 일정 변경을 검토 없이 반영
- 등록 마감, 취소, 장소 변경을 자동 확정

### 2-1. Official Source Monitoring / 공식 소스 모니터링

목적:

Freeride World Tour, FWT Challenger, FWT Qualifier, FWT Junior, FIS Freeride World Championships 같은 공식 페이지의 변경사항을 사람이 매일 직접 확인하지 않아도 되도록 관리자 알림을 만든다.

이 기능은 자동 게시 기능이 아니라 `변경 감지 + 관리자 알림 + 등록 후보 생성` 기능이다.

Monitoring targets:

- Freeride World Tour News & Videos
- Freeride World Tour Events
- FWT Challenger Events
- FWT Qualifier Events
- FWT Junior Events
- FIS Freeride World Championships
- 추후 Freeride Asia 또는 지역 대회 공식 링크

Monitoring frequency:

- MVP: 하루 1회 자동 점검
- 대회 시즌: 하루 2회 또는 관리자가 수동 재점검
- 긴급 자동 반영은 하지 않음

What to detect:

- 새 뉴스 게시물
- 새 영상 게시물
- 새 이벤트 등록
- 일정 변경
- 장소 / 리조트 변경
- 등록 링크 추가 또는 변경
- 결과 / 리플레이 링크 추가
- 취소 또는 상태 변경
- 기존 링크 오류

AI role:

- 변경된 페이지 요약
- 새 게시물 후보 제목 생성
- 한글 / 영문 요약 초안 생성
- Events 또는 News & Video 중 어느 메뉴에 넣을지 추천
- 시리즈 카테고리 추천
- 관련 Resources 추천
- 원문 링크와 감지 시간을 기록

Admin review queue:

```text
Source checked
-> Change detected
-> AI summary draft
-> Admin alert
-> Admin review
-> Create content / Ignore / Snooze / Mark as duplicate
```

Admin notification examples:

- 관리자 대시보드 알림
- 이메일 알림
- 추후 카카오톡 / Slack / Discord 알림
- 중요도 High / Medium / Low 표시

Required source monitor fields:

- source name
- source URL
- source category
- monitoring frequency
- last checked at
- last changed at
- change type
- detected title
- detected URL
- AI summary
- admin status
- reviewer
- review note

Admin status:

- New
- Reviewing
- Draft Created
- Published
- Ignored
- Duplicate
- Snoozed
- Error

Important boundary:

공식 사이트에서 새 정보가 감지되어도 FREERIDE KOREA 사이트에 바로 게시하지 않는다. AI는 `등록 후보`만 만들고, 관리자가 원문을 확인한 뒤 게시한다.

### 3. Athlete Program

AI가 도울 수 있는 일:

- Freeride / Backcountry 프로그램 소개문 초안
- 커리큘럼 설명 초안
- 참가 준비물 체크리스트 초안
- FAQ 초안
- 관련 FWT / 대회 / 룰북 Resources 추천
- 신청자 문의 답변 초안

관리자 승인 필요:

- 커리큘럼 최종 내용
- 강사 정보
- 참가 조건
- 가격 / 일정 / 정원
- 선수 성장 루트 표현

자동 게시 금지:

- 선수 자격 판단
- 훈련 안전 기준 자동 확정
- 대회 참가 가능성 보장 표현

### 4. Safety Education

AI가 도울 수 있는 일:

- 눈사태 안전교육 소개문 초안
- WFR 관련 교육 소개문 초안
- 교육 준비물 체크리스트 초안
- 교육 신청 FAQ 초안
- 관련 안전 앱, 눈사태 예보, 기상 링크 추천
- 교육 자료의 오래된 링크 점검

관리자 승인 필요:

- 눈사태 안전교육 본문
- WFR / 응급 대응 관련 내용
- 안전 공지
- 교육 자료 PDF
- 강사 / 인증 / 교육 기준 문구

자동 게시 금지:

- 눈사태 위험 판단
- 구조 / 응급 처치 지침
- 현장 안전 의사결정
- 특정 루트의 안전 여부

### 5. Freeride Tour

AI가 도울 수 있는 일:

- 투어 소개문 초안
- 일정표 형식 정리
- 포함 / 불포함 항목 정리
- 장비 체크리스트 초안
- 국가별 준비 자료 추천
- 관련 지도, 보험, 날씨, 리조트 링크 추천
- 신청자 문의 답변 초안

관리자 승인 필요:

- 투어 일정
- 가격 / 예약금
- 취소 / 환불 규정
- 보험 안내
- 안전 공지
- 가이드 / 리더 정보
- 참가 조건

자동 게시 금지:

- 현장 위험도 판단
- 보험 / 법적 책임 문구
- 환불 규정 자동 변경
- 투어 가능 여부 자동 확정

### 6. Culture

AI가 도울 수 있는 일:

- 라이더 인터뷰 질문 초안
- 사진 / 영상 설명문 초안
- 커뮤니티 제보 글 정리
- Mountain Ethics 글 초안
- Green Season 콘텐츠 아이디어
- 태그 추천

관리자 승인 필요:

- 커뮤니티 제보 게시
- 인물 발언 정리
- 사진 / 영상 사용 권한
- 산악 윤리 관련 문구

자동 게시 금지:

- 위험한 루트 베타
- 비공개 접근 정보
- 출입 금지 구역 정보
- 특정 개인이나 단체에 대한 검증되지 않은 주장

### 7. SHOP

AI가 도울 수 있는 일:

- 상품 설명문 초안
- 제품 카테고리 추천
- 이미지 alt text 초안
- 출시 예정 상품 소개문
- 협업 상품 소개문
- 관심 등록자 세그먼트 분류

관리자 승인 필요:

- 가격
- 재고
- 배송 / 교환 / 반품 문구
- 브랜드 협업 문구
- 안전장비 관련 표현

자동 게시 금지:

- 법적 책임이 있는 상품 고지
- 안전장비 성능 보장 표현
- 환불 / 교환 정책 자동 변경

### 8. Member Marketplace / 회원 중고장터

AI가 도울 수 있는 일:

- 누락 필드 감지
- 위험 키워드 감지
- 중복 매물 감지
- 신고 사유 분류
- 안전장비 필수 체크 항목 누락 경고
- 관리자 검토 우선순위 추천

필수 점검 예시:

- 제조연식
- 구입 시기
- 충격 / 사고 이력
- 수리 이력
- 점검 이력
- 배터리 / 작동 상태
- 리콜 확인 여부
- 안전장비 중고거래 주의사항 동의

관리자 승인 필요:

- 매물 게시
- 신고 처리
- 숨김 처리
- 판매자 제재

자동 게시 금지:

- 안전장비 상태 판단
- 장비 사용 가능성 보증
- 판매자 신뢰도 자동 판정
- 신고 매물 자동 삭제

### 9. Resources

AI가 도울 수 있는 일:

- 외부 링크 정상 여부 점검
- 오래된 자료 경고
- 자료 설명문 초안
- 관련 메뉴 태그 추천
- 자료 유형 분류
- 한글 / 영문 요약
- 중복 링크 감지

관리자 승인 필요:

- 안전 자료 게시
- 공식 링크 등록
- 다운로드 자료 업로드
- 오래된 자료 숨김 처리

자동 게시 금지:

- 안전 자료 해석
- 외부 자료를 검토 없이 공식 자료처럼 표시
- 링크 변경을 자동 확정

### 10. Contact / Join

AI가 도울 수 있는 일:

- 문의 유형 자동 분류
- 우선순위 플래그
- 누락 정보 요청 초안
- 답변 메일 초안
- 회원 등급 전환 요청 분류
- 파트너십 / 미디어 문의 분류

관리자 승인 필요:

- 답변 발송
- 회원 등급 전환
- 선수회원 승인
- 후원회원 전환
- 협력업체 등록

자동 게시 또는 자동 결정 금지:

- 회원 승인 / 거절
- 선수회원 자격 승인
- 환불 / 법적 / 안전 관련 답변 자동 발송
- 파트너십 수락 / 거절

## Admin Dashboard AI Queue / 관리자 AI 대기열

관리자 대시보드에는 AI 관련 대기열을 별도 영역으로 둔다.

Dashboard widgets:

- AI 초안 검토 대기
- 번역 초안 검토 대기
- 오래된 Resources 링크 점검 필요
- 이벤트 일정 / 상태 불일치
- 중고장터 위험 키워드 감지
- 중고장터 필수 정보 누락
- 문의 유형 자동 분류 결과
- 회원 등급 전환 검토 대기
- 관련 콘텐츠 연결 추천

## Workflow / 운영 흐름

### Content draft workflow

```text
Input
-> AI draft
-> Review queue
-> Admin edit
-> Approved
-> Published
```

### Link check workflow

```text
Scheduled check
-> Issue detected
-> Admin alert
-> Admin verify
-> Update / Hide / Keep
```

### Official source monitoring workflow

```text
Scheduled source check
-> New or changed item detected
-> AI summary and field extraction
-> Admin alert
-> Admin verify original source
-> Create draft / Update existing item / Ignore
-> Admin publish
```

### Marketplace review workflow

```text
Listing submitted
-> AI missing-field / risk-keyword check
-> Admin review
-> Publish / Request edits / Reject / Hide
```

### Contact workflow

```text
Inquiry submitted
-> AI classification
-> Admin queue
-> Reply draft
-> Admin edit
-> Admin send
```

## AI Permissions / AI 권한

AI can:

- 콘텐츠 초안 생성
- 한글 / 영문 번역 초안 생성
- 태그와 카테고리 추천
- 링크 점검
- 누락 필드 감지
- 위험 키워드 감지
- 문의 유형 분류
- 관련 자료 추천

AI cannot:

- 콘텐츠 자동 게시
- 콘텐츠 자동 삭제
- 회원 승인 / 거절
- 선수회원 승인
- 결제 / 환불 / 보험 / 법적 문구 자동 변경
- 안전 관련 판단
- 중고 안전장비 상태 보증
- 외부 크롤링 정보를 검토 없이 게시

## Audit Log / 기록 관리

AI 기능을 사용할 때는 다음 정보를 남긴다.

- module
- item id
- AI action type
- input source
- generated output
- confidence or flags
- timestamp
- admin reviewer
- final decision
- published version

목적:

- 누가 어떤 AI 결과물을 승인했는지 추적
- 안전 / 법적 이슈 발생 시 검토 이력 확인
- 콘텐츠 품질 개선
- 추후 자동화 범위 확장 판단

## MVP Scope / 1차 적용 범위

초기에는 다음 AI 기능부터 적용한다.

1. 한글 / 영문 번역 초안
2. 요약문 초안
3. 태그 추천
4. 관련 Resources 추천
5. 외부 링크 정상 여부 점검
6. 문의 유형 분류
7. 답변 초안
8. 중고장터 누락 필드 감지
9. 중고장터 위험 키워드 감지
10. 이미지 alt text 초안
11. 공식 소스 변경 감지 알림
12. 공식 소스 기반 등록 후보 초안

초기에는 제외한다.

- AI 자동 게시
- 자동 크롤링 기반 게시
- 회원 승인 자동화
- 결제 / 환불 자동 판단
- 안전 공지 자동 생성 후 게시
- 중고 안전장비 상태 자동 판정
- 공식 소스 변경사항 자동 게시

## Later Phase / 이후 확장

MVP가 안정화된 뒤 검토할 기능:

- 뉴스레터 초안 자동 생성
- 월간 콘텐츠 캘린더 제안
- FWT / 대회 공식 링크 변경 감지
- 오래된 안전 자료 자동 알림
- 다국어 SEO 메타데이터 생성
- 신청자 유형별 안내 메일 초안
- 이벤트 시즌별 아카이브 자동 정리
- Resources 품질 점수
- 관리자 업무 우선순위 추천

## Final Decision

FREERIDE KOREA의 AI 자동화는 `자동 운영자`가 아니라 `검수 가능한 운영 보조자`로 설계한다.

AI는 빠르게 초안을 만들고, 누락을 찾고, 링크를 점검하고, 번역과 분류를 돕는다. 그러나 안전, 법적 책임, 회원 승인, 투어 운영, 중고 안전장비 판단은 반드시 사람이 최종 결정한다.

이 방향이 FREERIDE KOREA의 공식성, 신뢰도, 안전 문화를 지키면서 운영 효율을 높이는 가장 현실적인 1차 자동화 전략이다.
