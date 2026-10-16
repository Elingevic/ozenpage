/* Lógica de la tienda. Los datos y el número de WhatsApp están en products.js */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => `$${n.toFixed(2)} USD`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const productUrl = (p) => `producto.html?id=${p.id}`;
const waLink = (text = "Hola OZEN, quiero información sobre sus productos.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const params = new URLSearchParams(location.search);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Imágenes y tarjetas ---------- */
function placeholder(p, cls = "ph") {
  return `<div class="${cls}"><img src="assets/isotipo-navy.png" alt=""><span>${p.label}</span></div>`;
}

function cardHTML(p, i = 0) {
  const media = p.images.length
    ? `<img src="${p.images[0]}" alt="${p.name}" class="card__photo" loading="lazy">` +
      (p.images[1] ? `<img src="${p.images[1]}" alt="" class="card__photo card__photo--alt" loading="lazy">` : "")
    : placeholder(p, "card__ph");
  return `
    <article class="card" style="animation-delay:${Math.min(i, 8) * 50}ms">
      <div class="card__media">
        <a href="${productUrl(p)}" class="card__link" aria-label="${p.name}">${media}</a>
        ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
        <button class="card__add" data-add="${p.id}">Agregar</button>
      </div>
      <div class="card__swatches">${p.colors.map((c) => `<span class="swatch" style="background:${c.hex}" title="${c.name}"></span>`).join("")}</div>
      <a href="${productUrl(p)}" class="card__name">${p.name}</a>
      <p class="card__price">${money(p.price)}</p>
    </article>`;
}

/* ---------- Carrito ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("ozen-cart")) || []; } catch { cart = []; }
cart = cart.filter((l) => byId(l.id));
const saveCart = () => { try { localStorage.setItem("ozen-cart", JSON.stringify(cart)); } catch {} };
const cartTotal = () => cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);

function addToCart(id, size, qty = 1) {
  const line = cart.find((l) => l.id === id && l.size === size);
  line ? (line.qty += qty) : cart.push({ id, size, qty });
  saveCart(); renderCart();
  const badge = $("#cartCount");
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  toast(`${byId(id).name} (${size}) agregado`);
}

function renderCart() {
  const count = cart.reduce((n, l) => n + l.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartCount").classList.toggle("has-items", count > 0);
  $("#cartHeadCount").textContent = count ? `(${count})` : "";
  $("#cartTotal").textContent = money(cartTotal());
  $("#checkout").disabled = count === 0;

  $("#cartItems").innerHTML = count === 0
    ? `<div class="drawer__empty"><img src="assets/isotipo-navy.png" alt="">Tu carrito está vacío<a href="coleccion.html" class="btn btn--line">Ver colección</a></div>`
    : cart.map((l, i) => {
        const p = byId(l.id);
        return `
        <div class="line">
          <a href="${productUrl(p)}" class="line__thumb">${p.images[0] ? `<img src="${p.images[0]}" alt="" class="card__photo">` : `<img src="assets/isotipo-navy.png" alt="">`}</a>
          <div>
            <a href="${productUrl(p)}" class="line__name">${p.name}</a>
            <p class="line__meta">Talla ${l.size}</p>
            <div class="qty qty--sm"><button data-qty="${i}" data-d="-1" aria-label="Menos">−</button><span>${l.qty}</span><button data-qty="${i}" data-d="1" aria-label="Más">+</button></div>
          </div>
          <div>
            <p class="line__price">${money(p.price * l.qty)}</p>
            <button class="line__remove" data-remove="${i}">Quitar</button>
          </div>
        </div>`;
      }).join("");
}

function initCart() {
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
    saveCart(); renderCart();
  });
  $("#cartOpen").addEventListener("click", () => openLayer("drawer"));
  $("#cartClose").addEventListener("click", closeLayers);
  $("#overlay").addEventListener("click", closeLayers);
  $("#checkout").addEventListener("click", () => {
    const lines = cart.map((l) => {
      const p = byId(l.id);
      return `• ${l.qty} x ${p.name} — Talla ${l.size} — ${money(p.price * l.qty)}`;
    });
    const msg = `Hola OZEN 👋 quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(cartTotal())}`;
    window.open(waLink(msg), "_blank");
  });
  renderCart();
}

/* ---------- Capas: carrito, menú, buscador, filtros ---------- */
function openLayer(id) {
  closeLayers();
  $(`#${id}`).classList.add("is-open");
  if (id === "drawer" || id === "filters") $("#overlay").classList.add("is-open");
  document.body.classList.add("no-scroll");
}
function closeLayers() {
  $$(".drawer, .mmenu, .search, .filters, .overlay, .modal").forEach((el) => el.classList.remove("is-open"));
  document.body.classList.remove("no-scroll");
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLayers(); });

/* ---------- Modal de talla (agregar rápido) ---------- */
let pending = { id: null, size: null };
function askSize(id) {
  const p = byId(id);
  if (p.sizes.length === 1) return addToCart(id, p.sizes[0]);
  pending = { id, size: null };
  $("#sizeTitle").textContent = p.name;
  $("#sizeOptions").innerHTML = p.sizes.map((s) => `<button data-size="${s}">${s}</button>`).join("");
  $("#sizeConfirm").disabled = true;
  $("#sizeModal").classList.add("is-open");
}
function initSizeModal() {
  $("#sizeOptions").addEventListener("click", (e) => {
    const b = e.target.closest("[data-size]");
    if (!b) return;
    pending.size = b.dataset.size;
    $$("#sizeOptions button").forEach((x) => x.classList.toggle("is-active", x === b));
    $("#sizeConfirm").disabled = false;
  });
  $("#sizeConfirm").addEventListener("click", () => { addToCart(pending.id, pending.size); $("#sizeModal").classList.remove("is-open"); });
  $("#sizeClose").addEventListener("click", () => $("#sizeModal").classList.remove("is-open"));
  $("#sizeModal").addEventListener("click", (e) => { if (e.target.id === "sizeModal") e.target.classList.remove("is-open"); });
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) askSize(add.dataset.add);
  });
}

/* ---------- Menú móvil ---------- */
function initMenu() {
  $("#menuOpen").addEventListener("click", () => openLayer("mmenu"));
  $("#menuClose").addEventListener("click", closeLayers);
  $$(".mmenu__toggle").forEach((btn) => btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    btn.parentElement.classList.toggle("is-open", !open);
  }));
}

/* ---------- Buscador ---------- */
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function renderSearch(q) {
  const box = $("#searchResults");
  const term = normalize(q.trim());
  if (!term) {
    box.innerHTML = `
      <p class="search__label">Búsquedas sugeridas</p>
      <div class="search__chips">
        ${["700KG", "Oversize", "Camiseta", "Gorra", "Straps"].map((t) => `<button class="chip" data-term="${t}">${t}</button>`).join("")}
      </div>
      <p class="search__label">Categorías</p>
      <div class="search__chips">
        ${Object.entries(CATEGORIES).map(([k, n]) => `<a class="chip" href="${catUrl(k)}">${n}</a>`).join("")}
      </div>`;
    return;
  }
  const found = PRODUCTS.filter((p) => normalize(`${p.name} ${p.label} ${CATEGORIES[p.category]} ${p.colors.map((c) => c.name).join(" ")}`).includes(term));
  box.innerHTML = found.length
    ? `<p class="search__label">${found.length} resultado${found.length > 1 ? "s" : ""}</p>
       <div class="search__list">${found.map((p) => `
         <a href="${productUrl(p)}" class="search__item">
           <span class="search__thumb">${p.images[0] ? `<img src="${p.images[0]}" alt="">` : `<img src="assets/isotipo-navy.png" alt="">`}</span>
           <span><strong>${p.name}</strong><small>${money(p.price)}</small></span>
         </a>`).join("")}</div>`
    : `<p class="search__empty">No encontramos “${esc(q)}”. Prueba con otra palabra o <a href="#" class="js-wa link">pregúntanos por WhatsApp</a>.</p>`;
  bindWa(box);
}

function initSearch() {
  const input = $("#searchInput");
  $$(".js-search").forEach((b) => b.addEventListener("click", () => {
    openLayer("search");
    renderSearch(input.value);
    setTimeout(() => input.focus(), 50);
  }));
  $("#searchClose").addEventListener("click", closeLayers);
  $("#search").addEventListener("click", (e) => { if (e.target.id === "search") closeLayers(); });
  input.addEventListener("input", () => renderSearch(input.value));
  $("#searchResults").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-term]");
    if (chip) { input.value = chip.dataset.term; renderSearch(input.value); input.focus(); }
  });
}

/* ---------- Utilidades ---------- */
let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2200);
}

function bindWa(root = document) {
  $$(".js-wa", root).forEach((a) => {
    a.href = waLink(a.dataset.msg);
    a.target = "_blank";
    a.rel = "noopener";
  });
}

function initReveal(selector) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(selector).forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

function tabs(container, onChange) {
  container.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t) return;
    $$(".tab", container).forEach((x) => x.classList.toggle("is-active", x === t));
    onChange(t.dataset.cat);
  });
}

/* =========================================================
   PÁGINA: INICIO
   ========================================================= */
function initHome() {
  // Slider
  const slides = $$(".slide");
  const dots = $("#dots");
  const progress = $("#progress");
  const DURATION = 6000;
  let current = 0, start = performance.now();

  dots.innerHTML = slides.map((_, i) => `<button aria-label="Diapositiva ${i + 1}"></button>`).join("");
  const goTo = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("is-active", j === current));
    $$("button", dots).forEach((d, j) => d.classList.toggle("is-active", j === current));
    start = performance.now();
  };
  const tick = (now) => {
    const t = Math.min((now - start) / DURATION, 1);
    progress.style.height = `${t * 100}%`;
    if (t >= 1) goTo(current + 1);
    requestAnimationFrame(tick);
  };
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
  requestAnimationFrame(tick);

  // Essentials por categoría
  const renderEssentials = (cat) => {
    const list = PRODUCTS.filter((p) => p.category === cat);
    $("#essRow").innerHTML = `
      <a href="${catUrl(cat)}" class="hero-card">
        <span class="hero-card__count">${list.length} productos</span>
        <img src="assets/isotipo.png" alt="" class="hero-card__mark">
        <span class="outline">${CATEGORIES[cat]}</span>
        <span class="pill pill--sm hero-card__cta">Ver todo</span>
      </a>` + list.map(cardHTML).join("");
    $("#essMore").href = catUrl(cat);
  };
  tabs($("#essTabs"), renderEssentials);
  renderEssentials("oversize");

  // Lo más vendido / New in
  const renderTop = (mode) => {
    const list = PRODUCTS.filter((p) => (mode === "nuevo" ? p.isNew : p.top));
    $("#topGrid").innerHTML = list.map(cardHTML).join("");
    $("#topMore").href = catUrl(mode === "nuevo" ? "nuevo" : "top");
  };
  tabs($("#topTabs"), renderTop);
  renderTop("top");

  initReveal(".banner, .tile, .band h2, .feature, .review");
}

/* =========================================================
   PÁGINA: COLECCIÓN
   ========================================================= */
const COLLECTIONS = {
  all: { title: "Ver todo", filter: () => true },
  nuevo: { title: "New in", filter: (p) => p.isNew },
  top: { title: "Lo más vendido", filter: (p) => p.top },
  ...Object.fromEntries(Object.entries(CATEGORIES).map(([k, n]) => [k, { title: n, filter: (p) => p.category === k }])),
};
const SORTS = {
  featured: { label: "Destacados", fn: (a, b) => (b.top - a.top) || (b.isNew - a.isNew) },
  "price-asc": { label: "Precio: menor a mayor", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Precio: mayor a menor", fn: (a, b) => b.price - a.price },
  az: { label: "Alfabético: A-Z", fn: (a, b) => a.name.localeCompare(b.name) },
};

function initCollection() {
  const state = {
    cat: COLLECTIONS[params.get("cat")] ? params.get("cat") : "all",
    sizes: new Set(),
    sort: "featured",
  };
  let view = "grid";
  try { view = localStorage.getItem("ozen-view") || "grid"; } catch {}

  const allSizes = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];

  $("#filterBody").innerHTML = `
    <div class="fgroup">
      <p class="fgroup__title">Colección</p>
      <div class="fgroup__opts" id="fCat">
        ${Object.entries(COLLECTIONS).map(([k, c]) => `<button class="chip" data-v="${k}">${c.title}</button>`).join("")}
      </div>
    </div>
    <div class="fgroup">
      <p class="fgroup__title">Talla</p>
      <div class="fgroup__opts" id="fSize">
        ${allSizes.map((s) => `<button class="chip" data-v="${s}">${s}</button>`).join("")}
      </div>
    </div>
    <div class="fgroup">
      <p class="fgroup__title">Ordenar por</p>
      <div class="fgroup__radios" id="fSort">
        ${Object.entries(SORTS).map(([k, s]) => `<label><input type="radio" name="sort" value="${k}"><span>${s.label}</span></label>`).join("")}
      </div>
    </div>`;

  const render = () => {
    const col = COLLECTIONS[state.cat];
    const list = PRODUCTS
      .filter(col.filter)
      .filter((p) => !state.sizes.size || p.sizes.some((s) => state.sizes.has(s)))
      .sort(SORTS[state.sort].fn);

    document.title = `${col.title} — OZEN`;
    $("#colTitle").textContent = col.title;
    $("#crumbCurrent").textContent = col.title;
    $("#colCount").textContent = `${list.length} producto${list.length === 1 ? "" : "s"}`;
    $("#colGrid").className = `grid grid--${view}`;
    $("#colGrid").innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<div class="empty">No hay productos con esos filtros.<button class="link" id="clearInline">Quitar filtros</button></div>`;

    $$("#fCat .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.v === state.cat));
    $$("#fSize .chip").forEach((c) => c.classList.toggle("is-active", state.sizes.has(c.dataset.v)));
    $$("#fSort input").forEach((r) => { r.checked = r.value === state.sort; });
    $$(".view-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));

    const active = state.sizes.size + (state.sort !== "featured");
    $("#filterCount").textContent = active ? `(${active})` : "";
    $("#applyFilters").textContent = `Ver ${list.length} producto${list.length === 1 ? "" : "s"}`;

    const url = state.cat === "all" ? "coleccion.html" : `coleccion.html?cat=${state.cat}`;
    history.replaceState(null, "", url);
  };

  const clear = () => { state.sizes.clear(); state.sort = "featured"; render(); };

  $("#fCat").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) { state.cat = c.dataset.v; render(); } });
  $("#fSize").addEventListener("click", (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    state.sizes.has(c.dataset.v) ? state.sizes.delete(c.dataset.v) : state.sizes.add(c.dataset.v);
    render();
  });
  $("#fSort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#openFilters").addEventListener("click", () => openLayer("filters"));
  $("#closeFilters").addEventListener("click", closeLayers);
  $("#applyFilters").addEventListener("click", closeLayers);
  $("#clearFilters").addEventListener("click", clear);
  $("#colGrid").addEventListener("click", (e) => { if (e.target.id === "clearInline") { state.cat = "all"; clear(); } });
  $$(".view-btn").forEach((b) => b.addEventListener("click", () => {
    view = b.dataset.view;
    try { localStorage.setItem("ozen-view", view); } catch {}
    render();
  }));

  render();
}

/* =========================================================
   PÁGINA: PRODUCTO
   ========================================================= */
function initProduct() {
  const p = byId(params.get("id"));
  const root = $("#product");
  if (!p) {
    root.innerHTML = `<div class="empty empty--page"><h1 class="page-title">Producto no encontrado</h1><a href="coleccion.html" class="btn btn--dark">Ver colección</a></div>`;
    return;
  }
  document.title = `${p.name} — OZEN`;
  let size = p.sizes.length === 1 ? p.sizes[0] : null;
  let qty = 1;

  const slidesHTML = p.images.length
    ? p.images.map((src, i) => `<div class="gallery__slide"><img src="${src}" alt="${p.name} ${i + 1}"></div>`).join("")
    : `<div class="gallery__slide">${placeholder(p, "gallery__ph")}</div>`;
  const thumbs = p.images.length > 1
    ? `<div class="gallery__thumbs">${p.images.map((src, i) => `<button data-i="${i}" class="${i ? "" : "is-active"}"><img src="${src}" alt=""></button>`).join("")}</div>`
    : "";

  root.innerHTML = `
    <nav class="crumbs" aria-label="Ruta">
      <a href="index.html">Inicio</a><span>/</span><a href="${catUrl(p.category)}">${CATEGORIES[p.category]}</a><span>/</span><span>${p.name}</span>
    </nav>
    <div class="pdp">
      <div class="gallery">
        <div class="gallery__track" id="gTrack">${slidesHTML}</div>
        ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
        ${thumbs}
      </div>
      <div class="pdp__info">
        <h1 class="pdp__name">${p.name}</h1>
        <p class="pdp__price">${money(p.price)}</p>

        <div class="pdp__row">
          <p class="pdp__label">Color: <strong>${p.colors.map((c) => c.name).join(" / ")}</strong></p>
          <div class="card__swatches">${p.colors.map((c) => `<span class="swatch swatch--lg" style="background:${c.hex}" title="${c.name}"></span>`).join("")}</div>
        </div>

        <div class="pdp__row">
          <p class="pdp__label">Talla: <strong id="sizeLabel">${size || "elige una"}</strong></p>
          <div class="sizes sizes--pdp" id="pdpSizes">
            ${p.sizes.map((s) => `<button data-s="${s}" class="${s === size ? "is-active" : ""}">${s}</button>`).join("")}
          </div>
        </div>

        <div class="pdp__buy">
          <div class="qty" id="pdpQty"><button data-d="-1" aria-label="Menos">−</button><span>1</span><button data-d="1" aria-label="Más">+</button></div>
          <button class="btn btn--dark" id="pdpAdd">Agregar al carrito</button>
        </div>
        <button class="btn btn--line btn--block" id="pdpBuy">Comprar ahora por WhatsApp</button>

        <div class="acc">
          <details open><summary>Descripción</summary><p>${p.description}</p></details>
          <details><summary>Guía de tallas</summary><p>Nuestras oversize tienen un corte amplio. Si prefieres un fit más ajustado, pide una talla menos. ¿Dudas con tu talla? <a href="#" class="js-wa link" data-msg="Hola OZEN, ¿qué talla me recomiendan de ${p.name}?">Escríbenos</a> y te ayudamos.</p></details>
          <details><summary>Envíos y pagos</summary><p>Hacemos envíos a todo el país. Al enviar tu pedido por WhatsApp coordinamos la entrega y el método de pago.</p></details>
        </div>
      </div>
    </div>`;

  const needSize = () => {
    if (size) return false;
    toast("Elige una talla");
    $("#pdpSizes").classList.remove("shake"); void $("#pdpSizes").offsetWidth; $("#pdpSizes").classList.add("shake");
    return true;
  };

  $("#pdpSizes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-s]");
    if (!b) return;
    size = b.dataset.s;
    $("#sizeLabel").textContent = size;
    $$("#pdpSizes button").forEach((x) => x.classList.toggle("is-active", x === b));
  });
  $("#pdpQty").addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    qty = Math.max(1, qty + Number(b.dataset.d));
    $("#pdpQty span").textContent = qty;
  });
  $("#pdpAdd").addEventListener("click", () => { if (!needSize()) { addToCart(p.id, size, qty); openLayer("drawer"); } });
  $("#pdpBuy").addEventListener("click", () => {
    if (needSize()) return;
    const msg = `Hola OZEN 👋 quiero comprar:\n\n• ${qty} x ${p.name} — Talla ${size} — ${money(p.price * qty)}`;
    window.open(waLink(msg), "_blank");
  });

  // Galería: miniaturas y deslizamiento
  const track = $("#gTrack");
  $$(".gallery__thumbs button").forEach((b) => b.addEventListener("click", () => {
    track.scrollTo({ left: track.clientWidth * Number(b.dataset.i), behavior: "smooth" });
  }));
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    $$(".gallery__thumbs button").forEach((b, j) => b.classList.toggle("is-active", j === i));
  }, { passive: true });

  // Relacionados
  const related = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
  const fill = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category && x.top);
  $("#related").innerHTML = [...related, ...fill].slice(0, 4).map(cardHTML).join("");
}

/* ---------- Arranque ---------- */
document.body.insertAdjacentHTML("beforeend", layoutBottom());

const header = $("#header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

initCart();
initSizeModal();
initMenu();
initSearch();

const page = document.body.dataset.page;
if (page === "home") initHome();
if (page === "collection") initCollection();
if (page === "product") initProduct();

bindWa();
