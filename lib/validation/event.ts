import { z } from "zod";

export const eventSeriesSchema = z.enum([
  "fis-freeride-world-championships",
  "freeride-world-tour",
  "fwt-challenger",
  "fwt-qualifier",
  "fwt-junior",
  "freeride-asia",
]);

export const eventOfficialitySchema = z.enum(["official", "unofficial"]);

const localizedTextSchema = z
  .object({
    ko: z.string().trim().min(1),
    en: z.string().trim().optional().or(z.literal("")),
  })
  .transform((value) => ({
    ko: value.ko,
    en: value.en || value.ko,
  }));

const optionalUrlSchema = z
  .string()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const eventInputSchema = z
  .object({
    name: localizedTextSchema,
    series: eventSeriesSchema,
    officiality: eventOfficialitySchema,
    season: z.string().min(4),
    country: z.string().min(1),
    location: z.string().min(1),
    resort: z.string().optional(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    timezone: z.string().min(1),
    cancelled: z.boolean().default(false),
    imageUrl: z.string().optional(),
    summary: localizedTextSchema,
    description: localizedTextSchema,
    officialLink: optionalUrlSchema,
    registrationLink: optionalUrlSchema,
    replayOrResultsLink: optionalUrlSchema,
    relatedLinks: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.string().url(),
        }),
      )
      .default([]),
  })
  .refine((event) => new Date(event.endsAt) >= new Date(event.startsAt), {
    message: "Event end date must be after the start date.",
    path: ["endsAt"],
  });

export type EventInput = z.infer<typeof eventInputSchema>;
