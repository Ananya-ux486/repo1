"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ArrowRight,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import PhoneWithCountryField from "@/components/PhoneWithCountryField";

type Mode = "login" | "signup" | "otp" | "admin";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type ProjectsAuthModalProps = {
  open: boolean;
  onUnlocked: (user: AuthUser) => void;
  purpose?: "projects" | "payment";
};

async function postJson<T>(url: string, body: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data: (T & { error?: string }) | null = null;
  try {
    data = raw ? (JSON.parse(raw) as T & { error?: string }) : ({} as T);
  } catch {
    throw new Error(
      "Server did not return a valid response. Please confirm the site API is running and try again.",
    );
  }
  if (!res.ok) throw new Error(data?.error || "Something went wrong.");
  return data as T;
}

export default function ProjectsAuthModal({
  open,
  onUnlocked,
  purpose = "projects",
}: ProjectsAuthModalProps) {
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneDial, setPhoneDial] = useState("+91");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetMessages = () => {
    setError("");
    setInfo("");
  };

  const finishAuth = (
    data: { user: AuthUser; message?: string; otpRequired?: boolean; demoOtp?: string },
  ) => {
    if (data.otpRequired) {
      setDemoOtp(data.demoOtp);
      setInfo(data.message || "OTP sent.");
      setMode("otp");
      return;
    }
    setInfo(data.message || "Signed in successfully.");
    onUnlocked(data.user);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const data = await postJson<{
        message?: string;
        demoOtp?: string;
        otpRequired?: boolean;
        user: AuthUser;
      }>("/api/auth/signup", {
        name,
        email,
        phone: `${phoneDial} ${phone}`.trim(),
        password,
      });
      finishAuth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const data = await postJson<{
        message?: string;
        demoOtp?: string;
        otpRequired?: boolean;
        user: AuthUser;
      }>("/api/auth/login", { email, password });
      finishAuth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const data = await postJson<{ user: AuthUser }>("/api/auth/admin-login", {
        email: adminEmail,
        password: adminPassword,
      });
      onUnlocked(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const data = await postJson<{ user: AuthUser }>("/api/auth/otp/verify", {
        email,
        code: otp,
      });
      onUnlocked(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    resetMessages();
    setLoading(true);
    try {
      const data = await postJson<{ message?: string; demoOtp?: string }>(
        "/api/auth/otp/send",
        { email },
      );
      setDemoOtp(data.demoOtp);
      setInfo(data.message || "OTP resent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const formId =
    mode === "admin"
      ? "admin-form"
      : mode === "otp"
        ? "otp-form"
        : mode === "login"
          ? "login-form"
          : "signup-form";
  const isPayment = purpose === "payment";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[5px]" />

          <div className="relative flex min-h-full items-center justify-center p-3 sm:p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="projects-auth-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] my-2 flex w-full max-w-[440px] flex-col rounded-2xl border border-white/50 bg-white shadow-2xl"
              style={{ maxHeight: "calc(100dvh - 1.5rem)" }}
            >
              <div className="shrink-0 border-b border-border/50 px-4 pb-2.5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                    {mode === "admin" ? (
                      <Shield className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
                      {isPayment ? "Secure checkout" : "Private portfolio"}
                    </p>
                    <h2
                      id="projects-auth-title"
                      className="text-sm font-bold text-foreground"
                    >
                      {mode === "otp"
                        ? "Verify OTP"
                        : mode === "admin"
                          ? "Admin access"
                          : mode === "login"
                            ? "Login to continue"
                            : isPayment
                              ? "Sign up to continue"
                              : "Sign up to view projects"}
                    </h2>
                  </div>
                </div>
              </div>

              {mode !== "otp" && (
                <div
                  className={`mx-3 mt-2 grid shrink-0 gap-0.5 rounded-lg bg-slate-100 p-0.5 ${
                    isPayment ? "grid-cols-2" : "grid-cols-3"
                  }`}
                >
                  <TabBtn
                    active={mode === "signup"}
                    onClick={() => {
                      setMode("signup");
                      resetMessages();
                    }}
                    icon={UserPlus}
                    label="Sign Up"
                  />
                  <TabBtn
                    active={mode === "login"}
                    onClick={() => {
                      setMode("login");
                      resetMessages();
                    }}
                    icon={LogIn}
                    label="Login"
                  />
                  {!isPayment && (
                    <TabBtn
                      active={mode === "admin"}
                      onClick={() => {
                        setMode("admin");
                        resetMessages();
                      }}
                      icon={Shield}
                      label="Admin"
                    />
                  )}
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {error && (
                  <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                    {error}
                  </p>
                )}
                {info && (
                  <p className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
                    {info}
                  </p>
                )}
                {demoOtp && mode === "otp" && (
                  <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
                    Demo OTP:{" "}
                    <span className="font-bold tracking-widest">{demoOtp}</span>
                  </p>
                )}

                {mode === "signup" && (
                  <form
                    id="signup-form"
                    onSubmit={handleSignup}
                    className="space-y-2"
                  >
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Field
                        icon={User}
                        label="Full name"
                        value={name}
                        onChange={setName}
                        autoComplete="name"
                        required
                      />
                      <div className="sm:col-span-2">
                        <PhoneWithCountryField
                          required
                          value={phone}
                          onChange={setPhone}
                          onDialChange={setPhoneDial}
                        />
                      </div>
                    </div>
                    <Field
                      icon={Mail}
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      autoComplete="email"
                      required
                    />
                    <PasswordField
                      value={password}
                      onChange={setPassword}
                      show={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                  </form>
                )}

                {mode === "login" && (
                  <form
                    id="login-form"
                    onSubmit={handleLogin}
                    className="space-y-2"
                  >
                    <Field
                      icon={Mail}
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      autoComplete="email"
                      required
                    />
                    <PasswordField
                      value={password}
                      onChange={setPassword}
                      show={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                    />
                  </form>
                )}

                {mode === "admin" && (
                  <form
                    id="admin-form"
                    onSubmit={handleAdminLogin}
                    className="space-y-2"
                  >
                    <p className="rounded-lg border border-brand/20 bg-orange-50 px-2.5 py-2 text-xs text-slate-700">
                      TasmaFive team only — no OTP required. Use your admin
                      email &amp; password to unlock projects.
                    </p>
                    <Field
                      icon={Mail}
                      label="Admin email"
                      type="email"
                      value={adminEmail}
                      onChange={setAdminEmail}
                      autoComplete="username"
                      required
                    />
                    <PasswordField
                      value={adminPassword}
                      onChange={setAdminPassword}
                      show={showAdminPassword}
                      onToggle={() => setShowAdminPassword((v) => !v)}
                      label="Admin password"
                    />
                  </form>
                )}

                {mode === "otp" && (
                  <form
                    id="otp-form"
                    onSubmit={handleVerifyOtp}
                    className="space-y-2"
                  >
                    <p className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-muted">
                      Sent to{" "}
                      <span className="font-semibold text-foreground">
                        {email}
                      </span>
                    </p>
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                        <ShieldCheck className="h-3 w-3 text-brand" />
                        6-digit OTP
                      </span>
                      <input
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-center text-lg font-bold tracking-[0.35em] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        placeholder="••••••"
                        required
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="w-full text-center text-xs font-semibold text-brand hover:underline disabled:opacity-60"
                    >
                      Resend OTP
                    </button>
                  </form>
                )}
              </div>

              <div className="shrink-0 border-t border-border/50 bg-white px-4 py-3">
                <SubmitButton form={formId} loading={loading}>
                  {mode === "otp"
                    ? isPayment
                      ? "Verify & continue to payment"
                      : "Verify & view projects"
                    : mode === "admin"
                      ? "Admin unlock"
                      : mode === "login"
                        ? "Login & continue"
                        : isPayment
                          ? "Create account & continue"
                          : "Create account & continue"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </SubmitButton>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof User;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[11px] font-semibold transition sm:text-xs ${
        active
          ? "bg-white text-foreground shadow-sm"
          : "text-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-lg border border-border bg-white py-1.5 pl-7 pr-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </span>
    </label>
  );
}

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
  label = "Password",
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className="relative block">
        <Lock className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="current-password"
          required
          minLength={8}
          className="w-full rounded-lg border border-border bg-white py-1.5 pl-7 pr-8 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      </span>
    </label>
  );
}

function SubmitButton({
  loading,
  children,
  form,
}: {
  loading: boolean;
  children: ReactNode;
  form?: string;
}) {
  return (
    <button
      type="submit"
      form={form}
      disabled={loading}
      className="inline-flex w-full min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
