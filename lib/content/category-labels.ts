export const categorySubtypeLabels: Record<string, string> = {
  "Avalanche Safety": "눈사태 안전",
  Freeriding: "FREERIDING 교육",
  Backcountry: "백컨트리 역량 강화",
  Story: "자유게시판",
  "Photo / Video": "포토제닉",
  "Mountain Ethics": "프리라이드 핫스팟",
  Community: "산악윤리",
  "Official Link": "공식 링크",
  App: "앱",
  Download: "다운로드",
  Reference: "참고 자료",
  Membership: "멤버십",
  Education: "교육",
  Tour: "투어",
  Merchandise: "굿즈",
};

export function getCategorySubtypeLabel(subtype: string) {
  return categorySubtypeLabels[subtype] ?? subtype;
}
