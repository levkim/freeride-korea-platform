import type { UpdateItem } from "@/lib/types/content";
import type { EventItem } from "@/lib/types/event";
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
    country: "Andorra",
    venue: "Andorra",
    startsAt: "2026-02-01T00:00:00.000Z",
    endsAt: "2026-02-07T00:00:00.000Z",
    cancelled: false,
    summary: {
      ko: "FWT와 동등한 Official Major 범주에서 관리할 세계선수권 대회입니다.",
      en: "A world championship managed as an Official Major category alongside Freeride World Tour.",
    },
  },
];

export const mockMembers: Member[] = [
  {
    id: "member-1",
    name: "Demo Member",
    email: "member@freeride.kr",
    memberType: "general",
    status: "active",
    joinedAt: "2026-07-10",
  },
];

export const reviewQueueItems: ReviewQueueItem[] = [
  {
    id: "review-1",
    kind: "member-upgrade",
    title: "Regular Member upgrade request",
    submittedBy: "Demo Member",
    status: "new",
    requiredAuthorRole: "general",
    requiredPublishRole: "admin",
    risk: "low",
    createdAt: "2026-07-10",
  },
  {
    id: "review-2",
    kind: "source-alert",
    title: "Official event source candidate",
    submittedBy: "Source Monitor",
    status: "reviewing",
    requiredAuthorRole: "admin",
    requiredPublishRole: "admin",
    risk: "medium",
    createdAt: "2026-07-10",
  },
  {
    id: "review-3",
    kind: "marketplace",
    title: "Used safety gear listing",
    submittedBy: "Demo Member",
    status: "review",
    requiredAuthorRole: "general",
    requiredPublishRole: "admin",
    risk: "high",
    createdAt: "2026-07-10",
  },
];
