import net from "node:net";
import { env } from "../config/env.js";

const TICKET_WIDTH = 32;

function fitText(value, max) {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, Math.max(0, max - 1))}...`;
}

function centerText(value, width = TICKET_WIDTH) {
  const trimmed = fitText(value, width);
  const totalPadding = Math.max(0, width - trimmed.length);
  const left = Math.floor(totalPadding / 2);
  const right = totalPadding - left;
  return `${" ".repeat(left)}${trimmed}${" ".repeat(right)}`;
}

function lineSeparator(width = TICKET_WIDTH) {
  return "-".repeat(width);
}

function moneyShort(value) {
  const formatted = new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 0
  }).format(value);
  return `$${formatted}`;
}

function buildPlainTicket({ at, amount, products }) {
  const lines = [
    centerText("SCANER"),
    centerText("Ticket de venta"),
    lineSeparator(),
    `Fecha: ${at}`,
    lineSeparator(),
    "Producto               Total"
  ];

  products.forEach((product) => {
    const left = fitText(`${product.qty}x ${product.name}`, 21).padEnd(21, " ");
    const right = moneyShort(product.subtotal).padStart(11, " ");
    lines.push(`${left}${right}`);
  });

  lines.push(lineSeparator());
  lines.push(`${"TOTAL".padEnd(21, " ")}${moneyShort(amount).padStart(11, " ")}`);
  lines.push(lineSeparator());
  lines.push(centerText("Gracias por su compra"));
  lines.push("");
  lines.push("");
  lines.push("");

  return lines.join("\n");
}

function sendToPrinter(payload) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let settled = false;

    socket.setTimeout(env.printerTimeoutMs);

    socket.once("connect", () => {
      socket.write(payload, "utf8", () => {
        socket.end();
      });
    });

    socket.once("timeout", () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(new Error("Timeout conectando a la impresora."));
    });

    socket.once("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });

    socket.once("close", () => {
      if (settled) return;
      settled = true;
      resolve();
    });

    socket.connect(env.printerPort, env.printerIp);
  });
}

export async function printTicketNetwork(movement) {
  if (!env.printerIp) {
    throw new Error("PRINTER_IP no esta configurado en el backend.");
  }

  const payload = `${buildPlainTicket(movement)}\n`;
  await sendToPrinter(payload);
}
