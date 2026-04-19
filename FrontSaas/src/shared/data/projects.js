export const projects = [
  {
    slug: "almacen",
    name: "Almacen",
    category: "Retail + Scanner",
    image: "images/almacen.svg",
    description:
      "Control de stock, scanner de productos, ventas y reposicion inteligente."
  },
  {
    slug: "peluqueria",
    name: "Peluqueria",
    category: "Reservas",
    image: "images/peluqueria.svg",
    description:
      "Agenda de turnos, reservas online, recordatorios y gestion de clientes."
  },
  {
    slug: "gimnasio",
    name: "Gimnasio",
    category: "Suscripciones",
    image: "images/gimnasio.svg",
    description:
      "Planes mensuales, control de asistencia, pagos y seguimiento de alumnos."
  },
  {
    slug: "cafeteria",
    name: "Cafeteria",
    category: "Pedidos + Caja",
    image: "images/restaurante.svg",
    description:
      "Menu de cafe y postres, carrito rapido y panel de pedidos para despacho."
  },
  {
    slug: "clinica",
    name: "Clinica",
    category: "Turnos + Historial",
    image: "images/clinica.svg",
    description:
      "Turnos medicos, historias clinicas y panel administrativo para secretarias."
  },
  {
    slug: "inmobiliaria",
    name: "Inmobiliaria",
    category: "Leads + CRM",
    image: "images/inmobiliaria.svg",
    description:
      "Propiedades, seguimiento de leads, visitas y embudo comercial."
  }
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getPublicAssetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}
