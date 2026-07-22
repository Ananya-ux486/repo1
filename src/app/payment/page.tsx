import type { Metadata } from "next";
import PaymentCheckout from "@/components/PaymentCheckout";

export const metadata: Metadata = {
  title: "Secure Payment | TasmaFive Solutions",
  description: "Pay securely for TasmaFive Solutions services.",
  robots: { index: false, follow: false },
};

export default function PaymentPage() {
  return <PaymentCheckout />;
}
