/* =========================================================
   CONFIGURACIÓN — edita aquí tu número y tus productos
   ========================================================= */

// Número de WhatsApp con código de país, sin "+" ni espacios (ej: 584121234567)
const WHATSAPP = "584XXXXXXXXX";

const CATEGORIES = {
  oversize: "Oversize",
  camisetas: "Camisetas",
  accesorios: "Accesorios",
};

// Campos de cada producto:
//   images: fotos del producto (ej: ["assets/productos/700kg-1.jpg", "assets/productos/700kg-2.jpg"]).
//           Si está vacío se muestra el logo como imagen provisional.
//   top: aparece en "Lo más vendido" · isNew: aparece en "New in"
const PRODUCTS = [
  {
    id: "700kg-oversize", name: "Oversize 700KG OZEN Navy", category: "oversize", price: 25,
    tag: "Más vendido", label: "700KG", colors: [{ name: "Navy", hex: "#1d2150" }],
    top: true, isNew: false, images: [], sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Nuestra pieza insignia. Camiseta oversize de algodón pesado con hombro caído y estampado 700KG en la espalda. Hecha para el día de pierna y para todo lo que viene después.",
  },
  {
    id: "deer-oversize", name: "Oversize Ciervo OZEN Negro", category: "oversize", price: 25,
    tag: "Nuevo", label: "OZEN", colors: [{ name: "Negro", hex: "#111111" }],
    top: true, isNew: true, images: [], sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Oversize negra con el ciervo OZEN al frente. Algodón grueso que mantiene la forma lavado tras lavado.",
  },
  {
    id: "oversize-blanca", name: "Oversize Basic OZEN Blanco", category: "oversize", price: 22,
    tag: "", label: "BASIC", colors: [{ name: "Blanco", hex: "#f2f2f2" }],
    top: false, isNew: true, images: [], sizes: ["S", "M", "L", "XL", "XXL"],
    description: "La básica que combina con todo. Corte oversize, logo pequeño bordado y tela pesada.",
  },
  {
    id: "ozen-classic", name: "Camiseta Classic OZEN", category: "camisetas", price: 20,
    tag: "", label: "CLASSIC", colors: [{ name: "Negro", hex: "#111111" }, { name: "Navy", hex: "#1d2150" }],
    top: true, isNew: false, images: [], sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Corte regular, cómoda para entrenar y para el día a día. Logo OZEN al pecho.",
  },
  {
    id: "ozen-dryfit", name: "Camiseta Training OZEN Gris", category: "camisetas", price: 20,
    tag: "", label: "TRAINING", colors: [{ name: "Gris", hex: "#7a7c86" }],
    top: false, isNew: true, images: [], sizes: ["S", "M", "L", "XL"],
    description: "Tela ligera de secado rápido para sesiones intensas.",
  },
  {
    id: "ozen-tank", name: "Tank Top OZEN Negro", category: "camisetas", price: 18,
    tag: "", label: "TANK", colors: [{ name: "Negro", hex: "#111111" }],
    top: false, isNew: false, images: [], sizes: ["S", "M", "L", "XL"],
    description: "Sin mangas, sisa amplia. Ideal para días de brazo y espalda.",
  },
  {
    id: "ozen-cap", name: "Gorra OZEN Navy", category: "accesorios", price: 15,
    tag: "", label: "CAP", colors: [{ name: "Navy", hex: "#1d2150" }],
    top: true, isNew: false, images: [], sizes: ["Única"],
    description: "Gorra ajustable con el ciervo OZEN bordado.",
  },
  {
    id: "ozen-straps", name: "Straps OZEN", category: "accesorios", price: 12,
    tag: "Gym", label: "STRAPS", colors: [{ name: "Negro", hex: "#111111" }],
    top: false, isNew: false, images: [], sizes: ["Única"],
    description: "Straps de agarre para peso muerto y jalones. Más kilos, menos excusas.",
  },
];

const TICKER = ["Únete al club OZEN", "Envíos a todo el país", "Pedidos por WhatsApp", "Drop 01 disponible"];
