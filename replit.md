# Overview

Luccy Studio is a beauty salon website built with React, TypeScript, and Express.js, featuring a modern design with a nude, gold, black, and white color palette. It functions as both a business showcase and an e-commerce platform for services like hair, nails, eyelashes, and makeup. The application includes a public-facing site with service listings, product catalog, gallery, and contact information, alongside an administrative panel for content management. It is designed to be fully responsive across all devices. The project aims to provide a comprehensive online presence for Luccy Studio, enhancing client engagement and streamlining business operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for client-side navigation.
- **Styling**: Tailwind CSS with shadcn/ui components (new-york style).
- **State Management**: TanStack React Query for server state and caching.
- **UI Components**: Radix UI primitives.
- **Design System**: Custom theme with CSS variables (nude/gold/black/white).

## Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM for type-safe operations.
- **Session Management**: Express sessions with PostgreSQL store.
- **Authentication**: Simple password-based admin authentication with bcrypt.
- **API Design**: RESTful endpoints under `/api`.

## Database Schema
- **Database**: PostgreSQL via Neon serverless.
- **Tables**: Users, categories, products, services, testimonials, gallery images, site settings.
- **Schema Definition**: Centralized in `/shared/schema.ts` with Zod validation.
- **Migrations**: Drizzle Kit for schema management.

## Content Management
- **Admin Panel**: Protected interface for managing all content types.
- **Product Management**: CRUD for products with categorization.
- **Service Management**: Featured services with pricing and duration.
- **Media Management**: Gallery images with featured image support.
- **Testimonial System**: Customer reviews with approval workflow.
- **Visual Schedule**: Monthly calendar view of appointments with status-based coloring and daily detail panel.

## System Design Choices
- **Responsive Design**: Optimized for desktop, tablet, and mobile.
- **SEO**: Meta tags, Open Graph tags, and semantic HTML.
- **Automated Database Setup**: Includes scripts for enabling PostgreSQL extensions, validating foreign keys, creating indices, and diagnosing database issues.
- **Error Handling**: Enhanced error treatment for mutations with specific feedback.
- **Deployment**: Configured for Railway, including proxy trust and session cookie settings for production.

# External Dependencies

## Core Technologies
- **Database**: Neon PostgreSQL serverless.
- **UI Framework**: Radix UI component primitives.
- **Styling**: Tailwind CSS with PostCSS.
- **Fonts**: Google Fonts (Inter, Playfair Display).
- **Icons**: Font Awesome 6.4.0.

## Development Tools
- **Build Tool**: Vite.
- **Code Quality**: TypeScript strict mode.
- **Development Environment**: Replit integration with cartographer and dev banner.

## Third-Party Services
- **Communication**: WhatsApp Business API (for direct messaging links).
- **Image Hosting**: External image URLs.
- **Email**: Basic mailto links.

## Key Dependencies
- **Data Fetching**: TanStack React Query.
- **Form Validation**: React Hook Form with Zod validation.
- **Password Security**: bcrypt.
- **Database Connection**: `ws` package for Neon serverless.