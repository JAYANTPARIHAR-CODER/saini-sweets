import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import PageHero from "@/components/PageHero";
import { getProducts } from "@/api/index";  // ← our axios function
import menuBoard from "@/assets/menu-board.jpg";

// -----------------------------------------------
// This is the shape of one product from MongoDB
// -----------------------------------------------
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  isAvailable: boolean;
}

const MenuPage = () => {
  const [active, setActive] = useState("ALL");

  // -----------------------------------------------
  // NEW — store products fetched from backend
  // -----------------------------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------------------
  // NEW — fetch products when page loads
  // useEffect runs ONCE when component mounts
  // -----------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(); // calls localhost:5000/api/products
        setProducts(response.data);           // save data to state
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Make sure backend is running!");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // [] means run only once when page loads

  // -----------------------------------------------
  // Get unique categories from fetched products
  // -----------------------------------------------
  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category.trim().toUpperCase())))];

  // -----------------------------------------------
  // Filter products by selected category
  // -----------------------------------------------
  const filtered = active === "ALL"
    ? products
    : products.filter((p) => p.category.trim().toLowerCase() === active.toLowerCase());

  // -----------------------------------------------
  // Show loading state
  // -----------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-body text-muted-foreground text-lg">Loading menu...</p>
      </div>
    );
  }

  // -----------------------------------------------
  // Show error state
  // -----------------------------------------------
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-body text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Our Menu" subtitle="Handmade with love in Hisar" bgImage={menuBoard} />

      <section className="section-padding bg-background">
        <div className="container mx-auto">

          {/* Tabs — now generated from real categories in DB */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`font-body text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                  active === c
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Grid — now uses real products from MongoDB */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((item) => (
                <div key={item._id} className="bg-card gold-border rounded-xl p-5 hover-lift">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3"/>)}
                  <span className="inline-block bg-primary/10 text-primary font-body text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {item.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">{item.name}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display text-lg font-bold text-primary">₹{item.price}</span>
                    <Link
                      to="/order"
                      className="bg-primary text-primary-foreground font-body text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">No items in this category yet. Coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Catering Banner */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-secondary-foreground mb-3">
              🎉 Catering Available
            </h2>
            <p className="font-body text-secondary-foreground/80 mb-6">
              Weddings, parties, corporate events — we cater to all occasions in Hisar and nearby areas.
            </p>
            <Link to="/contact" className="bg-primary text-primary-foreground font-body font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block">
              Enquire Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;