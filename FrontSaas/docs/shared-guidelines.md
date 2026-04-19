# Shared Guidelines

## Cuando crear modulo shared

- La logica aparece en 2 o mas features.
- Es infraestructura transversal (HTTP, storage, formatter).
- Es contrato de datos comun (pedido, carrito, producto).

## Reglas

1. `shared` no depende de features.
2. Exponer APIs pequenas y estables.
3. Documentar cada modulo shared con README corto.
4. Priorizar funciones puras para testear facil.

## Modulos shared actuales

- `shared/commerce`: flujo carrito + pedidos.
- `shared/ux`: infraestructura de 3UX.
- `shared/adapters`: cliente HTTP y utilities de infra.

