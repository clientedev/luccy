#!/bin/bash

echo "🏥 Testando Healthcheck Endpoint..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test healthcheck
RESPONSE=$(curl -s -w "\n%{http_code}\n%{time_total}" http://localhost:5000/health)
BODY=$(echo "$RESPONSE" | head -n 1)
HTTP_CODE=$(echo "$RESPONSE" | sed -n '2p')
TIME=$(echo "$RESPONSE" | tail -n 1)

echo "📍 Endpoint: /health"
echo "📊 Status Code: $HTTP_CODE"
echo "⏱️  Tempo de Resposta: ${TIME}s"
echo "📦 Resposta: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Healthcheck está funcionando perfeitamente!${NC}"
    echo ""
    echo "Para Railway, configure:"
    echo "  - Healthcheck Path: /health"
    echo "  - Healthcheck Timeout: 100"
else
    echo -e "${RED}❌ Healthcheck falhou!${NC}"
    exit 1
fi
