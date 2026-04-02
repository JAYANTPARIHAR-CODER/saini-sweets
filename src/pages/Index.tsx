import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Gift, Leaf, ChefHat, Droplets } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import shopNight from "@/assets/shop-night.jpg";
import chaatDish from "@/assets/chaat-dish.jpg";
import gulabs from "@/assets/gulab.jpg";


const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {

          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-display font-bold text-secondary">
        {count}{suffix}
      </div>
      <div className="text-sm text-cream/70 font-body mt-1">{label}</div>
    </div>
  );
};

const featuredItems = [
  { name: "Kaju Katli", desc: "Premium cashew fudge with silver leaf", price: "₹80/100g", img: ""},
  { name: "Papri Chaat", desc: "Crispy papri with yogurt & chutneys", price: "₹55", img: chaatDish },
  { name: "Gulab Jamun", desc: "Soft milk dumplings in rose syrup", price: "₹12/pc", img: gulabs },
];

const testimonials = [
  { name: "Rajesh Kumar", text: "Best sweets in Hisar! The Kaju Katli melts in your mouth. Been a loyal customer for 15 years.", rating: 5 },
  { name: "Sunita Devi", text: "Their chaat is absolutely amazing. Fresh ingredients and authentic taste. My family's favorite!", rating: 5 },
  { name: "Amit Sharma", text: "Ordered sweets for my daughter's wedding. Everyone praised the quality. Thank you Saini Sweets!", rating: 5 },
];

const Index = () => {
  const marqueeText = "SWEETS · NAMKEEN · BAKERY · CHAAT · SOUTH INDIAN · FRESH DAILY · ";

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={shopNight} alt="Saini Sweets Hisar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-brown/60" />
        <div className="relative text-center z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block border-2 border-secondary rounded-full px-6 py-2 mb-8"
          >
            <span className="font-body text-sm text-secondary tracking-widest">HISAR'S FAVOURITE SINCE 1998</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-cream leading-none"
          >
            Saini<br />
            <span className="text-secondary italic">Sweets</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-lg text-cream/80 font-body tracking-wider"
          >
            Sweets · Namkeen · Bakery
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/order" className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 text-center">
              Order Now
            </Link>
            <Link to="/menu" className="border-2 border-cream/40 text-cream hover:border-secondary hover:text-secondary font-body font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 text-center">
              View Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-footer-bg py-10">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem value={25} suffix="+" label="Years of Trust" />
          <StatItem value={100} suffix="+" label="Varieties" />
          <StatItem value={500} suffix="+" label="Happy Customers" />
          <StatItem value={49} suffix="" label="★ 4.9 Rating" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Why Choose Us</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Droplets, title: "Pure Desi Ghee", desc: "Every sweet made with 100% pure desi ghee — no substitutes" },
              { icon: Leaf, title: "Natural Flavours", desc: "Real saffron, cardamom, and rose — no artificial colours" },
              { icon: ChefHat, title: "Expert Halwais", desc: "Master sweet-makers with 25+ years of Haryanvi tradition" },
              { icon: Gift, title: "Gift Boxes", desc: "Beautifully packaged boxes for weddings & festivals" },
            ].map((f, i) => (
              <AnimatedSection key={i}>
                <div className="bg-card gold-border rounded-xl p-6 text-center hover-lift">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="font-display text-xl md:text-2xl text-primary-foreground/90 tracking-widest mx-4">
              {marqueeText}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Featured Items</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="bg-card gold-border rounded-xl overflow-hidden hover-lift">
                  <div className="h-48 overflow-hidden">
                    {item.img ? (
                      <img src={item.img || "https://via.placeholder.com/300" } alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-placeholder" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-foreground">{item.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{item.desc}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-display text-lg font-bold text-primary">{item.price}</span>
                      <Link to="/order" className="bg-primary text-primary-foreground font-body text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">What Customers Say</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-4" />
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i}>
                <div className="bg-card rounded-xl p-6 hover-lift">
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                  <p className="font-display font-semibold text-foreground">{t.name}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Order for Your Next Event
            </h2>
            <p className="font-body text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Weddings, birthdays, festivals — we cater to all occasions with fresh, handmade sweets delivered across Hisar.
            </p>
            <Link to="/contact" className="bg-secondary text-secondary-foreground font-body font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all inline-block">
              Get in Touch
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
