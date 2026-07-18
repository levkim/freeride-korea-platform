const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";

async function main() {
  const response = await fetch(`${baseUrl}/healthz`, {
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  const failures = [];

  if (!response.ok) {
    failures.push({
      message: "healthz did not return 2xx",
      status: response.status,
    });
  }

  if (!contentType.includes("application/json")) {
    failures.push({
      message: "healthz did not return JSON",
      contentType,
    });
  }

  if (typeof body === "object" && body !== null) {
    if (body.ok !== true) {
      failures.push({ message: "healthz ok flag is not true", body });
    }

    if (body.service !== "freeride-korea-webapp") {
      failures.push({ message: "healthz service mismatch", body });
    }

    if (body.dataMode !== "mock" && body.dataMode !== "supabase") {
      failures.push({ message: "healthz dataMode is invalid", body });
    }
  }

  console.log(
    JSON.stringify(
      {
        baseUrl,
        endpoint: "/healthz",
        status: response.status,
        body,
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
