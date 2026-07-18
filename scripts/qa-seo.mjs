const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";

function fail(message, detail) {
  return { ok: false, message, detail };
}

function pass(message, detail) {
  return { ok: true, message, detail };
}

function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, "i"),
    new RegExp(`<meta\\s+property=["']${name}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${name}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = await response.text();

  return {
    path,
    status: response.status,
    ok: response.ok,
    text,
  };
}

async function main() {
  const checks = [];
  const [home, robots, sitemap] = await Promise.all([
    fetchText("/"),
    fetchText("/robots.txt"),
    fetchText("/sitemap.xml"),
  ]);

  checks.push(
    home.ok
      ? pass("home page responds", { status: home.status })
      : fail("home page failed", { status: home.status }),
  );

  const title = home.text.match(/<title>([^<]+)<\/title>/i)?.[1] || null;
  const description = extractMeta(home.text, "description");
  const ogTitle = extractMeta(home.text, "og:title");
  const ogDescription = extractMeta(home.text, "og:description");

  checks.push(
    title?.includes("FREERIDE KOREA")
      ? pass("title includes brand", { title })
      : fail("title missing brand", { title }),
  );
  checks.push(
    description && description.length >= 40
      ? pass("description exists", { description })
      : fail("description missing or too short", { description }),
  );
  checks.push(
    ogTitle?.includes("FREERIDE KOREA")
      ? pass("og:title exists", { ogTitle })
      : fail("og:title missing brand", { ogTitle }),
  );
  checks.push(
    ogDescription && ogDescription.length >= 40
      ? pass("og:description exists", { ogDescription })
      : fail("og:description missing or too short", { ogDescription }),
  );

  checks.push(
    robots.ok
      ? pass("robots.txt responds", { status: robots.status })
      : fail("robots.txt failed", { status: robots.status }),
  );
  checks.push(
    robots.text.includes("Disallow: /admin")
      ? pass("robots blocks admin", null)
      : fail("robots does not block admin", robots.text),
  );
  checks.push(
    robots.text.includes(`${baseUrl}/sitemap.xml`)
      ? pass("robots references sitemap", null)
      : fail("robots missing sitemap reference", robots.text),
  );

  const sitemapUrls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const requiredSitemapPaths = [
    "/",
    "/about",
    "/news-video",
    "/events",
    "/freeride-tour",
    "/safety-education",
    "/athlete-program",
    "/culture",
    "/shop",
  ];

  checks.push(
    sitemap.ok
      ? pass("sitemap.xml responds", { status: sitemap.status })
      : fail("sitemap.xml failed", { status: sitemap.status }),
  );
  checks.push(
    sitemapUrls.length >= requiredSitemapPaths.length
      ? pass("sitemap has urls", { count: sitemapUrls.length })
      : fail("sitemap has too few urls", { count: sitemapUrls.length }),
  );

  for (const path of requiredSitemapPaths) {
    const expectedUrl = `${baseUrl}${path}`;
    checks.push(
      sitemapUrls.includes(expectedUrl)
        ? pass(`sitemap includes ${path}`, null)
        : fail(`sitemap missing ${path}`, { expectedUrl }),
    );
  }

  const failures = checks.filter((check) => !check.ok);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checked: checks.length,
        failures,
      },
      null,
      2,
    ),
  );

  if (failures.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
