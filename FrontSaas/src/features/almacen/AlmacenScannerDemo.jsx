import { AlmacenHeaderTabs } from "./components/AlmacenHeaderTabs";
import { AlmacenMovementsView } from "./components/AlmacenMovementsView";
import { AlmacenScannerView } from "./components/AlmacenScannerView";
import { FacialView } from "./components/FacialView";
import { useAlmacenController } from "./hooks/useAlmacenController";

export function AlmacenScannerDemo() {
  const { refs, state, derived, actions, utils } = useAlmacenController();
  const { videoRef } = refs;
  const { activeView, currentTheme } = state;

  return (
    <section className={`scanner-shell theme-${currentTheme.id}`}>
      <AlmacenHeaderTabs
        activeView={activeView}
        currentTheme={currentTheme}
        actions={actions}
      />

      {activeView === "scanner" ? (
        <AlmacenScannerView
          videoRef={videoRef}
          state={state}
          derived={derived}
          actions={actions}
          utils={utils}
        />
      ) : activeView === "movements" ? (
        <AlmacenMovementsView
          state={state}
          derived={derived}
          actions={actions}
          utils={utils}
        />
      ) : (
        <FacialView />
      )}
    </section>
  );
}
