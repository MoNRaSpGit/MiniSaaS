import { listProjects } from "../services/projects.service.js";

export function getProjects(req, res) {
  const projects = listProjects();
  res.json({ data: projects });
}
