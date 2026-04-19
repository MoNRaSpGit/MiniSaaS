export function CafeteriaHeaderTabs({
  activeMode,
  cycleMode,
  activeTab,
  totals,
  pendingOrdersCount,
  actions
}) {
  return (
    <>
      <header className="cafeteria-header cafeteria-header-main">
        <div>
          <h2>Cafeteria Demo</h2>
          <p>Menu con carrusel, carrito y panel de pedidos en una sola vista.</p>
        </div>
        <button type="button" className="cafeteria-ux-btn" onClick={cycleMode}>
          {activeMode.label}
        </button>
      </header>

      <nav className="cafeteria-tabs">
        <button
          type="button"
          className={activeTab === "menu" ? "active" : ""}
          onClick={() => actions.setActiveTab("menu")}
        >
          Menu
        </button>
        <button
          type="button"
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => actions.setActiveTab("cart")}
        >
          Carrito ({totals.totalItems})
        </button>
        <button
          type="button"
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => actions.setActiveTab("orders")}
        >
          Pedidos ({pendingOrdersCount})
        </button>
      </nav>
    </>
  );
}
