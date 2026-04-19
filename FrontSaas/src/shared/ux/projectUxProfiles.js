import { DEFAULT_UX_MODES } from "./useUxMode";

function createProfileMap(modes, perModeConfig) {
  return modes.reduce((acc, mode) => {
    acc[mode.id] = {
      ...perModeConfig.base,
      ...(perModeConfig[mode.id] || {})
    };
    return acc;
  }, {});
}

export const CAFETERIA_UX_PROFILES = createProfileMap(DEFAULT_UX_MODES, {
  base: {
    showCarousel: true,
    carouselStyle: "slider",
    productCardStyle: "standard",
    productGridColumns: 2,
    headerStyle: "compact",
    orderPanelDensity: "normal"
  },
  modern: {
    showCarousel: true,
    carouselStyle: "slider",
    productCardStyle: "visual"
  },
  classic: {
    showCarousel: false,
    carouselStyle: "none",
    productCardStyle: "list"
  },
  mix: {
    showCarousel: true,
    carouselStyle: "stack",
    productCardStyle: "hybrid",
    productGridColumns: 1
  }
});

export function getProjectUxProfile(profileMap, modeId) {
  return profileMap[modeId] || Object.values(profileMap)[0];
}
