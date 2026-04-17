import express from "express";
import cors from "cors";
import { projectsRouter } from "./routes/projects.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/projects", projectsRouter);
