import {
  createSupabaseAdminClient,
  getSupabaseAdminConfig,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

const maxImageSizeBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export class ContentImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentImageUploadError";
  }
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function sanitizeFileName(fileName: string) {
  const [rawName = "image", rawExtension = "jpg"] =
    fileName.split(/\.(?=[^.]+$)/);
  const name = rawName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, "");

  return `${name || "image"}.${extension || "jpg"}`;
}

function normalizeDirectory(directory: string) {
  return directory
    .toLowerCase()
    .replace(/[^a-z0-9-/]+/g, "-")
    .replace(/^\/+|\/+$/g, "");
}

function getStorageObjectPathFromUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  const { url, contentImageBucket } = getSupabaseAdminConfig();
  const storageMarker = `/storage/v1/object/public/${contentImageBucket}/`;

  if (url && imageUrl.startsWith(url) && imageUrl.includes(storageMarker)) {
    return imageUrl.split(storageMarker)[1] || null;
  }

  const localMarker = `/storage/${contentImageBucket}/`;

  if (imageUrl.startsWith(localMarker)) {
    return imageUrl.slice(localMarker.length) || null;
  }

  return null;
}

export async function uploadContentImageFromFormData(
  formData: FormData,
  directory: string,
  fieldName = "imageFile",
) {
  const file = formData.get(fieldName);

  if (!isFile(file) || file.size === 0) {
    return null;
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new ContentImageUploadError(
      "JPG, PNG, WEBP, GIF 이미지 파일만 업로드할 수 있습니다.",
    );
  }

  if (file.size > maxImageSizeBytes) {
    throw new ContentImageUploadError(
      "대표 이미지는 5MB 이하 파일만 업로드할 수 있습니다.",
    );
  }

  if (!hasSupabaseAdminEnv()) {
    throw new ContentImageUploadError(
      "Supabase Storage 환경변수가 설정되어 있지 않습니다.",
    );
  }

  const { contentImageBucket } = getSupabaseAdminConfig();
  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const objectPath = [
    normalizeDirectory(directory),
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`,
  ].join("/");

  const { error } = await supabase.storage
    .from(contentImageBucket)
    .upload(objectPath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new ContentImageUploadError(error.message);
  }

  const { data } = supabase.storage
    .from(contentImageBucket)
    .getPublicUrl(objectPath);

  return data.publicUrl;
}

export async function deleteContentImageByUrl(imageUrl?: string | null) {
  const objectPath = getStorageObjectPathFromUrl(imageUrl);

  if (!objectPath || !hasSupabaseAdminEnv()) {
    return;
  }

  const { contentImageBucket } = getSupabaseAdminConfig();
  const supabase = createSupabaseAdminClient();
  await supabase.storage.from(contentImageBucket).remove([objectPath]);
}

export async function applyUploadedContentImage(
  formData: FormData,
  directory: string,
  previousImageUrl?: string | null,
) {
  const uploadedUrl = await uploadContentImageFromFormData(formData, directory);
  const removeImage = formData.get("removeImage") === "on";

  if (uploadedUrl) {
    await deleteContentImageByUrl(previousImageUrl);
    formData.set("imageUrl", uploadedUrl);
    return uploadedUrl;
  }

  if (removeImage) {
    await deleteContentImageByUrl(previousImageUrl);
    formData.set("imageUrl", "");
    return "";
  }

  return typeof formData.get("imageUrl") === "string"
    ? String(formData.get("imageUrl"))
    : "";
}

