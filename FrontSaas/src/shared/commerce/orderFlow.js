import { useMemo, useState } from "react";
import {
  createCartLine,
  createOrderRecord,
  isValidOrderStatus,
  ORDER_STATUS
} from "./contracts.js";

export { ORDER_STATUS } from "./contracts.js";

export function upsertCartItem(cart, product) {
  const line = createCartLine(product, 1);
  const found = cart.find((item) => item.id === line.id);
  if (!found) {
    return [line, ...cart];
  }

  return cart.map((item) =>
    item.id === line.id ? { ...item, qty: item.qty + 1 } : item
  );
}

export function decrementCartItem(cart, productId) {
  return cart
    .map((item) =>
      item.id === productId ? { ...item, qty: Math.max(0, item.qty - 1) } : item
    )
    .filter((item) => item.qty > 0);
}

export function getCartTotals(cart) {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return { totalItems, totalAmount };
}

export function getPendingOrdersCount(orders) {
  return orders.filter((order) => order.status !== ORDER_STATUS.DONE).length;
}

export function buildOrderFromCart({ cart, getDateLabel }) {
  if (cart.length === 0) {
    return null;
  }

  return createOrderRecord({
    id: Date.now(),
    at: getDateLabel(),
    status: ORDER_STATUS.PENDING,
    items: cart
  });
}

export function useOrderFlow({ getDateLabel }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const totals = useMemo(() => getCartTotals(cart), [cart]);

  const pendingOrdersCount = useMemo(() => getPendingOrdersCount(orders), [orders]);

  const addToCart = (product) => {
    setCart((prev) => upsertCartItem(prev, product));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => decrementCartItem(prev, productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const confirmOrder = () => {
    const newOrder = buildOrderFromCart({ cart, getDateLabel });
    if (!newOrder) {
      return null;
    }

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    if (!isValidOrderStatus(status)) {
      return;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return {
    cart,
    orders,
    totals,
    pendingOrdersCount,
    addToCart,
    removeFromCart,
    clearCart,
    confirmOrder,
    updateOrderStatus
  };
}
