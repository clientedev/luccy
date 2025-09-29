# Overview

Luccy Studio is a sophisticated beauty salon website built with React, TypeScript, and Express.js. The application features a modern, elegant design with a nude, gold, black, and white color palette targeting the beauty industry. It serves as both a business showcase and e-commerce platform for Luccy Studio, a beauty salon owned by Raquel Luci Lopes da Silva, specializing in hair, nails, eyelashes, and makeup services.

The site includes a public-facing website with service listings, product catalog, gallery, and contact information, plus an administrative panel for content management. The application is designed to be fully responsive and optimized for desktop, tablet, and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in Vite build environment
- **Routing**: Wouter for client-side routing with pages for Home, About, Services, Products, Gallery, Contact, and Admin
- **Styling**: Tailwind CSS with shadcn/ui component library using "new-york" style
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Radix UI primitives for accessible, customizable components
- **Design System**: Custom theme with CSS variables for consistent branding (nude/gold/black/white palette)

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **Authentication**: Simple password-based admin authentication with bcrypt hashing
- **API Design**: RESTful endpoints under `/api` prefix for CRUD operations

## Database Schema
- **Database**: PostgreSQL via Neon serverless with WebSocket connections
- **Tables**: Users, categories, products, services, testimonials, gallery images, and site settings
- **Schema Definition**: Centralized in `/shared/schema.ts` with Zod validation schemas
- **Migrations**: Drizzle Kit for schema management and migrations

## Content Management
- **Admin Panel**: Protected admin interface for managing all content types
- **Product Management**: CRUD operations for products with category organization
- **Service Management**: Featured services with pricing and duration information
- **Media Management**: Gallery images with featured image support
- **Testimonial System**: Customer reviews with approval workflow

## Integration Points
- **WhatsApp Integration**: Direct messaging links for appointment booking and customer communication
- **Form Handling**: React Hook Form with Zod validation for all form inputs
- **Image Handling**: External image URLs with fallback support
- **SEO Optimization**: Meta tags, Open Graph tags, and semantic HTML structure

# External Dependencies

## Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **UI Framework**: Radix UI component primitives
- **Styling**: Tailwind CSS with PostCSS
- **Fonts**: Google Fonts (Inter and Playfair Display)
- **Icons**: Font Awesome 6.4.0 for consistent iconography

## Development Tools
- **Build Tool**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development Environment**: Replit integration with cartographer and dev banner plugins
- **Session Storage**: PostgreSQL session store for persistent admin sessions

## Third-Party Services
- **Communication**: WhatsApp Business API for customer messaging
- **Image Hosting**: External image URLs (likely Unsplash for demo content)
- **Email**: Basic mailto links for contact form functionality

## Key Dependencies
- **Data Fetching**: TanStack React Query for efficient server state management
- **Form Validation**: React Hook Form with Hookform Resolvers for Zod integration
- **Password Security**: bcrypt for secure password hashing
- **Database Connection**: WebSocket support via ws package for Neon serverless
- **Development Security**: Runtime error overlay and development banner for debugging

# Recent Changes (September 2025)

## Database Improvements
- **Automated Database Setup**: Criado arquivo `server/migrate.ts` com funções automáticas para:
  - Verificar e habilitar extensões PostgreSQL necessárias (pgcrypto, uuid-ossp)
  - Validar integridade de foreign keys
  - Criar índices para otimizar performance de queries
  - Diagnosticar problemas do banco de dados
  - Limpar dados órfãos
  
- **Diagnóstico Automático**: Sistema agora executa diagnóstico completo do banco na inicialização em modo desenvolvimento, mostrando:
  - Contagem de registros em cada tabela
  - Serviços sem horários definidos
  - Status dos agendamentos
  - Status dos depoimentos (aprovados vs pendentes)

## Bug Fixes - Admin Panel
### Problema 1: Queries com Query Parameters
- **Problema**: Agendamentos e depoimentos não apareciam no painel admin
- **Causa**: TanStack Query v5 default queryFn usa `queryKey.join("/")` que não suporta objetos como query parameters
- **Solução**: Implementadas queryFn customizadas para rotas com parâmetros:
  ```typescript
  // Antes (quebrava):
  queryKey: ["/api/testimonials", { admin: "true" }]
  
  // Depois (funciona):
  queryKey: ["/api/testimonials", "admin"],
  queryFn: async () => {
    const res = await fetch("/api/testimonials?admin=true", {
      credentials: "include"
    });
    return res.json();
  }
  ```

### Problema 2: Tratamento de Erros nas Mutations
- **Problema**: Erros ao salvar serviços não mostravam mensagem específica
- **Solução**: 
  - Adicionado tratamento de erro detalhado em todas as mutations (services, appointments, testimonials)
  - Mensagens de erro agora mostram descrição específica do problema
  - Console.error adicionado para debug durante desenvolvimento
  
### Problema 3: Mutations não Usavam apiRequest Corretamente
- **Problema**: Algumas mutations usavam fetch() direto em vez de apiRequest()
- **Solução**: Padronizadas todas as mutations para usar apiRequest com credenciais
  ```typescript
  // Agora todas as mutations seguem o padrão:
  mutationFn: async (data) => {
    const res = await apiRequest("POST", "/api/endpoint", data);
    return res.json();
  }
  ```

## Melhorias de Infraestrutura
- **Índices de Performance**: Criados índices automáticos para:
  - appointments(appointment_date, service_id, status)
  - service_hours(service_id, day_of_week)
  - products(category_id)
  - testimonials(approved)
  - gallery_images(featured)

- **Validação Automática**: Sistema verifica valores NULL em colunas obrigatórias na inicialização

## Deployment Configuration
- Configurado para deploy no Railway com PostgreSQL
- Workflow otimizado para desenvolvimento com diagnóstico automático
- Sistema de migração automática garante banco sempre configurado corretamente

### Problema 4: Login Admin não Funcionava em Produção (Railway) - Setembro 2025
- **Problema**: Após fazer login no painel admin em produção, o sistema ficava preso na tela de login sem acessar a área administrativa
- **Causa**: Configuração inadequada de sessões e cookies para ambientes com proxy reverso (Railway usa proxies)
  - Cookie `secure: true` em produção requer HTTPS (correto)
  - Faltava `trust proxy` no Express para reconhecer o proxy do Railway
  - Cookie `sameSite` precisava ser configurado para 'none' em produção
  - Faltava `proxy: true` na configuração de sessão
- **Solução Implementada em `server/routes.ts`**:
  ```typescript
  // Trust proxy for Railway deployment
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }
  
  // Session configuration with proxy support
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || fallback,
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }
  }));
  ```
- **Impacto**: Login admin agora funciona corretamente em produção no Railway. Sessões são mantidas corretamente através do proxy reverso.

## Verificação de Sistemas (Setembro 2025)
Todos os sistemas foram testados e estão funcionando corretamente:
- ✅ **Autenticação Admin**: Login/logout funcionando em desenvolvimento e produção
- ✅ **Agendamentos**: Sistema completo de agendamento com:
  - Seleção de data e horário
  - Verificação de horários disponíveis
  - Detecção de conflitos
  - Integração com WhatsApp
- ✅ **Serviços**: CRUD completo com:
  - Criação automática de horários de atendimento
  - Edição e exclusão
  - Marcação de serviços em destaque
- ✅ **Produtos**: Sistema de produtos com categorização
- ✅ **Depoimentos**: Sistema de aprovação e gerenciamento de depoimentos
- ✅ **Galeria**: Upload e gerenciamento de imagens da galeria