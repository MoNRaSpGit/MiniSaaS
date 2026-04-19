import test from "node:test";
import assert from "node:assert/strict";
import {
  buildOrderFromCart,
  decrementCartItem,
  getCartTotals,
  getPendingOrdersCount,
  ORDER_STATUS,
  upsertCartItem
} from "./orderFlow.js";

test("upsertCartItem agrega y acumula qty", () => {
  const empty = [];
  const added = upsertCartItem(empty, { id: "1", name: "Cafe", price: 120 });
  const updated = upsertCartItem(added, { id: "1", name: "Cafe", price: 120 });

  assert.equal(added.length, 1);
  assert.equal(updated[0].qty, 2);
});

test("decrementCartItem elimina linea al llegar a cero", () => {
  const cart = [{ id: "1", name: "Cafe", price: 100, qty: 1 }];
  const result = decrementCartItem(cart, "1");
  assert.equal(result.length, 0);
});

test("getCartTotals calcula items y monto", () => {
  const totals = getCartTotals([
    { id: "1", price: 100, qty: 2 },
    { id: "2", price: 250, qty: 1 }
  ]);
  assert.equal(totals.totalItems, 3);
  assert.equal(totals.totalAmount, 450);
});

test("getPendingOrdersCount solo cuenta no entregados", () => {
  const count = getPendingOrdersCount([
    { id: 1, status: ORDER_STATUS.PENDING },
    { id: 2, status: ORDER_STATUS.IN_PROGRESS },
    { id: 3, status: ORDER_STATUS.DONE }
  ]);
  assert.equal(count, 2);
});

test("buildOrderFromCart retorna null si carrito vacio", () => {
  const order = buildOrderFromCart({
    cart: [],
    getDateLabel: () => "19/04 10:00"
  });
  assert.equal(order, null);
});
