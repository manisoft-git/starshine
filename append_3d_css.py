with open('/data/data/com.termux/files/home/MANISOFT/projects/starshine/static/css/style.css', 'a') as f:
    f.write('''
/* ==========================================================================
   LUSION-CALIBER 3D WEBGL ENGINE & SHOWROOM STYLES
   ========================================================================== */

/* Full Viewport 3D Canvas */
#webgl-bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.9;
}

/* Ensure foreground content has relative z-index above canvas */
.site-header, .hero-section, .category-grid, .catalog-section, 
.capsules-section, .lookbook-gallery-section, .brand-story-section, 
.value-props-section, .testimonials-section, .newsletter-section, .site-footer {
  position: relative;
  z-index: 2;
}

/* 3D Atelier Showroom Section */
.stage-3d-section {
  padding: 80px 0 100px;
  position: relative;
  z-index: 2;
  background: radial-gradient(circle at 50% 50%, rgba(18, 21, 30, 0.9) 0%, var(--bg-main) 75%);
  border-top: 1px solid var(--border-gold-subtle);
  border-bottom: 1px solid var(--border-gold-subtle);
  overflow: hidden;
}

.stage-3d-layout {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 50px;
  align-items: center;
}

/* 3D Canvas Container */
.stage-3d-viewport-wrapper {
  position: relative;
  width: 100%;
  height: 580px;
  background: radial-gradient(circle at 50% 50%, #151822 0%, #090a0d 80%);
  border: 1px solid var(--border-gold-bright);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.2);
}

#interactive-3d-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}

#interactive-3d-canvas:active {
  cursor: grabbing;
}

/* 3D Interactive Controls Overlay */
.stage-3d-badge-top {
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(10, 11, 15, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-gold-subtle);
  padding: 8px 16px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold-light);
  font-weight: 700;
  pointer-events: none;
}

.stage-3d-hint-bottom {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 11, 15, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 7px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--text-secondary);
  pointer-events: none;
  white-space: nowrap;
}

/* Material Switcher Floating Bar */
.stage-3d-finishes-bar {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(10, 11, 15, 0.85);
  backdrop-filter: blur(12px);
  padding: 14px 10px;
  border-radius: 30px;
  border: 1px solid var(--border-subtle);
}

.btn-3d-finish {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  transition: var(--transition-fast);
  padding: 0;
}

.btn-3d-finish:hover, .btn-3d-finish.active {
  transform: scale(1.18);
  border-color: #ffffff;
  box-shadow: 0 0 14px rgba(212, 175, 55, 0.6);
}

/* 3D Action Tools Dock (Explode, Wireframe, Reset) */
.stage-3d-dock {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.btn-3d-dock {
  background: var(--bg-card);
  border: 1px solid var(--border-gold-subtle);
  color: var(--gold-light);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-fast);
}

.btn-3d-dock:hover, .btn-3d-dock.active {
  background: var(--gold-gradient);
  color: #000;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
}

/* 3D Details Content Area */
.stage-3d-details {
  display: flex;
  flex-direction: column;
}

.stage-3d-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 14px;
  color: #fff;
}

.stage-3d-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
}

.stage-3d-specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 30px;
}

.spec-box {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 14px 16px;
}

.spec-box-label {
  font-size: 0.72rem;
  color: var(--gold-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.spec-box-val {
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
}

/* Audio Visualizer Canvas in Header */
#audioCanvas {
  width: 24px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
}

/* Responsive 3D Stage */
@media (max-width: 992px) {
  .stage-3d-layout {
    grid-template-columns: 1fr;
  }
  .stage-3d-viewport-wrapper {
    height: 440px;
  }
}
''')
print('Appended 3D WebGL CSS styles successfully!')
