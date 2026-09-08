#!/bin/bash
# STARSHINE STEEZ - Launch script
cd "$(dirname "$0")"
PORT="${PORT:-5000}"
echo "✨ Starting STARSHINE STEEZ on port $PORT..."
python3 app.py
