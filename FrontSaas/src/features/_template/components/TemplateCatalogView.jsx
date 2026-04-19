import { FEATURE_MENU_PRODUCTS } from "../data/menuCatalog";

export function TemplateCatalogView({ controller }) {
  const { commerce } = controller;
  return (
    <section>
      <h2>Template Feature</h2>
      <p>Clona este modulo y renombra archivos para nuevos proyectos.</p>
      <button
        type="button"
        onClick={() => commerce.addToCart(FEATURE_MENU_PRODUCTS[0])}
      >
        Agregar demo al carrito
      </button>
    </section>
  );
}
