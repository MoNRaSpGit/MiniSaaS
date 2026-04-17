import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./db/connection.js";

initializeDatabase();

app.listen(env.port, () => {
  console.log(`BackSaas listening on http://localhost:${env.port}`);
});
