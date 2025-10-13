# Deploy no Railway - Guia Completo

## 📋 Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Banco de dados PostgreSQL configurado no Railway
3. Código no GitHub/GitLab

## 🚀 Configuração do Deploy

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Railway:

```env
# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host:porta/database

# Sessão e Autenticação
SESSION_SECRET=seu_secret_aqui_minimo_32_caracteres
ADMIN_PASSWORD=sua_senha_admin_segura

# Configuração Node
NODE_ENV=production
PORT=5000
```

### 2. Build Command

No Railway, configure o Build Command como:

```bash
npm install && tsx scripts/railway-migrate.ts && npm run build
```

⚠️ **IMPORTANTE**: O script `railway-migrate.ts` deve rodar DURANTE O BUILD, não no runtime. Isso garante que:
- Migrations rodam antes do servidor iniciar
- Deploy falha se houver erro nas migrations
- Servidor inicia instantaneamente em produção

### 3. Start Command

Configure o Start Command como:

```bash
npm run start
```

### 4. Deploy Settings

- **Root Directory**: `/` (raiz do projeto)
- **Healthcheck Path**: `/health` (IMPORTANTE: endpoint de healthcheck configurado)
- **Healthcheck Timeout**: 100 segundos
- **Restart Policy**: ON_FAILURE com 10 tentativas

## 🔧 Scripts Disponíveis

### Testar Antes do Deploy
```bash
# Testar build de produção localmente
chmod +x test-production.sh
./test-production.sh

# Ou manualmente:
npm run build
NODE_ENV=production npm run start
# Em outro terminal:
curl http://localhost:5000/health
```

### Deploy para Railway
```bash
# Build do projeto
npm run build

# Iniciar em produção
npm run start

# Push do schema do banco (forçado)
npm run db:push
```

### Desenvolvimento Local
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar tipos TypeScript
npm run check

# Seed de categorias
npm run db:seed-categories
```

## 🐛 Troubleshooting

### Problema: Erro 502 - Application failed to respond

**Causa**: A aplicação não está respondendo ou crashando ao iniciar.

**Soluções**:

1. **Verificar Healthcheck**:
   - O endpoint `/health` deve estar respondendo
   - Configure no Railway: Healthcheck Path = `/health`
   - Timeout: 100 segundos

2. **Verificar Variáveis de Ambiente**:
   ```bash
   # Obrigatórias
   DATABASE_URL=postgresql://...
   SESSION_SECRET=minimo_32_caracteres_aleatorios
   NODE_ENV=production
   PORT=5000
   ```

3. **Verificar Logs do Railway**:
   ```bash
   railway logs --tail
   ```
   - Procure por erros de conexão com banco
   - Verifique se o servidor está iniciando na porta correta

4. **Cookies e Sessões**:
   - O app usa `sameSite: 'lax'` para compatibilidade com Railway
   - `secure: true` em produção (requer HTTPS)
   - Trust proxy configurado automaticamente

5. **Build Completo**:
   ```bash
   # Reconstruir do zero
   npm clean-install
   npm run build
   npm run start
   ```

### Problema: Select de Serviços Fica Carregando

**Causa**: A API não está respondendo corretamente no Railway.

**Solução**:

1. Verifique os logs do Railway para erros
2. Confirme que `DATABASE_URL` está configurado corretamente
3. Verifique se o banco de dados está acessível:
   ```bash
   # No Railway shell
   node -e "console.log(process.env.DATABASE_URL)"
   ```

4. Execute o push do schema:
   ```bash
   npm run db:push
   ```

### Problema: Erros de CORS

**Causa**: Requisições sendo bloqueadas por política CORS.

**Solução**: O servidor Express já está configurado para servir frontend e backend na mesma origem. Não precisa configuração adicional.

### Problema: Banco de Dados Não Conecta

**Solução**:

1. Verifique a string de conexão `DATABASE_URL`
2. Confirme que o banco PostgreSQL está ativo no Railway
3. Teste a conexão localmente:
   ```bash
   psql $DATABASE_URL
   ```

### Problema: Build Falha

**Soluções**:

1. Limpe o cache:
   ```bash
   npm clean-install
   ```

2. Verifique se todas as dependências estão no `package.json`

3. Execute localmente primeiro:
   ```bash
   npm run build
   npm run start
   ```

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start`
- [ ] Banco de dados PostgreSQL criado
- [ ] `DATABASE_URL` configurada corretamente
- [ ] Schema do banco aplicado (`npm run db:push`)
- [ ] Testar endpoints da API
- [ ] Verificar logs do Railway

## 🔒 Segurança

### Variáveis Sensíveis

**Nunca** commite no git:
- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_PASSWORD`

Use sempre as variáveis de ambiente do Railway.

### Gerando Secrets Seguros

```bash
# Gerar SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar senha segura
openssl rand -base64 32
```

## 📊 Monitoramento

### Verificar Saúde da Aplicação

```bash
# Endpoint de teste (adicione se necessário)
curl https://seu-app.railway.app/api/services

# Verificar logs
railway logs
```

### Métricas Importantes

- Tempo de resposta da API
- Taxa de erro
- Uso de memória
- Conexões ativas do banco

## 🔄 Atualizações

### Deploy de Nova Versão

1. Push para o branch principal:
   ```bash
   git push origin main
   ```

2. Railway fará deploy automático

3. Verificar logs:
   ```bash
   railway logs --tail
   ```

### Rollback

Se algo der errado:

1. No Railway Dashboard, vá em Deployments
2. Selecione o deployment anterior
3. Clique em "Redeploy"

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `railway logs`
2. Consulte a documentação: https://docs.railway.app
3. Entre em contato com suporte do Railway
