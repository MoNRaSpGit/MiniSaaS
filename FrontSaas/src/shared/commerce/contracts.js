export const ORDER_STATUS = {
  PENDING: "pendiente",
  IN_PROGRESS: "en-preparacion",
  DONE: "entregado"
};

export function normalizeProduct(product) {
  return {
    id: String(product.id),
    name: String(product.name),
    description: String(product.description || ""),
    category: String(product.category || "general"),
    price: Number(product.price) || 0
  };
}

export function createCartLine(product, qty = 1) {
  const safeProduct = normalizeProduct(product);
  return {
    id: safeProduct.id,
    name: safeProduct.name,
    description: safeProduct.description,
    category: safeProduct.category,
    price: safeProduct.price,
    qty: Math.max(1, Number(qty) || 1)
  };
}

export function createOrderItem(cartLine) {
  return {
    id: String(cartLine.id),
    name: String(cartLine.name),
    qty: Math.max(1, Number(cartLine.qty) || 1),
    subtotal: (Number(cartLine.price) || 0) * (Math.max(1, Number(cartLine.qty) || 1))
  };
}

export function createOrderRecord({ id, at, status = ORDER_STATUS.PENDING, items }) {
  const normalizedItems = items.map(createOrderItem);
  const total = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    id,
    at,
    status,
    items: normalizedItems,
    total
  };
}

export function isValidOrderStatus(status) {
  return Object.values(ORDER_STATUS).includes(status);
}
