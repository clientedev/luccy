#!/bin/bash

echo "🧪 Testando Build de Produção..."
echo ""

echo "1. Fazendo build..."
npm run build

echo ""
echo "2. Iniciando servidor de produção..."
echo "   (Pressione Ctrl+C para parar após o teste)"
echo ""

NODE_ENV=production npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo ""
echo "3. Testando healthcheck endpoint..."
curl -s http://localhost:5000/health || echo "❌ Healthcheck falhou"

echo ""
echo ""
echo "4. Testando API endpoint..."
curl -s http://localhost:5000/api/services | head -c 100 || echo "❌ API falhou"

echo ""
echo ""
echo "✅ Testes concluídos!"
echo ""

# Kill the server
kill $SERVER_PID 2>/dev/null

exit 0
