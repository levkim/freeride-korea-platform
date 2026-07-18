const youtubeHosts = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

export function getYouTubeVideoId(input?: string) {
  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);

    if (!youtubeHosts.has(url.hostname)) {
      return null;
    }

    if (url.hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    const searchVideoId = url.searchParams.get("v");
    if (searchVideoId) {
      return searchVideoId;
    }

    const [type, id] = url.pathname.split("/").filter(Boolean);
    if (["embed", "shorts", "live"].includes(type) && id) {
      return id;
    }

    return null;
  } catch {
    return input.match(/^[a-zA-Z0-9_-]{11}$/)?.[0] ?? null;
  }
}

export function getYouTubeEmbedUrl(input?: string) {
  const videoId = getYouTubeVideoId(input);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}
