import { useMemo } from "react";
import { projects } from "../../../shared/data/projects";
import {
  buildMiniSaasWebUrl,
  buildProjectUrl,
  buildQrImageUrl
} from "../lib/qrLinks";

export function useAccessCodesController() {
  const baseUrl = buildMiniSaasWebUrl();

  const catalogUrl = baseUrl;

  const items = useMemo(
    () =>
      projects.map((project) => {
        const url = buildProjectUrl(baseUrl, project.slug);
        return {
          slug: project.slug,
          name: project.name,
          url,
          qrUrl: buildQrImageUrl(url)
        };
      }),
    [baseUrl]
  );

  return {
    baseUrl,
    catalogUrl,
    catalogQrUrl: buildQrImageUrl(catalogUrl),
    items
  };
}
