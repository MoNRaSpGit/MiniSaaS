## Commerce Flow (Reusable Pattern)

Patron reusable para features que comparten este flujo:
1. mostrar catalogo/productos
2. agregar al carrito
3. confirmar pedido
4. panel admin para manipular estado de pedido

### Hook principal

- Archivo: `src/shared/commerce/orderFlow.js`
- API:
  - estado: `cart`, `orders`, `totals`, `pendingOrdersCount`
  - acciones: `addToCart`, `removeFromCart`, `clearCart`, `confirmOrder`, `updateOrderStatus`
  - constantes: `ORDER_STATUS`

### Contratos

- Archivo: `src/shared/commerce/contracts.js`
- Define shape canonical de producto, carrito y pedido.

### Regla para nuevos proyectos

Todo proyecto que siga `catalogo -> carrito -> pedidos` debe partir de este hook
y solo agregar diferencias de UI/UX o reglas de negocio especificas.
