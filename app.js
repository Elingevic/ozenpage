/* =========================================================
   CONFIGURACIÓN — edita aquí tu número y tus productos
   ========================================================= */

// Número de WhatsApp con código de país, sin "+" ni espacios (ej: 584121234567)
const WHATSAPP = "584XXXXXXXXX";

// Para usar foto real: pon la ruta en "image" (ej: "assets/productos/700kg.jpg").
// Si "image" está vacío se muestra el logo sobre fondo gris.
// "top: true" lo muestra en "Lo más vendido".
const PRODUCTS = [
  { id: "700kg-oversize",  name: "Oversize 700KG OZEN Navy",  category: "oversize",   price: 25, tag: "Más vendido", label: "700KG",  colors: ["#1d2150"], top: true,  image: "", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "deer-oversize",   name: "Oversize Ciervo OZEN Negro", category: "oversize",  price: 25, tag: "Nuevo",       label: "OZEN",   colors: ["#111111"], top: true,  image: "", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "oversize-blanca", name: "Oversize Basic OZEN Blanco", category: "oversize",  price: 22, tag: "",            label: "BASIC",  colors: ["#f2f2f2"], top: false, image: "", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "ozen-classic",    name: "Camiseta Classic OZEN",     category: "camisetas",  price: 20, tag: "",            label: "CLASSIC", colors: ["#111111", "#1d2150"], top: true, image: "", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "ozen-dryfit",     name: "Camiseta Training OZEN Gris", category: "camisetas", price: 20, tag: "",           label: "TRAINING", colors: ["#7a7c86"], top: false, image: "", sizes: ["S", "M", "L", "XL"] },
  { id: "ozen-tank",       name: "Tank Top OZEN Negro",       category: "camisetas",  price: 18, tag: "",            label: "TANK",   colors: ["#111111"], top: false, image: "", sizes: ["S", "M", "L", "XL"] },
  { id: "ozen-cap",        name: "Gorra OZEN Navy",           category: "accesorios", price: 15, tag: "",            label: "CAP",    colors: ["#1d2150"], top: true,  image: "", sizes: ["Única"] },
  { id: "ozen-straps",     name: "Straps OZEN",               category: "accesorios", price: 12, tag: "Gym",         label: "STRAPS", colors: ["#111111"], top: false, image: "", sizes: ["Única"] },
];

const TICKER = ["Únete al club OZEN", "Envíos a todo el país", "Pedidos por WhatsApp", "Drop 01 disponible"];

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => `$${n.toFixed(2)} USD`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const waLink = (text = "Hola OZEN, quiero información sobre sus productos.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const CAT_NAMES = { oversize: "Oversize", camisetas: "Camisetas", accesorios: "Accesorios" };

/* ---------- Ticker ---------- */
const tickerItems = TICKER.map((t) => `<span><img src="assets/isotipo.png" alt="">${t}</span>`).join("");
$("#ticker").innerHTML = tickerItems.repeat(6);

/* ---------- Tarjetas ---------- */
function cardHTML(p, i = 0) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" class="card__photo" loading="lazy">`
    : `<div class="card__ph"><img src="assets/isotipo-navy.png" alt=""><span>${p.label}</span></div>`;
  return `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card__media">
        ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
        ${media}
        <button class="card__add" data-add="${p.id}">Agregar</button>
      </div>
      <div class="card__swatches">${p.colors.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("")}</div>
      <h3 class="card__name">${p.name}</h3>
      <p class="card__price">${money(p.price)}</p>
    </article>`;
}

function renderEssentials(cat) {
  const list = PRODUCTS.filter((p) => p.category === cat);
  $("#essRow").innerHTML = `
    <div class="hero-card">
      <span class="hero-card__count">${list.length} productos</span>
      <img src="assets/isotipo.png" alt="" class="hero-card__mark">
      <span class="outline">${CAT_NAMES[cat]}</span>
    </div>` + list.map(cardHTML).join("");
  $$("#essTabs .tab").forEach((t) => t.classList.toggle("is-active", t.dataset.cat === cat));
}

function renderAll(mode) {
  const list = mode === "top" ? PRODUCTS.filter((p) => p.top) : PRODUCTS;
  $("#allGrid").innerHTML = list.map(cardHTML).join("");
  $$("#allTabs .tab").forEach((t) => t.classList.toggle("is-active", t.dataset.cat === mode));
}

$("#essTabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (t) renderEssentials(t.dataset.cat);
});
$("#allTabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (t) renderAll(t.dataset.cat);
});

// Enlaces que abren una categoría concreta en "Essentials"
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (g) renderEssentials(g.dataset.goto);
});

/* ---------- Hero slider ---------- */
const slides = $$(".slide");
const dots = $("#dots");
const progress = $("#progress");
const DURATION = 6000;
let current = 0, timer, start;

dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");

function goTo(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, j) => s.classList.toggle("is-active", j === current));
  $$("button", dots).forEach((d, j) => d.classList.toggle("is-active", j === current));
  start = performance.now();
}
function tick(now) {
  const t = Math.min((now - start) / DURATION, 1);
  progress.style.height = `${t * 100}%`;
  if (t >= 1) goTo(current + 1);
  timer = requestAnimationFrame(tick);
}
dots.addEventListener("click", (e) => {
  const i = $$("button", dots).indexOf(e.target);
  if (i >= 0) goTo(i);
});
let touchX = null;
$("#slides").addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
$("#slides").addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  touchX = null;
});
goTo(0);
timer = requestAnimationFrame(tick);

/* ---------- Carrito ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("ozen-cart")) || []; } catch { cart = []; }
cart = cart.filter((l) => byId(l.id));
const save = () => { try { localStorage.setItem("ozen-cart", JSON.stringify(cart)); } catch {} };

function addToCart(id, size) {
  const line = cart.find((l) => l.id === id && l.size === size);
  line ? line.qty++ : cart.push({ id, size, qty: 1 });
  save(); renderCart();
  const badge = $("#cartCount");
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  toast(`${byId(id).name} (${size}) agregado`);
}

function renderCart() {
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
  $("#cartCount").textContent = count;
  $("#cartCount").classList.toggle("has-items", count > 0);
  $("#cartHeadCount").textContent = count ? `(${count})` : "";
  $("#cartTotal").textContent = money(total);
  $("#checkout").disabled = count === 0;

  $("#cartItems").innerHTML = count === 0
    ? `<div class="drawer__empty"><img src="assets/isotipo-navy.png" alt="">Tu carrito está vacío</div>`
    : cart.map((l, i) => {
        const p = byId(l.id);
        return `
        <div class="line">
          <div class="line__thumb">${p.image ? `<img src="${p.image}" alt="" class="card__photo">` : `<img src="assets/isotipo-navy.png" alt="">`}</div>
          <div>
            <p class="line__name">${p.name}</p>
            <p class="line__meta">Talla ${l.size}</p>
            <div class="qty"><button data-qty="${i}" data-d="-1" aria-label="Menos">−</button>${l.qty}<button data-qty="${i}" data-d="1" aria-label="Más">+</button></div>
          </div>
          <div>
            <p class="line__price">${money(p.price * l.qty)}</p>
            <button class="line__remove" data-remove="${i}">Quitar</button>
          </div>
        </div>`;
      }).join("");
}

$("#cartItems").addEventListener("click", (e) => {
  const q = e.target.closest("[data-qty]");
  const r = e.target.closest("[data-remove]");
  if (q) {
    const line = cart[q.dataset.qty];
    line.qty += Number(q.dataset.d);
    if (line.qty <= 0) cart.splice(q.dataset.qty, 1);
  } else if (r) {
    cart.splice(r.dataset.remove, 1);
  } else return;
  save(); renderCart();
});

const drawer = $("#drawer"), overlay = $("#overlay");
const openCart = () => { drawer.classList.add("is-open"); overlay.classList.add("is-open"); };
const closeCart = () => { drawer.classList.remove("is-open"); overlay.classList.remove("is-open"); };
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

$("#checkout").addEventListener("click", () => {
  const lines = cart.map((l) => {
    const p = byId(l.id);
    return `• ${l.qty} x ${p.name} — Talla ${l.size} — ${money(p.price * l.qty)}`;
  });
  const total = cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
  const msg = `Hola OZEN 👋 quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
  window.open(waLink(msg), "_blank");
});

/* ---------- Modal de talla ---------- */
const modal = $("#sizeModal");
let pending = { id: null, size: null };

function askSize(id) {
  const p = byId(id);
  if (p.sizes.length === 1) return addToCart(id, p.sizes[0]);
  pending = { id, size: null };
  $("#sizeTitle").textContent = p.name;
  $("#sizeOptions").innerHTML = p.sizes.map((s) => `<button data-size="${s}">${s}</button>`).join("");
  $("#sizeConfirm").disabled = true;
  modal.classList.add("is-open");
}
const closeModal = () => modal.classList.remove("is-open");

$("#sizeOptions").addEventListener("click", (e) => {
  const b = e.target.closest("[data-size]");
  if (!b) return;
  pending.size = b.dataset.size;
  $$("#sizeOptions button").forEach((x) => x.classList.toggle("is-active", x === b));
  $("#sizeConfirm").disabled = false;
});
$("#sizeConfirm").addEventListener("click", () => { addToCart(pending.id, pending.size); closeModal(); });
$("#sizeClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeCart(); } });

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) askSize(add.dataset.add);
});

/* ---------- UI general ---------- */
let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2200);
}

$$(".js-wa").forEach((a) => {
  a.href = waLink(a.dataset.msg);
  a.target = "_blank";
  a.rel = "noopener";
});

const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $("#menuBtn"), nav = $("#nav");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("is-open");
  nav.classList.toggle("is-open");
});
$$("#nav a").forEach((a) => a.addEventListener("click", () => {
  menuBtn.classList.remove("is-open");
  nav.classList.remove("is-open");
}));

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
$$(".banner, .tile, .band h2, .feature, .review, .club").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});

$("#year").textContent = new Date().getFullYear();

renderEssentials("oversize");
renderAll("top");
renderCart();
