export const KNOWN_PRODUCTS = {
  "5455345": { name: "Galletitas Mix Crocante 170g", price: 1290 },
  "7791234567890": { name: "Yerba Serrana Suave 1kg", price: 2980 },
  "7501031311309": { name: "Jabon Liquido Fresh 500ml", price: 1840 }
};

const BRANDS = ["Norte", "Del Valle", "Maxi", "Urbano", "Don", "Prime", "Eco"];
const ITEMS = [
  "Arroz Integral 1kg",
  "Pasta Fusilli 500g",
  "Leche Entera 1L",
  "Atun en Agua 170g",
  "Cafe Molido 250g",
  "Jugo Naranja 1L",
  "Pan Lactal Blanco",
  "Detergente Limon 750ml",
  "Papel Higienico x4",
  "Gaseosa Cola 2.25L"
];

function hashCode(value) {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getDemoProductFromCode(code) {
  if (KNOWN_PRODUCTS[code]) {
    return { ...KNOWN_PRODUCTS[code], code };
  }

  const hash = hashCode(code);
  const brand = BRANDS[hash % BRANDS.length];
  const item = ITEMS[hash % ITEMS.length];
  const price = 990 + ((hash % 26) + 1) * 120;

  return {
    code,
    name: `${brand} ${item}`,
    price
  };
}
