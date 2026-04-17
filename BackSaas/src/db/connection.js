import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { env } from "../config/env.js";

const resolvedDbPath = path.resolve(process.cwd(), env.dbPath);
const dbDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(resolvedDbPath);

export function initializeDatabase() {
  const initSqlPath = path.resolve(process.cwd(), "src/db/init.sql");
  const initSql = fs.readFileSync(initSqlPath, "utf8");
  db.exec(initSql);
}
