const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";

const assets = [
  "/brand/logo-header.png",
  "/brand/hero-event.png",
  "/brand/hero-safety.png",
  "/brand/hero-tour.png",
  "/brand/hero-training.png",
  "/brand/hero-video.png",
];

function resolveUrl(path) {
  return new URL(path, baseUrl).toString();
}

async function checkAsset(path) {
  const url = resolveUrl(path);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "manual",
    });
    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length") || "";
    const ok =
      response.status >= 200 &&
      response.status < 300 &&
      contentType.toLowerCase().startsWith("image/");

    return {
      path,
      status: response.status,
      contentType,
      contentLength,
      ok,
    };
  } catch (error) {
    return {
      path,
      status: 0,
      contentType: "",
      contentLength: "",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const results = await Promise.all(assets.map(checkAsset));
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
