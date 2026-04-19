import test from "node:test";
import assert from "node:assert/strict";
import {
  createCartLine,
  createOrderRecord,
  isValidOrderStatus,
  ORDER_STATUS
} from "./contracts.js";

test("createCartLine normaliza datos y qty minima", () => {
  const line = createCartLine(
    {
      id: 123,
      name: "Cafe",
      description: null,
      category: null,
      price: "45"
    },
    0
  );

  assert.equal(line.id, "123");
  assert.equal(line.name, "Cafe");
  assert.equal(line.category, "general");
  assert.equal(line.price, 45);
  assert.equal(line.qty, 1);
});

test("createOrderRecord calcula total desde items", () => {
  const order = createOrderRecord({
    id: 1,
    at: "19/04 10:00",
    items: [
      { id: "a", name: "Cafe", qty: 2, price: 100 },
      { id: "b", name: "Torta", qty: 1, price: 250 }
    ]
  });

  assert.equal(order.total, 450);
  assert.equal(order.status, ORDER_STATUS.PENDING);
  assert.equal(order.items.length, 2);
});

test("isValidOrderStatus reconoce estados definidos", () => {
  assert.equal(isValidOrderStatus(ORDER_STATUS.IN_PROGRESS), true);
  assert.equal(isValidOrderStatus("otro"), false);
});
