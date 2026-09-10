#!/usr/bin/env python3
"""
Starshine Steez — Haute Horology, Footwear & Designer Apparel
In-Depth Presentation Video Generator
720p 16:9, obsidian/champagne-gold luxury slides, neural voiceover, ambient music.
"""

import os, subprocess
from PIL import Image, ImageDraw, ImageFont

BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR  = os.path.join(BASE_DIR, "static")
TEMP_DIR    = "/tmp/starshine_video_build"
FINAL_VIDEO = os.path.join(OUTPUT_DIR, "starshine_presentation.mp4")

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

WIDTH, HEIGHT, FPS = 1280, 720, 25

BG_DEEP  = (9, 10, 13)
BG_CARD  = (21, 24, 33)
ACCENT1  = (212, 175, 55)    # champagne gold
ACCENT2  = (240, 220, 120)   # bright gold
ACCENT3  = (180, 140, 30)    # dark gold
TEXT_HI  = (255, 252, 235)
TEXT_MID = (200, 185, 140)
GRID_COL = (35, 32, 20)

def lf(path, size):
    try:    return ImageFont.truetype(path, size)
    except: return ImageFont.load_default()

def grid(draw):
    for x in range(0, WIDTH, 60):
        draw.line([(x,0),(x,HEIGHT)], fill=(*GRID_COL,15))
    for y in range(0, HEIGHT, 60):
        draw.line([(0,y),(WIDTH,y)], fill=(*GRID_COL,15))

def glow(draw, x1, y1, x2, y2, col):
    for i in range(5, 0, -1):
        draw.rectangle([x1-i,y1-i,x2+i,y2+i], outline=(*col[:3], int(40*i/5)))
    draw.rectangle([x1,y1,x2,y2], outline=(*col[:3],200), width=2)

def badge(draw, x, y, label, col, font):
    tw = int(draw.textlength(label, font=font))
    p  = 10
    draw.rounded_rectangle([x,y,x+tw+p*2,y+28], radius=6,
                            fill=(*col[:3],35), outline=(*col[:3],180), width=1)
    draw.text((x+p, y+4), label, font=font, fill=col)
    return tw+p*2+8

SCENES = [
    {
        "title": "STARSHINE STEEZ",
        "subtitle": "Haute Horology, Footwear & Designer Apparel",
        "body": [
            "A luxury e-commerce platform for high-end retail",
            "Dark Obsidian & Champagne Gold editorial aesthetic",
            "Four signature departments: Watches, Shoes, Clothing, Accessories",
            "High-converting 1-Click WhatsApp Direct Ordering System",
            "Glassmorphism product cards with interactive quick-view modals",
        ],
        "tags": ["Flask", "Python", "E-Commerce", "WhatsApp API", "Luxury"],
        "voiceover": (
            "Starshine Steez. Haute horology, footwear, and designer apparel. "
            "A luxury e-commerce platform engineered for high-end retail, "
            "featuring four signature departments: watches, shoes, clothing, and accessories. "
            "The design language is Deep Obsidian with Champagne Gold metallic gradients — "
            "editorial, elegant, and unmistakably premium. "
            "At its core is a one-click WhatsApp ordering system that converts browsers into buyers "
            "with zero friction."
        ),
    },
    {
        "title": "THE 4 DEPARTMENTS",
        "subtitle": "A Curated World of Luxury",
        "body": [
            "⌚ HOROLOGY    — Skeleton automatics, Swiss chronographs, Tourbillons",
            "👞 FOOTWEAR    — Calfskin Oxfords, Suede loafers, Nappa court sneakers",
            "👔 APPAREL     — Super 130s wool blazers, Egyptian silk shirts, Cashmere",
            "🕶  ACCESSORIES — 24K belts, Titanium aviators, Sterling silver cufflinks",
        ],
        "tags": ["Watches", "Footwear", "Apparel", "Accessories", "Luxury Goods"],
        "voiceover": (
            "Starshine Steez houses four curated luxury departments. "
            "The Horology department features skeleton automatic watches, Swiss chronographs, and celestial tourbillons. "
            "Footwear includes handcrafted calfskin Oxfords, suede tassel loafers, and Nappa court sneakers. "
            "The Apparel department carries Super one-thirty-s virgin wool blazers, Egyptian silk dress shirts, "
            "and Mongolian cashmere knitwear. "
            "And Fine Accessories offers twenty-four-carat monogram belts, aerospace titanium aviators, "
            "and sterling silver cufflinks. "
            "Every piece is presented with the precision of a luxury editorial."
        ),
    },
    {
        "title": "WHATSAPP 1-CLICK ORDERING",
        "subtitle": "The Frictionless High-Conversion Checkout",
        "body": [
            "Customer selects products, sizes, colours, and quantities",
            "Slide-over shopping bag with real-time quantity adjustments",
            "Coupon voucher engine: STAR10 (10% off), STAR20 (20% off)",
            "One tap sends a pre-formatted order directly to WhatsApp",
            "Order includes itemised list, subtotal, discount, and total",
        ],
        "tags": ["WhatsApp API", "1-Click Checkout", "Voucher Engine", "Slide-Over Bag", "Conversion"],
        "voiceover": (
            "The WhatsApp one-click ordering system is the conversion engine of Starshine Steez. "
            "Customers add products to their slide-over shopping bag, selecting custom sizes, colours, and quantities. "
            "A coupon voucher engine accepts STAR10 for ten percent off and STAR20 for twenty percent off. "
            "When ready, one tap on Complete Order On WhatsApp generates a perfectly formatted order message "
            "sent directly to the store owner's WhatsApp — "
            "with an itemised list, subtotal, discount applied, and grand total. "
            "No payment gateway complexity. No cart abandonment. Pure conversion."
        ),
    },
    {
        "title": "PRODUCT QUICK VIEW",
        "subtitle": "Luxury Product Exploration Experience",
        "body": [
            "Multi-angle thumbnail gallery — inspect every angle",
            "Real-time colour swatches with active ring indicator",
            "Size selector: EU 39–45, S–XXL, 39mm–43mm",
            "Private reserve stock countdown (e.g. 'Only 4 remaining')",
            "Instant WhatsApp Inquiry button per product",
        ],
        "tags": ["Quick View", "Gallery", "Colour Swatches", "Size Selector", "FOMO Engine"],
        "voiceover": (
            "Every product on Starshine Steez features a luxury Quick View modal. "
            "A multi-angle thumbnail gallery lets customers inspect the product from every direction. "
            "Real-time colour swatches with an active ring indicator show the selected option clearly. "
            "Size selectors cover European shoe sizes, apparel sizes, and watch case diameters. "
            "A private reserve stock countdown — for example, only four pieces remaining — "
            "creates urgency without feeling cheap. "
            "And an Instant WhatsApp Inquiry button lets customers ask questions about any specific piece "
            "with one tap."
        ),
    },
    {
        "title": "DESIGN LANGUAGE",
        "subtitle": "Dark Obsidian & Champagne Gold — Editorial Luxury",
        "body": [
            "Primary: Deep Obsidian (#090A0D) + Rich Charcoal (#151821)",
            "Accent: Champagne Gold metallic gradients (#D4AF37)",
            "Typography: Cinzel (Roman serif) + Plus Jakarta Sans",
            "Ambient gold radial backlights on hero sections",
            "Card hover lift effects with gold border animation",
        ],
        "tags": ["Design System", "Glassmorphism", "Gold Gradient", "Cinzel", "Dark Theme"],
        "voiceover": (
            "The Starshine Steez design language is uncompromising. "
            "Deep Obsidian backgrounds at nine, ten, thirteen — and Rich Charcoal cards at twenty-one, twenty-four, thirty-three. "
            "Champagne Gold metallic gradients at D-four, A-F, three-seven bring warmth and prestige. "
            "Typography pairs Cinzel — a majestic Roman serif — with Plus Jakarta Sans for digital legibility. "
            "Ambient gold radial backlights illuminate hero sections. "
            "Card hover animations lift each product with a gold border glow. "
            "This is not just a website. It is a luxury experience."
        ),
    },
    {
        "title": "ARCHITECTURE & DEPLOYMENT",
        "subtitle": "Flask + Python — Fast, Portable, Production-Ready",
        "body": [
            "Backend: Python Flask serving product catalogue and orders",
            "Frontend: Vanilla JS + CSS — no heavy frameworks, fast load",
            "Deployed on Render.com — live and accessible worldwide",
            "Mobile-first responsive design — perfect on any screen size",
            "WhatsApp integration via wa.me deep link — zero backend needed",
        ],
        "tags": ["Flask", "Render", "Mobile-First", "Responsive", "WhatsApp Deep Link"],
        "voiceover": (
            "Starshine Steez is built on Python Flask with a vanilla JavaScript and CSS frontend — "
            "no heavy frameworks, meaning it loads instantly on any device. "
            "It is deployed on Render dot com and live worldwide. "
            "The design is mobile-first and fully responsive — perfect whether viewed on a phone, tablet, or desktop. "
            "WhatsApp integration uses a deep link system, meaning no backend payment processing is required "
            "for the ordering flow. "
            "Starshine Steez is a production-grade luxury retail platform "
            "built to operate and scale immediately."
        ),
    },
]

def render_scene(scene, idx):
    img  = Image.new("RGB", (WIDTH, HEIGHT), BG_DEEP)
    draw = ImageDraw.Draw(img, "RGBA")
    grid(draw)

    # Radial gold glow at top-right
    for r in range(200, 0, -10):
        alpha = int(6 * (1 - r/200))
        draw.ellipse([WIDTH-r-100, -r, WIDTH+r-100, r], fill=(*ACCENT1[:3], alpha))

    fn_sm = lf(FONT_MONO, 13)
    draw.text((40, 22), f"SCENE {idx+1:02d}/{len(SCENES):02d}  //  STARSHINE STEEZ",
              font=fn_sm, fill=(*ACCENT1[:3], 160))
    draw.rectangle([40,44,WIDTH-40,46], fill=ACCENT1)
    draw.rectangle([40,47,WIDTH//2,48], fill=(*ACCENT3[:3],140))

    ft = lf(FONT_BOLD, 46)
    draw.text((40, 62), scene["title"], font=ft, fill=TEXT_HI)
    fs = lf(FONT_REG, 20)
    draw.text((40, 118), scene["subtitle"], font=fs, fill=ACCENT2)

    cy, ch = 155, 340
    draw.rounded_rectangle([30,cy,WIDTH-30,cy+ch], radius=12, fill=(*BG_CARD,220))
    glow(draw, 30, cy, WIDTH-30, cy+ch, ACCENT1)

    fb = lf(FONT_REG, 19)
    for i, line in enumerate(scene["body"]):
        y = cy + 22 + i*52
        draw.ellipse([50,y+7,60,y+17], fill=ACCENT2)
        draw.text((72, y), line, font=fb, fill=TEXT_MID)
        draw.line([(72,y+32),(WIDTH-50,y+32)], fill=(*GRID_COL,60))

    tag_y = cy+ch+22
    fm = lf(FONT_MONO, 14)
    xc = 40
    for tag in scene["tags"]:
        xc += badge(draw, xc, tag_y, tag, ACCENT1, fm)

    draw.rectangle([40, HEIGHT-44, WIDTH-40, HEIGHT-42], fill=(*ACCENT1[:3],60))
    draw.text((40, HEIGHT-36), "STARSHINE STEEZ  //  HAUTE HOROLOGY, FOOTWEAR & DESIGNER APPAREL",
              font=fn_sm, fill=(*ACCENT1[:3],100))

    fd = os.path.join(TEMP_DIR, f"s{idx:02d}"); os.makedirs(fd, exist_ok=True)
    p  = os.path.join(fd, "frame.png"); img.save(p); return p

def synth(text, out):
    try:
        r = subprocess.run(["edge-tts","--voice","en-US-ChristopherNeural","--rate","+5%",
                            "--text",text,"--write-media",out],capture_output=True,timeout=120)
        if r.returncode==0 and os.path.exists(out): return True
    except: pass
    try: subprocess.run(["gtts-cli","--lang","en",text,"--output",out],capture_output=True,timeout=90)
    except: pass
    return os.path.exists(out)

def dur(path):
    r = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                        "-of","default=noprint_wrappers=1:nokey=1",path],capture_output=True,text=True)
    try: return float(r.stdout.strip())
    except: return 8.0

def make_clip(idx, frame, audio):
    out = os.path.join(TEMP_DIR, f"clip_{idx:02d}.mp4")
    d   = dur(audio)+1.2
    subprocess.run([
        "ffmpeg","-y","-loop","1","-i",frame,"-i",audio,
        "-vf",f"scale={WIDTH}:{HEIGHT},zoompan=z='min(zoom+0.0008,1.04)':d={int(d*FPS)}:s={WIDTH}x{HEIGHT}:fps={FPS}",
        "-c:v","libx264","-preset","fast","-crf","22",
        "-c:a","aac","-b:a","128k","-t",str(d),"-pix_fmt","yuv420p",out
    ], capture_output=True)
    return out

def ambient(duration, out):
    # Use simple sine wave (aevalsrc 'mod' unsupported on this build)
    subprocess.run([
        "ffmpeg","-y","-f","lavfi",
        "-i", f"sine=frequency=40:sample_rate=44100:duration={duration}",
        "-af","volume=0.06,aecho=0.6:0.6:100:0.3,lowpass=f=600",out
    ], capture_output=True)

def main():
    print("="*60)
    print(" STARSHINE STEEZ — VIDEO PRESENTATION GENERATOR")
    print("="*60)
    clips = []
    for i, scene in enumerate(SCENES):
        print(f"\n📹 Scene {i+1}/{len(SCENES)}: {scene['title']}")
        frame = render_scene(scene, i)
        ao    = os.path.join(TEMP_DIR, f"vo_{i:02d}.mp3")
        synth(scene["voiceover"], ao)
        clips.append(make_clip(i, frame, ao))
        print("  ✅ Done")

    lf_path = os.path.join(TEMP_DIR, "concat.txt")
    with open(lf_path,"w") as f:
        for c in clips: f.write(f"file '{c}'\n")
    raw = os.path.join(TEMP_DIR, "raw.mp4")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",lf_path,"-c","copy",raw],capture_output=True)

    total = dur(raw)
    amb   = os.path.join(TEMP_DIR, "ambient.wav")
    ambient(int(total)+5, amb)

    print("\n🎚  Mastering...")
    subprocess.run([
        "ffmpeg","-y","-i",raw,"-i",amb,
        "-filter_complex","[0:a]volume=1.0[va];[1:a]volume=0.12[vb];[va][vb]amix=inputs=2:duration=first[aout]",
        "-map","0:v","-map","[aout]","-c:v","copy","-c:a","aac","-b:a","144k",FINAL_VIDEO
    ], capture_output=True)

    if not os.path.exists(FINAL_VIDEO):
        print("\n❌ ERROR: Final video not created — check ffmpeg output above.")
        import sys; sys.exit(1)
    size = os.path.getsize(FINAL_VIDEO)/(1024*1024)
    d2   = dur(FINAL_VIDEO)
    print(f"\n🎉 {FINAL_VIDEO}")
    print("="*60)
    print(f" [SUCCESS] {WIDTH}x{HEIGHT}  {d2:.1f}s  {size:.2f}MB")
    print("="*60)

if __name__ == "__main__":
    main()
