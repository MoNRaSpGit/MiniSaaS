import { Outlet, Link } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link className="brand" to="/">
          MiniSaaS Showcase
        </Link>
        <p className="brand-copy">6 proyectos demo listos para vender</p>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
