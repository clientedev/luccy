import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, Plus, Eye, EyeOff, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LoginFormProps {
  onLogin: () => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);
      if (response.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vinda ao painel administrativo.",
        });
        onLogin();
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-primary-foreground text-2xl"></i>
          </div>
          <CardTitle className="text-2xl font-serif">Área Administrativa</CardTitle>
          <p className="text-muted-foreground">Digite suas credenciais para acessar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o usuário"
                required
                data-testid="input-admin-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                required
                data-testid="input-admin-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments", "admin"],
    queryFn: async () => {
      const res = await fetch("/api/appointments?admin=true", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/appointments/${id}`, data).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Agendamento atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar agendamento", variant: "destructive" });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/appointments/${id}`).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Agendamento excluído com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir agendamento", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      completed: { label: "Concluído", variant: "outline" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointmentMutation.mutate({
      id: appointmentId,
      data: { status: newStatus }
    });
  };

  const generateWhatsAppMessage = (appointment: any) => {
    const date = new Date(appointment.appointmentDate);
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

    const serviceName = appointment.service?.name || 'serviço solicitado';
    
    // Generate dynamic message based on appointment status
    switch (appointment.status) {
      case 'confirmed':
        return `Olá ${appointment.clientName}! Seu agendamento foi confirmado para o serviço de ${serviceName} no dia ${formattedDate} às ${formattedTime}. Aguardamos você no Luccy Studio! 💅✨`;
      case 'pending':
        return `Olá ${appointment.clientName}! Recebemos sua solicitação de agendamento para o serviço de ${serviceName} no dia ${formattedDate} às ${formattedTime}. Em breve entraremos em contato para confirmar! 💅`;
      case 'completed':
        return `Olá ${appointment.clientName}! Obrigada por escolher o Luccy Studio! Esperamos que tenha gostado do serviço de ${serviceName}. Conte conosco sempre! 💅✨`;
      case 'cancelled':
        return `Olá ${appointment.clientName}! Seu agendamento para o serviço de ${serviceName} foi cancelado. Se desejar reagendar, fique à vontade para entrar em contato! 💅`;
      default:
        return `Olá ${appointment.clientName}! Entrando em contato sobre seu agendamento para o serviço de ${serviceName} no dia ${formattedDate} às ${formattedTime}. 💅`;
    }
  };

  const openWhatsApp = (appointment: any) => {
    const phone = appointment.clientPhone.replace(/\D/g, ''); // Remove caracteres não numéricos
    const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`;
    const message = encodeURIComponent(generateWhatsAppMessage(appointment));
    const url = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gerenciar Agendamentos</span>
            <Badge variant="secondary" data-testid="appointments-count">
              {Array.isArray(appointments) ? appointments.length : 0} agendamentos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!Array.isArray(appointments) || appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-calendar-times text-4xl mb-4 block"></i>
              <p>Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment: any) => (
                <Card key={appointment.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{appointment.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.clientPhone}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <i className="fas fa-calendar mr-1"></i>
                          {formatDate(appointment.appointmentDate)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{appointment.service?.name || 'Serviço não encontrado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.service?.duration && `Duração: ${appointment.service.duration}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.service?.price && `Preço: ${appointment.service.price}`}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getStatusBadge(appointment.status).variant}
                            data-testid={`status-${appointment.id}`}
                          >
                            {getStatusBadge(appointment.status).label}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                          <Select
                            value={appointment.status}
                            onValueChange={(newStatus) => handleStatusChange(appointment.id, newStatus)}
                          >
                            <SelectTrigger className="w-full sm:w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="confirmed">Confirmar</SelectItem>
                              <SelectItem value="completed">Concluir</SelectItem>
                              <SelectItem value="cancelled">Cancelar</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openWhatsApp(appointment)}
                            className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 w-full sm:w-auto"
                            data-testid={`whatsapp-appointment-${appointment.id}`}
                          >
                            <SiWhatsapp className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este agendamento?')) {
                                deleteAppointmentMutation.mutate(appointment.id);
                              }
                            }}
                            data-testid={`delete-appointment-${appointment.id}`}
                            className="w-full sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {appointment.notes && (
                          <div className="text-sm">
                            <strong>Observações:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agenda Visual */}
      <AdminScheduleView 
        appointments={Array.isArray(appointments) ? appointments : []} 
        services={Array.isArray(services) ? services : []}
        onStatusChange={handleStatusChange}
        onWhatsAppClick={openWhatsApp}
        onDelete={(id) => deleteAppointmentMutation.mutate(id)}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />
    </>
  );
}

function AdminScheduleView({ 
  appointments, 
  services,
  onStatusChange,
  onWhatsAppClick,
  onDelete,
  getStatusBadge,
  formatDate
}: {
  appointments: any[];
  services: any[];
  onStatusChange: (id: string, status: string) => void;
  onWhatsAppClick: (appointment: any) => void;
  onDelete: (id: string) => void;
  getStatusBadge: (status: string) => { label: string; variant: any };
  formatDate: (dateString: string) => string;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group appointments by date (yyyy-MM-dd)
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    appointments.forEach(apt => {
      const date = format(startOfDay(new Date(apt.appointmentDate)), 'yyyy-MM-dd');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(apt);
    });
    return grouped;
  }, [appointments]);

  // Get completed appointments
  const completedAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.status === 'completed')
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  }, [appointments]);

  // Build calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days to start on Sunday
    const startDay = monthStart.getDay();
    const paddingStart = Array(startDay).fill(null);
    
    return [...paddingStart, ...days];
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectedDayAppointments = selectedDate ? (appointmentsByDate[selectedDate] || []) : [];

  return (
    <div className="space-y-6 mt-6">
      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">Agenda Visual - {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</CardTitle>
            <div className="flex gap-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
                data-testid="button-prev-month"
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                data-testid="button-today"
                className="flex-1 sm:flex-none"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                data-testid="button-next-month"
                className="flex-1 sm:flex-none"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Week headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center font-semibold text-xs sm:text-sm text-muted-foreground p-1 sm:p-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="p-2" />;
              
              const dayKey = format(day, 'yyyy-MM-dd');
              const dayAppointments = appointmentsByDate[dayKey] || [];
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate === dayKey;
              const hasAppointments = dayAppointments.length > 0;
              
              return (
                <button
                  key={dayKey}
                  onClick={() => setSelectedDate(isSelected ? null : dayKey)}
                  className={`
                    min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg border-2 transition-all text-left
                    ${isToday ? 'border-primary bg-primary/5' : 'border-border'}
                    ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
                    ${hasAppointments ? 'hover:bg-muted cursor-pointer' : 'opacity-60'}
                    ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                  `}
                  data-testid={`calendar-day-${dayKey}`}
                >
                  <div className="font-semibold text-xs sm:text-base mb-1">{format(day, 'd')}</div>
                  {hasAppointments && (
                    <div className="space-y-0.5 sm:space-y-1">
                      {dayAppointments.slice(0, 2).map((apt, i) => (
                        <div
                          key={i}
                          className={`text-[10px] sm:text-xs px-0.5 sm:px-1 py-0.5 rounded truncate ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <span className="hidden sm:inline">{format(new Date(apt.appointmentDate), 'HH:mm')} - </span>{apt.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                          +{dayAppointments.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Details */}
          {selectedDate && selectedDayAppointments.length > 0 && (
            <Card className="mt-6 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">
                  Agendamentos de {format(parseISO(selectedDate), "dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDayAppointments.map((apt: any) => (
                    <Card key={apt.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
                          <div>
                            <h4 className="font-semibold">{apt.clientName}</h4>
                            <p className="text-sm text-muted-foreground">{apt.clientPhone}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <i className="fas fa-clock mr-1"></i>
                              {format(new Date(apt.appointmentDate), 'HH:mm')}
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium">{apt.service?.name || 'Serviço não encontrado'}</p>
                            <p className="text-sm text-muted-foreground">
                              {apt.service?.duration && `Duração: ${apt.service.duration}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {apt.service?.price && `Preço: ${apt.service.price}`}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <Badge variant={getStatusBadge(apt.status).variant}>
                              {getStatusBadge(apt.status).label}
                            </Badge>
                            
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                              <Select
                                value={apt.status}
                                onValueChange={(newStatus) => onStatusChange(apt.id, newStatus)}
                              >
                                <SelectTrigger className="w-full sm:w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="confirmed">Confirmar</SelectItem>
                                  <SelectItem value="completed">Concluir</SelectItem>
                                  <SelectItem value="cancelled">Cancelar</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onWhatsAppClick(apt)}
                                className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 w-full sm:w-auto"
                              >
                                <SiWhatsapp className="w-4 h-4 mr-1" />
                                WhatsApp
                              </Button>
                              
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir este agendamento?')) {
                                    onDelete(apt.id);
                                  }
                                }}
                                className="w-full sm:w-auto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {apt.notes && (
                              <div className="text-sm">
                                <strong>Observações:</strong> {apt.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Atendimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Histórico de Atendimentos</span>
            <Badge variant="outline" data-testid="completed-count">
              {completedAppointments.length} atendimentos concluídos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-history text-4xl mb-4 block"></i>
              <p>Nenhum atendimento concluído ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedAppointments.map((apt: any) => (
                <Card key={apt.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex flex-col gap-2 sm:gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <h4 className="font-semibold">{apt.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{apt.clientPhone}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{apt.service?.name || 'Serviço não encontrado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.service?.price}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <i className="fas fa-calendar mr-1"></i>
                          {formatDate(apt.appointmentDate)}
                        </p>
                      </div>
                      
                      <div className="flex items-center sm:justify-end">
                        <Badge variant="outline" className="bg-blue-50">Concluído</Badge>
                      </div>
                    </div>
                    {apt.notes && (
                      <div className="text-sm mt-2 text-muted-foreground">
                        <strong>Observações:</strong> {apt.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ServicesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    featured: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/services", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Serviço criado com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Erro ao criar serviço:", error);
      toast({ 
        title: "Erro ao criar serviço", 
        description: error.message || "Verifique os dados e tente novamente",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/services/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Serviço atualizado com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar serviço:", error);
      toast({ 
        title: "Erro ao atualizar serviço", 
        description: error.message || "Verifique os dados e tente novamente",
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/services/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Serviço excluído com sucesso!" });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir serviço:", error);
      toast({ 
        title: "Erro ao excluir serviço", 
        description: error.message || "Não foi possível excluir o serviço",
        variant: "destructive" 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      featured: false,
    });
    setEditingService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
      featured: service.featured || false,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif font-bold">Gerenciar Serviços</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-service">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  data-testid="input-service-name"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="textarea-service-description"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Ex: A partir de R$ 50"
                  data-testid="input-service-price"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger data-testid="select-service-duration">
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutos</SelectItem>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="1h30m">1 hora e 30 minutos</SelectItem>
                    <SelectItem value="2h">2 horas</SelectItem>
                    <SelectItem value="2h30m">2 horas e 30 minutos</SelectItem>
                    <SelectItem value="3h">3 horas</SelectItem>
                    <SelectItem value="4h">4 horas</SelectItem>
                    <SelectItem value="5h">5 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  data-testid="switch-service-featured"
                />
                <Label htmlFor="featured">Serviço em destaque</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-service">
                  {editingService ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando serviços...</div>
        ) : Array.isArray(services) && services.length > 0 ? (
          services.map((service: any) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" data-testid={`service-name-${service.id}`}>
                        {service.name}
                      </h4>
                      {service.featured && (
                        <Badge className="bg-primary/10 text-primary">Destaque</Badge>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-muted-foreground mb-2" data-testid={`service-description-${service.id}`}>
                        {service.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {service.price && (
                        <span data-testid={`service-price-${service.id}`}>💰 {service.price}</span>
                      )}
                      {service.duration && (
                        <span data-testid={`service-duration-${service.id}`}>⏱️ {service.duration}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(service)}
                      data-testid={`button-edit-service-${service.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(service.id)}
                      data-testid={`button-delete-service-${service.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço cadastrado
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image1: "",
    image2: "",
    image3: "",
    inStock: true,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleImageUpload = (imageNumber: 1 | 2 | 3) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, [`image${imageNumber}`]: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Produto criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar produto",
        description: error?.message || "Ocorreu um erro ao criar o produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Produto atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error?.message || "Ocorreu um erro ao atualizar o produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Produto excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir produto",
        description: error?.message || "Ocorreu um erro ao excluir o produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image1: "",
      image2: "",
      image3: "",
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: formData.price.toString(),
    };
    
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.categoryId || "",
      image1: product.image1 || "",
      image2: product.image2 || "",
      image3: product.image3 || "",
      inStock: product.inStock,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif font-bold">Gerenciar Produtos</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-product">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  data-testid="input-product-name"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="textarea-product-description"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  data-testid="input-product-price"
                />
              </div>
              <div>
                <Label htmlFor="categoryId">Categoria</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Imagens do Produto (até 3)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="image1" className="text-sm text-muted-foreground">Imagem 1</Label>
                    <Input
                      id="image1"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload(1)}
                      data-testid="input-product-image1"
                      className="cursor-pointer"
                    />
                    {formData.image1 && (
                      <img src={formData.image1} alt="Preview 1" className="mt-2 w-full h-20 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image2" className="text-sm text-muted-foreground">Imagem 2</Label>
                    <Input
                      id="image2"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload(2)}
                      data-testid="input-product-image2"
                      className="cursor-pointer"
                    />
                    {formData.image2 && (
                      <img src={formData.image2} alt="Preview 2" className="mt-2 w-full h-20 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image3" className="text-sm text-muted-foreground">Imagem 3</Label>
                    <Input
                      id="image3"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload(3)}
                      data-testid="input-product-image3"
                      className="cursor-pointer"
                    />
                    {formData.image3 && (
                      <img src={formData.image3} alt="Preview 3" className="mt-2 w-full h-20 object-cover rounded" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                  data-testid="switch-product-stock"
                />
                <Label htmlFor="inStock">Em estoque</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-product">
                  {editingProduct ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando produtos...</div>
        ) : Array.isArray(products) && products.length > 0 ? (
          products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {product.image1 && (
                      <img
                        src={product.image1}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        data-testid={`product-image-${product.id}`}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold" data-testid={`product-name-${product.id}`}>
                          {product.name}
                        </h4>
                        {!product.inStock && (
                          <Badge variant="secondary">Fora de estoque</Badge>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-muted-foreground mb-2" data-testid={`product-description-${product.id}`}>
                          {product.description}
                        </p>
                      )}
                      <p className="font-semibold text-primary" data-testid={`product-price-${product.id}`}>
                        R$ {product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(product)}
                      data-testid={`button-edit-product-${product.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(product.id)}
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum produto cadastrado
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialsManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials", "admin"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials?admin=true", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/testimonials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento atualizado!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Depoimento excluído!" });
    },
  });

  const toggleApproval = (testimonial: any) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: { approved: !testimonial.approved }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif font-bold">Gerenciar Depoimentos</h3>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando depoimentos...</div>
        ) : Array.isArray(testimonials) && testimonials.length > 0 ? (
          testimonials.map((testimonial: any) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold" data-testid={`testimonial-client-${testimonial.id}`}>
                        {testimonial.clientName}
                      </h4>
                      <div className="flex text-primary">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <i key={i} className="fas fa-star text-sm"></i>
                        ))}
                      </div>
                      {testimonial.approved ? (
                        <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                      ) : (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2" data-testid={`testimonial-content-${testimonial.id}`}>
                      "{testimonial.content}"
                    </p>
                    {testimonial.service && (
                      <p className="text-sm text-muted-foreground" data-testid={`testimonial-service-${testimonial.id}`}>
                        Serviço: {testimonial.service}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApproval(testimonial)}
                      data-testid={`button-toggle-approval-${testimonial.id}`}
                    >
                      {testimonial.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(testimonial.id)}
                      data-testid={`button-delete-testimonial-${testimonial.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum depoimento encontrado
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
    featured: false,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: images, isLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Imagem adicionada à galeria!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Imagem removida da galeria!" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      imageUrl: "",
      category: "",
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif font-bold">Gerenciar Galeria</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-gallery-image">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  data-testid="input-gallery-title"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  required
                  data-testid="input-gallery-image"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger data-testid="select-gallery-category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makeup">Maquiagem</SelectItem>
                    <SelectItem value="hair">Cabelo</SelectItem>
                    <SelectItem value="nails">Unhas</SelectItem>
                    <SelectItem value="lashes">Cílios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  data-testid="switch-gallery-featured"
                />
                <Label htmlFor="featured">Imagem em destaque</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-gallery-image">
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Carregando galeria...</div>
        ) : Array.isArray(images) && images.length > 0 ? (
          images.map((image: any) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={image.imageUrl}
                  alt={image.title || 'Imagem da galeria'}
                  className="w-full h-48 object-cover"
                  data-testid={`gallery-admin-image-${image.id}`}
                />
                {image.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">Destaque</Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => deleteMutation.mutate(image.id)}
                  data-testid={`button-delete-gallery-${image.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                {image.title && (
                  <h4 className="font-semibold mb-1" data-testid={`gallery-title-${image.id}`}>
                    {image.title}
                  </h4>
                )}
                {image.category && (
                  <p className="text-sm text-muted-foreground" data-testid={`gallery-category-${image.id}`}>
                    {image.category}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhuma imagem na galeria
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.checkStatus();
      setIsAuthenticated(response.isAdmin);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-lock text-primary-foreground text-2xl"></i>
          </div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={checkAuthStatus} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">Luccy Studio</p>
          </div>
          <Button variant="outline" onClick={handleLogout} data-testid="button-logout" className="w-full sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="appointments" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 h-auto p-1 sm:p-1.5">
            <TabsTrigger value="appointments" data-testid="tab-appointments" className="text-xs sm:text-sm py-2 sm:py-2.5">Agendamentos</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services" className="text-xs sm:text-sm py-2 sm:py-2.5">Serviços</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products" className="text-xs sm:text-sm py-2 sm:py-2.5">Produtos</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials" className="text-xs sm:text-sm py-2 sm:py-2.5">Depoimentos</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery" className="text-xs sm:text-sm py-2 sm:py-2.5">Galeria</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsManagement />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
