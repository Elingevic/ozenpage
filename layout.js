/* Partes comunes a todas las páginas: header, menú, buscador, carrito y footer.
   Se insertan donde está el <script>, así no hay saltos al cargar. */

const ICONS = {
  search: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.5-4.5"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.5l2.2 11h10.6L20.5 7H6.4"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5 5 19"/></svg>`,
  wa: `<svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.5 6.5 0 0 0 1.3 3.4 14.8 14.8 0 0 0 5.7 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4Z"/></svg>`,
};

const catUrl = (cat) => `coleccion.html${cat ? `?cat=${cat}` : ""}`;

function layoutTop() {
  const cats = Object.entries(CATEGORIES);
  const ticker = TICKER.map((t) => `<span><img src="assets/isotipo.png" alt="">${t}</span>`).join("").repeat(6);

  const menuGroups = cats.map(([key, name]) => {
    const items = PRODUCTS.filter((p) => p.category === key)
      .map((p) => `<a href="producto.html?id=${p.id}">${p.name}</a>`).join("");
    return `
      <div class="mmenu__group">
        <button class="mmenu__toggle" aria-expanded="false">${name}<span class="mmenu__plus"></span></button>
        <div class="mmenu__sub"><div><a href="${catUrl(key)}" class="mmenu__all">Ver todo ${name.toLowerCase()}</a>${items}</div></div>
      </div>`;
  }).join("");

  return `
  <a href="#main" class="skip">Saltar al contenido</a>
  <header class="header" id="header">
    <div class="container header__inner">
      <div class="header__left">
        <button class="icon-btn" id="menuOpen" aria-label="Abrir menú">${ICONS.menu}</button>
        <button class="icon-btn js-search" aria-label="Buscar">${ICONS.search}</button>
      </div>
      <a href="index.html" class="brand" aria-label="OZEN inicio">
        <img src="assets/isotipo-navy.png" alt="" class="brand__iso">
        <img src="assets/wordmark-navy.png" alt="OZEN" class="brand__word">
      </a>
      <nav class="nav" aria-label="Principal">
        <a href="${catUrl("nuevo")}">New in</a>
        ${cats.map(([k, n]) => `<a href="${catUrl(k)}">${n}</a>`).join("")}
        <a href="${catUrl()}">Ver todo</a>
      </nav>
      <div class="header__actions">
        <button class="icon-btn js-search search-d" aria-label="Buscar">${ICONS.search}</button>
        <a href="https://www.instagram.com/ozenod" target="_blank" rel="noopener" class="icon-btn ig-btn" aria-label="Instagram">${ICONS.ig}</a>
        <button class="icon-btn cart-btn" id="cartOpen" aria-label="Abrir carrito">${ICONS.cart}<span class="cart-count" id="cartCount">0</span></button>
      </div>
    </div>
  </header>
  <div class="ticker" aria-hidden="true"><div class="ticker__track">${ticker}</div></div>

  <!-- Menú móvil a pantalla completa -->
  <aside class="mmenu" id="mmenu" aria-label="Menú">
    <div class="mmenu__head">
      <a href="index.html" class="brand"><img src="assets/isotipo-navy.png" alt="" class="brand__iso"><img src="assets/wordmark-navy.png" alt="OZEN" class="brand__word"></a>
      <button class="icon-btn" id="menuClose" aria-label="Cerrar menú">${ICONS.close}</button>
    </div>
    <nav class="mmenu__nav">
      <a href="${catUrl("nuevo")}" class="mmenu__link">New in</a>
      ${menuGroups}
      <a href="${catUrl()}" class="mmenu__link">Ver todo</a>
    </nav>
    <div class="mmenu__extra">
      <a href="#" class="js-wa">Contacto por WhatsApp</a>
      <a href="https://www.instagram.com/ozenod" target="_blank" rel="noopener">Instagram @ozenod</a>
      <button class="js-search">Buscar</button>
    </div>
  </aside>

  <!-- Buscador -->
  <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Buscar">
    <div class="search__panel">
      <div class="container search__bar">
        ${ICONS.search}
        <input type="search" id="searchInput" placeholder="Buscar productos" autocomplete="off">
        <button class="icon-btn" id="searchClose" aria-label="Cerrar búsqueda">${ICONS.close}</button>
      </div>
      <div class="container search__body" id="searchResults"></div>
    </div>
  </div>`;
}

function layoutBottom() {
  const cats = Object.entries(CATEGORIES);
  return `
  <section class="container club">
    <div>
      <h2>Únete al club OZEN</h2>
      <p>Entérate primero de los nuevos drops y ofertas exclusivas.</p>
    </div>
    <div class="club__actions">
      <a href="#" class="btn btn--dark js-wa" data-msg="Hola OZEN, quiero unirme al club para enterarme de los nuevos drops.">Unirme por WhatsApp</a>
      <a href="https://www.instagram.com/ozenod" target="_blank" rel="noopener" class="btn btn--line">Seguir en Instagram</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <h4>Shop</h4>
        <a href="${catUrl("nuevo")}">New in</a>
        ${cats.map(([k, n]) => `<a href="${catUrl(k)}">${n}</a>`).join("")}
        <a href="${catUrl()}">Ver todo</a>
      </div>
      <div>
        <h4>Atención al cliente</h4>
        <a href="#" class="js-wa">WhatsApp</a>
        <a href="#" class="js-wa" data-msg="Hola OZEN, ¿me ayudan con la talla?">Ayuda con tallas</a>
        <a href="#" class="js-wa" data-msg="Hola OZEN, quiero información sobre envíos.">Envíos</a>
      </div>
      <div>
        <h4>Síguenos</h4>
        <a href="https://www.instagram.com/ozenod" target="_blank" rel="noopener">Instagram</a>
      </div>
      <div class="footer__brand">
        <img src="assets/logo-ozen.png" alt="OZEN">
        <p class="footer__pay">Pago móvil · Zelle · Efectivo</p>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© ${new Date().getFullYear()} OZEN Sportswear</span>
      <span>Hecho para entrenar</span>
    </div>
  </footer>

  <a href="#" class="wa-float js-wa" aria-label="WhatsApp">${ICONS.wa}</a>

  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer" aria-label="Carrito">
    <div class="drawer__head">
      <h3>Carrito <span id="cartHeadCount"></span></h3>
      <button class="icon-btn" id="cartClose" aria-label="Cerrar">${ICONS.close}</button>
    </div>
    <div class="drawer__body" id="cartItems"></div>
    <div class="drawer__foot">
      <div class="drawer__total"><span>Total</span><strong id="cartTotal">$0.00 USD</strong></div>
      <button class="btn btn--dark btn--block" id="checkout">Enviar pedido por WhatsApp</button>
      <p class="drawer__note">Envío y forma de pago se coordinan por WhatsApp.</p>
    </div>
  </aside>

  <div class="modal" id="sizeModal" role="dialog" aria-modal="true">
    <div class="modal__card">
      <button class="icon-btn modal__close" id="sizeClose" aria-label="Cerrar">${ICONS.close}</button>
      <p class="block__sub">Elige tu talla</p>
      <h3 id="sizeTitle"></h3>
      <div class="sizes" id="sizeOptions"></div>
      <button class="btn btn--dark btn--block" id="sizeConfirm" disabled>Agregar al carrito</button>
    </div>
  </div>

  <div class="toast" id="toast"></div>`;
}

document.currentScript.insertAdjacentHTML("afterend", layoutTop());
