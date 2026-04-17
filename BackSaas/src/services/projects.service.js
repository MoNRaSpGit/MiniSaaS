import { db } from "../db/connection.js";

export function listProjects() {
  const stmt = db.prepare(`
    SELECT id, slug, name, category, description, image_url AS imageUrl, status
    FROM projects
    ORDER BY id ASC
  `);

  return stmt.all();
}
