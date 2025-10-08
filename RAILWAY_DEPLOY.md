# Deploy no Railway - Instruções

## Configuração Necessária

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Railway:

```
NODE_ENV=production
DATABASE_URL=<sua-conexão-postgres>
```

### 2. Build Command

```bash
npm run build
```

### 3. Start Command

```bash
npm run start
```

### 4. Node.js Version

O aplicativo é compatível com Node.js 18 e 20. No Railway, certifique-se de que está usando Node 18 ou superior.

### 5. Configuração do Banco de Dados

O aplicativo usa PostgreSQL. No Railway:

1. Adicione um serviço PostgreSQL
2. O Railway automaticamente criará a variável `DATABASE_URL`
3. As tabelas serão criadas automaticamente no primeiro deploy através do script `postinstall`

### 6. Importante

- O aplicativo já está configurado para aceitar uploads de imagens de até 50MB
- As imagens são armazenadas como base64 no banco de dados
- O banco de dados será automaticamente configurado no primeiro deploy

## Troubleshooting

### Erro: "paths[0] argument must be of type string"

Este erro foi corrigido. O problema era o uso de `import.meta.dirname` que não está disponível no Node.js 18. Foi substituído por `path.dirname(fileURLToPath(import.meta.url))`.

### Imagens não estão sendo salvas

Certifique-se de que:
1. A variável `DATABASE_URL` está configurada corretamente
2. O tamanho da imagem não excede 5MB
3. Os logs do Railway não mostram erros de validação

## Scripts Disponíveis

- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run db:push` - Sincroniza o schema do banco de dados
