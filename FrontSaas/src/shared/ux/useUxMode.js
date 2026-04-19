import { useState } from "react";

export const DEFAULT_UX_MODES = [
  { id: "modern", label: "UX Moderna" },
  { id: "classic", label: "UX Clasica" },
  { id: "mix", label: "UX Mix" }
];

function resolveInitialModeIndex(modes, initialModeId) {
  const index = modes.findIndex((mode) => mode.id === initialModeId);
  return index >= 0 ? index : 0;
}

export function useUxMode({
  modes = DEFAULT_UX_MODES,
  initialModeId = DEFAULT_UX_MODES[0].id
} = {}) {
  const [modeIndex, setModeIndex] = useState(
    resolveInitialModeIndex(modes, initialModeId)
  );

  const activeMode = modes[modeIndex] || modes[0];

  const cycleMode = () => {
    setModeIndex((prev) => (prev + 1) % modes.length);
  };

  const setModeById = (modeId) => {
    const index = modes.findIndex((mode) => mode.id === modeId);
    if (index >= 0) {
      setModeIndex(index);
    }
  };

  return {
    modes,
    activeMode,
    modeIndex,
    cycleMode,
    setModeById
  };
}
