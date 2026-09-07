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
