import { newsVideoInputSchema } from "@/lib/validation/news-video";

function splitTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseNewsVideoFormData(formData: FormData) {
  const titleKo = formData.get("titleKo");
  const summaryKo = formData.get("summaryKo");
  const bodyKo = formData.get("bodyKo");

  return newsVideoInputSchema.safeParse({
    kind: formData.get("kind"),
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
    publishedAt: formData.get("publishedAt"),
    imageUrl: formData.get("imageUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    sourceUrl: formData.get("sourceUrl"),
    tags: splitTags(formData.get("tags")),
  });
}
