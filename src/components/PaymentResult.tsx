"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  Home,
  ReceiptText,
  XCircle,
} from "lucide-react";
import ProjectsAuthModal from "@/components/ProjectsAuthModal";

type Payment = {
  reference: string;
  provider: string;
  status: string;
  displayAmount: string;
  currency: string;
  serviceTitle: string;
  paidAt?: string;
  createdAt: string;
};

export default function PaymentResult() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || "";
    const cancelled = params.get("cancelled") === "1";
    const paypalReturn = params.get("paypal_return") === "1";
    const paypalOrder = params.get("token") || "";

    async function post(url: string, body: Record<string, string>) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed.");
    }

    async function readStatus() {
      const response = await fetch(
        `/api/payments/status/${encodeURIComponent(reference)}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment not found.");
      return data.payment as Payment;
    }

    async function verify() {
      try {
        if (!reference) {
          setError("Payment reference is missing.");
          return;
        }
        const sessionResponse = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const session = await sessionResponse.json();
        if (
          !sessionResponse.ok ||
          !session.authenticated ||
          !session.projectsAccess ||
          session.user?.id === "team-admin"
        ) {
          setAuthRequired(true);
          return;
        }
        if (cancelled) {
          await post("/api/payments/cancel", { reference });
        } else if (paypalReturn && paypalOrder) {
          await post("/api/payments/paypal/capture", {
            reference,
            orderId: paypalOrder,
          });
        }
        let current = await readStatus();
        setPayment(current);
        if (!cancelled && ["created", "pending"].includes(current.status)) {
          for (let attempt = 0; attempt < 5; attempt += 1) {
            await new Promise((resolve) => window.setTimeout(resolve, 1500));
            current = await readStatus();
            setPayment(current);
            if (!["created", "pending"].includes(current.status)) break;
          }
        }
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to verify payment.");
      } finally {
        setLoading(false);
      }
    }

    void verify();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center text-sm text-slate-600">
        Verifying payment securely…
      </div>
    );
  }

  if (authRequired) {
    return (
      <section className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ReceiptText className="mx-auto h-10 w-10 text-slate-900" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950">
            Login to view this payment
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in with the account that owns this payment to view its status
            and download the receipt.
          </p>
        </div>
        <ProjectsAuthModal
          open
          purpose="payment"
          onUnlocked={() => window.location.reload()}
        />
      </section>
    );
  }

  const paid = payment?.status === "paid";
  const cancelled = payment?.status === "cancelled";
  const pending = payment && ["created", "pending"].includes(payment.status);
  const Icon = paid ? CheckCircle2 : pending ? Clock3 : cancelled ? XCircle : AlertCircle;
  const color = paid
    ? "text-emerald-600"
    : pending
      ? "text-amber-600"
      : "text-red-600";

  return (
    <section className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        <Icon className={`mx-auto h-14 w-14 ${color}`} />
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          {paid
            ? "Payment successful"
            : pending
              ? "Payment confirmation pending"
              : cancelled
                ? "Payment cancelled"
                : "Payment not completed"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          {paid
            ? "Thank you. Your payment has been verified and recorded."
            : pending
              ? "The provider is still confirming this payment. Please do not pay again. Contact us with the reference below."
              : error || "No amount was charged, or the provider declined the transaction."}
        </p>

        {payment && (
          <dl className="mt-7 space-y-3 rounded-xl bg-slate-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Reference</dt>
              <dd className="break-all text-right font-semibold text-slate-900">
                {payment.reference}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Service</dt>
              <dd className="text-right font-semibold text-slate-900">
                {payment.serviceTitle}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Amount</dt>
              <dd className="font-semibold text-slate-900">{payment.displayAmount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Provider</dt>
              <dd className="font-semibold capitalize text-slate-900">
                {payment.provider}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {paid && payment && (
            <a
              href={`/api/payments/receipt/${encodeURIComponent(payment.reference)}`}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              <Download className="h-4 w-4" />
              Download receipt
            </a>
          )}
          {!paid && (
            <Link
              href="/payment"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              <ReceiptText className="h-4 w-4" />
              Try again
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
