import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle2, LogOut, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage whenever route changes
  useEffect(() => {
    const name = localStorage.getItem("user_name");
    setUserName(name);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("google_token");
    localStorage.removeItem("user_name");
    setUserName(null);
    setDropdownOpen(false);
    navigate("/auth");
  };

  // Helper: get initials (e.g. "Rahul Saini" → "RS")
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-footer-bg/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
          <span className="font-display text-xl md:text-2xl font-bold text-primary-foreground">
            Saini Sweets
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-body text-sm tracking-wide transition-colors duration-200 ${
                location.pathname === l.to
                  ? "text-secondary font-semibold"
                  : "text-primary-foreground/80 hover:text-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Order Now button */}
          <Link
            to="/order"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            Order Now
          </Link>

          {/* ── User avatar / Sign In ── */}
          {userName ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 group"
                aria-label="User menu"
              >
                {/* Avatar circle with initials */}
                <span
                  style={{
                    background: "linear-gradient(135deg, #7a1a1a 0%, #c9972c 100%)",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 0.5,
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(122,26,26,0.30)",
                    border: "2px solid rgba(201,151,44,0.5)",
                  }}
                >
                  {getInitials(userName)}
                </span>
                <span
                  className="font-body text-sm font-semibold text-primary-foreground/90 group-hover:text-secondary transition-colors"
                  style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-primary-foreground/60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    background: "#fdf8f0",
                    border: "1px solid #ddd0b8",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(122,26,26,0.14)",
                    minWidth: 200,
                    zIndex: 100,
                    overflow: "hidden",
                    animation: "ss-fade-in 0.18s ease both",
                  }}
                >
                  <style>{`@keyframes ss-fade-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }`}</style>
                  {/* User info row */}
                  <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #ddd0b8" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #7a1a1a 0%, #c9972c 100%)",
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(userName)}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#2c1a0e", fontSize: 14 }}>{userName}</div>
                        <div style={{ fontSize: 11, color: "#8a7060" }}>Signed in</div>
                      </div>
                    </div>
                  </div>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#7a1a1a",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5efe4")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className={`font-body text-sm tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                location.pathname === "/auth"
                  ? "text-secondary font-semibold"
                  : "text-primary-foreground/80 hover:text-secondary"
              }`}
            >
              <UserCircle2 className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-footer-bg/98 backdrop-blur-md border-t border-secondary/20">
          <div className="flex flex-col py-4 px-6 gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-base py-2 ${
                  location.pathname === l.to ? "text-secondary font-semibold" : "text-primary-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/order"
              className="bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-3 rounded-lg text-center mt-2"
            >
              Order Now
            </Link>
            {userName ? (
              <div className="flex items-center justify-between mt-1 pt-3 border-t border-secondary/20">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7a1a1a 0%, #c9972c 100%)",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {getInitials(userName)}
                  </span>
                  <span className="font-body text-sm font-semibold text-primary-foreground/90">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-primary-foreground/60 hover:text-secondary"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="font-body text-base py-2 text-primary-foreground/80 flex items-center gap-2">
                <UserCircle2 className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
