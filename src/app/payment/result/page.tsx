import type { Metadata } from "next";
import PaymentResult from "@/components/PaymentResult";

export const metadata: Metadata = {
  title: "Payment Status | TasmaFive Solutions",
  robots: { index: false, follow: false },
};

export default function PaymentResultPage() {
  return <PaymentResult />;
}
