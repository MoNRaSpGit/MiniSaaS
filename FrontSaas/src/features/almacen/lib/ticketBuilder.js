const TICKET_WIDTH = 32;
const TICKET_FEED_LINES = 8;
const ESC = "\x1B";
const BOLD_ON = `${ESC}E\x01`;
const BOLD_OFF = `${ESC}E\x00`;

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

export function buildPlainTicket(movement) {
  const lines = [
    `${BOLD_ON}${centerText("SCANER")}${BOLD_OFF}`,
    `${BOLD_ON}${centerText("Ticket de venta")}${BOLD_OFF}`,
    lineSeparator(),
    `Fecha: ${movement.at}`,
    lineSeparator(),
    `${BOLD_ON}Producto               Total${BOLD_OFF}`
  ];

  movement.products.forEach((product) => {
    const left = fitText(`${product.qty}x ${product.name}`, 21).padEnd(21, " ");
    const right = moneyShort(product.subtotal).padStart(11, " ");
    lines.push(`${left}${right}`);
  });

  lines.push(lineSeparator());
  lines.push(
    `${BOLD_ON}${"TOTAL".padEnd(21, " ")}${moneyShort(movement.amount).padStart(11, " ")}${BOLD_OFF}`
  );
  lines.push(lineSeparator());
  lines.push(`${BOLD_ON}${centerText("Gracias por su compra")}${BOLD_OFF}`);

  for (let i = 0; i < TICKET_FEED_LINES; i += 1) {
    lines.push("");
  }

  return lines.join("\n");
}
