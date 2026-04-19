export const FEATURED_PRODUCTS = [
  {
    id: "capuccino",
    name: "Capuccino Clasico",
    description: "Espuma suave, espresso doble y canela.",
    price: 145,
    category: "cafe"
  },
  {
    id: "latte-vainilla",
    name: "Latte Vainilla",
    description: "Cafe con leche cremosa y toque de vainilla.",
    price: 165,
    category: "cafe"
  },
  {
    id: "cheesecake",
    name: "Cheesecake Frutos Rojos",
    description: "Postre del dia con base crocante y salsa casera.",
    price: 230,
    category: "postre"
  }
];

export const MENU_PRODUCTS = [
  ...FEATURED_PRODUCTS,
  {
    id: "espresso",
    name: "Espresso Doble",
    description: "Corto, intenso y recien molido.",
    price: 120,
    category: "cafe"
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Extraccion en frio de 12 horas.",
    price: 170,
    category: "cafe"
  },
  {
    id: "brownie",
    name: "Brownie Tibio",
    description: "Chocolate 70% con nueces y salsa de cacao.",
    price: 210,
    category: "postre"
  },
  {
    id: "cookie",
    name: "Cookie Chips",
    description: "Galleta grande estilo NY, recien horneada.",
    price: 140,
    category: "postre"
  }
];
