with open('/data/data/com.termux/files/home/MANISOFT/projects/starshine/static/css/style.css', 'a') as f:
    f.write('''
/* ==========================================================================
   ADVANCED LUXURY ENHANCEMENTS: CURSOR SPOTLIGHT, ENSEMBLES & MARQUEE
   ========================================================================== */

/* Cursor Spotlight */
.cursor-spotlight {
  position: fixed;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  transition: opacity 0.3s ease;
  opacity: 0;
}

body:hover .cursor-spotlight {
  opacity: 1;
}

/* Infinite Marquee Ticker */
.marquee-ribbon {
  background: #0d0f15;
  border-top: 1px solid var(--border-gold-subtle);
  border-bottom: 1px solid var(--border-gold-subtle);
  overflow: hidden;
  padding: 14px 0;
  white-space: nowrap;
  position: relative;
}

.marquee-track {
  display: inline-flex;
  gap: 40px;
  animation: marquee-scroll 28s linear infinite;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-serif);
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-light);
}

.marquee-item .gold-star {
  color: var(--gold-primary);
  font-size: 0.9rem;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ==========================================================================
   CURATED CAPSULE LOOKS / COMPLETE THE ENSEMBLE
   ========================================================================== */
.capsules-section {
  padding: 100px 0;
  background: linear-gradient(180deg, var(--bg-main) 0%, #0d0f16 50%, var(--bg-main) 100%);
  position: relative;
}

.capsules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.capsule-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition-normal);
  position: relative;
}

.capsule-card:hover {
  border-color: var(--border-gold-bright);
  transform: translateY(-8px);
  box-shadow: var(--shadow-card-hover);
}

.capsule-header-banner {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.capsule-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.capsule-card:hover .capsule-banner-img {
  transform: scale(1.08);
}

.capsule-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--gold-gradient);
  color: #000;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 3px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.6);
}

.capsule-body {
  padding: 26px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.capsule-subtitle {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-primary);
  margin-bottom: 6px;
}

.capsule-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

.capsule-desc {
  font-size: 0.86rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Capsule Included Items */
.capsule-items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 0;
}

.capsule-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}

.capsule-item-name {
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.capsule-item-name svg {
  color: var(--gold-primary);
}

.capsule-item-price {
  color: var(--gold-light);
  font-family: var(--font-serif);
  font-weight: 600;
}

.capsule-pricing-box {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}

.capsule-total-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.capsule-prices {
  text-align: right;
}

.capsule-bundle-price {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--gold-light);
}

.capsule-regular-price {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: line-through;
  margin-right: 8px;
}

.btn-add-capsule {
  width: 100%;
  background: var(--gold-gradient);
  color: #000;
  border: none;
  padding: 14px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: var(--transition-fast);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-add-capsule:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.45);
}

/* ==========================================================================
   FULL SCREEN LUXURY SEARCH OVERLAY
   ========================================================================== */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 10, 13, 0.95);
  backdrop-filter: blur(25px);
  z-index: 300;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
}

.search-overlay.open {
  opacity: 1;
  visibility: visible;
}

.search-overlay-container {
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
}

.search-overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.search-overlay-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: var(--gold-light);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.search-overlay-input-wrap {
  position: relative;
  margin-bottom: 30px;
}

.search-overlay-input {
  width: 100%;
  background: rgba(21, 24, 33, 0.8);
  border: 1px solid var(--border-gold-subtle);
  border-radius: 8px;
  padding: 18px 24px 18px 56px;
  color: #fff;
  font-size: 1.25rem;
  outline: none;
  font-family: var(--font-sans);
  transition: var(--transition-fast);
}

.search-overlay-input:focus {
  border-color: var(--gold-primary);
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.3);
}

.search-overlay-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold-primary);
}

.search-tags-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.search-tag-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.search-tag {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.8rem;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-tag:hover {
  border-color: var(--gold-primary);
  color: var(--gold-light);
  background: rgba(212, 175, 55, 0.1);
}

.search-results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 8px;
}

.search-result-item {
  display: flex;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-result-item:hover {
  border-color: var(--gold-primary);
  transform: translateY(-2px);
}

.search-result-thumb {
  width: 60px;
  height: 72px;
  object-fit: cover;
  border-radius: 4px;
}

.search-result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-result-name {
  font-size: 0.86rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  line-height: 1.3;
}

.search-result-cat {
  font-size: 0.7rem;
  color: var(--gold-primary);
  text-transform: uppercase;
}

.search-result-price {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gold-light);
  margin-top: 4px;
}

/* ==========================================================================
   INTERACTIVE SIZE & FIT GUIDE MODAL
   ========================================================================== */
.size-guide-modal {
  max-width: 760px;
}

.size-guide-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 24px;
  padding-bottom: 12px;
}

.size-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: var(--transition-fast);
}

.size-tab-btn.active, .size-tab-btn:hover {
  color: #000;
  background: var(--gold-gradient);
}

.size-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  margin-bottom: 24px;
}

.size-table th {
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-light);
  padding: 12px;
  text-align: left;
  font-family: var(--font-serif);
  border: 1px solid var(--border-subtle);
}

.size-table td {
  padding: 12px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.size-table tr:hover td {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
}

/* ==========================================================================
   VIP CONCIERGE CHAT & INQUIRY MODAL
   ========================================================================== */
.concierge-hub-modal {
  max-width: 580px;
}

.concierge-options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.concierge-option-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.concierge-option-card:hover {
  border-color: var(--whatsapp-green);
  background: rgba(37, 211, 102, 0.06);
  transform: translateX(4px);
}

.concierge-opt-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.concierge-opt-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}

.concierge-opt-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

/* ==========================================================================
   PRINTABLE LUXURY INVOICE MODAL
   ========================================================================== */
.invoice-card {
  background: #0d0f15;
  border: 1px solid var(--border-gold-bright);
  border-radius: 8px;
  padding: 36px;
  color: #fff;
  position: relative;
  margin-bottom: 20px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-gold-subtle);
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.invoice-items-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 0.85rem;
}

.invoice-items-table th {
  border-bottom: 1px solid var(--border-gold-subtle);
  padding: 8px;
  text-align: left;
  color: var(--gold-light);
}

.invoice-items-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.invoice-stamp {
  display: inline-block;
  border: 2px solid var(--gold-primary);
  color: var(--gold-light);
  padding: 6px 14px;
  font-family: var(--font-serif);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 4px;
  transform: rotate(-5deg);
  opacity: 0.85;
}

/* ==========================================================================
   LOOKBOOK CLIENT EDITORIAL GALLERY
   ========================================================================== */
.lookbook-gallery-section {
  padding: 90px 0;
}

.lookbook-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.lookbook-item {
  position: relative;
  height: 340px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}

.lookbook-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.lookbook-item:hover .lookbook-img {
  transform: scale(1.08);
}

.lookbook-hover-tag {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 11, 14, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0;
  transition: var(--transition-fast);
}

.lookbook-item:hover .lookbook-hover-tag {
  opacity: 1;
}

.lookbook-tag-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.lookbook-tag-sub {
  font-size: 0.72rem;
  color: var(--gold-light);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 992px) {
  .capsules-grid {
    grid-template-columns: 1fr;
  }
  .lookbook-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .lookbook-grid {
    grid-template-columns: 1fr;
  }
  .search-results-grid {
    grid-template-columns: 1fr;
  }
}
''')
print('Appended advanced luxury CSS styles successfully!')
