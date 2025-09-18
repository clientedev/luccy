export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all z-50"
      data-testid="button-whatsapp-float"
    >
      <i className="fab fa-whatsapp text-2xl"></i>
    </a>
  );
}
