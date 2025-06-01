#!/bin/bash

echo "Starting AI Biology Playground servers..."
echo

# Function to check if a port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

# Kill any existing processes on the ports
echo "Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "python.*sae_inference_service.py" 2>/dev/null || true

# Wait a moment for processes to clean up
sleep 2

# Start Python SAE inference service (optional)
if command -v python3 &> /dev/null && [ -f "scripts/sae_inference_service.py" ]; then
    echo "Starting Python SAE inference service on port 5000..."
    cd scripts
    python3 sae_inference_service.py &
    SAE_PID=$!
    cd ..
    sleep 2
    if check_port 5000; then
        echo "✅ SAE inference service started successfully on port 5000"
    else
        echo "⚠️  SAE inference service failed to start (optional component)"
        SAE_PID=""
    fi
else
    echo "⚠️  Python not found or SAE service not available (optional component)"
    SAE_PID=""
fi

# Start backend server
echo "Starting backend server on port 3002..."
cd api
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend started successfully
if check_port 3002; then
    echo "✅ Backend server started successfully on port 3002"
else
    echo "❌ Failed to start backend server"
    [ -n "$SAE_PID" ] && kill $SAE_PID 2>/dev/null || true
    exit 1
fi

# Start frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if frontend started successfully
if check_port 3000; then
    echo "✅ Frontend server started successfully on port 3000"
    echo ""
    echo "🎉 All servers are running!"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:3002"
    [ -n "$SAE_PID" ] && echo "   SAE Service: http://localhost:5000"
    echo ""
    echo "Press Ctrl+C to stop all servers"
else
    echo "❌ Failed to start frontend server"
    kill $BACKEND_PID 2>/dev/null || true
    [ -n "$SAE_PID" ] && kill $SAE_PID 2>/dev/null || true
    exit 1
fi

# Wait for user to stop
trap 'echo ""; echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; [ -n "$SAE_PID" ] && kill $SAE_PID 2>/dev/null; exit' INT
wait
