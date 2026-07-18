import type { MetadataRoute } from "next";

import { listCategoryContent } from "@/lib/repositories/category-content";
import { listEvents } from "@/lib/repositories/events";
import { listNewsVideoItems } from "@/lib/repositories/news-video";
import type { CategoryContentItem } from "@/lib/types/content";
import { getSiteUrl } from "@/lib/site-url";

const staticRoutes = [
  "/",
  "/about",
  "/news-video",
  "/events",
  "/freeride-tour",
  "/safety-education",
  "/athlete-program",
  "/culture",
  "/shop",
  "/contact-join",
  "/account",
];

function categoryPath(item: CategoryContentItem) {
  if (item.kind === "tour") {
    return `/freeride-tour/${item.id}`;
  }

  if (item.kind === "shop") {
    return `/shop/${item.id}`;
  }

  if (item.kind === "program" && item.subtype === "Freeride") {
    return `/athlete-program/${item.id}`;
  }

  if (
    item.kind === "program" &&
    ["Avalanche Safety", "Freeriding", "Backcountry", "WFR"].includes(
      item.subtype,
    )
  ) {
    return `/safety-education/${item.id}`;
  }

  if (["culture", "marketplace", "resource"].includes(item.kind)) {
    return `/culture/${item.id}`;
  }

  return null;
}

function toUrl(siteUrl: string, path: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [events, newsVideoItems, categoryItems] = await Promise.all([
    listEvents(),
    listNewsVideoItems(),
    listCategoryContent(),
  ]);

  const dynamicRoutes = [
    ...events.map((event) => `/events/${event.id}`),
    ...newsVideoItems.map((item) => `/news-video/${item.id}`),
    ...categoryItems
      .map((item) => categoryPath(item))
      .filter((path): path is string => Boolean(path)),
  ];

  return [...new Set([...staticRoutes, ...dynamicRoutes])].map((path) =>
    toUrl(siteUrl, path),
  );
}
