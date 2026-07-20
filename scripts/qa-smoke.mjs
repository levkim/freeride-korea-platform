const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";

const paths = [
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
  "/admin/deployment",
  "/admin/data-setup",
  "/health",
  "/healthz",
  "/robots.txt",
  "/sitemap.xml",
];

const protectedAdminPaths = new Set([
  "/admin",
  "/admin/deployment",
  "/admin/data-setup",
]);

function resolveUrl(path) {
  return new URL(path, baseUrl).toString();
}

async function checkPath(path) {
  const url = resolveUrl(path);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "manual",
    });

    const contentType = response.headers.get("content-type") || "";
    const location = response.headers.get("location") || "";
    const isOk =
      (response.status >= 200 && response.status < 300 && Boolean(contentType)) ||
      (protectedAdminPaths.has(path) &&
        response.status >= 300 &&
        response.status < 400 &&
        location.includes("/admin/login"));

    return {
      path,
      status: response.status,
      contentType,
      location,
      ok: isOk,
    };
  } catch (error) {
    return {
      path,
      status: 0,
      contentType: "",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const results = await Promise.all(paths.map(checkPath));
  const failures = results.filter((result) => !result.ok);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checked: results.length,
        results,
        failures,
      },
      null,
      2,
    ),
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
