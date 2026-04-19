import { Link } from "react-router-dom";
import { AccessCodesPanel } from "../features/access-codes/components/AccessCodesPanel";
import { getPublicAssetUrl, projects } from "../shared/data/projects";

export function HomePage() {
  return (
    <>
      <header className="top-bar">
        <div className="brand">MiniSaaS Demos</div>
        <p className="brand-copy">Selecciona un proyecto para entrar a su modulo.</p>
      </header>

      <section className="hero">
        <h1>Catalogo de proyectos</h1>
        <p>
          Tenemos 6 demos de negocio. Entra al modulo que quieras para probar su
          flujo.
        </p>
      </section>

      <section className="project-grid">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/project/${project.slug}`}
            className="project-card"
          >
            <img src={getPublicAssetUrl(project.image)} alt={project.name} />
            <div className="project-content">
              <span>{project.category}</span>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <AccessCodesPanel />
    </>
  );
}
