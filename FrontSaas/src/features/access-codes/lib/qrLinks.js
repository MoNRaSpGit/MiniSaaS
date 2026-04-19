const DEFAULT_PUBLIC_APP_URL = "https://monraspgit.github.io/MiniSaaS/#/";

function normalizeHashBase(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  if (withoutTrailingSlash.endsWith("#")) {
    return `${withoutTrailingSlash}/`;
  }
  if (withoutTrailingSlash.includes("#/")) {
    return `${withoutTrailingSlash}/`;
  }
  if (withoutTrailingSlash.includes("#")) {
    return `${withoutTrailingSlash}/`;
  }
  return `${withoutTrailingSlash}/#/`;
}

export function buildMiniSaasBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL;
  return (
    normalizeHashBase(configured) ||
    normalizeHashBase(DEFAULT_PUBLIC_APP_URL)
  );
}

export function buildProjectUrl(baseUrl, slug) {
  return `${baseUrl}project/${slug}`;
}

export function buildQrImageUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encoded}`;
}
