# 3UX Architecture

## Objetivo

Definir una estructura reutilizable para que cada proyecto tenga 3 interfaces
realmente distintas (no solo color), manteniendo codigo ordenado y escalable.

## Capas del sistema

0. `Commerce pattern shared`:
- Carpeta: `src/shared/commerce/`
- Hook: `useOrderFlow`
- Responsabilidad: flujo base `catalogo -> carrito -> pedidos`

1. `Modo UX` (shared):
- Archivo: `src/shared/ux/useUxMode.js`
- Responsabilidad: estado del modo activo (`modern`, `classic`, `mix`) y ciclo.

2. `Perfil UX por proyecto` (shared):
- Archivo: `src/shared/ux/projectUxProfiles.js`
- Responsabilidad: describir diferencias funcionales/estructurales por modo.
- Ejemplos de flags:
  - `showCarousel`
  - `carouselStyle`
  - `productCardStyle`
  - `productGridColumns`
  - `headerStyle`
  - `orderPanelDensity`

3. `Tema visual por modo` (feature CSS):
- Convencion de clases:
  - `<feature>-ux-modern`
  - `<feature>-ux-classic`
  - `<feature>-ux-mix`
- Responsabilidad: tokens visuales (colores, bordes, fondos, etc.).

4. `Renderer de variantes` (feature JSX):
- Cada feature interpreta su perfil UX para decidir:
  - que bloques se muestran/ocultan
  - como se ordenan
  - que variante de componente se usa

## Regla para los 6 proyectos

Cada proyecto debe tener:
1. reutilizar `useOrderFlow` si aplica patron de pedidos.
1. `useUxMode` para estado del modo.
2. perfil UX propio en `projectUxProfiles.js`.
3. 3 clases CSS de tema (`modern/classic/mix`).
4. al menos 1 cambio estructural entre modos (no solo color).

## Plan sugerido de migracion

1. Cafeteria:
- Aplicar perfiles completos (p. ej. `classic` sin carrusel, `mix` con layout alterno).

2. Almacen:
- Extraer sus temas actuales al mismo estandar `modern/classic/mix`.

3. Resto de proyectos:
- Repetir plantilla con perfiles minimos primero, luego enriquecer.
