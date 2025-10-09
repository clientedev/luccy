# 🚀 Guia Completo de Deploy no Railway

Este guia mostra como fazer deploy da aplicação Luccy Studio no Railway com PostgreSQL, incluindo **migrações automáticas do banco de dados**.

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Projeto configurado no Railway
3. PostgreSQL provisionado no Railway

## 🔧 Configuração Automática

O projeto está **100% configurado** para fazer deploy automático no Railway. As migrações do banco de dados rodam automaticamente durante o build.

### Scripts Configurados

- **`npm run railway:migrate`** - Executa migrações e configuração do banco (roda automaticamente no build)
- **`npm run build`** - Build da aplicação (frontend + backend)
- **`npm start`** - Inicia o servidor em produção

## 🗄️ Configuração do Banco de Dados

### 1. Provisionar PostgreSQL no Railway

1. Acesse seu projeto no Railway
2. Clique em **"New"** → **"Database"** → **"Add PostgreSQL"**
3. O Railway criará automaticamente a variável `DATABASE_URL`

### 2. Variáveis de Ambiente

O Railway configura automaticamente:
- ✅ `DATABASE_URL` - String de conexão do PostgreSQL
- ✅ `PORT` - Porta do servidor (configurada automaticamente)
- ✅ `NODE_ENV` - Definido como "production"

**Não é necessário configurar manualmente!**

## 🚀 Deploy

### Método 1: Deploy via GitHub (Recomendado)

1. Conecte seu repositório GitHub ao Railway
2. O Railway detectará automaticamente o `railway.json`
3. O deploy será feito automaticamente a cada push

### Método 2: Deploy via Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Vincular ao projeto
railway link

# Deploy
railway up
```

## 📊 O que Acontece no Deploy

### Durante o Build (`buildCommand`)
```bash
npm install                    # Instala dependências
npm run build                  # Build do frontend e backend
npm run railway:migrate        # ✨ Executa migrações automáticas do banco
```

O script `railway:migrate` faz:
1. ✅ Verifica se `DATABASE_URL` está configurado
2. ✅ Sincroniza schema usando `drizzle-kit push --force`
3. ✅ Habilita extensões PostgreSQL necessárias (pgcrypto)
4. ✅ Cria todas as tabelas do schema
5. ✅ Cria índices para performance
6. ✅ Adiciona categorias padrão
7. ✅ Verifica integridade do banco

### Durante o Start (`startCommand`)
```bash
npm start    # Inicia o servidor (node dist/index.js)
```

O servidor:
- ✅ Responde ao healthcheck em `/health` imediatamente
- ✅ Inicializa dados de seed em background (não bloqueia o servidor)
- ✅ Em produção, pula verificações pesadas (já feitas no build)

## 🏥 Healthcheck

O Railway verifica a saúde da aplicação em:
- **Path**: `/health`
- **Timeout**: 300ms (5 minutos para primeira resposta)
- **Resposta esperada**: `{ "status": "ok" }`

## 🔍 Verificação de Deploy

Após o deploy, verifique:

1. **Logs do Build**
   ```
   ✓ DATABASE_URL encontrado
   ✓ Schema sincronizado com sucesso
   ✓ Banco de dados verificado e configurado
   ✅ Migração concluída com sucesso!
   ```

2. **Logs do Runtime**
   ```
   serving on port 5000
   Production mode - skipping database setup (already done in build)
   ```

3. **Teste a Aplicação**
   - Acesse a URL fornecida pelo Railway
   - Verifique se o site carrega corretamente
   - Teste funcionalidades básicas (agendamentos, galeria, etc)

## 🐛 Troubleshooting

### ❌ Erro: "DATABASE_URL não encontrado"
**Causa**: PostgreSQL não provisionado  
**Solução**: 
1. No Railway, adicione PostgreSQL: **New → Database → Add PostgreSQL**
2. Aguarde a criação da variável `DATABASE_URL`
3. Faça redeploy

### ❌ Erro: "Healthcheck timeout"
**Causa**: Servidor não iniciou a tempo ou está travado  
**Solução**: 
1. Verifique os logs do Railway para erros de inicialização
2. Confirme que `railway.json` tem `healthcheckTimeout: 300`
3. Verifique se a porta está configurada corretamente

### ❌ Erro: "Migration failed"
**Causa**: Problema na sincronização do schema  
**Solução**: 
1. Verifique se o PostgreSQL está ativo no Railway
2. Confira os logs de build: `railway logs --deployment`
3. Execute localmente: `npm run railway:migrate` para testar

### ❌ Erro: "Port already in use"
**Causa**: Tentativa de usar porta hardcoded  
**Solução**: O Railway configura `PORT` automaticamente. Não defina manualmente.

### ❌ Erro: "Cannot find module 'tsx'"
**Causa**: Dependências não instaladas corretamente  
**Solução**: 
1. Verifique se `tsx` está em `devDependencies` do `package.json`
2. Force reinstall: `railway run npm install`

## 📝 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `railway.json` | Configuração do Railway (build, deploy, healthcheck) |
| `scripts/railway-migrate.ts` | Script de migração automática do banco |
| `server/migrate-runner.ts` | Runner de configuração do banco |
| `server/migrate.ts` | Funções de setup e diagnóstico do banco |
| `drizzle.config.ts` | Configuração do Drizzle ORM |
| `shared/schema.ts` | Schema completo do banco de dados |

## 🔄 Atualizações Futuras do Schema

Para atualizar o schema do banco de dados:

1. **Modifique** `shared/schema.ts` com as novas tabelas/colunas
2. **Commit e push** para o repositório
3. **Aguarde** - O Railway executará automaticamente:
   - ✅ Build da aplicação
   - ✅ Migrações do banco (`railway:migrate`)
   - ✅ Restart do servidor

**Não é necessário executar migrações manualmente!**

### Exemplo: Adicionar nova coluna

```typescript
// shared/schema.ts
export const services = pgTable('services', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  // Nova coluna:
  discount: integer('discount').default(0),
});
```

Faça push → Railway detecta → Migra automaticamente ✨

## ✅ Checklist de Deploy

- [ ] PostgreSQL provisionado no Railway
- [ ] `DATABASE_URL` configurado automaticamente
- [ ] Repositório conectado ao Railway
- [ ] Build concluído com sucesso
- [ ] Migrações executadas sem erros
- [ ] Healthcheck respondendo (`/health`)
- [ ] Aplicação acessível via URL do Railway
- [ ] Funcionalidades testadas (agendamentos, galeria, etc)

## 🎯 Comandos Úteis do Railway CLI

```bash
# Ver logs em tempo real
railway logs

# Ver logs de um deploy específico
railway logs --deployment

# Ver variáveis de ambiente
railway variables

# Executar comando no ambiente Railway
railway run npm run railway:migrate

# Abrir shell no container
railway shell

# Forçar redeploy
railway up --detach
```

## 📊 Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:

- `users` - Usuários do sistema
- `categories` - Categorias de produtos/serviços
- `products` - Produtos da loja
- `services` - Serviços oferecidos
- `service_hours` - Horários disponíveis por serviço
- `appointments` - Agendamentos de clientes
- `testimonials` - Depoimentos de clientes
- `gallery_images` - Galeria de imagens
- `site_settings` - Configurações do site

### Dados Iniciais (Seed)

O sistema adiciona automaticamente:
- ✅ 5 categorias padrão: Cílios, Maquiagem, Cabelo, Unhas, Roupas
- ✅ Extensões PostgreSQL necessárias
- ✅ Índices para otimização de consultas

## 🆘 Suporte e Debug

### Ver estado do banco de dados

```bash
# Conectar ao PostgreSQL do Railway
railway connect postgres

# Ver tabelas
\dt

# Ver dados de uma tabela
SELECT * FROM services;
```

### Resetar banco de dados (cuidado!)

```bash
# Apenas em casos extremos
railway run npm run db:push:force
```

### Logs detalhados

```bash
# Ver todos os logs
railway logs

# Filtrar por erro
railway logs | grep ERROR

# Ver últimas 100 linhas
railway logs --tail 100
```

---

## 🎉 Pronto para Produção!

Com esta configuração, seu sistema está pronto para rodar no Railway com:
- ✅ Migrações automáticas
- ✅ Healthcheck otimizado
- ✅ PostgreSQL configurado
- ✅ Deploy contínuo via GitHub

**Desenvolvido com ❤️ para Luccy Studio**
