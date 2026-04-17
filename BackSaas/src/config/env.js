import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3001),
  dbPath: process.env.DB_PATH ?? "./data/minisaas.db",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  printerIp: process.env.PRINTER_IP ?? "",
  printerPort: Number(process.env.PRINTER_PORT ?? 9100),
  printerTimeoutMs: Number(process.env.PRINTER_TIMEOUT_MS ?? 5000)
};
