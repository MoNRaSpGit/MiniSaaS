# MiniSaaS Showcase

MVP para mostrar 6 proyectos demo en una sola web, con foco visual y estructura profesional.

## Stack
- Frontend: React + Vite
- Backend: Node + Express
- DB: SQLite (SQL real con seed inicial)

## Estructura
```text
MiniSaaS/
  FrontSaas/
    public/images/
    src/app
    src/pages
    src/shared
  BackSaas/
    src/config
    src/controllers
    src/routes
    src/services
    src/db
```

## Ejecutar Frontend
```bash
cd FrontSaas
npm install
npm run dev
```

## Ejecutar Backend
```bash
cd BackSaas
npm install
npm run dev
```

Backend por defecto en `http://localhost:3001`.

## Primer roadmap
1. Conectar `FrontSaas` a `/api/projects` para consumir datos reales.
2. Crear el modulo real de cada demo (almacen, peluqueria, etc).
3. Agregar autenticacion simple para modo admin/comercial.

# MiniSaaS
