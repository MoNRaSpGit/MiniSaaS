import { CafeteriaCartView } from "./components/CafeteriaCartView";
import { CafeteriaHeaderTabs } from "./components/CafeteriaHeaderTabs";
import { CafeteriaMenuView } from "./components/CafeteriaMenuView";
import { CafeteriaOrdersView } from "./components/CafeteriaOrdersView";
import { useCafeteriaController } from "./hooks/useCafeteriaController";

export function CafeteriaDemo() {
  const {
    activeTab,
    slideIndex,
    activeMode,
    cycleMode,
    uxProfile,
    commerce,
    actions,
    constants
  } = useCafeteriaController();

  const {
    cart,
    orders,
    totals,
    pendingOrdersCount,
    addToCart,
    removeFromCart,
    clearCart,
    updateOrderStatus
  } = commerce;

  return (
    <section
      className={`cafeteria-shell cafeteria-ux-${activeMode.id} ux-layout-${uxProfile.headerStyle}`}
    >
      <CafeteriaHeaderTabs
        activeMode={activeMode}
        cycleMode={cycleMode}
        activeTab={activeTab}
        totals={totals}
        pendingOrdersCount={pendingOrdersCount}
        actions={actions}
      />

      {activeTab === "menu" ? (
        <CafeteriaMenuView
          uxProfile={uxProfile}
          slideIndex={slideIndex}
          addToCart={addToCart}
          actions={actions}
        />
      ) : null}

      {activeTab === "cart" ? (
        <CafeteriaCartView
          uxProfile={uxProfile}
          cart={cart}
          totals={totals}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          actions={actions}
        />
      ) : null}

      {activeTab === "orders" ? (
        <CafeteriaOrdersView
          uxProfile={uxProfile}
          orders={orders}
          updateOrderStatus={updateOrderStatus}
          orderStatus={constants.ORDER_STATUS}
        />
      ) : null}
    </section>
  );
}
