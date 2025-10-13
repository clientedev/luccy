# Correção dos Erros 502 e Health Check no Railway ✅

## 🐛 Problemas Identificados

A aplicação estava apresentando os seguintes problemas no Railway:

1. **Erro 502 (Bad Gateway)** - Servidor não conseguindo responder
2. **Falhas no Health Check** - Railway não conseguia verificar se a aplicação estava funcionando
3. **Lentidão extrema** - Aplicação travando e ficando muito lenta
4. **Problemas no banco de dados** - Dados recarregando, necessitando redeploys frequentes

## 🔍 Causas Raiz Encontradas

### 1. Connection Pool sem Limites
- Pool do PostgreSQL usando configuração padrão (10 conexões máx)
- Railway PostgreSQL tem limite de ~4 conexões
- Resultado: **Bloqueio de conexões**, causando timeouts e erros 502

### 2. Migrations Rodando no Runtime
- `ensureDatabaseSetup()` executando em TODA inicialização do servidor
- Migrations consumindo conexões enquanto servidor já estava recebendo requisições
- Resultado: **Health checks falhando**, aplicação travando

### 3. Script de Migração não Falhava
- `railway-migrate.ts` ignorava erros e continuava deploy
- Esquema desatualizado em produção
- Resultado: **Inconsistências no banco**, necessitando redeploys

## ✅ Correções Implementadas

### 1. Connection Pool Otimizado (server/db.ts)

```typescript
_pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 3, // Abaixo do limite do Railway
  connectionTimeoutMillis: 5000, // Falha rápido se não conectar em 5s
  idleTimeoutMillis: 10000, // Fecha conexões ociosas após 10s
  allowExitOnIdle: false,
  keepAlive: true, // TCP keepalive para prevenir drops
  keepAliveInitialDelayMillis: 10000,
});
```

**Benefícios:**
- ✅ Evita esgotamento de conexões
- ✅ Falha rápido em caso de problemas
- ✅ Libera conexões ociosas automaticamente
- ✅ Mantém conexões vivas com TCP keepalive

### 2. Migrations Apenas no Build (server/index.ts)

```typescript
// PRODUCTION: Migrations já rodaram durante build
// DEVELOPMENT: Roda migrations na inicialização
if (process.env.NODE_ENV !== 'production') {
  await ensureDatabaseSetup();
  await seedCategories();
  await diagnoseDatabaseIssues();
}
```

**Benefícios:**
- ✅ Servidor inicia instantaneamente em produção
- ✅ Sem concorrência entre migrations e requisições
- ✅ Health check sempre rápido

### 3. Script de Migração Fail-Fast (scripts/railway-migrate.ts)

```typescript
// FAIL FAST: Stop deployment if migrations fail
process.exit(1); // Exit with error code to block Railway deployment
```

**Benefícios:**
- ✅ Deploy bloqueado se migrations falharem
- ✅ Garante esquema correto antes do deploy
- ✅ Evita inconsistências no banco

### 4. Graceful Shutdown (server/index.ts)

```typescript
const gracefulShutdown = async (signal: string) => {
  await server.close();
  await closePool(); // Fecha conexões do pool
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

**Benefícios:**
- ✅ Fecha conexões corretamente no redeploy
- ✅ Evita conexões vazadas
- ✅ Deploy mais limpo e rápido

## 🚀 Como Fazer Deploy Correto no Railway

### 1. Configuração no Railway

**Build Command:**
```bash
npm install && tsx scripts/railway-migrate.ts && npm run build
```

**Start Command:**
```bash
npm run start
```

**Health Check Settings:**
- Path: `/health`
- Timeout: 100 segundos
- Restart Policy: ON_FAILURE (10 tentativas)

### 2. Variáveis de Ambiente Obrigatórias

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=seu_secret_minimo_32_chars
ADMIN_PASSWORD=sua_senha_admin
NODE_ENV=production
PORT=5000
```

### 3. Fluxo de Deploy

1. **Build Phase** (Railway executa):
   ```bash
   npm install
   tsx scripts/railway-migrate.ts  # Roda migrations
   npm run build                    # Build da aplicação
   ```

2. **Start Phase** (Railway executa):
   ```bash
   npm run start  # Inicia servidor (sem migrations)
   ```

3. **Runtime**:
   - Servidor escuta na porta 5000
   - Health check `/health` responde instantaneamente
   - Seed data é inicializado (rápido)
   - Conexões do pool gerenciadas eficientemente

## 📊 Resultados Esperados

### Antes das Correções ❌
- Erro 502 frequente
- Health check falhando
- Aplicação travando
- Redeploys necessários constantemente
- Lentidão extrema

### Depois das Correções ✅
- Erro 502 eliminado
- Health check sempre passando
- Aplicação responsiva
- Deploy estável e confiável
- Performance otimizada

## ⚠️ Considerações Importantes

### 1. Idle Timeout
O `idleTimeoutMillis: 10000` (10s) pode causar reconexões frequentes em tráfego muito baixo. Monitore os logs e aumente se necessário.

### 2. Monitoramento
Adicione logs para monitorar:
- Uso do pool de conexões
- Eventos de shutdown
- Tempo de resposta do health check

### 3. Banco de Dados Railway
Certifique-se de que:
- PostgreSQL está provisionado no Railway
- `DATABASE_URL` está corretamente configurada
- Plano tem conexões suficientes (recomendado: mínimo 5)

## 🔧 Troubleshooting

### Se ainda tiver erro 502:
1. Verifique os logs do Railway
2. Confirme que `DATABASE_URL` está correta
3. Verifique se o health check está passando
4. Confirme que o build command inclui `tsx scripts/railway-migrate.ts`

### Se health check falhar:
1. Teste localmente: `curl http://localhost:5000/health`
2. Verifique se a porta está correta (5000)
3. Confirme que o servidor iniciou (`Server listening on port 5000`)

### Se migrations falharem:
1. Verifique a estrutura do banco manualmente
2. Execute localmente: `tsx scripts/railway-migrate.ts`
3. Verifique se há conflitos no schema

## 📝 Arquivos Modificados

- `server/db.ts` - Configuração otimizada do connection pool
- `server/index.ts` - Migrations condicionais + graceful shutdown
- `scripts/railway-migrate.ts` - Fail-fast em erros de migração

## ✨ Revisão do Arquiteto

**Status:** ✅ Aprovado

**Feedback:**
> "As correções resolvem os problemas de 502/health-check. Pool configurado dentro dos limites do Railway (3 conexões), migrations movidas para build-time, graceful shutdown implementado. Health endpoint permanece rápido e independente do DB. Nenhuma regressão arquitetural detectada."

**Próximos Passos Sugeridos:**
1. Monitorar uso do pool em produção
2. Ajustar `idleTimeout` se houver muita rotatividade de conexões
3. Adicionar logs de monitoramento

---

**Documentação atualizada em:** 13 de outubro de 2025
**Status:** ✅ Pronto para deploy no Railway
