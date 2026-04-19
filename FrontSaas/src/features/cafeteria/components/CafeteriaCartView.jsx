import { formatCurrency } from "../lib/formatters";

export function CafeteriaCartView({ uxProfile, cart, totals, addToCart, removeFromCart, clearCart, actions }) {
  return (
    <section className={`cafe-panel density-${uxProfile.orderPanelDensity}`}>
      <div className="cafe-panel-head">
        <h3>Carrito actual</h3>
        <button type="button" onClick={clearCart}>
          Limpiar
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="cafe-empty">No hay productos en el carrito.</p>
      ) : (
        <ul className="cafe-list">
          {cart.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>x{item.qty}</span>
              </div>
              <div className="cafe-line-actions">
                <small>{formatCurrency(item.qty * item.price)}</small>
                <button type="button" onClick={() => addToCart(item)}>
                  +
                </button>
                <button type="button" onClick={() => removeFromCart(item.id)}>
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="cafe-total">
        <p>
          Total <strong>{formatCurrency(totals.totalAmount)}</strong>
        </p>
        <button
          type="button"
          onClick={actions.handleConfirmOrder}
          disabled={cart.length === 0}
        >
          Confirmar pedido
        </button>
      </div>
    </section>
  );
}
