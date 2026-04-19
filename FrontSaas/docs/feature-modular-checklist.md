# Feature Modular Checklist

Checklist rapido para crear/modularizar cualquier feature nuevo.

## 1) Estructura de carpetas

- `src/features/<feature>/data`
- `src/features/<feature>/hooks`
- `src/features/<feature>/components`
- `src/features/<feature>/services`
- `src/features/<feature>/lib` (si hay formatters/helpers del feature)
- `src/features/<feature>/<Feature>Demo.jsx`

## 2) Separacion de responsabilidades

- `hooks/use<Feature>Controller.js`: estado, reglas, acciones.
- `<Feature>Demo.jsx`: solo orquesta vistas.
- `components/*View.jsx`: presentacionales, sin logica compleja.
- `data/*`: catalogos/fixtures.
- `services/*Adapter.js`: integracion API.

## 3) Patrones shared obligatorios (si aplica)

- Pedidos: usar `shared/commerce/useOrderFlow`.
- UX: usar `shared/ux/useUxMode` + perfil en `projectUxProfiles.js`.
- HTTP: usar `shared/adapters/httpClient`.

## 4) Regla 3UX minima por feature

- `modern`, `classic`, `mix`.
- Al menos 1 diferencia estructural real entre modos.
- Boton visible para cambiar UX.

## 5) Validacion tecnica antes de cerrar

1. `npm test`
2. `npm run build`
3. Probar navegacion:
   - entrada al feature
   - flujo principal
   - volver al catalogo

## 6) Definition of Done (DoD)

- Codigo modular (controller + views).
- Sin logica duplicada que deba estar en `shared`.
- Documentacion actualizada en `docs/`.
- Build y tests en verde.
