import { Link } from "react-router-dom";
import { getPublicAssetUrl, projects } from "../shared/data/projects";

export function HomePage() {
  return (
    <section className="home-wrapper">
      <div className="hero">
        <h1>Catalogo de Soluciones Digitales</h1>
        <p>
          Selecciona un proyecto para entrar a la demo. Todo esta pensado para
          mostrar producto real, no solo diseno.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <Link
            to={`/project/${project.slug}`}
            className="project-card"
            key={project.slug}
          >
            <img src={getPublicAssetUrl(project.image)} alt={project.name} />
            <div className="project-content">
              <span>{project.category}</span>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
