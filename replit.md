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