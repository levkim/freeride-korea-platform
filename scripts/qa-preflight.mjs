import { spawn } from "node:child_process";

const port = process.env.QA_PORT || "3100";
const baseUrl = process.env.QA_BASE_URL || `http://127.0.0.1:${port}`;
const npmCommand = "npm";

function cleanEnv(env) {
  return Object.fromEntries(
    Object.entries(env).filter(([, value]) => value !== undefined),
  );
}

function runCommand(args, options = {}) {
  return new Promise((resolve, reject) => {
    const commandLine = `${npmCommand} ${args.join(" ")}`;
    const child = spawn(commandLine, {
      stdio: "inherit",
      shell: true,
      env: cleanEnv({
        ...process.env,
        ...options.env,
      }),
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${npmCommand} ${args.join(" ")} failed with ${code}`));
    });
  });
}

function startServer() {
  return spawn(
    `${npmCommand} run start -- --hostname 127.0.0.1 --port ${port}`,
    {
      stdio: "inherit",
      shell: true,
      env: cleanEnv({
        ...process.env,
        NEXT_PUBLIC_SITE_URL: baseUrl,
      }),
    },
  );
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { cache: "no-store" });
      if (response.ok) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(
    `Timed out waiting for ${baseUrl}${lastError ? `: ${lastError.message}` : ""}`,
  );
}

function stopServer(child) {
  if (!child || child.killed) {
    return Promise.resolve();
  }

  if (process.platform === "win32" && child.pid) {
    return new Promise((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });

      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
    });
  }

  child.kill("SIGTERM");
  return Promise.resolve();
}

async function main() {
  console.log(`Preflight base URL: ${baseUrl}`);

  const qaEnv = {
    QA_BASE_URL: baseUrl,
    NEXT_PUBLIC_SITE_URL: baseUrl,
  };

  await runCommand(["run", "build"], { env: qaEnv });

  const server = startServer();

  try {
    await waitForServer();

    await runCommand(["run", "qa:release"], { env: qaEnv });
    await runCommand(["run", "qa:smoke"], { env: qaEnv });
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
