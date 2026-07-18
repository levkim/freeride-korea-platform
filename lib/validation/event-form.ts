import { eventInputSchema } from "@/lib/validation/event";

function toIsoDateTime(value: FormDataEntryValue | null) {
  const raw = String(value ?? "");

  return raw ? new Date(raw).toISOString() : "";
}

export function parseEventFormData(formData: FormData) {
  const nameKo = formData.get("nameKo");
  const summaryKo = formData.get("summaryKo");
  const descriptionKo = formData.get("descriptionKo");
  const relatedLabel = String(formData.get("relatedLabel") ?? "").trim();
  const relatedUrl = String(formData.get("relatedUrl") ?? "").trim();

  return eventInputSchema.safeParse({
    name: {
      ko: nameKo,
      en: formData.get("nameEn") || nameKo,
    },
    series: formData.get("series"),
    officiality: formData.get("officiality"),
    season: formData.get("season"),
    country: formData.get("country"),
    location: formData.get("location"),
    resort: formData.get("resort") || undefined,
    startsAt: toIsoDateTime(formData.get("startsAt")),
    endsAt: toIsoDateTime(formData.get("endsAt")),
    timezone: formData.get("timezone"),
    cancelled: formData.get("cancelled") === "on",
    imageUrl: formData.get("imageUrl") || undefined,
    summary: {
      ko: summaryKo,
      en: formData.get("summaryEn") || summaryKo,
    },
    description: {
      ko: descriptionKo,
      en: formData.get("descriptionEn") || descriptionKo,
    },
    officialLink: formData.get("officialLink"),
    registrationLink: formData.get("registrationLink"),
    replayOrResultsLink: formData.get("replayOrResultsLink"),
    relatedLinks:
      relatedLabel && relatedUrl ? [{ label: relatedLabel, url: relatedUrl }] : [],
  });
}
