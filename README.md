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

## Deploy en Render

Crear 2 servicios desde el mismo repo:

### 1) Frontend (`FrontSaas`)
- Service type: `Static Site`
- Root directory: `FrontSaas`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://TU-BACKEND.onrender.com`

### 2) Backend (`BackSaas`)
- Service type: `Web Service`
- Root directory: `BackSaas`
- Build command: `npm install`
- Start command: `npm run start`
- Environment variables:
  - `NODE_ENV=production`
  - `DB_PATH=./data/minisaas.db`
  - `CORS_ORIGIN=https://TU-FRONTEND.onrender.com`

`PORT` lo inyecta Render automaticamente.
