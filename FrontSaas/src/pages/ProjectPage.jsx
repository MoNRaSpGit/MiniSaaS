import { Link, useParams } from "react-router-dom";
import { getProjectBySlug, getPublicAssetUrl } from "../shared/data/projects";
import { AlmacenScannerDemo } from "../features/almacen/AlmacenScannerDemo";

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <section className="detail-card">
        <h1>Proyecto no encontrado</h1>
        <Link to="/" className="back-link">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  if (project.slug === "almacen") {
    return (
      <section className="detail-card detail-card-mobile">
        <img src={getPublicAssetUrl(project.image)} alt={project.name} />
        <span>{project.category}</span>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <AlmacenScannerDemo />
        <Link to="/" className="back-link">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  return (
    <section className="detail-card detail-card-mobile">
      <img src={getPublicAssetUrl(project.image)} alt={project.name} />
      <span>{project.category}</span>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>
        Esta vista es el punto de entrada a la demo de <strong>{project.name}</strong>.
        En el siguiente paso conectamos cada una con su modulo real (scanner,
        reservas, CRM, etc).
      </p>
      <Link to="/" className="back-link">
        Volver al catalogo
      </Link>
    </section>
  );
}
