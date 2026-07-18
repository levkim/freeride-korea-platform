import type {
  CategoryContentItem,
  NewsVideoItem,
  UpdateItem,
} from "@/lib/types/content";
import type { EventItem } from "@/lib/types/event";
import type { InquiryItem } from "@/lib/types/inquiry";
import type { Member } from "@/lib/types/member";
import type { ProgramItem } from "@/lib/types/program";
import type { ReviewQueueItem } from "@/lib/types/review";
import type { TourItem } from "@/lib/types/tour";

export const latestUpdates: UpdateItem[] = [
  {
    id: "update-1",
    kind: "news",
    title: {
      ko: "프리라이드 코리아 플랫폼 준비 소식",
      en: "FREERIDE KOREA platform preparation update",
    },
    summary: {
      ko: "선수 육성, 안전 교육, 투어, 대회 소식을 연결하는 공식 플랫폼을 준비하고 있습니다.",
      en: "We are preparing an official platform for athlete development, safety education, tours, and events.",
    },
    status: "published",
    date: "2026-07-10",
  },
  {
    id: "update-2",
    kind: "program",
    title: {
      ko: "눈사태 안전교육 커리큘럼 준비",
      en: "Avalanche safety curriculum planning",
    },
    summary: {
      ko: "프리라이딩에서 가장 중요한 눈사태 안전 교육을 핵심 교육 축으로 설계합니다.",
      en: "Avalanche safety is being designed as a core education pathway for freeriding.",
    },
    status: "review",
    date: "2026-07-10",
  },
  {
    id: "update-3",
    kind: "tour",
    title: {
      ko: "프리라이드 투어 카테고리 설계",
      en: "Freeride tour category planning",
    },
    summary: {
      ko: "국내, 일본, 중앙아시아, 유럽, 맞춤 투어를 확장 가능한 지역 체계로 준비합니다.",
      en: "Tour regions will support Korea, Japan, Central Asia, Europe, and custom destinations.",
    },
    status: "draft",
    date: "2026-07-10",
  },
];

export const newsVideoItems: NewsVideoItem[] = [
  {
    id: "news-video-1",
    kind: "news",
    title: {
      ko: "Freeride joins the Olympic Winter Games",
      en: "It is official: freeride joins the Olympic Winter Games",
    },
    summary: {
      ko: "프리라이드 스키와 스노보드가 Alpes 2030 동계올림픽 프로그램에 포함된 소식입니다.",
      en: "Freeride skiing and snowboarding will feature on the programme of the Alpes 2030 Olympic Winter Games.",
    },
    body: {
      ko: "FWT 공식 뉴스 구조를 참고한 외부 소식 예시입니다. 우리 사이트에서는 원문 링크, 요약, 관련 영상을 함께 관리합니다.",
      en: "A sample external news entry based on the FWT news structure. The FK site manages source links, summaries, and related videos together.",
    },
    publishedAt: "2026-07-07",
    status: "published",
    imageUrl: "/brand/hero-event.png",
    sourceUrl:
      "https://www.freerideworldtour.com/news/its-official-freeride-joins-the-olympic-winter-games/",
    tags: ["Olympic", "FWT", "News"],
  },
  {
    id: "news-video-2",
    kind: "video",
    title: {
      ko: "2026 Season Highlights",
      en: "2026 Season Highlights",
    },
    summary: {
      ko: "2026 시즌 주요 장면을 소개하는 영상 게시물 예시입니다.",
      en: "A video post example for 2026 season highlights.",
    },
    body: {
      ko: "관리자는 유튜브 링크, 대표 이미지, 요약, 본문을 입력하고 관리자 승인 후 게시합니다.",
      en: "Admins can review a YouTube link, hero image, summary, and body before publishing.",
    },
    publishedAt: "2026-05-06",
    status: "published",
    imageUrl: "/brand/hero-video.png",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceUrl: "https://www.freerideworldtour.com/news-videos/",
    tags: ["Video", "Highlights", "FWT"],
  },
  {
    id: "news-video-3",
    kind: "news",
    title: {
      ko: "FREERIDE KOREA 플랫폼 준비 소식",
      en: "FREERIDE KOREA platform preparation update",
    },
    summary: {
      ko: "선수 육성, 안전 교육, 투어, 대회 소식을 연결하는 공식 플랫폼을 준비하고 있습니다.",
      en: "We are preparing an official platform for athlete development, safety education, tours, and events.",
    },
    body: {
      ko: "FREERIDE KOREA는 Fun, Respect, Safety를 기준으로 한국 프리라이드 문화를 정리하고 확장합니다.",
      en: "FREERIDE KOREA organizes and grows Korean freeride culture around Fun, Respect, and Safety.",
    },
    publishedAt: "2026-07-10",
    status: "published",
    imageUrl: "/brand/hero-training.png",
    tags: ["FREERIDE KOREA", "Platform"],
  },
];

export const featuredPrograms: ProgramItem[] = [
  {
    id: "program-1",
    kind: "freeride",
    title: {
      ko: "Freeride Athlete Pathway",
      en: "Freeride Athlete Pathway",
    },
    summary: {
      ko: "FWT 본선과 향후 올림픽 무대를 목표로 하는 한국인 라이더 성장 루트입니다.",
      en: "A development pathway for Korean riders aiming for the FWT main stage and future Olympics.",
    },
    status: "coming-soon",
    location: "Korea / International",
  },
  {
    id: "program-2",
    kind: "avalanche-safety",
    title: {
      ko: "눈사태 안전교육",
      en: "Avalanche Safety Education",
    },
    summary: {
      ko: "비콘, 프로브, 삽 운용과 지형 판단, 그룹 의사결정을 다루는 안전 교육입니다.",
      en: "Safety training covering beacon, probe, shovel use, terrain judgment, and group decisions.",
    },
    status: "coming-soon",
    location: "Korea",
  },
];

export const featuredTours: TourItem[] = [
  {
    id: "tour-1",
    title: {
      ko: "Japan Powder Freeride Tour",
      en: "Japan Powder Freeride Tour",
    },
    region: "Japan",
    country: "Japan",
    difficulty: "intermediate",
    status: "coming-soon",
    summary: {
      ko: "파우더와 리조트 기반 프리라이드 경험을 연결하는 일본 투어입니다.",
      en: "A Japan tour connecting powder riding and resort-based freeride experience.",
    },
  },
  {
    id: "tour-2",
    title: {
      ko: "Custom Freeride Expedition",
      en: "Custom Freeride Expedition",
    },
    region: "Custom",
    country: "Global",
    difficulty: "advanced",
    status: "coming-soon",
    summary: {
      ko: "팀, 브랜드, 선수 목적에 맞춘 맞춤형 프리라이드 투어입니다.",
      en: "A custom freeride tour for teams, brands, and athlete objectives.",
    },
  },
];

export const upcomingEvents: EventItem[] = [
  {
    id: "event-1",
    name: {
      ko: "FIS Freeride World Championships",
      en: "FIS Freeride World Championships",
    },
    series: "fis-freeride-world-championships",
    officiality: "official",
    season: "2026",
    country: "Andorra",
    location: "Andorra",
    resort: "Andorra",
    startsAt: "2026-02-01T00:00:00.000Z",
    endsAt: "2026-02-07T00:00:00.000Z",
    timezone: "Europe/Andorra",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "FWT와 동등한 Official Major 범주에서 관리할 세계선수권 대회입니다.",
      en: "A world championship managed as an Official Major category alongside Freeride World Tour.",
    },
    description: {
      ko: "FIS Freeride World Championships는 Freeride World Tour 위의 Official Major 범주에서 동등한 위계로 관리하는 세계선수권 대회입니다.",
      en: "The FIS Freeride World Championships is managed as an Official Major event with equal hierarchy above the Freeride World Tour category.",
    },
    officialLink:
      "https://www.freerideworldtour.com/worldchampionships/events/fis-freeride-world-championships-2026-andorra/",
    relatedLinks: [
      {
        label: "Official event page",
        url: "https://www.freerideworldtour.com/worldchampionships/events/fis-freeride-world-championships-2026-andorra/",
      },
    ],
  },
  {
    id: "event-2",
    name: {
      ko: "2026 Baqueira Beret Pro by movistar",
      en: "2026 Baqueira Beret Pro by movistar",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "Spain",
    location: "Baqueira Beret",
    resort: "Baqueira Beret",
    startsAt: "2026-01-15T00:00:00.000Z",
    endsAt: "2026-01-15T23:59:59.000Z",
    timezone: "Europe/Madrid",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "2026 FWT 시즌 개막전으로 관리할 스페인 Baqueira Beret 대회입니다.",
      en: "The Spain stop opening the 2026 Freeride World Tour season.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink:
      "https://www.freerideworldtour.com/events/2026-baqueira-beret-pro/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-baqueira-beret-pro/",
      },
    ],
  },
  {
    id: "event-3",
    name: {
      ko: "2026 Val Thorens Pro",
      en: "2026 Val Thorens Pro",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "France",
    location: "Val Thorens",
    resort: "Val Thorens",
    startsAt: "2026-01-24T00:00:00.000Z",
    endsAt: "2026-01-29T23:59:59.000Z",
    timezone: "Europe/Paris",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "프랑스 Val Thorens에서 열리는 2026 Freeride World Tour 대회입니다.",
      en: "The 2026 Freeride World Tour stop in Val Thorens, France.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink:
      "https://www.freerideworldtour.com/events/2026-val-thorens-pro/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-val-thorens-pro/",
      },
    ],
  },
  {
    id: "event-4",
    name: {
      ko: "2026 Georgia Pro",
      en: "2026 Georgia Pro",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "Georgia",
    location: "Georgia",
    resort: "TBD",
    startsAt: "2026-02-22T00:00:00.000Z",
    endsAt: "2026-02-28T23:59:59.000Z",
    timezone: "Asia/Tbilisi",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "조지아에서 열리는 2026 Freeride World Tour 대회입니다.",
      en: "The 2026 Freeride World Tour stop in Georgia.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink: "https://www.freerideworldtour.com/events/2026-georgia-pro/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-georgia-pro/",
      },
    ],
  },
  {
    id: "event-5",
    name: {
      ko: "2026 Fieberbrunn Pro",
      en: "2026 Fieberbrunn Pro",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "Austria",
    location: "Fieberbrunn",
    resort: "Fieberbrunn",
    startsAt: "2026-03-05T00:00:00.000Z",
    endsAt: "2026-03-10T23:59:59.000Z",
    timezone: "Europe/Vienna",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "오스트리아 Fieberbrunn에서 열리는 2026 Freeride World Tour 대회입니다.",
      en: "The 2026 Freeride World Tour stop in Fieberbrunn, Austria.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink:
      "https://www.freerideworldtour.com/events/2026-fieberbrunn-pro/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-fieberbrunn-pro/",
      },
    ],
  },
  {
    id: "event-6",
    name: {
      ko: "2026 YETI Alaska Haines Pro",
      en: "2026 YETI Alaska Haines Pro",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "United States",
    location: "Haines, Alaska",
    resort: "Haines",
    startsAt: "2026-03-15T00:00:00.000Z",
    endsAt: "2026-03-22T23:59:59.000Z",
    timezone: "America/Anchorage",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "미국 알래스카 Haines에서 열리는 2026 Freeride World Tour 대회입니다.",
      en: "The 2026 Freeride World Tour stop in Haines, Alaska.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink:
      "https://www.freerideworldtour.com/events/2026-yeti-alaska-pro/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-yeti-alaska-pro/",
      },
    ],
  },
  {
    id: "event-7",
    name: {
      ko: "2026 YETI Xtreme Verbier",
      en: "2026 YETI Xtreme Verbier",
    },
    series: "freeride-world-tour",
    officiality: "official",
    season: "2026",
    country: "Switzerland",
    location: "Verbier",
    resort: "Verbier",
    startsAt: "2026-03-28T00:00:00.000Z",
    endsAt: "2026-04-05T23:59:59.000Z",
    timezone: "Europe/Zurich",
    cancelled: false,
    imageUrl: "/brand/hero-event.png",
    summary: {
      ko: "스위스 Verbier에서 열리는 2026 Freeride World Tour 파이널 대회입니다.",
      en: "The 2026 Freeride World Tour finals stop in Verbier, Switzerland.",
    },
    description: {
      ko: "FWT 공식 페이지 기준 2026 시즌 Freeride World Tour 이벤트 항목입니다.",
      en: "A 2026 Freeride World Tour event entry based on the official FWT event page.",
    },
    officialLink:
      "https://www.freerideworldtour.com/events/2026-yeti-xtreme-verbier/",
    relatedLinks: [
      {
        label: "Official FWT event",
        url: "https://www.freerideworldtour.com/events/2026-yeti-xtreme-verbier/",
      },
    ],
  },
  {
    id: "event-8",
    name: {
      ko: "Freeride Asia Regional Event",
      en: "Freeride Asia Regional Event",
    },
    series: "freeride-asia",
    officiality: "unofficial",
    season: "2026",
    country: "Asia",
    location: "TBD",
    resort: "TBD",
    startsAt: "2026-03-01T00:00:00.000Z",
    endsAt: "2026-03-02T00:00:00.000Z",
    timezone: "Asia/Seoul",
    cancelled: false,
    imageUrl: "/brand/hero-tour.png",
    summary: {
      ko: "아시아 지역 프리라이드 비공식 대회 소식을 올리기 위한 예시 항목입니다.",
      en: "A placeholder for unofficial freeride event updates in Asia.",
    },
    description: {
      ko: "Freeride Asia 카테고리는 공식 FWT 범주가 아닌 지역 대회, 커뮤니티 이벤트, 참여 소식을 관리합니다.",
      en: "Freeride Asia manages regional events, community competitions, and participation updates outside the official FWT categories.",
    },
    relatedLinks: [],
  },
];

export const mockMembers: Member[] = [
  {
    id: "member-1",
    name: "데모 회원",
    email: "member@freeride.kr",
    memberType: "general",
    status: "active",
    joinedAt: "2026-07-10",
  },
  {
    id: "member-2",
    name: "정회원 전환 후보",
    email: "regular@freeride.kr",
    memberType: "regular",
    status: "reviewing",
    joinedAt: "2026-07-11",
  },
  {
    id: "member-3",
    name: "임원 편집자",
    email: "executive@freeride.kr",
    memberType: "executive",
    status: "active",
    joinedAt: "2026-07-12",
  },
  {
    id: "member-4",
    name: "퀄리파이어 선수",
    email: "athlete@freeride.kr",
    memberType: "athlete",
    status: "active",
    joinedAt: "2026-07-13",
  },
  {
    id: "member-5",
    name: "스폰서십 파트너",
    email: "sponsor@freeride.kr",
    memberType: "supporting",
    status: "reviewing",
    joinedAt: "2026-07-14",
  },
];

export const inquiryItems: InquiryItem[] = [
  {
    id: "inquiry-1",
    type: "membership",
    name: "김프리",
    email: "member@freeride.kr",
    phone: "010-0000-0001",
    title: "정회원 전환 문의",
    message: "정회원 가입 절차와 연 회비 납부 방법을 알고 싶습니다.",
    status: "new",
    assignedTo: "회원 담당",
    createdAt: "2026-07-14",
  },
  {
    id: "inquiry-2",
    type: "freeride-tour",
    name: "박투어",
    email: "tour@freeride.kr",
    phone: "010-0000-0002",
    title: "일본 프리라이드 투어 문의",
    message: "일본 파우더 투어 일정과 참가 가능 레벨을 문의합니다.",
    status: "reviewing",
    assignedTo: "투어 담당",
    createdAt: "2026-07-15",
  },
  {
    id: "inquiry-3",
    type: "sponsorship",
    name: "브랜드 파트너",
    email: "partner@example.com",
    title: "선수 후원 및 브랜드 협업 문의",
    message: "선수 육성과 안전 교육 프로그램 후원 가능성을 검토하고 싶습니다.",
    status: "needs_reply",
    assignedTo: "파트너십 담당",
    createdAt: "2026-07-16",
  },
  {
    id: "inquiry-4",
    type: "media",
    name: "미디어 담당자",
    email: "media@example.com",
    title: "프리라이드 문화 인터뷰 요청",
    message: "한국 프리라이드 문화와 안전 교육 방향에 대해 인터뷰를 요청합니다.",
    status: "closed",
    assignedTo: "미디어 담당",
    createdAt: "2026-07-17",
  },
];

export const reviewQueueItems: ReviewQueueItem[] = [
  {
    id: "review-1",
    kind: "member-upgrade",
      title: "정회원 등급 전환 요청",
      submittedBy: "데모 회원",
    status: "new",
    requiredAuthorRole: "general",
    requiredPublishRole: "admin",
    risk: "low",
    createdAt: "2026-07-10",
  },
  {
    id: "review-2",
    kind: "source-alert",
      title: "공식 대회 소스 업데이트 후보",
      submittedBy: "소스 모니터",
    status: "reviewing",
    requiredAuthorRole: "admin",
    requiredPublishRole: "admin",
    risk: "medium",
    createdAt: "2026-07-10",
  },
  {
    id: "review-3",
    kind: "marketplace",
      title: "중고 안전 장비 매물 등록 요청",
      submittedBy: "데모 회원",
    status: "review",
    requiredAuthorRole: "general",
    requiredPublishRole: "admin",
    risk: "high",
    createdAt: "2026-07-10",
  },
  {
    id: "review-4",
    kind: "program",
    title: "Freeride Athlete Pathway 초안",
    submittedBy: "정회원 전환 후보",
    status: "review",
    requiredAuthorRole: "regular",
    requiredPublishRole: "admin",
    risk: "medium",
    createdAt: "2026-07-18",
  },
  {
    id: "review-5",
    kind: "tour",
    title: "Japan Powder Freeride Tour 모집 초안",
    submittedBy: "임원 편집자",
    status: "review",
    requiredAuthorRole: "regular",
    requiredPublishRole: "admin",
    risk: "medium",
    createdAt: "2026-07-18",
  },
  {
    id: "review-6",
    kind: "culture",
    title: "Fun Respect Safety 컬쳐 스토리",
    submittedBy: "데모 회원",
    status: "review",
    requiredAuthorRole: "general",
    requiredPublishRole: "admin",
    risk: "low",
    createdAt: "2026-07-18",
  },
  {
    id: "review-7",
    kind: "shop",
    title: "정회원 연회비 상품 등록 초안",
    submittedBy: "운영 관리자",
    status: "draft",
    requiredAuthorRole: "regular",
    requiredPublishRole: "admin",
    risk: "medium",
    createdAt: "2026-07-18",
  },
];

export const categoryContentItems: CategoryContentItem[] = [
  {
    id: "freeride-athlete-pathway",
    kind: "program",
    subtype: "Freeride",
    title: {
      ko: "프리라이드 선수 육성 패스웨이",
      en: "Freeride Athlete Pathway",
    },
    summary: {
      ko: "FWT Qualifier, Challenger, World Tour 본선과 향후 올림픽 무대를 목표로 하는 한국 선수 성장 프로그램입니다.",
      en: "A structured pathway for Korean riders aiming for FWT Qualifier, Challenger, World Tour, and future Olympic stages.",
    },
    body: {
      ko: "선수의 현재 레벨, 시즌 목표, 대회 참가 계획, 영상 분석, 피지컬과 멘탈 준비를 함께 관리합니다. 단순 강습이 아니라 대회 출전과 성장 기록을 연결하는 운영형 프로그램으로 설계합니다.",
      en: "The program connects rider level checks, seasonal goals, event planning, video review, physical preparation, and competition readiness into one managed pathway.",
    },
    status: "published",
    imageUrl: "/brand/hero-training.png",
    location: "Korea / International",
    startsAt: "Season based",
    capacity: "Review based",
    athleteLevel: "Development / Competition / Elite",
    targetEvents: "FWT Qualifier, FWT Challenger, Freeride World Tour, future Olympic pathway",
    seasonGoal:
      "Set a season competition plan, build rider video review records, and prepare international event entries.",
    coachingFormat:
      "Season planning meeting, online video feedback, line choice review, event preparation support, and post-event debrief.",
    videoReview:
      "Rider footage is reviewed for line choice, fluidity, control, technique, and competition decision-making.",
    selectionCriteria:
      "Regular member or above. Riding footage, safety education history, competition goals, and operating team review may be required before participation.",
    applicationUrl: "/contact-join",
    policyNote:
      "정회원 이상 제안 가능, 실제 게시는 관리자 승인 후 진행합니다. 선수회원 전환은 운영진 검토 기준을 따릅니다.",
    tags: ["Athlete", "FWT", "Competition"],
  },
  {
    id: "backcountry-development",
    kind: "program",
    subtype: "Backcountry",
    title: {
      ko: "백컨트리 역량 강화 프로그램",
      en: "Backcountry Development Program",
    },
    summary: {
      ko: "리조트 밖 지형에서 이동, 장비 운용, 그룹 판단, 응급 상황 대응을 훈련하는 실전형 프로그램입니다.",
      en: "A field-based program for movement, gear use, group decisions, and emergency response outside resort terrain.",
    },
    body: {
      ko: "스킨업, 루트 선정, 지형 읽기, 날씨와 설질 변화 이해, 그룹 커뮤니케이션을 단계적으로 다룹니다. 프리라이드 투어와 선수 프로그램의 기초 체력과 판단력을 함께 보강합니다.",
      en: "The curriculum covers skinning, route selection, terrain reading, snow and weather changes, and group communication as a foundation for freeride tours and athlete development.",
    },
    status: "published",
    imageUrl: "/brand/hero-tour.png",
    location: "Korea / Japan",
    startsAt: "Winter season",
    capacity: "Small group",
    price: "By session",
    instructor: "FK education lead / partner guide",
    operator: "Direct operation or partner guide",
    difficulty: "Intermediate",
    requiredGear:
      "Touring setup, helmet, backpack, beacon, probe, shovel, weather-ready layers",
    insuranceNote:
      "Outdoor activity insurance is recommended. Participants must confirm emergency contact and basic health condition before joining.",
    cancellationPolicy:
      "Weather, avalanche forecast, and guide judgment may change or cancel the session. Refund rules are confirmed per course notice.",
    applicationUrl: "/contact-join",
    policyNote:
      "교육 콘텐츠 작성은 임원진 이상 가능하며, 참가 전 필수 장비, 보험, 안전 교육 이수 여부를 확인합니다.",
    tags: ["Backcountry", "Training", "Safety"],
  },
  {
    id: "freeriding-skills",
    kind: "program",
    subtype: "Freeriding",
    title: {
      ko: "FREERIDING 교육",
      en: "Freeriding Skills Education",
    },
    summary: {
      ko: "자연설에서 스키어와 보더가 안전하고 즐겁게 다운힐할 수 있도록 라이딩 스킬을 다루는 교육입니다.",
      en: "A freeriding skills course for skiers and snowboarders to ride natural snow safely and enjoyably.",
    },
    body: {
      ko: "FREERIDING 교육은 자연설, 파우더, 크러드, 트리런, 급사면 등 다양한 설면과 지형에서 안전하게 다운힐하기 위한 기본기와 응용 기술을 다룹니다. 라인 선택, 속도 조절, 턴 컨트롤, 낙상 위험 관리, 그룹 라이딩 매너를 포함하며 필요에 따라 전문 강사 또는 외부 교육센터에 위탁해 운영할 수 있습니다.",
      en: "This course covers core and applied downhill skills for natural snow, powder, crud, tree runs, and steeper terrain. It includes line choice, speed management, turn control, fall-risk management, and group riding etiquette, and may be operated with professional instructors or external education centers.",
    },
    status: "published",
    imageUrl: "/brand/hero-training.png",
    location: "Korea / Partner centers",
    startsAt: "Season based",
    capacity: "Small group",
    price: "By course",
    instructor: "Professional instructor or external education center",
    operator: "Direct operation / outsourced education center",
    difficulty: "Beginner to Intermediate",
    requiredGear:
      "Helmet, freeride ski or snowboard setup, suitable boots, protective gear, layered outdoor clothing",
    insuranceNote:
      "Participants are guided to prepare outdoor activity insurance and confirm personal riding level before the course.",
    cancellationPolicy:
      "Course operation may be adjusted by snow condition, weather, resort policy, or instructor decision.",
    applicationUrl: "/contact-join",
    policyNote:
      "FREERIDING 교육 작성은 임원진 이상 가능하며, 내부 운영 또는 강사/외부 교육센터 위탁 방식으로 진행할 수 있습니다. 강사 정보와 안전 운영 기준을 상세 페이지에 명확히 표시합니다.",
    tags: ["Freeriding", "Skills", "Education"],
  },
  {
    id: "avalanche-safety-foundation",
    kind: "program",
    subtype: "Avalanche Safety",
    title: {
      ko: "눈사태 안전교육 기초 과정",
      en: "Avalanche Safety Foundation",
    },
    summary: {
      ko: "프리라이딩에서 가장 중요한 눈사태 안전 판단과 구조 장비 운용을 배우는 핵심 과정입니다.",
      en: "A core course for avalanche awareness, terrain judgment, and rescue equipment use in freeriding.",
    },
    body: {
      ko: "비콘, 프로브, 삽 사용법뿐 아니라 사면 각도, 적설 변화, 위험 신호, 그룹 의사결정을 함께 다룹니다. 즐겁게 타기 위해 반드시 먼저 갖춰야 할 안전 기준을 정리합니다.",
      en: "Beyond beacon, probe, and shovel use, the course covers slope angle, snowpack changes, red flags, and group decision-making.",
    },
    status: "published",
    imageUrl: "/brand/hero-safety.png",
    location: "Korea",
    startsAt: "Winter season",
    capacity: "8-12 participants",
    price: "By course",
    instructor: "Avalanche safety instructor",
    operator: "FK education team / partner education center",
    difficulty: "Intro to Intermediate",
    requiredGear:
      "Beacon, probe, shovel, backpack, helmet, gloves, winter outdoor clothing",
    insuranceNote:
      "Participants must understand that avalanche education reduces risk but cannot remove all mountain hazards.",
    cancellationPolicy:
      "Field sessions may be moved, postponed, or cancelled by snowpack, weather, or safety judgment.",
    applicationUrl: "/contact-join",
    policyNote:
      "교육 프로그램 작성은 임원진 이상 가능하며 관리자가 최종 게시합니다.",
    tags: ["Avalanche", "Safety", "Education"],
  },
  {
    id: "wfr-mountain-response",
    kind: "program",
    subtype: "WFR",
    title: {
      ko: "WFR 야생 응급 대응 과정",
      en: "WFR Mountain Response Course",
    },
    summary: {
      ko: "산악 활동 중 발생할 수 있는 부상, 저체온, 구조 대기 상황에 대응하기 위한 WFR 관련 교육입니다.",
      en: "A WFR-related education pathway for injuries, hypothermia, and delayed rescue scenarios in mountain environments.",
    },
    body: {
      ko: "프리라이드와 백컨트리 활동에서 구조 접근이 늦어질 수 있는 상황을 가정하고, 현장 평가, 응급 처치, 의사소통, 이송 판단을 훈련합니다.",
      en: "The course trains scene assessment, field care, communication, and evacuation judgment when rescue access may be delayed.",
    },
    status: "published",
    imageUrl: "/brand/hero-safety.png",
    location: "Korea",
    startsAt: "Scheduled course",
    capacity: "Course based",
    price: "By course",
    instructor: "WFR-qualified instructor or partner provider",
    operator: "External certification provider or FK partner course",
    difficulty: "Intermediate",
    requiredGear:
      "Personal outdoor clothing, note materials, field practice kit as instructed by the provider",
    insuranceNote:
      "Certification, liability, and field-practice scope must be confirmed with the provider before registration.",
    cancellationPolicy:
      "Provider cancellation and refund rules apply. FK displays the official provider policy on the detail page.",
    applicationUrl: "/contact-join",
    policyNote:
      "WFR 관련 교육 작성은 임원진 이상 가능하며, 외부 인증 기관 또는 전문 강사진과의 협력 여부를 상세 페이지에 명확히 표시합니다.",
    tags: ["WFR", "First Aid", "Mountain Safety"],
  },
  {
    id: "japan-powder-freeride-tour",
    kind: "tour",
    subtype: "Japan",
    title: {
      ko: "일본 파우더 프리라이드 투어",
      en: "Japan Powder Freeride Tour",
    },
    summary: {
      ko: "리조트 접근성과 파우더 컨디션을 기반으로 프리라이드 경험을 확장하는 일본 투어입니다.",
      en: "A Japan tour built around resort access, powder conditions, and practical freeride experience.",
    },
    body: {
      ko: "현지 컨디션, 참가자 레벨, 장비 준비, 보험, 이동 동선을 기준으로 일정을 구성합니다. 투어 상세에는 포함 사항, 불포함 사항, 취소/환불 규정을 반드시 함께 표시합니다.",
      en: "The itinerary is shaped by local conditions, rider level, equipment readiness, insurance, and travel logistics.",
    },
    status: "published",
    imageUrl: "/brand/hero-tour.png",
    location: "Japan",
    startsAt: "2026 winter",
    capacity: "6-10 participants",
    price: "Inquiry",
    tourGuide: "FK tour lead / local mountain guide",
    operator: "FK direct planning with local partner support",
    difficulty: "Intermediate",
    requiredLevel:
      "Comfortable on ungroomed snow, able to ride controlled turns in variable conditions",
    itinerary:
      "Day 1 arrival and gear check / Day 2-4 resort-based freeride and condition-based route choice / Day 5 weather reserve or departure",
    includedItems:
      "Tour planning, local condition briefing, freeride route guidance, basic safety briefing",
    excludedItems:
      "Flights, personal insurance, lift tickets, accommodation, meals, rental equipment unless stated",
    requiredGear:
      "Helmet, freeride ski or snowboard setup, avalanche safety gear when required, layered winter clothing",
    insuranceNote:
      "Travel and outdoor activity insurance is strongly recommended. Participants must understand snow, weather, and terrain risk.",
    cancellationPolicy:
      "Schedule may change by weather, avalanche forecast, resort operation, or guide decision. Refund rules are confirmed in the final tour notice.",
    applicationUrl: "/contact-join",
    policyNote:
      "투어 상세에는 취소/환불 규정, 보험 권장, 필수 장비, 안전 교육 포함 여부를 별도 블록으로 표시합니다.",
    tags: ["Tour", "Japan", "Powder"],
  },
  {
    id: "custom-freeride-expedition",
    kind: "tour",
    subtype: "Custom",
    title: {
      ko: "맞춤형 프리라이드 원정",
      en: "Custom Freeride Expedition",
    },
    summary: {
      ko: "팀, 브랜드, 선수, 촬영 목적에 맞춰 지역과 일정, 안전 기준을 별도로 설계하는 맞춤형 프리라이드 투어입니다.",
      en: "A custom freeride expedition designed around team, brand, athlete, or filming objectives.",
    },
    body: {
      ko: "맞춤 투어는 고정 상품이 아니라 목적 기반 설계형 프로그램입니다. 참가자의 라이딩 수준, 촬영 또는 훈련 목적, 희망 지역, 계절, 안전 장비, 보험, 현지 파트너, 가이드 운영 가능 여부를 검토한 뒤 일정과 운영 범위를 확정합니다.",
      en: "Custom tours are scoped after reviewing rider level, objective, destination, season, safety equipment, insurance, local partners, and guide availability.",
    },
    status: "published",
    imageUrl: "/brand/hero-tour.png",
    location: "Global",
    startsAt: "By request",
    capacity: "By project",
    price: "Custom quote",
    tourGuide: "FK tour lead / local guide / partner operator",
    operator: "FK planning with local partner support",
    difficulty: "Advanced",
    requiredLevel:
      "Strong off-piste riding ability, fitness for full-day mountain activity, and willingness to follow safety decisions",
    itinerary:
      "Scope meeting / destination and season review / safety and logistics planning / final itinerary confirmation / field operation",
    includedItems:
      "Route planning, partner coordination, field briefing, safety checklist, and custom itinerary design",
    excludedItems:
      "Flights, insurance, accommodation, lift tickets, guide fees, filming permits, rescue costs, and rental equipment unless stated",
    requiredGear:
      "Helmet, freeride ski or snowboard setup, avalanche safety gear when required, layered outdoor clothing, and project-specific equipment",
    insuranceNote:
      "Travel, rescue, and outdoor activity insurance must be reviewed before final confirmation.",
    cancellationPolicy:
      "Refund and cancellation rules are set per project after destination, operator, and reservation conditions are confirmed.",
    applicationUrl: "/contact-join",
    policyNote:
      "맞춤 투어는 지역, 목적, 안전 조건에 따라 운영 가능 여부가 달라지므로 문의 접수 후 운영진 검토를 거쳐 진행합니다.",
    tags: ["Tour", "Custom", "Expedition"],
  },
  {
    id: "fun-respect-safety-culture",
    kind: "culture",
    subtype: "Story",
    title: {
      ko: "Fun Respect Safety 컬쳐 스토리",
      en: "Fun Respect Safety Culture Story",
    },
    summary: {
      ko: "즐겁게 타되 산과 사람을 존중하고 안전 기준을 공유하는 프리라이드 코리아의 문화 선언입니다.",
      en: "A culture story about riding with joy, respecting mountains and people, and sharing safety standards.",
    },
    body: {
      ko: "프리라이드는 기록과 순위만으로 완성되지 않습니다. 좋은 영상, 좋은 동료, 좋은 판단, 산을 대하는 태도가 함께 쌓일 때 한국 프리라이드 문화가 성장합니다.",
      en: "Freeride culture grows through film, community, judgment, and the way riders treat mountains, not only through rankings.",
    },
    status: "published",
    imageUrl: "/brand/hero-video.png",
    cultureFormat: "Story / Culture guideline",
    communityScope: "Public with admin curation",
    relatedLink: "/news-video",
    ethicsNote:
      "콘텐츠는 산과 사람을 존중하는 기준을 우선합니다. 위험한 위치 공개, 안전장비 미착용을 미화하는 표현, 타인 촬영 동의가 불명확한 자료는 관리자 검토에서 보류할 수 있습니다.",
    applicationUrl: "/news-video",
    policyNote:
      "컬쳐 콘텐츠는 초기에는 운영진 큐레이션 중심으로 운영하고, 이후 회원 작성과 관리자 승인 구조로 확장합니다.",
    tags: ["Culture", "Community", "Ethics"],
  },
  {
    id: "freeride-community-guideline",
    kind: "culture",
    subtype: "Community",
    title: {
      ko: "프리라이드 커뮤니티 운영 기준",
      en: "Freeride Community Guideline",
    },
    summary: {
      ko: "회원과 운영진이 함께 만드는 프리라이드 커뮤니티의 게시, 댓글, 참여 기준입니다.",
      en: "A guideline for member and operator-led freeride community participation.",
    },
    body: {
      ko: "커뮤니티는 자유롭게 이야기하되 안전, 존중, 사실 기반을 우선합니다. 초기에는 운영진이 주요 게시물을 큐레이션하고, 이후 회원 게시판과 댓글 기능을 확장합니다. 장비, 투어, 교육, 대회, 영상, 지역 정보는 환영하지만 개인 공격, 위험 행동 미화, 확인되지 않은 사고 정보, 무단 촬영물은 관리 대상입니다.",
      en: "The community prioritizes safety, respect, and fact-based discussion while expanding member participation over time.",
    },
    status: "published",
    imageUrl: "/brand/hero-training.png",
    cultureFormat: "Community guideline",
    communityScope: "Members and operators",
    relatedLink: "/contact-join",
    ethicsNote:
      "커뮤니티 게시물과 댓글은 서로를 존중하고, 산과 지역 문화를 훼손하지 않는 기준 안에서 운영합니다.",
    applicationUrl: "/contact-join",
    policyNote:
      "컬쳐, 중고장터, 자료실은 관리자 검토 없이 바로 등록할 수 있지만, 신고 또는 운영 기준 위반 시 숨김/보관 처리될 수 있습니다.",
    tags: ["Culture", "Community", "Member"],
  },
  {
    id: "mountain-ethics-guideline",
    kind: "culture",
    subtype: "Mountain Ethics",
    title: {
      ko: "산악 윤리와 지역 존중 가이드",
      en: "Mountain Ethics Guideline",
    },
    summary: {
      ko: "산과 사람, 지역 문화, 안전 기준을 함께 지키기 위한 프리라이드 코리아의 산악 윤리 기준입니다.",
      en: "A mountain ethics guideline for freeride safety, respect, and local culture.",
    },
    body: {
      ko: "프리라이딩은 좋은 라인을 찾는 활동이기 전에 산을 대하는 태도입니다. 위치 공개, 촬영, 이동, 쓰레기, 지역 주민과 리조트 운영 기준, 구조 리소스에 대한 존중이 필요합니다. 위험한 지형 정보는 맥락 없이 공유하지 않고, 사고나 구조 상황은 당사자와 현장 운영자의 기준을 우선합니다.",
      en: "Freeriding requires respect for mountains, local communities, terrain information, rescue resources, and safety standards.",
    },
    status: "published",
    imageUrl: "/brand/hero-safety.png",
    cultureFormat: "Mountain ethics guideline",
    communityScope: "Public guideline",
    relatedLink: "/safety-education",
    ethicsNote:
      "위험 지형의 위치 공개, 무단 촬영, 지역 문화 훼손, 안전장비 미착용을 미화하는 콘텐츠는 제한될 수 있습니다.",
    applicationUrl: "/contact-join",
    policyNote:
      "산악 윤리 기준은 컬쳐 게시물, 영상/사진, 핫스팟 정보, 댓글 운영에 공통 적용됩니다.",
    tags: ["Culture", "Ethics", "Safety"],
  },
  {
    id: "member-marketplace-guideline",
    kind: "marketplace",
    subtype: "Marketplace",
    title: {
      ko: "회원 중고장터 운영 가이드",
      en: "Member Marketplace Guideline",
    },
    summary: {
      ko: "프리라이드 장비 거래를 회원 기반으로 관리하기 위한 중고장터 운영 기준입니다.",
      en: "A marketplace guideline for member-based freeride gear listings.",
    },
    body: {
      ko: "중고장터는 장비 상태, 거래 책임, 신고/숨김 처리, 사기 예방 안내를 포함해야 합니다. 관리자는 게시 등급과 노출 등급을 분리해 운영합니다.",
      en: "Marketplace posts should include equipment condition, seller responsibility, report handling, and fraud prevention guidance.",
    },
    status: "published",
    imageUrl: "/brand/hero-training.png",
    cultureFormat: "Marketplace guideline",
    communityScope: "Members with admin review",
    relatedLink: "/contact-join",
    ethicsNote:
      "중고장터는 장비 상태를 정확히 표기하고 거래 책임을 명확히 해야 합니다. 안전 장비는 사용 이력과 손상 여부를 반드시 안내해야 하며, 신고 접수 시 관리자가 노출을 제한할 수 있습니다.",
    applicationUrl: "/contact-join",
    policyNote:
      "중고장터는 회원 작성 가능 영역이지만, 위험도가 높아 관리자 검토와 신고 처리 흐름을 둡니다.",
    tags: ["Marketplace", "Gear", "Member"],
  },
  {
    id: "regular-membership",
    kind: "shop",
    subtype: "Membership",
    title: {
      ko: "정회원 연회비",
      en: "Regular Membership",
    },
    summary: {
      ko: "연 회비를 납부한 공식 회원으로 전용 프로그램 제안과 우선 참가 혜택을 받을 수 있습니다.",
      en: "An official annual membership for program proposals, priority participation, and member benefits.",
    },
    body: {
      ko: "정회원은 투어와 선수 프로그램을 제안할 수 있고, 다양한 교육/훈련/투어 우선 참가 및 할인 혜택, 아웃도어 활동에 도움이 되는 전용 앱 사용, 운영 참여와 제안 기회를 가집니다. 교육 콘텐츠 작성은 임원진 이상 가능합니다.",
      en: "Regular members can propose tours and athlete programs, access priority participation and discounts, use selected outdoor apps, and contribute to operations. Education content authoring requires executive-level membership or above.",
    },
    status: "published",
    imageUrl: "/brand/hero-event.png",
    price: "Annual fee",
    shopItemType: "Membership",
    memberRequirement: "General member upgrade to regular member",
    inventoryStatus: "Application intake",
    fulfillmentMethod:
      "결제 기능 연동 전까지 문의/신청 폼으로 접수하고, 관리자가 입금 또는 승인 상태를 확인한 뒤 회원 등급을 조정합니다.",
    benefitSummary:
      "투어와 선수 프로그램 제안, 교육/훈련/투어 우선 참가 및 할인, 아웃도어 전용 앱 사용, 운영 참여와 제안 권한을 제공합니다.",
    applicationUrl: "/contact-join",
    policyNote:
      "결제 기능 연동 전까지는 문의/신청 폼으로 접수하고 관리자가 확인 후 회원 등급을 조정합니다.",
    tags: ["Membership", "Shop", "Member"],
  },
];
