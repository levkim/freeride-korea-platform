"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type ImageUploadFieldProps = {
  label?: string;
  name?: string;
  fileName?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  bucketPath?: string;
  allowRemove?: boolean;
  onChange?: (value: string) => void;
};

function slugFileName(fileName: string) {
  const [name = "image", extension = "jpg"] = fileName.split(/\.(?=[^.]+$)/);
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "image"}-${Date.now()}.${extension.toLowerCase()}`;
}

export function ImageUploadField({
  label = "대표 이미지",
  name = "imageUrl",
  fileName = "imageFile",
  value,
  defaultValue = "",
  required,
  placeholder = "/brand/hero-training.png",
  bucketPath = "/storage/content-images",
  allowRemove = true,
  onChange,
}: ImageUploadFieldProps) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageUrl = controlled ? value : internalValue;

  const displayPreview = previewUrl || imageUrl;
  const canPreview = useMemo(
    () =>
      Boolean(
        displayPreview &&
          (displayPreview.startsWith("/") || displayPreview.startsWith("http")),
      ),
    [displayPreview],
  );

  function updateValue(nextValue: string) {
    if (!controlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    updateValue(`${bucketPath}/${slugFileName(file.name)}`);
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="grid gap-3">
      <div>
        <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
        <p className="mt-1 text-xs font-bold leading-5 text-zinc-500">
          JPG, PNG, WEBP, GIF 파일을 업로드할 수 있습니다. 파일을 선택하면
          저장 시 Supabase Storage에 업로드되고 대표 이미지 URL로 반영됩니다.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden border border-zinc-200 bg-zinc-100">
          {canPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayPreview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs font-black text-zinc-400">
              이미지 미리보기
            </div>
          )}
        </div>

        <div className="grid content-start gap-3">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              이미지 파일 선택
            </span>
            <input
              type="file"
              name={fileName}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-900 file:mr-3 file:border-0 file:bg-zinc-200 file:px-3 file:py-2 file:text-xs file:font-black"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">
              이미지 URL / 저장 경로
            </span>
            <input
              name={name}
              required={required}
              value={imageUrl}
              onChange={(event) => updateValue(event.target.value)}
              placeholder={placeholder}
              className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-900 outline-none transition-colors focus:border-[var(--color-fk-red)]"
            />
          </label>

          {allowRemove && imageUrl ? (
            <label className="flex items-center gap-2 text-xs font-black text-zinc-600">
              <input type="checkbox" name="removeImage" />
              대표 이미지 삭제
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}

