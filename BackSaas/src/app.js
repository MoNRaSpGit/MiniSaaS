import express from "express";
import cors from "cors";
import { projectsRouter } from "./routes/projects.routes.js";
import { env } from "./config/env.js";
import { printRouter } from "./routes/print.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/projects", projectsRouter);
app.use("/api/print", printRouter);
