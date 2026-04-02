import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import PageHero from "@/components/PageHero";
import shopDay from "@/assets/shop-day.jpg";
import shopNight from "@/assets/shop-night.jpg";
import chaatDish from "@/assets/chaat-dish.jpg";
import menuBoard from "@/assets/menu-board.jpg";
import sweetDisplay from "@/assets/sweet-display.jpg";
import festivalCater from "@/assets/festival-cater.jpg";
import weddingBox from "@/assets/wedding-sweetsbox.jpg";
import ladoosMaking from "@/assets/fesh-ladoomaker.jpg";

interface GalleryImage {
  src: string | null;
  caption: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: shopDay, caption: "Shop exterior — daytime", category: "SHOP" },
  { src: menuBoard, caption: "Our famous menu board", category: "SHOP" },
  { src: shopNight, caption: "Shop glowing at night", category: "SHOP" },
  { src: chaatDish, caption: "Chaat dish close-up", category: "FOOD" },
  { src: sweetDisplay, caption: "Sweet display counter", category: "FOOD" },
  { src: festivalCater, caption: "Festival catering setup", category: "EVENTS" },
  { src: weddingBox, caption: "Wedding sweet boxes", category: "EVENTS" },
  { src: ladoosMaking, caption: "Fresh ladoos being made", category: "FOOD" },
];

const filterTabs = ["ALL", "SHOP", "FOOD", "EVENTS"];

const Gallery = () => {
  const [active, setActive] = useState("ALL");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "ALL" ? galleryImages : galleryImages.filter((g) => g.category === active);

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    const newIdx = lightbox + dir;
    if (newIdx >= 0 && newIdx < filtered.length) setLightbox(newIdx);
  };

  return (
    <div>
      <PageHero title="Gallery" subtitle="A glimpse of Saini Sweets, Hisar" />

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filterTabs.map((t) => (
              <button
                key={t}
                onClick={() => { setActive(t); setLightbox(null); }}
                className={`font-body text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                  active === t
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((img, i) => (
              <AnimatedSection key={`${active}-${i}`}>
                <div
                  className="rounded-xl overflow-hidden cursor-pointer hover-lift aspect-[4/3]"
                  onClick={() => setLightbox(i)}
                >
                  {img.src ? (
                    <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-placeholder flex items-center justify-center">
                      <span className="font-display text-cream/60 text-sm">{img.caption}</span>
                    </div>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground mt-2 text-center">{img.caption}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-brown/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-cream" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-cream" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-cream" onClick={(e) => { e.stopPropagation(); navigate(1); }}>
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              {filtered[lightbox]?.src ? (
                <img src={filtered[lightbox].src!} alt={filtered[lightbox].caption} className="max-w-full max-h-[75vh] rounded-lg" />
              ) : (
                <div className="w-[600px] h-[400px] gradient-placeholder rounded-lg flex items-center justify-center">
                  <span className="font-display text-cream text-xl">{filtered[lightbox]?.caption}</span>
                </div>
              )}
              <p className="text-center text-cream font-body mt-4">{filtered[lightbox]?.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">Visit Us in Hisar</h2>
            <p className="font-body text-primary-foreground/80 mb-6">Near Hotel Jai Shree, Hisar, Haryana</p>
            <Link to="/contact" className="bg-secondary text-secondary-foreground font-body font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all inline-block">
              Get Directions
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
