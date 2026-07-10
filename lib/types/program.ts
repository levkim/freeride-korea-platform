import type { LocalizedText } from "./content";

export type ProgramKind =
  | "freeride"
  | "backcountry"
  | "avalanche-safety"
  | "wfr";

export type ProgramItem = {
  id: string;
  kind: ProgramKind;
  title: LocalizedText;
  summary: LocalizedText;
  status: "open" | "coming-soon" | "closed";
  location: string;
};
