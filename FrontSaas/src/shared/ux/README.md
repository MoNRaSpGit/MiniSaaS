## 3UX Shared Infrastructure

Objetivo: tener una base unica para aplicar 3 variantes de interfaz por feature
sin duplicar logica.

Arquitectura extendida (layout + comportamiento + tema):
- `docs/3ux-architecture.md`

### Hook base

- Archivo: `src/shared/ux/useUxMode.js`
- Uso:
  - Maneja modo activo (`modern`, `classic`, `mix`)
  - Expone `cycleMode()` para boton de cambio rapido
  - Expone `setModeById()` para futura seleccion manual

### Convencion CSS por feature

- Cada feature define su shell con clase base + modo:
  - `project-shell project-ux-modern`
  - `project-shell project-ux-classic`
  - `project-shell project-ux-mix`
- Las diferencias visuales van en CSS variables del shell.

### Estandar recomendado para los 6 proyectos

1. Importar `useUxMode`.
2. Agregar boton `Cambiar UX`.
3. Aplicar clase dinamica `${shellClass} ${shellClass}-ux-${activeMode.id}`.
4. Mapear colores/estilo mediante variables en CSS.
5. Resolver estructura/flujo con perfiles de `projectUxProfiles.js`.
