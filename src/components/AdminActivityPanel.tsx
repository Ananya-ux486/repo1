"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, RefreshCw } from "lucide-react";

type ActivityEvent = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  ip?: string;
  createdAt: string;
  notifiedAdmin: boolean;
};

const typeLabel: Record<string, string> = {
  signup: "New signup",
  login: "Login",
  otp_verified: "OTP verified · projects unlocked",
  admin_login: "Admin login",
};

export default function AdminActivityPanel() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/activity", { cache: "no-store" });
      const data = (await res.json()) as {
        events?: ActivityEvent[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Failed to load activity");
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-slate-50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Bell className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Login activity database
            </h2>
            <p className="text-xs text-muted">
              Login credentials saved here
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading activity…
          </div>
        ) : error ? (
          <p className="px-4 py-6 text-sm text-red-600">{error}</p>
        ) : events.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No login yet
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {e.name}{" "}
                    <span className="font-normal text-muted">&lt;{e.email}&gt;</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {typeLabel[e.type] || e.type}
                    {e.phone ? ` · ${e.phone}` : ""}
                    {e.ip ? ` · IP ${e.ip}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-xs font-medium text-foreground">
                    {new Date(e.createdAt).toLocaleString()}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      e.notifiedAdmin ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {e.notifiedAdmin ? "Email notified" : "Logged (email pending)"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
