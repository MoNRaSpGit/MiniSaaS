# Feature Template

Usar esta plantilla para cada nuevo proyecto vertical.

Checklist complementaria:
- `docs/feature-modular-checklist.md`

## Estructura

```text
src/features/<feature>/
  data/
    menuCatalog.js
  hooks/
    use<Feature>Controller.js
  components/
    <Feature>MenuView.jsx
    <Feature>CartView.jsx
    <Feature>OrdersView.jsx
  services/
    <feature>OrdersAdapter.js
  <Feature>Demo.jsx
```

## Checklist de implementacion

1. Crear `data/` con catalogo demo.
2. Crear `hooks/use<Feature>Controller`.
3. Integrar `useOrderFlow` desde `shared/commerce`.
4. Integrar `useUxMode` + perfil en `shared/ux/projectUxProfiles.js`.
5. Definir 3 clases UX (`modern`, `classic`, `mix`) en CSS.
6. Asegurar al menos 1 cambio estructural entre UXs.
7. Crear/actualizar adapter en `services/`.
8. Documentar diferencias del feature en `docs/`.
