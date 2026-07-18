export type InquiryType =
  | "athlete-program"
  | "education"
  | "freeride-tour"
  | "membership"
  | "business-partner"
  | "sponsorship"
  | "media"
  | "general";

export type InquiryStatus =
  | "new"
  | "reviewing"
  | "needs_reply"
  | "closed";

export type InquiryItem = {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  title: string;
  message: string;
  status: InquiryStatus;
  assignedTo?: string;
  createdAt: string;
};
