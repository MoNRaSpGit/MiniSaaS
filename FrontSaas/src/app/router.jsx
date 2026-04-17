import { createHashRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { HomePage } from "../pages/HomePage";
import { ProjectPage } from "../pages/ProjectPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "project/:slug", element: <ProjectPage /> }
    ]
  }
]);
