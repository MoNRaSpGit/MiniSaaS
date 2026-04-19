import { formatCurrency } from "../lib/formatters";

export function CafeteriaOrdersView({ uxProfile, orders, updateOrderStatus, orderStatus }) {
  return (
    <section className={`cafe-panel density-${uxProfile.orderPanelDensity}`}>
      <h3>Pedidos recibidos</h3>
      {orders.length === 0 ? (
        <p className="cafe-empty">Todavia no hay pedidos confirmados.</p>
      ) : (
        <ul className="cafe-orders">
          {orders.map((order) => (
            <li key={order.id}>
              <div className="cafe-order-head">
                <div>
                  <strong>Pedido #{String(order.id).slice(-5)}</strong>
                  <span>{order.at}</span>
                </div>
                <em className={`status-${order.status}`}>{order.status}</em>
              </div>
              <ul className="cafe-order-items">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`}>
                    <span>
                      {item.qty}x {item.name}
                    </span>
                    <strong>{formatCurrency(item.subtotal)}</strong>
                  </li>
                ))}
              </ul>
              <p className="cafe-order-total">
                Total: <strong>{formatCurrency(order.total)}</strong>
              </p>
              <div className="cafe-order-actions">
                <button
                  type="button"
                  onClick={() => updateOrderStatus(order.id, orderStatus.IN_PROGRESS)}
                >
                  En preparacion
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus(order.id, orderStatus.DONE)}
                >
                  Entregado
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
