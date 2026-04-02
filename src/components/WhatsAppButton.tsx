import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi!%20I'd%20like%20to%20order%20from%20Saini%20Sweets,%20Hisar"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-whatsapp hover:brightness-110 rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-7 h-7 text-background" fill="currentColor" />
  </a>
);

export default WhatsAppButton;
