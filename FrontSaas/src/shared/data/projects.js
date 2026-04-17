export const projects = [
  {
    slug: "almacen",
    name: "Almacen",
    category: "Retail + Scanner",
    image: "/images/almacen.svg",
    description:
      "Control de stock, scanner de productos, ventas y reposicion inteligente."
  },
  {
    slug: "peluqueria",
    name: "Peluqueria",
    category: "Reservas",
    image: "/images/peluqueria.svg",
    description:
      "Agenda de turnos, reservas online, recordatorios y gestion de clientes."
  },
  {
    slug: "gimnasio",
    name: "Gimnasio",
    category: "Suscripciones",
    image: "/images/gimnasio.svg",
    description:
      "Planes mensuales, control de asistencia, pagos y seguimiento de alumnos."
  },
  {
    slug: "restaurante",
    name: "Restaurante",
    category: "Pedidos",
    image: "/images/restaurante.svg",
    description:
      "Pedidos en mesa, cocina en tiempo real y control total de caja y delivery."
  },
  {
    slug: "clinica",
    name: "Clinica",
    category: "Turnos + Historial",
    image: "/images/clinica.svg",
    description:
      "Turnos medicos, historias clinicas y panel administrativo para secretarias."
  },
  {
    slug: "inmobiliaria",
    name: "Inmobiliaria",
    category: "Leads + CRM",
    image: "/images/inmobiliaria.svg",
    description:
      "Propiedades, seguimiento de leads, visitas y embudo comercial."
  }
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
