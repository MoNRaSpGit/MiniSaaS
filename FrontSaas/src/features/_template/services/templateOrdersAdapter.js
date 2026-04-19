import { requestJson } from "../../../shared/adapters/httpClient";

export function createTemplateOrdersAdapter({ baseUrl = "" } = {}) {
  if (!baseUrl) {
    return {
      listOrders: async () => [],
      createOrder: async (payload) => payload
    };
  }

  return {
    listOrders: () => requestJson(`${baseUrl}/template/orders`),
    createOrder: (payload) =>
      requestJson(`${baseUrl}/template/orders`, {
        method: "POST",
        body: JSON.stringify(payload)
      })
  };
}
