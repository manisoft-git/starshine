#!/bin/bash
# STARSHINE - Launch script
cd "$(dirname "$0")"
PORT="${PORT:-5000}"
echo "✨ Starting STARSHINE Haute Collection on port $PORT..."
python3 app.py
