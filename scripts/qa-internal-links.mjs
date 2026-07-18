const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";

const seedPages = [
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
  "/admin",
  "/admin/news-video",
  "/admin/events",
  "/admin/site-categories",
  "/admin/comments",
  "/admin/members",
  "/admin/contact-join",
];

const internalHrefPattern = /href="([^"]+)"/g;

function normalizeHref(href) {
  if (!href.startsWith("/")) {
    return null;
  }

  if (
    href.startsWith("/_next") ||
    href.startsWith("/brand") ||
    href.startsWith("/favicon")
  ) {
    return null;
  }

  const clean = href.split("#")[0].split("?")[0];
  return clean || "/";
}

async function fetchStatus(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  return response.status;
}

async function main() {
  const hrefSources = new Map();
  const pageErrors = [];

  for (const page of seedPages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (!response.ok) {
        pageErrors.push({ page, status: response.status });
        continue;
      }

      const html = await response.text();
      for (const match of html.matchAll(internalHrefPattern)) {
        const href = normalizeHref(match[1]);
        if (!href) {
          continue;
        }

        const sources = hrefSources.get(href) || new Set();
        sources.add(page);
        hrefSources.set(href, sources);
      }
    } catch (error) {
      pageErrors.push({ page, error: error.message });
    }
  }

  const badLinks = [];
  for (const [href, sources] of hrefSources.entries()) {
    try {
      const status = await fetchStatus(href);
      if (status < 200 || status >= 400) {
        badLinks.push({ href, status, sources: [...sources] });
      }
    } catch (error) {
      badLinks.push({ href, error: error.message, sources: [...sources] });
    }
  }

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checkedSeedPages: seedPages.length,
        checkedInternalLinks: hrefSources.size,
        pageErrors,
        badLinks,
      },
      null,
      2,
    ),
  );

  if (pageErrors.length || badLinks.length) {
    process.exitCode = 1;
  }
}

main();
