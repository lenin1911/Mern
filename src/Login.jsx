import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import "./Landing.css";

/* ─── Google SVG ──────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

/* ─── Auth Modal ──────────────────────────────────────────────────────── */
function AuthModal({ mode, onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode); // "login" | "signup"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (currentMode === "signup" && form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (currentMode === "login") {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      }
      onClose();
    } catch (err) {
      const msg = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/email-already-in-use": "An account already exists for this email.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      }[err.code] || "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setApiError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request")
        setApiError("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lnd-modal-overlay" onClick={onClose}>
      <div className="lnd-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lnd-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo */}
        <div className="lnd-modal-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0052cc" />
            <rect x="5" y="5" width="9" height="19" rx="2" fill="white" />
            <rect x="18" y="5" width="9" height="12" rx="2" fill="white" />
          </svg>
          <span>Taskly</span>
        </div>

        <h2 className="lnd-modal-title">
          {currentMode === "login" ? "Log in to Taskly" : "Sign up for your account"}
        </h2>

        {apiError && <div className="lnd-modal-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate className="lnd-modal-form">
          <div className="lnd-field">
            <label htmlFor="modal-email">Email</label>
            <input
              id="modal-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "lnd-input-error" : ""}
              disabled={loading}
            />
            {errors.email && <span className="lnd-error">{errors.email}</span>}
          </div>

          <div className="lnd-field">
            <label htmlFor="modal-password">Password</label>
            <input
              id="modal-password"
              type="password"
              name="password"
              autoComplete={currentMode === "login" ? "current-password" : "new-password"}
              placeholder={currentMode === "login" ? "Enter your password" : "Create a password (min. 6 chars)"}
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "lnd-input-error" : ""}
              disabled={loading}
            />
            {errors.password && <span className="lnd-error">{errors.password}</span>}
          </div>

          <button type="submit" className="lnd-btn-primary" disabled={loading}>
            {loading ? "Please wait…" : currentMode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <div className="lnd-modal-divider"><span>OR</span></div>

        <button className="lnd-btn-google" onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="lnd-modal-switch">
          {currentMode === "login" ? (
            <>Don't have an account? <button className="lnd-link" onClick={() => { setCurrentMode("signup"); setApiError(""); setErrors({}); }}>Sign up for free</button></>
          ) : (
            <>Already have an account? <button className="lnd-link" onClick={() => { setCurrentMode("login"); setApiError(""); setErrors({}); }}>Log in</button></>
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── Landing Page ────────────────────────────────────────────────────── */
function Login({ onSwitch }) {
  const [modal, setModal] = useState(null); // null | "login" | "signup"
  const [heroEmail, setHeroEmail] = useState("");

  const handleHeroSignup = (e) => {
    e.preventDefault();
    setModal("signup");
  };

  return (
    <div className="lnd-root">
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="lnd-nav">
        <div className="lnd-nav-left">
          <div className="lnd-nav-brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#0052cc" />
              <rect x="5" y="5" width="9" height="19" rx="2" fill="white" />
              <rect x="18" y="5" width="9" height="12" rx="2" fill="white" />
            </svg>
            <span className="lnd-nav-brand-name">Taskly</span>
          </div>

          <div className="lnd-nav-links">
            {["Features", "Solutions", "Plans", "Pricing", "Resources"].map((item) => (
              <button key={item} className="lnd-nav-link">
                {item} <span className="lnd-nav-caret">▾</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lnd-nav-right">
          <button className="lnd-nav-login" onClick={() => setModal("login")}>
            Log in
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <main className="lnd-hero">
        <div className="lnd-hero-left">
          <h1 className="lnd-hero-title">
            Capture, organize, and tackle your to-dos from anywhere.
          </h1>
          <p className="lnd-hero-subtitle">
            Escape the clutter and chaos — unleash your productivity with Taskly.
          </p>

          <form className="lnd-hero-form" onSubmit={handleHeroSignup}>
            <input
              type="email"
              className="lnd-hero-email"
              placeholder="Email"
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="lnd-hero-cta">
              Sign up — it's free!
            </button>
          </form>

          <p className="lnd-hero-disclaimer">
            By entering my email, I acknowledge the{" "}
            <a href="#" className="lnd-hero-link">Privacy Policy</a>.
          </p>
        </div>

        <div className="lnd-hero-right">
          <img
            src="/hero.png"
            alt="Taskly app on mobile showing a Kanban board"
            className="lnd-hero-img"
          />
        </div>
      </main>

      {/* ── Feature Ribbon ───────────────────────────────────────── */}
      <section className="lnd-features">
        {[
          { icon: "📋", title: "Boards & Cards", desc: "Organize anything in flexible Kanban boards." },
          { icon: "🤝", title: "Collaborate", desc: "Work with your team in real time, from anywhere." },
          { icon: "🔗", title: "Integrations", desc: "Connect Slack, Google Drive, and 200+ apps." },
          { icon: "📱", title: "Mobile Ready", desc: "Access your tasks on any device, anytime." },
        ].map((f) => (
          <div key={f.title} className="lnd-feature-card">
            <span className="lnd-feature-icon">{f.icon}</span>
            <h3 className="lnd-feature-title">{f.title}</h3>
            <p className="lnd-feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Auth Modal ───────────────────────────────────────────── */}
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

export default Login;
