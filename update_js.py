with open('/data/data/com.termux/files/home/MANISOFT/projects/starshine/static/js/app.js', 'a') as f:
    f.write('''
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
''')
print('Appended advanced luxury JS features successfully!')
