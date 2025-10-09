# Railway - Guia Rápido para Corrigir Erro 502

## ✅ Checklist para Resolver Erro 502

### 1. Variáveis de Ambiente (OBRIGATÓRIAS)

No painel do Railway, configure:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
SESSION_SECRET=cole_aqui_um_secret_de_32_caracteres
ADMIN_PASSWORD=sua_senha_admin
NODE_ENV=production
PORT=5000
```

**Gerar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Configurações do Deploy

No Railway, configure:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Healthcheck Path**: `/health`
- **Healthcheck Timeout**: `100`

### 3. Verificar Banco de Dados

Certifique-se que:

1. PostgreSQL está criado e rodando no Railway
2. `DATABASE_URL` está correta (copie do painel do Railway)
3. Execute depois do primeiro deploy:
   ```bash
   railway run npm run db:push:force
   ```

### 4. Testar Localmente Antes

```bash
# 1. Configurar variáveis localmente
export DATABASE_URL="sua_url_do_railway"
export SESSION_SECRET="seu_secret"
export NODE_ENV=production

# 2. Build e teste
npm run build
npm run start

# 3. Em outro terminal
curl http://localhost:5000/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

## ⚡ Correção Crítica Aplicada

O endpoint `/health` agora está configurado **ANTES** de qualquer middleware ou inicialização de banco de dados. Isso garante resposta instantânea (<5ms) para o healthcheck do Railway, mesmo durante a inicialização do app.

**O que foi corrigido:**
- ✅ Healthcheck movido para o início do servidor (server/index.ts)
- ✅ Responde antes de qualquer operação de banco de dados
- ✅ Não depende de sessões ou outros middlewares
- ✅ Tempo de resposta: ~3-4ms

## 🔍 Como Debugar no Railway

### Ver Logs em Tempo Real

```bash
railway logs --tail
```

### Checklist de Problemas Comuns

- [ ] `DATABASE_URL` está configurada?
- [ ] `SESSION_SECRET` está configurada?
- [ ] Banco PostgreSQL está rodando?
- [ ] Build completou sem erros?
- [ ] Porta 5000 está sendo usada?
- [ ] Healthcheck Path está `/health`?

## 🚨 Erros Comuns e Soluções

### "Failed to connect to database"
- Verifique `DATABASE_URL`
- Confirme que o PostgreSQL está rodando

### "Session secret not set"
- Configure `SESSION_SECRET` nas variáveis de ambiente

### "Port already in use"
- Railway usa a porta do ambiente
- Não precisa configurar PORT manualmente, use 5000

### "Build failed"
- Execute localmente: `npm run build`
- Verifique erros no log

## ✅ Confirmar que Está Funcionando

Depois do deploy, acesse:

1. `https://seu-app.railway.app/health` - Deve retornar JSON com status "ok"
2. `https://seu-app.railway.app/api/services` - Deve retornar lista de serviços
3. `https://seu-app.railway.app` - Deve carregar o site

Se todos funcionarem, está tudo OK! 🎉
