import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { placeOrder } from "@/api/index"; // ← add this
import PageHero from "@/components/PageHero";
import { menuItems, categories } from "@/data/menuItems";

interface CartItem {
  id: string;
  name: string;
  price: string;
  qty: number;
}

const Order = () => {
  const [active, setActive] = useState("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", delivery: true, notes: "" });
  const [success, setSuccess] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const filtered = active === "ALL" ? menuItems : menuItems.filter((m) => m.category === active);

  const addToCart = (item: { id: string; name: string; price: string }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)).filter((c) => c.qty > 0)
    );
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
        // Build the order object to send to backend
        const orderData = {
            customerName: form.name,
            customerPhone: form.phone,
            deliveryAddress: form.delivery ? form.address : "PICKUP",
            notes: form.notes,
            deliveryType: form.delivery ? "Delivery" : "Pickup",
            items: cart.map((item) => ({
                product: item.name,   // product name
                quantity: item.qty,   // how many
                price: item.price     // price as string (₹12/pc)
            })),
            totalAmount: cart.length, // number of different items
            status: "pending"
        };

        // Send to backend → saves to MongoDB
        await placeOrder(orderData);

        // Show success screen
        setSuccess(true);

    } catch (error) {
        alert("Failed to place order. Make sure backend is running!");
    }
};

  if (success) {
    return (
      <div>
        <PageHero title="Order" />
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-md text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <div className="w-20 h-20 rounded-full bg-whatsapp flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-background" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Order Placed!</h2>
            <p className="font-body text-muted-foreground mb-6">
              Thank you, {form.name}! We'll confirm your order shortly on {form.phone}.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-8">
              {form.delivery ? "We'll deliver to your address in Hisar." : "Your order will be ready for pickup."}
            </p>
            <button onClick={() => { setSuccess(false); setCart([]); setForm({ name: "", phone: "", address: "", delivery: true, notes: "" }); }} className="bg-primary text-primary-foreground font-body font-semibold px-8 py-3 rounded-lg">
              Place Another Order
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Order Online" subtitle="We deliver across Hisar city" />

      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`font-body text-sm px-4 py-2 rounded-full transition-all ${
                      active === c ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:bg-primary/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {filtered.map((item) => {
                    const inCart = cart.find((c) => c.id === item.id);
                    return (
                      <div key={item.id} className="bg-card gold-border rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-foreground">{item.name}</h3>
                          <p className="font-body text-xs text-muted-foreground truncate">{item.description}</p>
                          <span className="font-display text-sm font-bold text-primary">{item.price}</span>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="font-body font-semibold text-foreground w-6 text-center">{inCart.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                              <Plus className="w-4 h-4 text-primary-foreground" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                            className="bg-primary text-primary-foreground font-body text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shrink-0"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Cart - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <CartPanel cart={cart} updateQty={updateQty} form={form} setForm={setForm} onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile cart button */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-primary text-primary-foreground font-body font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-2xl"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart ({totalItems} items)
          </button>
        </div>
      )}

      {/* Mobile cart sheet */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-brown/50 lg:hidden"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
              <CartPanel cart={cart} updateQty={updateQty} form={form} setForm={setForm} onSubmit={(e) => { handleSubmit(e); setShowCart(false); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CartPanelProps {
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  form: { name: string; phone: string; address: string; delivery: boolean; notes: string };
  setForm: (f: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CartPanel = ({ cart, updateQty, form, setForm, onSubmit }: CartPanelProps) => (
  <div className="bg-card gold-border rounded-xl p-5">
    <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
      <ShoppingCart className="w-5 h-5 text-primary" /> Your Order
    </h3>

    {cart.length === 0 ? (
      <p className="font-body text-sm text-muted-foreground py-6 text-center">Your cart is empty</p>
    ) : (
      <>
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
          {cart.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{c.name}</p>
                <p className="font-body text-xs text-muted-foreground">{c.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(c.id, -1)} className="w-7 h-7 rounded bg-muted flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-body text-sm font-semibold w-4 text-center">{c.qty}</span>
                <button onClick={() => updateQty(c.id, 1)} className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <Plus className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-3 border-t border-border pt-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, delivery: true })}
              className={`flex-1 font-body text-sm py-2 rounded-lg transition-all ${form.delivery ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, delivery: false })}
              className={`flex-1 font-body text-sm py-2 rounded-lg transition-all ${!form.delivery ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Pickup
            </button>
          </div>
          {form.delivery && (
            <input
              type="text"
              placeholder="Delivery Address in Hisar"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-background border border-input rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <textarea
            placeholder="Special Instructions (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full bg-background border border-input rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="font-body text-xs text-muted-foreground">🛵 We deliver across Hisar city</p>
          <button type="submit" className="w-full bg-primary text-primary-foreground font-body font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Place Order
          </button>
        </form>
      </>
    )}
  </div>
);

export default Order;
