import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3001),
  dbPath: process.env.DB_PATH ?? "./data/minisaas.db"
};
