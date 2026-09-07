/**
 * STARSHINE HAUTE COLLECTION - CLIENT APPLICATION
 * Features: Product Filtering, Currency Switching, Cart Management,
 * Wishlist, Quick View Modal, WhatsApp Order Engine & Owner Settings.
 */

// Default Configurations
const DEFAULT_SETTINGS = {
  storeName: "STARSHINE",
  whatsappNumber: "15550192834", // Uncle's WhatsApp Phone Number (Digits only with country code)
  displayPhone: "+1 (555) 019-2834",
  email: "concierge@starshine-luxe.com",
  currency: "USD",
  freeShippingThreshold: 150
};

// Currency Rates relative to USD
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, format: "prefix" },
  EUR: { symbol: "€", rate: 0.92, format: "prefix" },
  GBP: { symbol: "£", rate: 0.79, format: "prefix" },
  INR: { symbol: "₹", rate: 83.5, format: "prefix" },
  AED: { symbol: " AED", rate: 3.67, format: "suffix" },
  CAD: { symbol: "C$", rate: 1.36, format: "prefix" }
};

// Global State
let allProducts = [];
let filteredProducts = [];
let currentCategory = "all";
let currentSearch = "";
let currentSort = "featured";

let cart = JSON.parse(localStorage.getItem("starshine_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("starshine_wishlist") || "[]");
let settings = JSON.parse(localStorage.getItem("starshine_settings") || JSON.stringify(DEFAULT_SETTINGS));
let appliedPromo = null; // { code: 'STAR10', discountPercent: 10 }

let activeModalProduct = null;
let selectedModalSize = null;
let selectedModalColor = null;

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  initSettings();
  initEventListeners();
  loadProducts();
  updateCartUI();
  updateWishlistUI();
});

// Load Settings into UI
function initSettings() {
  document.querySelectorAll(".dyn-store-name").forEach(el => el.textContent = settings.storeName);
  document.querySelectorAll(".dyn-phone").forEach(el => el.textContent = settings.displayPhone);
  
  const currencySelect = document.getElementById("currencySelect");
  if (currencySelect) {
    currencySelect.value = settings.currency || "USD";
  }

  // Update floating WhatsApp link
  updateWhatsAppLinks();
}

function updateWhatsAppLinks() {
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
  const defaultMsg = encodeURIComponent(`Hello ${settings.storeName} Concierge! I am browsing your collection and would like some styling advice & assistance.`);
  const waUrl = `https://wa.me/${cleanNumber}?text=${defaultMsg}`;

  const floatBtn = document.getElementById("floatingWhatsApp");
  if (floatBtn) floatBtn.href = waUrl;

  const topConcierge = document.getElementById("topConciergeLink");
  if (topConcierge) topConcierge.href = waUrl;
}

// Load Products Catalog
async function loadProducts() {
  try {
    const res = await fetch("/static/data/products.json");
    if (!res.ok) throw new Error("Could not load products.json");
    allProducts = await res.json();
  } catch (err) {
    console.warn("Using inline fallback product list:", err);
    allProducts = getFallbackProducts();
  }
  applyFiltersAndRender();
}

// Apply Filters & Search & Sort
function applyFiltersAndRender() {
  let result = [...allProducts];

  // Category filter
  if (currentCategory === "bestseller") {
    result = result.filter(p => p.isBestSeller);
  } else if (currentCategory === "featured") {
    result = result.filter(p => p.isFeatured);
  } else if (currentCategory !== "all") {
    result = result.filter(p => p.category === currentCategory);
  }

  // Search keyword filter
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase().trim();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.badge && p.badge.toLowerCase().includes(q))
    );
  }

  // Sort
  if (currentSort === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  filteredProducts = result;
  renderProductGrid(filteredProducts);
}

// Render Products Grid
function renderProductGrid(products) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty">
        <div class="catalog-empty-icon">✧</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 8px;">No Exquisite Items Found</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Try adjusting your search or category filter to discover our collections.</p>
        <button class="btn-gold" onclick="resetFilters()">View All Collections</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(product => {
    const isWish = wishlist.includes(product.id);
    const currPrice = formatPrice(product.price);
    const origPrice = product.originalPrice ? formatPrice(product.originalPrice) : "";
    
    const swatches = (product.colors || []).map(c => 
      `<span class="swatch-circle" style="background-color: ${c.hex};" title="${c.name}"></span>`
    ).join("");

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-media">
          ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ""}
          <button class="card-wishlist-btn ${isWish ? "active" : ""}" 
                  onclick="toggleWishlist('${product.id}', event)" 
                  title="${isWish ? "Remove from Wishlist" : "Add to Wishlist"}"
                  aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWish ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <img class="card-img-primary" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'" />
          <img class="card-img-secondary" src="${product.secondaryImage || product.image}" alt="${product.name}" loading="lazy" />
          
          <button class="quick-view-btn" onclick="openQuickView('${product.id}')">
            Quick View
          </button>
        </div>

        <div class="card-body">
          <span class="card-category">${product.categoryName || product.category}</span>
          <h3 class="card-title" onclick="openQuickView('${product.id}')">${product.name}</h3>

          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-score">${product.rating}</span>
            <span class="review-count">(${product.reviewsCount})</span>
          </div>

          <div class="card-swatches">
            ${swatches}
          </div>

          <div class="card-footer">
            <div class="price-box">
              <span class="price-current">${currPrice}</span>
              ${origPrice ? `<span class="price-original">${origPrice}</span>` : ""}
            </div>
            <button class="btn-add-card" onclick="quickAddToCart('${product.id}', event)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Add
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Currency Formatter
function formatPrice(usdPrice) {
  const curKey = settings.currency || "USD";
  const cur = CURRENCIES[curKey] || CURRENCIES.USD;
  const converted = Math.round(usdPrice * cur.rate);
  
  if (cur.format === "suffix") {
    return `${converted.toLocaleString()}${cur.symbol}`;
  }
  return `${cur.symbol}${converted.toLocaleString()}`;
}

// Convert USD to current currency value as a number
function convertPrice(usdPrice) {
  const curKey = settings.currency || "USD";
  const cur = CURRENCIES[curKey] || CURRENCIES.USD;
  return Math.round(usdPrice * cur.rate);
}

// Quick Add to Cart (Default 1st variant)
function quickAddToCart(productId, e) {
  if (e) e.stopPropagation();
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard";
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard";

  addToCartItem(product, defaultSize, defaultColor, 1);
  showToast(`Added "${product.name}" to your luxury shopping bag`);
}

// Add Item to Cart Array
function addToCartItem(product, size, color, quantity = 1) {
  const existingIndex = cart.findIndex(item => 
    item.id === product.id && item.size === size && item.color === color
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      size: size,
      color: color,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

// Save Cart
function saveCart() {
  localStorage.setItem("starshine_cart", JSON.stringify(cart));
}

// Update Cart Drawer UI
function updateCartUI() {
  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = totalCount;
    el.style.display = totalCount > 0 ? "flex" : "none";
  });

  const cartContainer = document.getElementById("cartItemsBody");
  const cartFooter = document.getElementById("cartFooter");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">✧</div>
        <h4 class="cart-empty-title">Your Bag is Empty</h4>
        <p class="cart-empty-desc">Explore our bespoke watches, apparel, and footwear to curate your collection.</p>
        <button class="btn-gold" onclick="closeCartDrawer(); scrollToCatalog();">Explore Pieces</button>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartFooter) cartFooter.style.display = "block";

  cartContainer.innerHTML = cart.map((item, index) => {
    const itemTotal = formatPrice(item.price * item.quantity);
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-variant">${item.size ? `Size: ${item.size}` : ""} ${item.color ? `• ${item.color}` : ""}</span>
          <span class="cart-item-price">${itemTotal}</span>
          
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="updateItemQty(${index}, -1)">−</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="updateItemQty(${index}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${index})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Calculate Subtotals
  const usdSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  let discountUsd = 0;
  if (appliedPromo) {
    discountUsd = Math.round(usdSubtotal * (appliedPromo.discountPercent / 100));
  }
  const grandTotalUsd = Math.max(0, usdSubtotal - discountUsd);

  // Update Summary DOM
  const subtotalEl = document.getElementById("cartSubtotalDisplay");
  const discountRow = document.getElementById("cartDiscountRow");
  const discountEl = document.getElementById("cartDiscountDisplay");
  const grandTotalEl = document.getElementById("cartGrandTotalDisplay");

  if (subtotalEl) subtotalEl.textContent = formatPrice(usdSubtotal);
  if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotalUsd);

  if (discountRow && discountEl) {
    if (appliedPromo) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${formatPrice(discountUsd)} (${appliedPromo.code})`;
    } else {
      discountRow.style.display = "none";
    }
  }
}

function updateItemQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast("Item removed from your bag");
}

// Promo Code Logic
function applyPromoCode() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const val = input.value.trim().toUpperCase();

  if (val === "STAR10" || val === "VIP10") {
    appliedPromo = { code: val, discountPercent: 10 };
    showToast("✨ VIP 10% Privé Discount Applied!");
    input.value = "";
    updateCartUI();
  } else if (val === "STAR20") {
    appliedPromo = { code: val, discountPercent: 20 };
    showToast("✨ Exclusive 20% Luxury Voucher Applied!");
    input.value = "";
    updateCartUI();
  } else {
    showToast("Invalid or expired code. Try 'STAR10'");
  }
}

// WhatsApp Order Generator
function sendOrderViaWhatsApp() {
  if (cart.length === 0) {
    showToast("Your shopping bag is empty");
    return;
  }

  const customerNote = document.getElementById("cartDeliveryNote") ? 
    document.getElementById("cartDeliveryNote").value.trim() : "";

  const usdSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  let discountUsd = 0;
  if (appliedPromo) {
    discountUsd = Math.round(usdSubtotal * (appliedPromo.discountPercent / 100));
  }
  const grandTotalUsd = Math.max(0, usdSubtotal - discountUsd);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");

  // Build the message
  let msg = `✨ *NEW ORDER - ${settings.storeName.toUpperCase()}* ✨\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛍️ *ORDERED LUXURY PIECES*:\n\n`;

  cart.forEach((item, idx) => {
    msg += `${idx + 1}. *${item.name}*\n`;
    msg += `   • Details: Size ${item.size || "Std"}, Color: ${item.color || "Std"}\n`;
    msg += `   • Qty: ${item.quantity} × ${formatPrice(item.price)} = *${formatPrice(item.price * item.quantity)}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💵 *Subtotal*: ${formatPrice(usdSubtotal)}\n`;
  if (appliedPromo) {
    msg += `🎟️ *Voucher (${appliedPromo.code})*: -${formatPrice(discountUsd)}\n`;
  }
  msg += `📦 *Express Delivery*: COMPLIMENTARY\n`;
  msg += `💎 *TOTAL ORDER AMOUNT*: *${formatPrice(grandTotalUsd)}*\n`;
  
  if (customerNote) {
    msg += `\n📍 *Customer City / Delivery Note*: ${customerNote}\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Please confirm availability and share payment / shipping instructions. Thank you!`;

  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

// Wishlist Functionality
function toggleWishlist(productId, e) {
  if (e) e.stopPropagation();
  const idx = wishlist.indexOf(productId);
  const product = allProducts.find(p => p.id === productId);
  const name = product ? product.name : "Item";

  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed "${name}" from your wishlist`);
  } else {
    wishlist.push(productId);
    showToast(`Saved "${name}" to your wishlist ❤️`);
  }

  localStorage.setItem("starshine_wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
  renderProductGrid(filteredProducts);
}

function updateWishlistUI() {
  document.querySelectorAll(".wishlist-count").forEach(el => {
    el.textContent = wishlist.length;
    el.style.display = wishlist.length > 0 ? "flex" : "none";
  });
}

function openWishlistModal() {
  if (wishlist.length === 0) {
    showToast("Your wishlist is empty. Tap the heart on any item!");
    return;
  }
  // Filter products by wishlist
  currentCategory = "all";
  currentSearch = "";
  const wishProducts = allProducts.filter(p => wishlist.includes(p.id));
  renderProductGrid(wishProducts);
  scrollToCatalog();
  showToast(`Displaying your ${wishlist.length} saved luxury pieces`);
}

// Quick View Modal
function openQuickView(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  activeModalProduct = product;
  selectedModalSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
  selectedModalColor = product.colors && product.colors.length > 0 ? product.colors[0].name : null;

  const modalOverlay = document.getElementById("quickViewModal");
  if (!modalOverlay) return;

  document.getElementById("modalMainImg").src = product.image;
  
  // Thumbnails
  const thumbContainer = document.getElementById("modalThumbnails");
  const images = [product.image];
  if (product.secondaryImage) images.push(product.secondaryImage);
  
  thumbContainer.innerHTML = images.map((img, i) => `
    <img class="thumb-img ${i === 0 ? "active" : ""}" src="${img}" alt="Thumbnail" onclick="swapModalImage('${img}', this)" />
  `).join("");

  document.getElementById("modalCategory").textContent = product.categoryName || product.category;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalPrice").textContent = formatPrice(product.price);
  
  const origEl = document.getElementById("modalOriginalPrice");
  if (origEl) {
    origEl.textContent = product.originalPrice ? formatPrice(product.originalPrice) : "";
  }

  document.getElementById("modalDescription").textContent = product.description;

  // Features list
  const featEl = document.getElementById("modalFeatures");
  if (featEl && product.features) {
    featEl.innerHTML = product.features.map(f => `
      <li class="feature-point">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${f}</span>
      </li>
    `).join("");
  }

  // Color Swatches
  const colorWrap = document.getElementById("modalColorOptions");
  if (colorWrap && product.colors) {
    colorWrap.innerHTML = product.colors.map((c, i) => `
      <div class="color-pill ${i === 0 ? "active" : ""}" onclick="selectModalColor('${c.name}', this)">
        <span class="swatch-circle" style="background-color: ${c.hex};"></span>
        <span>${c.name}</span>
      </div>
    `).join("");
  }

  // Size buttons
  const sizeWrap = document.getElementById("modalSizeOptions");
  if (sizeWrap && product.sizes) {
    sizeWrap.innerHTML = product.sizes.map((s, i) => `
      <button class="size-btn ${i === 0 ? "active" : ""}" onclick="selectModalSize('${s}', this)">
        ${s}
      </button>
    `).join("");
  }

  // Stock count
  const stockEl = document.getElementById("modalStockCount");
  if (stockEl) {
    stockEl.textContent = product.stockCount || 5;
  }

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function swapModalImage(src, el) {
  document.getElementById("modalMainImg").src = src;
  document.querySelectorAll(".thumb-img").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function selectModalColor(name, el) {
  selectedModalColor = name;
  document.querySelectorAll(".color-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
}

function selectModalSize(size, el) {
  selectedModalSize = size;
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

function closeQuickView() {
  const modal = document.getElementById("quickViewModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function addModalItemToCart() {
  if (!activeModalProduct) return;
  addToCartItem(activeModalProduct, selectedModalSize, selectedModalColor, 1);
  closeQuickView();
  showToast(`Added "${activeModalProduct.name}" to your luxury bag`);
}

function directWhatsAppFromModal() {
  if (!activeModalProduct) return;
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
  let msg = `Hello ${settings.storeName}! I am interested in purchasing:\n\n`;
  msg += `💎 *${activeModalProduct.name}*\n`;
  msg += `• Price: *${formatPrice(activeModalProduct.price)}*\n`;
  if (selectedModalSize) msg += `• Size: *${selectedModalSize}*\n`;
  if (selectedModalColor) msg += `• Color: *${selectedModalColor}*\n`;
  msg += `\nIs this available in stock? Please share payment & delivery instructions.`;

  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

// Drawer & Modal Controls
function openCartDrawer() {
  const drawer = document.getElementById("cartDrawerOverlay");
  if (drawer) drawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawerOverlay");
  if (drawer) drawer.classList.remove("open");
  document.body.style.overflow = "";
}

// Store Settings Modal (Uncle's configuration)
function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;

  document.getElementById("setWhatsappNumber").value = settings.whatsappNumber;
  document.getElementById("setDisplayPhone").value = settings.displayPhone;
  document.getElementById("setStoreName").value = settings.storeName;
  document.getElementById("setCurrency").value = settings.currency || "USD";

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function saveStoreSettings(e) {
  if (e) e.preventDefault();
  settings.whatsappNumber = document.getElementById("setWhatsappNumber").value.trim() || DEFAULT_SETTINGS.whatsappNumber;
  settings.displayPhone = document.getElementById("setDisplayPhone").value.trim() || DEFAULT_SETTINGS.displayPhone;
  settings.storeName = document.getElementById("setStoreName").value.trim() || DEFAULT_SETTINGS.storeName;
  settings.currency = document.getElementById("setCurrency").value;

  localStorage.setItem("starshine_settings", JSON.stringify(settings));
  initSettings();
  renderProductGrid(filteredProducts);
  updateCartUI();
  closeSettingsModal();
  showToast("Store configurations updated successfully ✨");
}

// Event Listeners
function initEventListeners() {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Category Filter Buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      applyFiltersAndRender();
    });
  });

  // Search Input
  const searchInput = document.getElementById("catalogSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById("catalogSort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Currency Dropdown in Top Bar
  const currencySelect = document.getElementById("currencySelect");
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      settings.currency = e.target.value;
      localStorage.setItem("starshine_settings", JSON.stringify(settings));
      renderProductGrid(filteredProducts);
      updateCartUI();
      if (activeModalProduct) openQuickView(activeModalProduct.id);
      showToast(`Currency updated to ${settings.currency}`);
    });
  }

  // Newsletter Form
  const newsForm = document.getElementById("newsletterForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value;
      if (email) {
        showToast("✨ Welcome to Starshine Privé! Use code STAR10 for 10% off.");
        document.getElementById("newsletterEmail").value = "";
      }
    });
  }

  // Header Scroll Effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}

function resetFilters() {
  currentCategory = "all";
  currentSearch = "";
  currentSort = "featured";
  const searchInput = document.getElementById("catalogSearch");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });
  applyFiltersAndRender();
}

function filterByCategory(cat) {
  currentCategory = cat;
  currentSearch = "";
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === cat);
  });
  applyFiltersAndRender();
  scrollToCatalog();
}

function scrollToCatalog() {
  const el = document.getElementById("catalogSection");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Notification Toast
function showToast(msg) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Fallback products data in case fetch fails
function getFallbackProducts() {
  return [
    {
      id: "watch-01",
      name: "Aethelgard Skeleton Automatic Gold",
      category: "watches",
      categoryName: "Horology & Watches",
      price: 420,
      originalPrice: 520,
      rating: 4.9,
      reviewsCount: 84,
      badge: "Exclusive",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
      description: "Exquisite open-work skeleton automatic movement encased in 316L stainless steel with 18k champagne gold accents.",
      colors: [{"name": "Champagne Gold", "hex": "#D4AF37"}],
      sizes: ["40mm", "42mm"]
    }
  ];
}

// ==========================================================================
// ADVANCED LUXURY SUITE: CURSOR SPOTLIGHT, CAPSULES, AUDIO, SEARCH & INVOICE
// ==========================================================================

// Audio Effects via Web Audio API (Luxury Mechanical Watch Tick)
let audioEnabled = true;
let audioCtx = null;

function playMechanicalTick() {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById("audioToggleIcon");
  if (icon) {
    icon.innerHTML = audioEnabled ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>`;
  }
  showToast(audioEnabled ? "✦ Sound Effects Enabled" : "✦ Sound Muted");
}

// Cursor Spotlight Tracking
document.addEventListener("mousemove", (e) => {
  const spotlight = document.querySelector(".cursor-spotlight");
  if (spotlight) {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  }
});

// Curated Capsule Looks (Complete The Ensemble)
const CAPSULES = [
  {
    id: "capsule-gala",
    title: "The Black-Tie Gala",
    subtitle: "Bespoke Evening Grandeur",
    badge: "15% Bundle Savings",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    description: "The quintessential formal statement pairing pure Italian wool, open-heart horology, and hand-burnished calfskin.",
    items: [
      { id: "watch-03", name: "Celestial Flying Tourbillon", price: 590 },
      { id: "clothes-01", name: "Venetian Tailored Wool Blazer", price: 360 },
      { id: "shoes-01", name: "Milano Handcrafted Oxford Shoes", price: 280 },
      { id: "acc-04", name: "Sterling Silver & Onyx Cufflinks", price: 85 }
    ],
    originalTotal: 1315,
    bundlePrice: 1117
  },
  {
    id: "capsule-riviera",
    title: "The Riviera Connoisseur",
    subtitle: "Effortless Mediterranean Luxury",
    badge: "Most Coveted",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=80",
    description: "Sun-drenched sophistication crafted with water-resistant suede loafers, ceramic chronograph, and 24K gold aviators.",
    items: [
      { id: "watch-02", name: "Monaco Chronograph Midnight", price: 350 },
      { id: "shoes-02", name: "Montecristo Tassel Suede Loafers", price: 230 },
      { id: "clothes-02", name: "Giza Silk-Cotton Evening Shirt", price: 145 },
      { id: "acc-02", name: "Aviation 24K Gold Aviators", price: 175 }
    ],
    originalTotal: 900,
    bundlePrice: 765
  },
  {
    id: "capsule-urban",
    title: "The Wall Street Minimalist",
    subtitle: "Contemporary Modern Poise",
    badge: "Editorial Choice",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
    description: "Sleek low-profile court sneakers, Mongolian pure cashmere knit, and ultra-thin black diamond horology.",
    items: [
      { id: "watch-04", name: "Astral Minimalist Black Diamond", price: 270 },
      { id: "shoes-03", name: "Aura Luxury Nappa Court Sneaker", price: 210 },
      { id: "clothes-04", name: "Mongolian Pure Cashmere Knit", price: 195 },
      { id: "acc-01", name: "Starshine 24K Monogram Belt", price: 120 }
    ],
    originalTotal: 795,
    bundlePrice: 675
  }
];

function addCapsuleToCart(capsuleId) {
  playMechanicalTick();
  const capsule = CAPSULES.find(c => c.id === capsuleId);
  if (!capsule) return;

  capsule.items.forEach(item => {
    const fullProd = allProducts.find(p => p.id === item.id);
    if (fullProd) {
      const defaultSize = fullProd.sizes ? fullProd.sizes[0] : "Standard";
      const defaultColor = fullProd.colors ? fullProd.colors[0].name : "Standard";
      addToCartItem(fullProd, defaultSize, defaultColor, 1);
    }
  });

  // Apply automatic 15% ensemble voucher
  appliedPromo = { code: "ENSEMBLE15", discountPercent: 15 };
  updateCartUI();
  showToast(`✨ "${capsule.title}" added to your bag with 15% VIP Ensemble Discount!`);
}

// Full Screen Luxury Search Overlay
function openSearchOverlay() {
  playMechanicalTick();
  const overlay = document.getElementById("searchOverlay");
  if (overlay) {
    overlay.classList.add("open");
    const input = document.getElementById("overlaySearchInput");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 100);
      renderOverlaySearchResults("");
    }
    document.body.style.overflow = "hidden";
  }
}

function closeSearchOverlay() {
  const overlay = document.getElementById("searchOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function searchTagClick(tag) {
  const input = document.getElementById("overlaySearchInput");
  if (input) {
    input.value = tag;
    renderOverlaySearchResults(tag);
  }
}

function renderOverlaySearchResults(query) {
  const grid = document.getElementById("searchOverlayResults");
  if (!grid) return;

  const q = (query || "").toLowerCase().trim();
  let results = allProducts;
  if (q !== "") {
    results = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  } else {
    results = allProducts.slice(0, 6); // Display top 6 featured by default
  }

  if (results.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: var(--text-secondary);">
        <p style="font-size: 1.1rem; font-family: var(--font-serif); margin-bottom: 8px;">No matching luxury pieces found for "${query}"</p>
        <span style="font-size: 0.85rem;">Try searching for "watch", "shoes", "blazer", or "gold".</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(p => `
    <div class="search-result-item" onclick="closeSearchOverlay(); openQuickView('${p.id}')">
      <img class="search-result-thumb" src="${p.image}" alt="${p.name}" />
      <div class="search-result-info">
        <span class="search-result-cat">${p.categoryName || p.category}</span>
        <h4 class="search-result-name">${p.name}</h4>
        <span class="search-result-price">${formatPrice(p.price)}</span>
      </div>
    </div>
  `).join("");
}

// Global Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // Press '/' or 'Cmd/Ctrl + K' to open search
  if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && 
      document.activeElement.tagName !== "INPUT" && 
      document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    openSearchOverlay();
  }
  // Escape to close modals
  if (e.key === "Escape") {
    closeSearchOverlay();
    closeQuickView();
    closeCartDrawer();
    closeSizeGuide();
    closeConciergeHub();
    closeInvoiceModal();
    closeSettingsModal();
  }
});

// Size & Fitting Guide Modal
function openSizeGuide(tab = 'shoes') {
  playMechanicalTick();
  const modal = document.getElementById("sizeGuideModal");
  if (modal) {
    modal.classList.add("open");
    switchSizeTab(tab);
    document.body.style.overflow = "hidden";
  }
}

function closeSizeGuide() {
  const modal = document.getElementById("sizeGuideModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function switchSizeTab(tabName) {
  document.querySelectorAll(".size-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  const content = document.getElementById("sizeGuideContent");
  if (!content) return;

  if (tabName === 'shoes') {
    content.innerHTML = `
      <h4 style="font-family: var(--font-serif); color: var(--gold-light); margin-bottom: 12px;">Footwear Size Conversion Guide</h4>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Our dress shoes and sneakers are crafted to true Italian & European sizing.</p>
      <table class="size-table">
        <thead>
          <tr><th>EU Size</th><th>US Men</th><th>UK</th><th>Foot Length (CM)</th></tr>
        </thead>
        <tbody>
          <tr><td>EU 39</td><td>6.5</td><td>6.0</td><td>24.8 cm</td></tr>
          <tr><td>EU 40</td><td>7.5</td><td>7.0</td><td>25.4 cm</td></tr>
          <tr><td>EU 41</td><td>8.0</td><td>7.5</td><td>26.0 cm</td></tr>
          <tr><td>EU 42</td><td>9.0</td><td>8.5</td><td>26.7 cm</td></tr>
          <tr><td>EU 43</td><td>10.0</td><td>9.5</td><td>27.3 cm</td></tr>
          <tr><td>EU 44</td><td>11.0</td><td>10.5</td><td>28.0 cm</td></tr>
          <tr><td>EU 45</td><td>12.0</td><td>11.5</td><td>28.7 cm</td></tr>
        </tbody>
      </table>
    `;
  } else if (tabName === 'watches') {
    content.innerHTML = `
      <h4 style="font-family: var(--font-serif); color: var(--gold-light); margin-bottom: 12px;">Horology Case Diameter Advisor</h4>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Choosing the right timepiece proportion for your wrist circumference.</p>
      <table class="size-table">
        <thead>
          <tr><th>Wrist Circumference</th><th>Recommended Diameter</th><th>Case Profile</th></tr>
        </thead>
        <tbody>
          <tr><td>Under 6.5 inches (&lt; 16.5 cm)</td><td>38mm – 40mm</td><td>Slim / Dress Classic</td></tr>
          <tr><td>6.5 to 7.2 inches (16.5 – 18.5 cm)</td><td>40mm – 42mm</td><td>Universal Standard</td></tr>
          <tr><td>7.2 inches & above (&gt; 18.5 cm)</td><td>42mm – 44mm</td><td>Commanding Presence</td></tr>
        </tbody>
      </table>
    `;
  } else if (tabName === 'suits') {
    content.innerHTML = `
      <h4 style="font-family: var(--font-serif); color: var(--gold-light); margin-bottom: 12px;">Tailored Apparel & Suiting Fit</h4>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">Italian Drop-7 tailored blazers and trench coats.</p>
      <table class="size-table">
        <thead>
          <tr><th>Suit Size</th><th>Chest (Inches)</th><th>Waist (Inches)</th><th>Fit Profile</th></tr>
        </thead>
        <tbody>
          <tr><td>38R (Small)</td><td>37 - 38"</td><td>30 - 32"</td><td>Slim Sculpted</td></tr>
          <tr><td>40R (Medium)</td><td>39 - 40"</td><td>32 - 34"</td><td>Athletic Regular</td></tr>
          <tr><td>42R (Large)</td><td>41 - 42"</td><td>34 - 36"</td><td>Contemporary Fit</td></tr>
          <tr><td>44R (XL)</td><td>43 - 44"</td><td>36 - 38"</td><td>Tailored Comfort</td></tr>
          <tr><td>46R (XXL)</td><td>45 - 46"</td><td>38 - 40"</td><td>Generous Elegance</td></tr>
        </tbody>
      </table>
    `;
  }
}

// VIP Concierge Interactive Hub (WhatsApp Smart Launcher)
function openConciergeHub() {
  playMechanicalTick();
  const modal = document.getElementById("conciergeHubModal");
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeConciergeHub() {
  const modal = document.getElementById("conciergeHubModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function launchConciergeTopic(topicKey) {
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
  let text = "";

  if (topicKey === "stock") {
    text = `Hello ${settings.storeName} Concierge! I'd like to check live in-store stock availability for a specific size and piece. Could you assist me?`;
  } else if (topicKey === "sizing") {
    text = `Hello! I would appreciate personalized sizing advice for footwear/suiting at ${settings.storeName}.`;
  } else if (topicKey === "gift") {
    text = `Hello! I plan on gifting a piece from ${settings.storeName}. Could you provide details regarding your luxury gift packaging and custom handwritten wax-sealed notes?`;
  } else if (topicKey === "bespoke") {
    text = `Hello! I am seeking a bespoke/rare timepiece or apparel item not listed on the website. Can your master curators source this?`;
  }

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
  closeConciergeHub();
}

// Printable Luxury Invoice
function openInvoiceModal() {
  if (cart.length === 0) {
    showToast("Your shopping bag is empty");
    return;
  }
  playMechanicalTick();

  const modal = document.getElementById("invoiceModal");
  const body = document.getElementById("invoiceModalBody");
  if (!modal || !body) return;

  const invoiceNumber = "STR-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const usdSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  let discountUsd = 0;
  if (appliedPromo) {
    discountUsd = Math.round(usdSubtotal * (appliedPromo.discountPercent / 100));
  }
  const grandTotalUsd = Math.max(0, usdSubtotal - discountUsd);

  body.innerHTML = `
    <div class="invoice-card" id="printableInvoiceCard">
      <div class="invoice-header">
        <div>
          <div style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--gold-light); letter-spacing: 0.15em;">
            ${settings.storeName}
          </div>
          <div style="font-size: 0.75rem; letter-spacing: 0.25em; color: var(--text-secondary); text-transform: uppercase;">
            HAUTE COLLECTION • PRIVATE ATELIER
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">
            Phone / WhatsApp: ${settings.displayPhone}
          </div>
        </div>

        <div style="text-align: right;">
          <div class="invoice-stamp">VERIFIED ORDER</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 8px;">
            Invoice #: <strong>${invoiceNumber}</strong><br />
            Date: ${dateStr}
          </div>
        </div>
      </div>

      <table class="invoice-items-table">
        <thead>
          <tr>
            <th>Item & Specifications</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr>
              <td>
                <strong style="color: #fff;">${item.name}</strong><br />
                <span style="font-size: 0.74rem; color: var(--gold-primary);">Size: ${item.size || "Standard"} • Color: ${item.color || "Standard"}</span>
              </td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">${formatPrice(item.price)}</td>
              <td style="text-align: right; color: var(--gold-light); font-weight: 700;">${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="margin-left: auto; max-width: 320px; border-top: 1px solid var(--border-gold-subtle); padding-top: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 6px;">
          <span>Subtotal:</span>
          <span>${formatPrice(usdSubtotal)}</span>
        </div>
        ${appliedPromo ? `
          <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #4ade80; margin-bottom: 6px;">
            <span>VIP Discount (${appliedPromo.code}):</span>
            <span>-${formatPrice(discountUsd)}</span>
          </div>
        ` : ""}
        <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: var(--gold-primary); margin-bottom: 6px;">
          <span>Express Global Courier:</span>
          <span>COMPLIMENTARY</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-family: var(--font-serif); font-size: 1.3rem; color: var(--gold-light); font-weight: 700; border-top: 1px solid var(--border-subtle); padding-top: 10px; margin-top: 6px;">
          <span>Total Order:</span>
          <span>${formatPrice(grandTotalUsd)}</span>
        </div>
      </div>

      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed var(--border-subtle); font-size: 0.74rem; color: var(--text-muted); text-align: center;">
        ✦ Official Starshine Certificate of Authenticity & Hand-Inspection Guaranteed ✦
      </div>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn-whatsapp-order" style="width: auto; padding: 12px 24px;" onclick="printInvoice()">
        🖨️ Print / Save PDF Invoice
      </button>
      <button class="btn-whatsapp-outline" onclick="closeInvoiceModal()">
        Close
      </button>
    </div>
  `;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function printInvoice() {
  window.print();
}

function closeInvoiceModal() {
  const modal = document.getElementById("invoiceModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}


// ==========================================================================
// 3D ATELIER SHOWROOM ACTIONS
// ==========================================================================
function order3DWatchWhatsApp() {
  if (typeof playMechanicalTick === 'function') playMechanicalTick();
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
  const finishBtn = document.querySelector('.btn-3d-finish.active');
  const finishName = finishBtn ? finishBtn.getAttribute('title') : '18K Champagne Gold';
  
  let msg = `✨ *BESPOKE 3D CONFIGURATION ORDER - ${settings.storeName.toUpperCase()}* ✨\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💎 *Configured Piece*: Aethelgard Celestial Flying Tourbillon (42mm)\n`;
  msg += `🎨 *Custom 3D Finish*: *${finishName}*\n`;
  msg += `⚙️ *Caliber*: STR-09 Skeleton with Exposed Oscillating Tourbillon\n`;
  msg += `💵 *Price*: ${formatPrice(590)} (Includes Complimentary Express Delivery)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `I inspected this piece in your live 3D Atelier. Please confirm availability and reserve this piece. Thank you!`;

  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
}

function add3DWatchToBag() {
  const watch = allProducts.find(p => p.id === 'watch-03') || {
    id: "watch-03",
    name: "Celestial Heritage Flying Tourbillon",
    price: 590,
    category: "watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  };
  const finishBtn = document.querySelector('.btn-3d-finish.active');
  const finishName = finishBtn ? finishBtn.getAttribute('title') : '18K Champagne Gold';

  addToCartItem(watch, "42mm", finishName, 1);
  if (typeof playMechanicalTick === 'function') playMechanicalTick();
  showToast(`Added Bespoke Tourbillon (${finishName}) to your shopping bag!`);
}

// Re-run 3D card tilt after catalog filtering
const origApplyFiltersAndRender = applyFiltersAndRender;
applyFiltersAndRender = function() {
  origApplyFiltersAndRender();
  if (window.reinitCard3DTilt) {
    setTimeout(window.reinitCard3DTilt, 50);
  }
};
