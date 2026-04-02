import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="bg-footer-bg border-t-4 border-secondary">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="font-display text-xl font-bold text-cream">Saini Sweets</span>
          </div>
          <p className="font-body text-sm text-cream/60">Sweetening Hisar Since 1998</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-secondary mb-4">Pages</h4>
          <div className="flex flex-col gap-2">
            {["Home", "About", "Menu", "Gallery", "Contact", "Order"].map((p) => (
              <Link key={p} to={p === "Home" ? "/" : `/${p.toLowerCase()}`} className="font-body text-sm text-cream/70 hover:text-secondary transition-colors">
                {p}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-secondary mb-4">Specialties</h4>
          <div className="flex flex-col gap-2">
            {["Sweets", "Namkeen", "Chaat", "South Indian", "Bakery", "Beverages"].map((s) => (
              <span key={s} className="font-body text-sm text-cream/70">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-secondary mb-4">Connect</h4>
          <p className="font-body text-sm text-cream/70 mb-2">Near Hotel Jai Shree, Hisar, Haryana</p>
          <p className="font-body text-sm text-cream/70 mb-4">+91 98765 43210</p>
          <div className="flex gap-4">
            <a href="#" className="text-cream/60 hover:text-secondary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-cream/60 hover:text-secondary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://wa.me/919876543210" className="text-cream/60 hover:text-secondary transition-colors"><MessageCircle className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 mt-10 pt-6 text-center">
        <p className="font-body text-xs text-cream/40">© 2025 Saini Sweets, Hisar. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
