# FREERIDE KOREA Website Sitemap v1

Date: 2026-07-10

## Site Direction

FREERIDE KOREA 웹사이트는 단순 브랜드 소개 페이지가 아니라, 한국 프리라이드 생태계를 연결하는 공식 플랫폼으로 설계한다.

브랜드 톤은 공식성 60%, 프리미엄 아웃도어 40%를 유지한다.

- 공식성: 선수 육성, 안전 교육, 프로그램 운영, 파트너십 신뢰
- 프리미엄 아웃도어: 설산과 푸른산, 라이더 문화, 영상, 장비, 커뮤니티 감각

## Primary Website Goals

1. FREERIDE KOREA가 무엇을 하는 조직인지 명확히 설명한다.
2. 선수 육성 프로그램과 안전 교육 프로그램을 구분해 보여준다.
3. News, Video, Events를 통해 살아 있는 활동성을 만든다.
4. 교육 참가자, 선수, 파트너, 브랜드, 미디어가 문의할 수 있는 입구를 제공한다.
5. 추후 SHOP과 콘텐츠 아카이브로 확장할 수 있는 구조를 만든다.

## Main Navigation

```text
Home
About
News & Video
Events
Freeride Tour
Athlete Program
  - Freeride
  - Backcountry
Safety Education
  - 눈사태 안전교육
  - WFR
Culture
SHOP
Contact / Join
```

Note: `Backcounty`가 아니라 표준 표기는 `Backcountry`를 사용한다.

## Page Map

### 1. Home

Purpose:
FREERIDE KOREA의 첫 인상을 만들고, 전체 사이트의 핵심 메뉴로 연결하는 관제탑 역할을 한다.

Home은 단순 소개 페이지가 아니라 News, Video, Events, Course, Tour, Notice가 최신순으로 노출되는 운영형 첫 화면이다.

Core Message:
한국 프리라이드 선수 육성, 안전 교육, 투어, 대회 소식, 산악 문화를 연결하는 공식 플랫폼.

Primary CTA:
Athlete Program 보기

Secondary CTA:
Safety Education 보기

Content Blocks:
- Hero: FREERIDE KOREA 로고와 핵심 소개 문장
- Core Pathways: Athlete Program, Safety Education, Freeride Tour, Events
- Latest Updates: News, Video, Event, Course, Tour, Notice 최신순 노출
- Featured Programs: 모집 중인 강좌와 프로그램
- Featured Tours: 모집 중인 프리라이드 투어
- Upcoming Events: 예정된 대회와 이벤트
- Culture: Snow Mountains, Green Mountains, Fun, Respect, Safety
- Join CTA

Reference Document:

- `website/home-definition-v1.md`

### 2. About

Purpose:
브랜드의 목적, 철학, 운영 방향을 설명하는 선언 페이지.

Home이 첫인상과 이동을 위한 페이지라면, About은 브랜드의 뿌리와 신뢰를 만드는 페이지다.

Core Message:
FREERIDE KOREA는 한국인 프리라이드 선수 육성, 글로벌 프리라이드 컬쳐 보급, 산악 안전 교육, 프리라이드 투어, 대회 소식, 커뮤니티 문화를 연결하는 공식 플랫폼이다.

Required Content:
- 브랜드 목적
- 공식성 60%, 프리미엄 아웃도어 40% 포지셔닝
- Fun, Respect, Safety
- 설산과 푸른산을 함께 즐기는 문화
- 로고와 컬러가 의미하는 방향
- 우리가 만드는 것: Athlete Program, Safety Education, Freeride Tour, Events, News & Video, Culture

CTA:
Contact / Join으로 연결

Reference Document:

- `website/about-definition-v1.md`

### 3. News & Video

Purpose:
FREERIDE KOREA의 활동성과 신뢰를 보여주는 콘텐츠 허브.

Freeride World Tour의 `News & Videos` 페이지처럼 뉴스와 영상이 함께 흐르는 카드형 아카이브를 참고하되, 초기 운영은 `News`와 `Video` 두 타입으로 단순하게 시작한다.

Subcategories:
- All / 전체
- News / 뉴스
- Video / 영상

Optional future filters:

- Athlete / 선수
- Safety / 안전
- Events / 이벤트
- Culture / 컬쳐

Content Examples:
- 대회 참가 소식
- 선수 훈련 영상
- 라이더 인터뷰
- 눈사태 안전 콘텐츠
- WFR 관련 교육 노트
- 브랜드 협업 소식

CTA:
뉴스 읽기, 영상 보기, 미디어 문의

CMS Requirements:

- 게시물 타입: News 또는 Video
- 한글/영문 제목
- 한글/영문 요약
- 썸네일 이미지 업로드
- 본문 텍스트 필드
- 사진 업로드 또는 갤러리
- YouTube URL 필드, Video 타입에서 사용
- 카테고리 선택
- 게시 상태: draft / published

Video Rule:

- Video 게시물은 YouTube 링크 기반으로 연결하거나 임베드한다.
- 직접 영상 파일 업로드는 초기 범위에서 제외한다.

Reference Document:

- `website/news-video-definition-v1.md`

### 4. Events

Purpose:
국내외 프리라이드 대회 소식을 정리해서 전달하는 공식 이벤트 아카이브.

초기에는 자동 크롤링이 아니라 수동 등록 게시판/CMS로 운영한다. 공식 사이트의 구조 변경, 저작권, 운영 안정성 문제를 피하기 위해 관리자가 공통 필드를 직접 입력한다.

Event Types:
- Official Major
  - FIS Freeride World Championships
  - Freeride World Tour
- FWT Pathway Series
  - FWT Challenger
  - FWT Qualifier
  - FWT Junior
- Regional / Unofficial
  - Freeride Asia

Series Categories:
- Freeride Asia
- Freeride World Tour
- FWT Challenger
- FWT Qualifier
- FWT Junior
- FIS Freeride World Championships

Category Rule:
`FIS Freeride World Championships`는 `Freeride World Tour`의 하위 카테고리가 아니라, Official Major 범주에서 `Freeride World Tour`와 동등한 최상위 위치로 둔다.

Required Content:
- 대회명
- 대회 범주
- 시리즈 카테고리
- 공식 / 비공식 여부
- 시즌
- 국가
- 장소 / 리조트
- 시작 일시
- 종료 일시
- 취소 여부
- 대표 이미지
- 짧은 소개문
- 상세 설명
- 공식 링크
- 등록 링크
- 리플레이 / 결과 링크
- 관련 뉴스 또는 영상 링크

CTA:
공식 링크 보기, 등록 링크 보기, 결과 / 리플레이 보기

Status Rule:

- `취소`만 관리자가 수동 선택한다.
- `예정 / 진행중 / 완료`는 시작 일시와 종료 일시를 기준으로 자동 계산한다.

Reference Document:

- `website/events-definition-v1.md`

Related Resources:

- FWT 공식 이벤트 페이지
- FWT Challenger / Qualifier / Junior 링크
- FIS Freeride World Championships 링크
- 대회 등록 링크
- 결과 / 리플레이 링크

### 5. Freeride Tour

Purpose:
프리라이드 여행, 백컨트리 원정, 리조트 기반 프리라이드 캠프, 해외 스키/스노보드 투어를 등록하고 신청받는 상품형 투어 메뉴.

Freeride Tour는 교육보다 여행 경험과 현장 운영이 중심이다.

Core distinction:

- Athlete Program: 선수 성장 / 훈련 중심
- Safety Education: 안전 교육 / 자격 / 워크숍 중심
- Freeride Tour: 여행 / 원정 / 커뮤니티 경험 / 신청 중심

Suggested Categories:

- Korea / 국내 투어
- Japan / 일본 파우더 투어
- Central Asia / 중앙아시아 원정
- Europe / 유럽 프리라이드 투어
- Custom Tour / 맞춤 투어

Required Content:

- 투어명
- 투어 지역
- 국가
- 리조트 / 산악 지역
- 투어 유형
- 난이도
- 대상자
- 일정
- 모집 인원
- 가격
- 예약금
- 포함 사항
- 불포함 사항
- 숙박 정보
- 이동 정보
- 가이드 / 리더
- 필수 장비
- 권장 보험
- 안전 교육 포함 여부
- 대표 이미지
- 상세 이미지
- 짧은 소개문
- 상세 설명
- 신청 폼
- 문의처
- 취소 / 환불 규정

CTA:
투어 신청하기, 투어 문의하기

Reference Document:

- `website/freeride-tour-definition-v1.md`

Related Resources:

- 지도 / GPS 앱
- 오프라인 맵
- 여행 준비 체크리스트
- 보험 / 응급 정보
- 국가별 기상 / 리조트 링크
- 투어 전 장비 체크리스트

### 6. Athlete Program

Purpose:
FREERIDE KOREA의 선수 육성 강좌와 프로그램을 등록하고 신청받는 메뉴.

Athlete Program은 Safety Education과 함께 하나의 Course / Program CMS로 통합 관리한다.

Top-Level Message:
한국인 라이더가 프리라이드 월드 투어 본선과 향후 올림픽 무대에 도전할 수 있도록 체계적인 성장 루트를 만든다.

#### 5-1. Freeride

Purpose:
경기와 영상 중심의 프리라이드 선수 육성 카테고리.

Program Topics:
- 라인 선택
- 점프와 드롭
- 스피드 컨트롤
- 슬로프 스타일
- 영상 포트폴리오
- 대회 전략
- 멘탈과 피지컬 훈련

CTA:
Freeride 선수 프로그램 문의

#### 5-2. Backcountry

Purpose:
산악 이동, 루트 판단, 투어링 역량을 키우는 카테고리.

Program Topics:
- 투어링 기초
- 루트 플래닝
- 산악 기상
- 지형 판단
- 장비 운용
- 그룹 의사결정
- 안전한 철수 판단

CTA:
Backcountry 프로그램 문의

CMS Role:

- 강좌 등록
- 일정 / 장소 / 정원 관리
- 모집 상태 표시
- 신청 폼
- 강사 / 커리큘럼 / 준비물 관리
- 취소 / 환불 규정 표시

Reference Document:

- `website/course-program-definition-v1.md`

Related Resources:

- FWT 공식 링크
- FWT Qualifier / Junior 정보
- 대회 룰북
- 심사 기준
- 영상 포트폴리오 참고 자료
- 국내외 프리라이드 참고 사이트

### 7. Safety Education

Purpose:
프리라이딩과 백컨트리 활동에 필요한 안전 교육 강좌를 등록하고 신청받는 메뉴.

Safety Education은 Athlete Program과 함께 하나의 Course / Program CMS로 통합 관리한다.

Top-Level Message:
좋은 라인을 고르는 것보다 중요한 것은 돌아설 줄 아는 판단이다.

#### 6-1. 눈사태 안전교육

Purpose:
프리라이딩과 백컨트리 활동에서 필수적인 눈사태 위험 판단과 장비 운용을 교육한다.

Education Topics:
- 눈사태 지형 인지
- 적설과 날씨 변화
- 비콘, 프로브, 삽 운용
- 그룹 체크
- 구조 시나리오
- 의사결정과 철수 기준

CTA:
눈사태 안전교육 문의

#### 6-2. WFR

Purpose:
산악 환경에서 발생할 수 있는 응급 상황 대응 역량을 연결한다.

Education Topics:
- 응급 상황 평가
- 저체온 대응
- 외상 관리
- 구조 요청 판단
- 장시간 야외 대응
- 현장 커뮤니케이션

CTA:
WFR 관련 교육 문의

CMS Role:

- 교육 강좌 등록
- 일정 / 장소 / 정원 관리
- 모집 상태 표시
- 신청 폼
- 강사 / 커리큘럼 / 준비물 관리
- 취소 / 환불 규정 표시

Reference Document:

- `website/course-program-definition-v1.md`

Related Resources:

- 눈사태 예보
- 기상 / 적설 정보
- 안전 앱
- 구조 / 응급 연락 정보
- WFR 관련 자료
- 교육 자료 PDF

### 7-1. Resources / 자료실 CMS

Purpose:
앱, 공식 링크, 다운로드 자료, 지도, 기상/눈사태 정보, 대회 링크, 참고 사이트를 하나의 CMS로 관리한다.

Navigation:
초기에는 최상위 메뉴로 노출하지 않는다. 각 메뉴의 Related Resources 섹션으로 자동 노출하고, 자료가 많아지면 최상위 Resources 메뉴로 승격한다.

Core Rule:
자료는 한 번만 등록하고, 관련 메뉴 태그로 Athlete Program, Safety Education, Freeride Tour, Events 등에 동시에 노출한다.

Resource Types:
- Apps
- Weather & Avalanche
- Maps & Navigation
- Competition Links
- Safety Downloads
- Athlete References
- Tour Preparation
- Official Organizations

Reference Document:

- `website/resources-definition-v1.md`

### 8. Culture

Purpose:
FREERIDE KOREA가 단순 교육/대회 단체가 아니라 문화 플랫폼임을 보여준다.

Culture는 자유게시판으로 시작하지 않고, 큐레이션된 매거진과 커뮤니티 제보를 결합한 방식으로 운영한다.

Core principle:
커뮤니티는 열어두되, 문화는 큐레이션한다.

Content Categories:
- Rider Stories / 라이더 스토리
- Photo & Film / 사진·영상
- Mountain Ethics / 산악 윤리
- Green Season / 푸른산 문화
- Gear Culture / 장비 문화
- Community Notes / 커뮤니티 노트

CMS Role:
- 매거진형 콘텐츠 등록
- 사진 / 영상 콘텐츠 등록
- YouTube / Vimeo 링크 연결
- 관련 투어 / 강좌 / 이벤트 연결
- 커뮤니티 제보 폼
- 관리자 검토 후 게시

CTA:
이야기 제보하기, 사진 / 영상 제출하기

Reference Document:

- `website/culture-definition-v1.md`

### 9. SHOP

Purpose:
브랜드 굿즈와 교육 자료, 협업 상품으로 확장할 커머스 영역.

Initial Categories:
- Patch & Sticker
- Apparel
- Safety Goods
- Education Materials
- Collaboration Products
- Member Marketplace / 회원 중고장터

Launch Priority:
초기에는 완전한 쇼핑몰이 아니라 Coming Soon 섹션으로 두고, 출시 예정 상품과 관심 등록 폼을 먼저 운영한다. 브랜드 굿즈와 교육 자료가 준비되면 실제 상품 페이지와 결제 기능으로 전환한다.

회원 중고장터는 SHOP 안에 별도 영역으로 둔다. 공식 판매 상품과 구분하고, 회원 판매 등록과 관리자 검토 방식으로 시작한다.

CMS Role:
- 상품 카테고리 관리
- 출시 예정 상품 등록
- 상품 상태 관리: Coming Soon / Interest Open / Pre-order / On Sale / Sold Out / Hidden
- 대표 이미지와 상세 이미지 등록
- 관심 등록 폼 연결
- 협업 상품 문의 연결
- 회원 중고장터 매물 등록
- 중고장터 판매 상태 관리: Open / Reserved / Sold / Hidden / Reported
- 안전 장비 중고거래 필수 체크 항목 관리

MVP Scope:
- SHOP Coming Soon 페이지
- 상품 카테고리 소개
- 출시 예정 상품 카드
- 관심 등록 폼
- 협업 문의 CTA
- Contact / Join 연결
- 회원 중고장터 기본 목록
- 중고 매물 등록 폼, 관리자 검토형

CTA:
출시 알림 신청, 협업 상품 문의, 중고장터 판매 등록

Reference Document:

- `website/shop-definition-v1.md`

### 10. Contact / Join

Purpose:
모든 방문자가 자기 목적에 맞게 FREERIDE KOREA와 연결되는 입구.

Inquiry Types:
- 선수 프로그램 문의
- 교육 참가 문의
- 투어 문의
- 회원가입 / 멤버 등록
- 협력업체 등록
- 브랜드 파트너십
- 미디어 / 영상 협업
- 이벤트 참가 문의
- SHOP / 굿즈 문의

Required Fields:
- 이름
- 이메일 / 연락처
- 문의 유형
- 라이딩 경험
- 관심 프로그램
- 메시지
- 개인정보 수집 및 이용 동의

Extended Form Types:
- Athlete Inquiry / 선수 프로그램 문의
- Education Inquiry / 교육 문의
- Tour Inquiry / 투어 문의
- Membership / 회원가입
- Business Partner / 협력업체
- Brand Partnership / 브랜드 파트너십
- Media Inquiry / 미디어 문의
- General Inquiry / 일반 문의

Membership Types:
- 모든 신규 가입자는 공통 폼 등록 후 일반회원 / General Member로 시작
- 정회원 / Regular Member, 일반회원 가입 후 연 회비 납부로 전환
- 선수회원 / Athlete Member, 일반회원 가입 후 FWT Qualifier Level 3 진출자 이상 기준으로 승인 전환
- 후원회원 / Supporting Member, 일반회원 가입 후 후원 등록으로 전환

Primary CTA:
문의하기

Secondary CTA:
프로그램 소식 받기

Reference Document:

- `website/contact-join-definition-v1.md`

## Recommended Build Order

1. Website screen structure v1
2. Home screen redesign
3. Header / Footer structure
4. Contact / Join form
5. Athlete Program detail pages
6. Safety Education detail pages
7. Freeride Tour pages
8. Events pages
9. News & Video pages
10. Culture pages
11. SHOP / Member Marketplace
12. UI and frontend design system upgrade

Screen Structure Document:

- `website/website-screen-structure-v1.md`

Admin CMS Document:

- `website/admin-cms-requirements-v1.md`

Admin Screen Structure Document:

- `website/admin-screen-structure-v1.md`

Backend Data Model Document:

- `website/backend-data-model-v1.md`

Technology Stack / Implementation Document:

- `website/technology-stack-implementation-v1.md`

Frontend Implementation Plan Document:

- `website/frontend-implementation-plan-v1.md`

Next.js Project Bootstrap Document:

- `website/nextjs-project-bootstrap-v1.md`

MVP Development Roadmap Document:

- `website/mvp-development-roadmap-v1.md`

Project Structure Document:

- `website/project-structure-v1.md`

Database Schema Document:

- `website/database-schema-v1.md`

Database Migration Plan Document:

- `website/database-migration-plan-v1.md`

Supabase RLS Policy Document:

- `website/supabase-rls-policy-v1.md`

Admin Permission Matrix Document:

- `website/admin-permission-matrix-v1.md`

Admin Workflow Document:

- `website/admin-workflow-v1.md`

Member Portal Requirements Document:

- `website/member-portal-requirements-v1.md`

ADR Process Document:

- `website/adr-process-v1.md`
- `website/adr/README.md`
- `website/adr/ADR-TEMPLATE.md`

AI Automation Planning Document:

- `website/ai-automation-planning-v1.md`

## Content Priority

Highest:
- Home
- About
- Athlete Program
- Safety Education
- Contact / Join

Medium:
- News & Video
- Events
- Culture

Later:
- SHOP

## Notes For Next Step

다음 단계는 각 메뉴별 상세 콘텐츠를 작성하는 것이다. 우선순위는 `Home`, `About`, `Athlete Program`, `Safety Education`, `Contact / Join` 순서가 좋다.

UI 디자인 고도화는 사이트맵과 핵심 문구가 잠긴 뒤 진행한다.
