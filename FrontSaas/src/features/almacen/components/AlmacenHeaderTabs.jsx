export function AlmacenHeaderTabs({ activeView, currentTheme, actions }) {
  return (
    <>
      <div className="scanner-header scanner-header-main">
        <h2>Scaner</h2>
        <button type="button" className="ux-switch-btn" onClick={actions.rotateTheme}>
          {currentTheme.label}
        </button>
      </div>

      <div className="almacen-links">
        <button
          type="button"
          className={`almacen-link ${activeView === "scanner" ? "active" : ""}`}
          onClick={() => actions.setActiveView("scanner")}
        >
          Scanner
        </button>
        <button
          type="button"
          className={`almacen-link ${activeView === "movements" ? "active" : ""}`}
          onClick={() => actions.setActiveView("movements")}
        >
          Movimientos
        </button>
        <button
          type="button"
          className={`almacen-link ${activeView === "facial" ? "active" : ""}`}
          onClick={() => actions.setActiveView("facial")}
        >
          Facial
        </button>
      </div>
    </>
  );
}
