import json
import os
import urllib.parse
from flask import Flask, render_template_string, render_template, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='static', template_folder='templates')

PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'static', 'data', 'products.json')

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    products = load_products()

    if category and category != 'all':
        products = [p for p in products if p.get('category') == category]

    if search:
        s = search.lower().strip()
        products = [
            p for p in products 
            if s in p.get('name', '').lower() 
            or s in p.get('description', '').lower()
            or s in p.get('categoryName', '').lower()
        ]

    return jsonify({"success": True, "count": len(products), "products": products})

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p.get('id') == product_id), None)
    if product:
        return jsonify({"success": True, "product": product})
    return jsonify({"success": False, "error": "Product not found"}), 404

@app.route('/api/whatsapp-link', methods=['POST'])
def generate_whatsapp_link():
    data = request.get_json() or {}
    phone = data.get('phone', '2348091977795').replace('+', '').replace(' ', '').replace('-', '')
    items = data.get('items', [])
    store_name = data.get('store_name', 'STARSHINE STEEZ')
    notes = data.get('notes', '')

    msg_lines = [
        f"✨ *NEW ORDER - {store_name.upper()}* ✨",
        "━━━━━━━━━━━━━━━━━━━━━",
        "🛍️ *ORDER DETAILS*:\n"
    ]

    total = 0
    for idx, item in enumerate(items, 1):
        name = item.get('name', 'Item')
        size = item.get('size', 'Standard')
        color = item.get('color', 'Standard')
        price = float(item.get('price', 0))
        qty = int(item.get('quantity', 1))
        item_total = price * qty
        total += item_total
        msg_lines.append(f"{idx}. *{name}* (Size: {size}, Color: {color})")
        msg_lines.append(f"   Qty: {qty} × ${price:,.2f} = *${item_total:,.2f}*\n")

    msg_lines.append("━━━━━━━━━━━━━━━━━━━━━")
    msg_lines.append(f"💎 *ESTIMATED TOTAL*: *${total:,.2f}*")
    msg_lines.append("📦 *Express Delivery*: COMPLIMENTARY")
    if notes:
        msg_lines.append(f"\n📍 *Delivery Location / Notes*: {notes}")
    msg_lines.append("\nPlease confirm item availability and dispatch timeline. Thank you!")

    encoded_text = urllib.parse.quote("\n".join(msg_lines))
    wa_url = f"https://wa.me/{phone}?text={encoded_text}"

    return jsonify({"success": True, "url": wa_url, "message": "\n".join(msg_lines)})

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "store": "STARSHINE STEEZ HAUTE COLLECTION", "version": "1.0.0"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🌟 STARSHINE STEEZ Haute Collection online on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
