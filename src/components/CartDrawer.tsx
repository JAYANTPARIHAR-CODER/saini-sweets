import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, updateQty, totalItems } = useCart();
  const navigate = useNavigate();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCheckout = () => {
    onClose();
    navigate("/order", { state: { scrollToCheckout: true } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl"
            style={{ background: "#fdf8f0" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "#ddd0b8" }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-display text-lg font-bold text-foreground">Your Cart</span>
                {totalItems > 0 && (
                  <span
                    className="text-xs font-bold text-white rounded-full px-2 py-0.5"
                    style={{ background: "#7a1a1a" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "#f0e6d3" }}
                  >
                    <ShoppingCart className="w-9 h-9 text-primary/40" />
                  </div>
                  <p className="font-body text-muted-foreground text-sm">Your cart is empty</p>
                  <button
                    onClick={() => { onClose(); navigate("/order"); }}
                    className="font-body text-sm font-semibold text-primary underline underline-offset-2"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "#fff", border: "1px solid #ddd0b8" }}
                    >
                      {/* Item icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
                        style={{ background: "#f5ece0" }}
                      >
                        🍬
                      </div>

                      {/* Name & price */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <p className="font-body text-xs text-primary font-bold">{item.price}</p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                          style={{ background: "#f5ece0" }}
                          aria-label="Decrease quantity"
                        >
                          {item.qty === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-foreground" />
                          )}
                        </button>
                        <span className="font-body text-sm font-bold w-5 text-center text-foreground">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: "#7a1a1a" }}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t" style={{ borderColor: "#ddd0b8" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">
                    {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                  </span>
                  <span className="font-body text-xs text-muted-foreground">🛵 Delivery across Hisar</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full font-body font-semibold text-white py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] text-sm"
                  style={{ background: "linear-gradient(135deg, #7a1a1a 0%, #a82020 100%)" }}
                >
                  Proceed to Order →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
