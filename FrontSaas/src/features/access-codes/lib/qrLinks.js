const DEFAULT_PUBLIC_APP_URL = "https://monraspgit.github.io/MiniSaaS/";

function normalizeWebBase(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  const withoutHash = withoutTrailingSlash.split("#")[0];
  return `${withoutHash}/`;
}

export function buildMiniSaasWebUrl() {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL;
  return normalizeWebBase(configured) || normalizeWebBase(DEFAULT_PUBLIC_APP_URL);
}

export function buildProjectUrl(baseUrl, slug) {
  return `${baseUrl}?go=${encodeURIComponent(slug)}`;
}

export function buildQrImageUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=420x420&qzone=2&data=${encoded}`;
}
