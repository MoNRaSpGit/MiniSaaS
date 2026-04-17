CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'demo'
);

INSERT OR IGNORE INTO projects (slug, name, category, description, image_url, status) VALUES
('almacen', 'Almacen', 'Retail + Scanner', 'Control de stock con escaneo y ventas.', '/images/almacen.svg', 'demo'),
('peluqueria', 'Peluqueria', 'Reservas', 'Sistema de turnos de corte y color.', '/images/peluqueria.svg', 'demo'),
('gimnasio', 'Gimnasio', 'Suscripciones', 'Planes, membresias y seguimiento.', '/images/gimnasio.svg', 'demo'),
('restaurante', 'Restaurante', 'Pedidos', 'Mesa, delivery y gestion de cocina.', '/images/restaurante.svg', 'demo'),
('clinica', 'Clinica', 'Turnos + Historial', 'Turnos medicos y administracion diaria.', '/images/clinica.svg', 'demo'),
('inmobiliaria', 'Inmobiliaria', 'Leads + CRM', 'Seguimiento de prospectos y propiedades.', '/images/inmobiliaria.svg', 'demo');
