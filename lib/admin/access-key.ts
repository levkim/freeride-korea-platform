export const adminCookieName = "fk_admin_access";

const tokenPrefix = "freeride-korea-admin:";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getAdminAccessToken(accessKey: string) {
  const encoded = new TextEncoder().encode(`${tokenPrefix}${accessKey}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);

  return toHex(digest);
}

export async function verifyAdminAccessToken(
  cookieValue: string | undefined,
  accessKey: string,
) {
  if (!cookieValue) {
    return false;
  }

  return cookieValue === (await getAdminAccessToken(accessKey));
}
