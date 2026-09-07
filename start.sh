#!/bin/bash
# STARSHINE ENTERPRISE - Launch script
cd "$(dirname "$0")"
PORT="${PORT:-5000}"
echo "✨ Starting STARSHINE ENTERPRISE on port $PORT..."
python3 app.py
