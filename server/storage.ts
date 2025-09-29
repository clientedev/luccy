import { 
  users, categories, products, services, testimonials, galleryImages, siteSettings, appointments, serviceHours,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type Service, type InsertService,
  type Testimonial, type InsertTestimonial, type GalleryImage, type InsertGalleryImage,
  type SiteSettings, type InsertSiteSettings, type Appointment, type InsertAppointment,
  type ServiceHours, type InsertServiceHours
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Testimonials
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Gallery
  getGalleryImages(): Promise<GalleryImage[]>;
  getFeaturedGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<boolean>;

  // Site Settings
  getSiteSetting(key: string): Promise<SiteSettings | undefined>;
  setSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings>;
  getAllSiteSettings(): Promise<SiteSettings[]>;

  // Service Hours
  getServiceHours(serviceId: string): Promise<ServiceHours[]>;
  createServiceHours(serviceHours: InsertServiceHours): Promise<ServiceHours>;
  updateServiceHours(id: string, serviceHours: Partial<InsertServiceHours>): Promise<ServiceHours | undefined>;
  deleteServiceHours(id: string): Promise<boolean>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByService(serviceId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  getAppointmentsWithService(): Promise<(Appointment & { service: Service })[]>;
}

export class DatabaseStorage implements IStorage {
  
  // Initialize seed data if none exists
  async initializeSeedData(): Promise<void> {
    try {
      // Check if categories exist
      const existingCategories = await this.getCategories();
      if (existingCategories.length === 0) {
        console.log('Creating initial categories...');
        await Promise.all([
          this.createCategory({ name: 'Cílios', slug: 'cilios', description: 'Extensões de cílios fio a fio e volume russo' }),
          this.createCategory({ name: 'Unhas', slug: 'unhas', description: 'Nail art, esmaltação e design exclusivo' }),
          this.createCategory({ name: 'Cabelo', slug: 'cabelo', description: 'Corte, coloração e mega hair' }),
          this.createCategory({ name: 'Maquiagem', slug: 'maquiagem', description: 'Maquiagem para eventos e dia a dia' })
        ]);
      }

      // Check if services exist
      const existingServices = await this.getServices();
      if (existingServices.length === 0) {
        console.log('Creating initial services...');
        await Promise.all([
          this.createService({ 
            name: 'Extensão de Cílios Fio a Fio', 
            description: 'Técnica natural que adiciona volume e comprimento aos cílios',
            price: 'A partir de R$ 80', 
            duration: '2h', 
            featured: true 
          }),
          this.createService({ 
            name: 'Volume Russo', 
            description: 'Técnica que aplica múltiplos fios em cada cílio natural',
            price: 'A partir de R$ 120', 
            duration: '2h30', 
            featured: true 
          }),
          this.createService({ 
            name: 'Nail Art Personalizada', 
            description: 'Design exclusivo em unhas com técnicas modernas',
            price: 'A partir de R$ 60', 
            duration: '1h30', 
            featured: true 
          }),
          this.createService({ 
            name: 'Mega Hair Natural', 
            description: 'Aplicação de cabelo natural com técnicas exclusivas',
            price: 'A partir de R$ 300', 
            duration: '4h', 
            featured: true 
          }),
          this.createService({ 
            name: 'Maquiagem Social', 
            description: 'Maquiagem completa para eventos especiais',
            price: 'A partir de R$ 100', 
            duration: '1h', 
            featured: false 
          })
        ]);
      }

      // Create service hours for all services that don't have them
      const allServices = await this.getServices();
      for (const service of allServices) {
        const existingHours = await this.getServiceHours(service.id);
        if (existingHours.length === 0) {
          console.log(`Creating service hours for ${service.name}...`);
          
          // Create default hours (Tuesday to Saturday, 9:00 AM to 9:00 PM)
          const defaultHours = [
            { dayOfWeek: 2, startTime: '09:00', endTime: '21:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '21:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '09:00', endTime: '21:00' }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '21:00' }, // Friday
            { dayOfWeek: 6, startTime: '09:00', endTime: '21:00' }, // Saturday
          ];
          
          for (const hours of defaultHours) {
            try {
              await this.createServiceHours({
                serviceId: service.id,
                dayOfWeek: hours.dayOfWeek,
                startTime: hours.startTime,
                endTime: hours.endTime,
                isAvailable: true
              });
            } catch (error) {
              console.error(`Error creating service hours for ${service.name}, day ${hours.dayOfWeek}:`, error);
            }
          }
        }
      }

      // Check if gallery images exist
      const existingImages = await this.getGalleryImages();
      if (existingImages.length === 0) {
        console.log('Creating initial gallery images...');
        await Promise.all([
          this.createGalleryImage({
            title: 'Extensão de Cílios Volume Russo',
            imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400',
            category: 'cilios',
            featured: true
          }),
          this.createGalleryImage({
            title: 'Nail Art Dourada',
            imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
            category: 'unhas',
            featured: true
          }),
          this.createGalleryImage({
            title: 'Cabelo com Luzes',
            imageUrl: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=400',
            category: 'cabelo',
            featured: true
          }),
          this.createGalleryImage({
            title: 'Maquiagem para Noiva',
            imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
            category: 'maquiagem',
            featured: true
          })
        ]);
      }

      console.log('Database seed initialization completed');
    } catch (error) {
      console.error('Error initializing seed data:', error);
      throw error;
    }
  }
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.categoryId, categoryId))
      .orderBy(products.name);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.name);
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Testimonials
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }

  async getFeaturedGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages)
      .where(eq(galleryImages.featured, true))
      .orderBy(desc(galleryImages.createdAt));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db
      .insert(galleryImages)
      .values(image)
      .returning();
    return newImage;
  }

  async updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [updated] = await db
      .update(galleryImages)
      .set(image)
      .where(eq(galleryImages.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Site Settings
  async getSiteSetting(key: string): Promise<SiteSettings | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async setSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings> {
    const existing = await this.getSiteSetting(setting.key);
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value: setting.value })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [newSetting] = await db
        .insert(siteSettings)
        .values(setting)
        .returning();
      return newSetting;
    }
  }

  async getAllSiteSettings(): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings);
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    return await db.select().from(appointments)
      .where(sql`${appointments.appointmentDate} >= ${startDate} AND ${appointments.appointmentDate} < ${endDate}`)
      .orderBy(appointments.appointmentDate);
  }

  async getAppointmentsByService(serviceId: string): Promise<Appointment[]> {
    return await db.select().from(appointments)
      .where(eq(appointments.serviceId, serviceId))
      .orderBy(appointments.appointmentDate);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db
      .update(appointments)
      .set(appointment)
      .where(eq(appointments.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Service Hours methods
  async getServiceHours(serviceId: string): Promise<ServiceHours[]> {
    return await db.select().from(serviceHours)
      .where(eq(serviceHours.serviceId, serviceId))
      .orderBy(serviceHours.dayOfWeek, serviceHours.startTime);
  }

  async createServiceHours(insertServiceHours: InsertServiceHours): Promise<ServiceHours> {
    const [newServiceHours] = await db
      .insert(serviceHours)
      .values(insertServiceHours)
      .returning();
    return newServiceHours;
  }

  async updateServiceHours(id: string, updates: Partial<InsertServiceHours>): Promise<ServiceHours | undefined> {
    const [updated] = await db
      .update(serviceHours)
      .set(updates)
      .where(eq(serviceHours.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteServiceHours(id: string): Promise<boolean> {
    const result = await db.delete(serviceHours).where(eq(serviceHours.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAppointmentsWithService(): Promise<(Appointment & { service: Service })[]> {
    const result = await db
      .select({
        id: appointments.id,
        clientName: appointments.clientName,
        clientPhone: appointments.clientPhone,
        serviceId: appointments.serviceId,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        service: services
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .orderBy(appointments.appointmentDate);
    
    return result.map(row => ({
      ...row,
      service: row.service!
    }));
  }
}

// In-memory storage for development/demo
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private services: Map<string, Service> = new Map();
  private testimonials: Map<string, Testimonial> = new Map();
  private galleryImages: Map<string, GalleryImage> = new Map();
  private siteSettings: Map<string, SiteSettings> = new Map();
  private serviceHours: Map<string, ServiceHours> = new Map();
  private appointments: Map<string, Appointment> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Add sample services
    const sampleServices = [
      {
        id: 'service1',
        name: 'Corte e Escova',
        description: 'Corte personalizado e escova profissional',
        price: 'R$ 80,00',
        duration: '1h30m',
        featured: true,
        createdAt: new Date()
      },
      {
        id: 'service2', 
        name: 'Coloração Completa',
        description: 'Coloração profissional com produtos de alta qualidade',
        price: 'A partir de R$ 150,00',
        duration: '3h',
        featured: true,
        createdAt: new Date()
      },
      {
        id: 'service3',
        name: 'Manicure e Pedicure',
        description: 'Cuidado completo para unhas das mãos e pés',
        price: 'R$ 45,00',
        duration: '1h',
        featured: false,
        createdAt: new Date()
      },
      {
        id: 'service4',
        name: 'Extensão de Cílios',
        description: 'Alongamento de cílios fio a fio',
        price: 'R$ 120,00',
        duration: '2h',
        featured: true,
        createdAt: new Date()
      },
      {
        id: 'service5',
        name: 'Maquiagem Profissional',
        description: 'Maquiagem para eventos especiais',
        price: 'A partir de R$ 100,00',
        duration: '1h',
        featured: false,
        createdAt: new Date()
      }
    ];

    for (const service of sampleServices) {
      this.services.set(service.id, service as Service);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const usersList = Array.from(this.users.values());
    for (const user of usersList) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...insertUser
    };
    this.users.set(user.id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.generateId(),
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
      createdAt: new Date()
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.categoryId === categoryId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      name: product.name,
      description: product.description ?? null,
      price: product.price,
      categoryId: product.categoryId ?? null,
      imageUrl: product.imageUrl ?? null,
      inStock: product.inStock ?? null,
      createdAt: new Date()
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createService(service: InsertService): Promise<Service> {
    const newService: Service = {
      id: this.generateId(),
      name: service.name,
      description: service.description ?? null,
      price: service.price ?? null,
      duration: service.duration ?? null,
      featured: service.featured ?? null,
      createdAt: new Date()
    };
    this.services.set(newService.id, newService);
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...service };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  // Testimonials
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(t => t.approved)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      id: this.generateId(),
      clientName: testimonial.clientName,
      content: testimonial.content,
      rating: testimonial.rating ?? null,
      service: testimonial.service ?? null,
      approved: testimonial.approved ?? null,
      createdAt: new Date()
    };
    this.testimonials.set(newTestimonial.id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existing = this.testimonials.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...testimonial };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getFeaturedGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values())
      .filter(img => img.featured)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const newImage: GalleryImage = {
      id: this.generateId(),
      title: image.title ?? null,
      imageUrl: image.imageUrl,
      category: image.category ?? null,
      featured: image.featured ?? null,
      createdAt: new Date()
    };
    this.galleryImages.set(newImage.id, newImage);
    return newImage;
  }

  async updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const existing = this.galleryImages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...image };
    this.galleryImages.set(id, updated);
    return updated;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Site Settings
  async getSiteSetting(key: string): Promise<SiteSettings | undefined> {
    return this.siteSettings.get(key);
  }

  async setSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings> {
    const newSetting: SiteSettings = {
      id: this.generateId(),
      key: setting.key,
      value: setting.value ?? null,
      updatedAt: new Date()
    };
    this.siteSettings.set(setting.key, newSetting);
    return newSetting;
  }

  async getAllSiteSettings(): Promise<SiteSettings[]> {
    return Array.from(this.siteSettings.values());
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const targetDate = new Date(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return Array.from(this.appointments.values())
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= targetDate && aptDate < nextDay;
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  }

  async getAppointmentsByService(serviceId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(apt => apt.serviceId === serviceId)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const newAppointment: Appointment = {
      id: this.generateId(),
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      serviceId: appointment.serviceId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status ?? null,
      notes: appointment.notes ?? null,
      createdAt: new Date()
    };
    this.appointments.set(newAppointment.id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...appointment };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  async getAppointmentsWithService(): Promise<(Appointment & { service: Service })[]> {
    const appointments = Array.from(this.appointments.values());
    return appointments.map(apt => {
      const service = this.services.get(apt.serviceId);
      return {
        ...apt,
        service: service!
      };
    }).filter(apt => apt.service) // Only include appointments with valid services
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  }

  // Service Hours methods
  async getServiceHours(serviceId: string): Promise<ServiceHours[]> {
    const hoursArray = Array.from(this.serviceHours.values());
    return hoursArray.filter(hours => hours.serviceId === serviceId)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  }

  async createServiceHours(serviceHours: InsertServiceHours): Promise<ServiceHours> {
    const newServiceHours: ServiceHours = {
      id: this.generateId(),
      serviceId: serviceHours.serviceId,
      dayOfWeek: serviceHours.dayOfWeek,
      startTime: serviceHours.startTime,
      endTime: serviceHours.endTime,
      isAvailable: serviceHours.isAvailable ?? true,
      createdAt: new Date()
    };
    this.serviceHours.set(newServiceHours.id, newServiceHours);
    return newServiceHours;
  }

  async updateServiceHours(id: string, updates: Partial<InsertServiceHours>): Promise<ServiceHours | undefined> {
    const existing = this.serviceHours.get(id);
    if (!existing) return undefined;

    const updated: ServiceHours = {
      ...existing,
      ...updates
    };
    this.serviceHours.set(id, updated);
    return updated;
  }

  async deleteServiceHours(id: string): Promise<boolean> {
    return this.serviceHours.delete(id);
  }
}

// Use in-memory storage for development (since no database is provisioned)
export const storage = new DatabaseStorage();
