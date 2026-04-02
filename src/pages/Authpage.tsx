import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { loginUser, logoutUser, registerUser } from "../api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [toast, setToast] = useState<string | null>(null);

  // Sign In form state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign Up form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogin = async () => {
    if (!siEmail || !siPassword) {
      showToast("Please enter your email and password.");
      return;
    }
    try {
      const response = await loginUser({ email: siEmail, password: siPassword });
      if (response.data.success) {
        showToast("Login successful! Welcome back 🍬");
        localStorage.setItem("token", response.data.data.token);
        if (response.data.data.name) {
          localStorage.setItem("user_name", response.data.data.name);
        }
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        showToast(response.data.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Login failed. Please check your credentials.";
      showToast(msg);
    }
  };

  const handleSignup = async () => {
    if (!firstName || !suEmail || !suPassword || !suConfirm) {
      showToast("Please fill in all required fields.");
      return;
    }
    if (suPassword !== suConfirm) {
      showToast("Passwords do not match!");
      return;
    }
    if (suPassword.length < 8) {
      showToast("Password must be at least 8 characters.");
      return;
    }
    try {
      const name = `${firstName} ${lastName}`.trim();
      const response = await registerUser({ name, email: suEmail, password: suPassword });
      if (response.data.success) {
        showToast("Account created! Welcome to Saini Sweets 🎉");
        localStorage.setItem("token", response.data.data.token);
        const fullName = `${firstName} ${lastName}`.trim();
        localStorage.setItem("user_name", fullName);
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        showToast(response.data.error || "Registration failed.");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Registration failed. Please try again.";
      showToast(msg);
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────────
  // Wrap your app's root with:
  //   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">...</GoogleOAuthProvider>
  // Get your Client ID from: https://console.cloud.google.com/ → Credentials → OAuth 2.0 Client IDs
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        // TODO: Send credentialResponse.credential (JWT) to your backend to verify
        // and exchange for your own app token, e.g.:
        //   const res = await googleAuthUser({ token: credentialResponse.credential });
        //   localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("google_token", credentialResponse.credential);
        // Decode the JWT to get the user's name
        try {
          const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
          if (payload.name) localStorage.setItem("user_name", payload.name);
        } catch {}
        showToast("Google authentication successful 🎉");
        setTimeout(() => navigate("/menu"), 1000);
      } else {
        showToast("Google authentication failed ❌");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      showToast("An error occurred during Google authentication.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    showToast("Google login failed ❌");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Lato:wght@300;400;600&display=swap');

        .ss-body {
          min-height: 100vh;
          background: #f5efe4;
          font-family: 'Lato', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .ss-body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 15% 20%, rgba(201,151,44,0.12) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(122,26,26,0.10) 0%, transparent 40%);
          pointer-events: none;
        }
        .ss-deco-tl {
          position: fixed; top: -60px; left: -60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          border: 30px solid #7a1a1a;
          opacity: 0.07; pointer-events: none;
        }
        .ss-deco-br {
          position: fixed; bottom: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 30px solid #c9972c;
          opacity: 0.07; pointer-events: none;
        }
        .ss-deco-line {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 6px;
          background: linear-gradient(90deg, #7a1a1a, #c9972c, #7a1a1a);
          pointer-events: none; z-index: 10;
        }
        .ss-toast {
          position: fixed; top: 24px; left: 50%;
          transform: translateX(-50%) translateY(-80px);
          background: #7a1a1a; color: #fff;
          padding: 12px 24px; border-radius: 8px;
          font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2);
          z-index: 999; white-space: nowrap;
        }
        .ss-toast.show { transform: translateX(-50%) translateY(0); }
        .ss-card {
          background: #fdf8f0;
          border: 1px solid #ddd0b8;
          border-radius: 18px;
          width: 100%; max-width: 430px;
          padding: 44px 44px 40px;
          box-shadow: 0 8px 40px rgba(122,26,26,0.10), 0 2px 8px rgba(0,0,0,0.06);
          position: relative; z-index: 1;
          animation: ss-slideUp 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }
        @keyframes ss-slideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .ss-card::before {
          content: '';
          display: block; height: 4px;
          background: linear-gradient(90deg, #7a1a1a, #c9972c);
          position: absolute; top: 0; left: 0; right: 0;
          border-radius: 18px 18px 0 0;
        }
        .ss-logo { text-align: center; margin-bottom: 28px; }
        .ss-logo-dot {
          display: inline-block; width: 10px; height: 10px;
          background: #c9972c; border-radius: 50%; margin-bottom: 6px;
        }
        .ss-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #7a1a1a; letter-spacing: 0.5px;
          display: block; line-height: 1;
        }
        .ss-logo-sub {
          font-size: 11px; color: #8a7060;
          letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;
          display: block;
        }
        .ss-tabs {
          display: flex; background: #f5efe4;
          border-radius: 8px; padding: 4px;
          margin-bottom: 28px; border: 1px solid #ddd0b8;
        }
        .ss-tab {
          flex: 1; padding: 9px; border: none;
          border-radius: 6px; background: transparent;
          font-family: 'Lato', sans-serif; font-size: 14px;
          font-weight: 600; color: #8a7060; cursor: pointer;
          transition: all 0.25s ease; letter-spacing: 0.3px;
        }
        .ss-tab.active {
          background: #7a1a1a; color: #fff;
          box-shadow: 0 2px 8px rgba(122,26,26,0.25);
        }
        .ss-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; color: #2c1a0e; margin-bottom: 6px;
        }
        .ss-form-desc { font-size: 13px; color: #8a7060; margin-bottom: 22px; }
        .ss-field { margin-bottom: 16px; }
        .ss-field label {
          display: block; font-size: 12px; font-weight: 600;
          color: #7a1a1a; text-transform: uppercase;
          letter-spacing: 0.8px; margin-bottom: 6px;
        }
        .ss-field input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #ddd0b8; border-radius: 8px;
          background: #f5efe4;
          font-family: 'Lato', sans-serif; font-size: 14px;
          color: #2c1a0e; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ss-field input:focus {
          border-color: #7a1a1a;
          box-shadow: 0 0 0 3px rgba(122,26,26,0.10);
          background: #fff;
        }
        .ss-field input::placeholder { color: #bfaf9e; }
        .ss-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ss-forgot { text-align: right; margin-top: -8px; margin-bottom: 16px; }
        .ss-forgot a {
          font-size: 12px; color: #c9972c;
          text-decoration: none; font-weight: 600;
        }
        .ss-btn-primary {
          width: 100%; padding: 13px;
          background: #7a1a1a; color: #fff;
          border: none; border-radius: 8px;
          font-family: 'Lato', sans-serif; font-size: 15px;
          font-weight: 600; letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 4px;
          box-shadow: 0 3px 12px rgba(122,26,26,0.25);
        }
        .ss-btn-primary:hover {
          background: #5c1010; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(122,26,26,0.30);
        }
        .ss-btn-primary:active { transform: scale(0.98); }
        .ss-divider {
          display: flex; align-items: center;
          gap: 10px; margin: 18px 0;
          color: #8a7060; font-size: 12px;
        }
        .ss-divider::before, .ss-divider::after {
          content: ''; flex: 1; height: 1px; background: #ddd0b8;
        }
        .ss-btn-google {
          width: 100%; padding: 11px;
          border: 1.5px solid #ddd0b8; border-radius: 8px;
          background: #fff;
          font-family: 'Lato', sans-serif; font-size: 14px;
          font-weight: 600; color: #2c1a0e; cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ss-btn-google:hover {
          border-color: #c9972c;
          box-shadow: 0 2px 8px rgba(201,151,44,0.12);
        }
        .ss-terms {
          font-size: 11.5px; color: #8a7060;
          text-align: center; margin-top: 14px; line-height: 1.6;
        }
        .ss-terms a { color: #c9972c; text-decoration: none; font-weight: 600; }
        .ss-switch {
          text-align: center; margin-top: 20px;
          font-size: 13px; color: #8a7060;
          padding-top: 18px; border-top: 1px solid #ddd0b8;
        }
        .ss-switch button {
          background: none; border: none;
          color: #7a1a1a; font-weight: 700;
          font-size: 13px; cursor: pointer;
          font-family: 'Lato', sans-serif;
          padding: 0;
        }
        .ss-switch button:hover { text-decoration: underline; }
        .ss-google-wrap { display: flex; justify-content: center; }
      `}</style>

      <div className="ss-body">
        <div className="ss-deco-tl" />
        <div className="ss-deco-br" />
        <div className="ss-deco-line" />

        {/* Toast */}
        <div className={`ss-toast ${toast ? "show" : ""}`}>{toast}</div>

        <div className="ss-card">
          {/* Logo */}
          <div className="ss-logo">
            <span className="ss-logo-dot" />
            <span className="ss-logo-name">Saini Sweets</span>
            <span className="ss-logo-sub">Handmade with love in Hisar</span>
          </div>

          {/* Tabs */}
          <div className="ss-tabs">
            <button
              className={`ss-tab ${tab === "signin" ? "active" : ""}`}
              onClick={() => setTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`ss-tab ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* ── Sign In ── */}
          {tab === "signin" && (
            <div>
              <p className="ss-form-title">Welcome back! 🍬</p>
              <p className="ss-form-desc">Sign in to your account to continue ordering</p>

              <div className="ss-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                />
              </div>
              <div className="ss-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={siPassword}
                  onChange={(e) => setSiPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="ss-forgot">
                <a href="#">Forgot password?</a>
              </div>

              <button className="ss-btn-primary" onClick={handleLogin}>
                Sign In
              </button>

              <div className="ss-divider">or continue with</div>
              <div className="ss-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              <div className="ss-switch">
                Don't have an account?{" "}
                <button onClick={() => setTab("signup")}>Sign Up</button>
              </div>
            </div>
          )}

          {/* ── Sign Up ── */}
          {tab === "signup" && (
            <div>
              <p className="ss-form-title">Create an account 🛍️</p>
              <p className="ss-form-desc">Join us and get exclusive sweet deals!</p>

              <div className="ss-row2">
                <div className="ss-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="ss-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Saini"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="ss-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                />
              </div>
              <div className="ss-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="ss-row2">
                <div className="ss-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 chars"
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                  />
                </div>
                <div className="ss-field">
                  <label>Confirm</label>
                  <input
                    type="password"
                    placeholder="Repeat"
                    value={suConfirm}
                    onChange={(e) => setSuConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />
                </div>
              </div>

              <button className="ss-btn-primary" onClick={handleSignup}>
                Create Account
              </button>

              <div className="ss-divider">or sign up with</div>
              <div className="ss-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              <p className="ss-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </p>

              <div className="ss-switch">
                Already have an account?{" "}
                <button onClick={() => setTab("signin")}>Sign In</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
