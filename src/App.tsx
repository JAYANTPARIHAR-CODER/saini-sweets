import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DemoBanner from "@/components/DemoBanner";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AiChatbot from "@/components/AiChatbot";  // ← AI chatbot
import Index from "./pages/Index";
import About from "./pages/About";
import MenuPage from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import Authpage from "./pages/Authpage";
import { Navigate } from "react-router-dom";

// Redirects to /auth if not logged in
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const token = localStorage.getItem("token") || localStorage.getItem("google_token");
  return token ? element : <Navigate to="/auth" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <CartProvider>
      <BrowserRouter>
        <DemoBanner />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<ProtectedRoute element={<Order />} />} />
          <Route path="/auth" element={<Authpage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
        <AiChatbot />        {/* ← Floating AI chatbot on every page */}
      </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
