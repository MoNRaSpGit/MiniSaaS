import { printTicketNetwork } from "../services/print.service.js";

function isValidMovement(body) {
  if (!body || typeof body !== "object") return false;
  if (typeof body.at !== "string" || !body.at.trim()) return false;
  if (typeof body.amount !== "number" || body.amount < 0) return false;
  if (!Array.isArray(body.products) || body.products.length === 0) return false;

  return body.products.every(
    (product) =>
      product &&
      typeof product.name === "string" &&
      Number.isFinite(product.qty) &&
      Number.isFinite(product.subtotal)
  );
}

export async function postPrintTicket(req, res) {
  if (!isValidMovement(req.body)) {
    return res.status(400).json({ error: "Payload de ticket invalido." });
  }

  try {
    await printTicketNetwork(req.body);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(502).json({
      error: "No se pudo imprimir por red.",
      detail: error.message
    });
  }
}
