import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { router } from "./app/router";
import { projects } from "./shared/data/projects";
import "./shared/styles/global.css";

registerSW({ immediate: true });

function applyQueryRedirect() {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const go = params.get("go");
  if (!go) {
    return;
  }

  const normalized = go.trim().toLowerCase();
  const basePath = import.meta.env.BASE_URL || "/";

  if (normalized === "catalog") {
    window.location.replace(`${basePath}#/`);
    return;
  }

  const targetProject = projects.find((project) => project.slug === normalized);
  if (targetProject) {
    window.location.replace(`${basePath}#/project/${targetProject.slug}`);
  }
}

applyQueryRedirect();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
