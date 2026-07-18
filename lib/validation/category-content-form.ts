import { categoryContentInputSchema } from "@/lib/validation/category-content";

export function parseCategoryContentFormData(formData: FormData) {
  const titleKo = formData.get("titleKo");
  const summaryKo = formData.get("summaryKo");
  const bodyKo = formData.get("bodyKo");

  return categoryContentInputSchema.safeParse({
    kind: formData.get("kind"),
    subtype: formData.get("subtype"),
    title: {
      ko: titleKo,
      en: formData.get("titleEn") || titleKo,
    },
    summary: {
      ko: summaryKo,
      en: formData.get("summaryEn") || summaryKo,
    },
    body: {
      ko: bodyKo,
      en: formData.get("bodyEn") || bodyKo,
    },
    location: formData.get("location"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
    instructor: formData.get("instructor") ?? "",
    operator: formData.get("operator") ?? "",
    difficulty: formData.get("difficulty") ?? "",
    requiredGear: formData.get("requiredGear") ?? "",
    insuranceNote: formData.get("insuranceNote") ?? "",
    cancellationPolicy: formData.get("cancellationPolicy") ?? "",
    tourGuide: formData.get("tourGuide") ?? "",
    itinerary: formData.get("itinerary") ?? "",
    includedItems: formData.get("includedItems") ?? "",
    excludedItems: formData.get("excludedItems") ?? "",
    requiredLevel: formData.get("requiredLevel") ?? "",
    athleteLevel: formData.get("athleteLevel") ?? "",
    targetEvents: formData.get("targetEvents") ?? "",
    seasonGoal: formData.get("seasonGoal") ?? "",
    coachingFormat: formData.get("coachingFormat") ?? "",
    videoReview: formData.get("videoReview") ?? "",
    selectionCriteria: formData.get("selectionCriteria") ?? "",
    cultureFormat: formData.get("cultureFormat") ?? "",
    communityScope: formData.get("communityScope") ?? "",
    ethicsNote: formData.get("ethicsNote") ?? "",
    relatedLink: formData.get("relatedLink") ?? "",
    shopItemType: formData.get("shopItemType") ?? "",
    memberRequirement: formData.get("memberRequirement") ?? "",
    fulfillmentMethod: formData.get("fulfillmentMethod") ?? "",
    inventoryStatus: formData.get("inventoryStatus") ?? "",
    benefitSummary: formData.get("benefitSummary") ?? "",
    imageUrl: formData.get("imageUrl"),
    applicationUrl: formData.get("applicationUrl"),
    policyNote: formData.get("policyNote"),
  });
}
