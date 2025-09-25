import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, isBefore, startOfDay, addMinutes, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const appointmentFormSchema = insertAppointmentSchema.extend({
  appointmentTime: z.string().min(1, "Selecione um horário")
});

type AppointmentForm = z.infer<typeof appointmentFormSchema>;

export default function Agendamentos() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      serviceId: "",
      appointmentDate: new Date(),
      appointmentTime: "",
      status: "pending",
      notes: ""
    }
  });

  // Fetch services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  // Fetch appointments for selected date
  const { data: existingAppointments } = useQuery({
    queryKey: ["/api/appointments", "date", selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""],
    queryFn: () => {
      if (!selectedDate) return Promise.resolve([]);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      return fetch(`/api/appointments?date=${dateStr}`).then(res => res.json());
    },
    enabled: !!selectedDate,
  });

  // Get service details
  const selectedServiceData = Array.isArray(services) ? services.find((s: any) => s.id === selectedService) : undefined;

  // Parse duration string to minutes
  const parseDurationToMinutes = (durationStr: string): number => {
    if (!durationStr) return 60;
    
    // Clean the string and convert to lowercase
    const cleaned = durationStr.toLowerCase().replace(/\s+/g, '');
    
    // Handle various formats: "90", "90min", "1h", "45m", "1h30m"
    let totalMinutes = 0;
    
    // Extract hours
    const hourMatch = cleaned.match(/(\d+)h/);
    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1]) * 60;
    }
    
    // Extract minutes
    const minMatch = cleaned.match(/(\d+)m(?!in)/); // Match 'm' but not 'min'
    if (minMatch) {
      totalMinutes += parseInt(minMatch[1]);
    }
    
    // Handle pure numbers or "90min" format
    if (totalMinutes === 0) {
      const numMatch = cleaned.match(/(\d+)/);
      if (numMatch) {
        const num = parseInt(numMatch[1]);
        // If it's a reasonable number for minutes (30-180), treat as minutes
        // Otherwise treat as hours
        totalMinutes = num > 10 && num <= 180 ? num : num * 60;
      }
    }
    
    return totalMinutes || 60; // Default to 60 minutes if nothing matches
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    if (!selectedDate || !selectedServiceData?.duration || !services) return [];
    
    const slots = [];
    const startHour = 9; // 9:00 AM
    const endHour = 21; // 9:00 PM
    const serviceDurationMinutes = parseDurationToMinutes(selectedServiceData.duration);
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hour, minute, 0, 0);
        
        // Check if slot is in the past
        if (isBefore(slotTime, new Date())) continue;
        
        // Check if slot conflicts with existing CONFIRMED appointments only
        const isBooked = Array.isArray(existingAppointments) && existingAppointments.some((apt: any) => {
          // Only consider confirmed and completed appointments as blocking
          if (apt.status !== 'confirmed' && apt.status !== 'completed') {
            return false;
          }
          
          // Find the service details for this appointment to get correct duration
          const aptService = Array.isArray(services) ? services.find((s: any) => s.id === apt.serviceId) : null;
          const aptDurationMinutes = aptService ? parseDurationToMinutes(aptService.duration) : 60;
          
          const aptTime = new Date(apt.appointmentDate);
          const aptEndTime = addMinutes(aptTime, aptDurationMinutes); // Use appointment's own service duration
          const slotEndTime = addMinutes(slotTime, serviceDurationMinutes); // Use selected service duration for slot
          
          return (
            (slotTime >= aptTime && slotTime < aptEndTime) ||
            (slotEndTime > aptTime && slotEndTime <= aptEndTime) ||
            (slotTime <= aptTime && slotEndTime >= aptEndTime)
          );
        });
        
        if (!isBooked) {
          slots.push({
            time: format(slotTime, "HH:mm"),
            datetime: slotTime
          });
        }
      }
    }
    
    return slots;
  };

  const availableSlots = generateTimeSlots();

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentForm) => {
      const appointmentDateTime = new Date(selectedDate!);
      const [hours, minutes] = data.appointmentTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const appointmentData = {
        ...data,
        appointmentDate: appointmentDateTime,
        serviceId: selectedService
      };
      
      // Remove appointmentTime from the data sent to backend
      const { appointmentTime, ...backendData } = appointmentData;
      
      return await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData)
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi solicitado com sucesso. Entraremos em contato para confirmação.",
      });
      form.reset();
      setSelectedService("");
      // Invalidate both general appointments and the specific date query
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      if (selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        queryClient.invalidateQueries({ queryKey: ["/api/appointments", "date", dateStr] });
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao realizar agendamento. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: AppointmentForm) => {
    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Selecione uma data para o agendamento.",
        variant: "destructive",
      });
      return;
    }
    
    createAppointmentMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Agendamentos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Agende seu horário no Luccy Studio de forma rápida e prática. Escolha o serviço, 
            a data e o horário que melhor se adequa à sua agenda.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar and Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione a Data e Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Escolha o Serviço</label>
                {servicesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger data-testid="select-service">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(services) && services.map((service: any) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price} 
                          {service.duration && ` (${service.duration})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Calendar */}
              <div>
                <label className="text-sm font-medium mb-2 block">Escolha a Data</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    isBefore(startOfDay(date), startOfDay(new Date())) ||
                    date.getDay() === 0 || // Sunday
                    date.getDay() === 1    // Monday
                  }
                  locale={ptBR}
                  className="rounded-md border"
                  data-testid="calendar-appointment"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Funcionamos de terça a sábado, das 9h às 21h
                </p>
              </div>

              {/* Available Times */}
              {selectedDate && selectedService && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Horários Disponíveis - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={form.watch("appointmentTime") === slot.time ? "default" : "outline"}
                          size="sm"
                          onClick={() => form.setValue("appointmentTime", slot.time)}
                          data-testid={`time-slot-${slot.time}`}
                        >
                          {slot.time}
                        </Button>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-muted-foreground py-4">
                        Nenhum horário disponível para esta data
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Seus Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite seu nome completo" 
                            {...field} 
                            data-testid="input-client-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone/WhatsApp</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 99999-9999" 
                            {...field} 
                            data-testid="input-client-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Alguma observação especial sobre o agendamento?"
                            {...field} 
                            value={field.value || ""}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  {selectedDate && selectedService && form.watch("appointmentTime") && (
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">Resumo do Agendamento:</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Serviço:</strong> {selectedServiceData?.name}</p>
                          <p><strong>Data:</strong> {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</p>
                          <p><strong>Horário:</strong> {form.watch("appointmentTime")}</p>
                          <p><strong>Duração:</strong> {selectedServiceData?.duration}</p>
                          <p><strong>Preço:</strong> {selectedServiceData?.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!selectedDate || !selectedService || !form.watch("appointmentTime") || createAppointmentMutation.isPending}
                    data-testid="button-submit-appointment"
                  >
                    {createAppointmentMutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Precisa de Ajuda?</h3>
              <p className="text-muted-foreground mb-4">
                Entre em contato conosco pelo WhatsApp ou telefone
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open("https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio", "_blank")}
                  data-testid="button-whatsapp-help"
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open("tel:+5511944555381", "_blank")}
                  data-testid="button-phone-help"
                >
                  <i className="fas fa-phone mr-2"></i>
                  (11) 94455-5381
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}