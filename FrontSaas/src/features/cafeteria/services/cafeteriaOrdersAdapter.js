import { requestJson } from "../../../shared/adapters/httpClient";

export function createCafeteriaOrdersAdapter({ baseUrl = "" } = {}) {
  return {
    listOrders() {
      if (!baseUrl) {
        return Promise.resolve([]);
      }
      return requestJson(`${baseUrl}/cafeteria/orders`);
    },
    createOrder(payload) {
      if (!baseUrl) {
        return Promise.resolve(payload);
      }
      return requestJson(`${baseUrl}/cafeteria/orders`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    updateOrderStatus(orderId, status) {
      if (!baseUrl) {
        return Promise.resolve({ id: orderId, status });
      }
      return requestJson(`${baseUrl}/cafeteria/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
    }
  };
}
