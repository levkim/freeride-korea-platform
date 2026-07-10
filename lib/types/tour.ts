import type { LocalizedText } from "./content";

export type TourItem = {
  id: string;
  title: LocalizedText;
  region: string;
  country: string;
  difficulty: "intro" | "intermediate" | "advanced" | "expert";
  status: "open" | "coming-soon" | "closed";
  summary: LocalizedText;
};
