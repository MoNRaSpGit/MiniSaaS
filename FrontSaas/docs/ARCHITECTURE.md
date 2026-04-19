# FrontSaaS Architecture

## Objetivo

Escalar multiples verticales (almacen, cafeteria, etc.) sin duplicar logica
ni romper consistencia de UX.

## Estructura principal

- `src/features/<feature>/`
  - `data/` catalogos y fixtures
  - `hooks/` controladores del feature (logica de negocio y estado local)
  - `components/` UI reutilizable del feature
  - `services/` adaptadores API del feature
  - `<Feature>Demo.jsx` pantalla demo del feature
- `src/shared/`
  - `commerce/` flujo reusable de carrito + pedidos
  - `ux/` sistema 3UX (modo, perfiles, convenciones)
  - `adapters/` utilidades de infraestructura (HTTP, storage, etc.)

## Principios

1. Si se repite en 2 features, va a `shared`.
2. La UI no contiene reglas de negocio complejas.
3. Cada feature usa `controller hook` para orquestacion.
4. Cada feature con pedidos usa `useOrderFlow`.
5. Cada feature soporta `3UX` con cambios estructurales reales.

## Contratos base

- Producto: `{ id, name, description, category, price }`
- Carrito line: `{ id, name, description, category, price, qty }`
- Pedido: `{ id, at, status, items[], total }`

Fuente canonical:
- `src/shared/commerce/contracts.js`

