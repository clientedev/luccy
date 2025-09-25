import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import { insertCategorySchema, insertProductSchema, insertServiceSchema, insertTestimonialSchema, insertGalleryImageSchema, insertSiteSettingsSchema, insertAppointmentSchema } from "../shared/schema";
import { ZodError } from "zod";

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'luccy-studio-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  }));

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.session?.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  // Admin login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      
      // Check admin password from environment only (fallback for development)
      const adminPassword = process.env.ADMIN_PASSWORD || 'luccy4731';
      
      if (password === adminPassword) {
        req.session.isAdmin = true;
        res.json({ success: true });
      } else {
        res.status(401).json({ message: 'Senha incorreta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao fazer logout' });
      } else {
        res.json({ success: true });
      }
    });
  });

  // Check admin status
  app.get('/api/admin/status', (req, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar categorias' });
    }
  });

  app.post('/api/categories', requireAdmin, async (req, res) => {
    try {
      const category = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(category);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao criar categoria' });
      }
    }
  });

  app.put('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCategorySchema.partial().parse(req.body);
      const updated = await storage.updateCategory(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar categoria' });
      }
    }
  });

  app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar categoria' });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar produtos' });
    }
  });

  app.post('/api/products', requireAdmin, async (req, res) => {
    try {
      const product = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(product);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao criar produto' });
      }
    }
  });

  app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertProductSchema.partial().parse(req.body);
      const updated = await storage.updateProduct(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar produto' });
      }
    }
  });

  app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar produto' });
    }
  });

  // Services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar serviços' });
    }
  });

  app.post('/api/services', requireAdmin, async (req, res) => {
    try {
      const service = insertServiceSchema.parse(req.body);
      const newService = await storage.createService(service);
      res.status(201).json(newService);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao criar serviço' });
      }
    }
  });

  app.put('/api/services/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertServiceSchema.partial().parse(req.body);
      const updated = await storage.updateService(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Serviço não encontrado' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar serviço' });
      }
    }
  });

  app.delete('/api/services/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteService(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Serviço não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar serviço' });
    }
  });

  // Testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const { admin } = req.query;
      let testimonials;
      
      if (admin === 'true' && req.session?.isAdmin) {
        testimonials = await storage.getAllTestimonials();
      } else {
        testimonials = await storage.getApprovedTestimonials();
      }
      
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar depoimentos' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const testimonial = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonial);
      res.status(201).json(newTestimonial);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao criar depoimento' });
      }
    }
  });

  app.put('/api/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertTestimonialSchema.partial().parse(req.body);
      const updated = await storage.updateTestimonial(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Depoimento não encontrado' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar depoimento' });
      }
    }
  });

  app.delete('/api/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTestimonial(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Depoimento não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar depoimento' });
    }
  });

  // Gallery
  app.get('/api/gallery', async (req, res) => {
    try {
      const { featured } = req.query;
      let images;
      
      if (featured === 'true') {
        images = await storage.getFeaturedGalleryImages();
      } else {
        images = await storage.getGalleryImages();
      }
      
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar galeria' });
    }
  });

  app.post('/api/gallery', requireAdmin, async (req, res) => {
    try {
      const image = insertGalleryImageSchema.parse(req.body);
      const newImage = await storage.createGalleryImage(image);
      res.status(201).json(newImage);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao adicionar imagem' });
      }
    }
  });

  app.put('/api/gallery/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertGalleryImageSchema.partial().parse(req.body);
      const updated = await storage.updateGalleryImage(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Imagem não encontrada' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar imagem' });
      }
    }
  });

  app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGalleryImage(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Imagem não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar imagem' });
    }
  });

  // Site Settings
  app.get('/api/settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar configurações' });
    }
  });

  app.post('/api/settings', requireAdmin, async (req, res) => {
    try {
      const setting = insertSiteSettingsSchema.parse(req.body);
      const newSetting = await storage.setSiteSetting(setting);
      res.json(newSetting);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao salvar configuração' });
      }
    }
  });

  // Appointments
  app.get('/api/appointments', async (req, res) => {
    try {
      const { date, service, admin } = req.query;
      let appointments;
      
      if (admin === 'true' && req.session?.isAdmin) {
        // Admin view with service details
        appointments = await storage.getAppointmentsWithService();
      } else if (date && typeof date === 'string') {
        // Get appointments for specific date
        appointments = await storage.getAppointmentsByDate(date);
      } else if (service && typeof service === 'string') {
        // Get appointments for specific service
        appointments = await storage.getAppointmentsByService(service);
      } else {
        // Get all appointments (for checking availability)
        appointments = await storage.getAppointments();
      }
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao carregar agendamentos' });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const appointment = insertAppointmentSchema.parse(req.body);
      const newAppointment = await storage.createAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao criar agendamento' });
      }
    }
  });

  app.put('/api/appointments/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertAppointmentSchema.partial().parse(req.body);
      const updated = await storage.updateAppointment(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ message: 'Agendamento não encontrado' });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro ao atualizar agendamento' });
      }
    }
  });

  app.delete('/api/appointments/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAppointment(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Agendamento não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar agendamento' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
