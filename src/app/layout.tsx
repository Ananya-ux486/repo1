import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import HashScroll from "@/components/HashScroll";
import MotionProvider from "@/components/MotionProvider";
import PageLoader from "@/components/PageLoader";
import ScrollLock from "@/components/ScrollLock";
import {
  DeferredAiChatbot,
  DeferredFloatingWidgets,
} from "@/components/DeferredClient";
import AuditFormProviderGate from "@/components/AuditFormProviderGate";
import RouteMark from "@/components/RouteMark";
import RouteProgress from "@/components/RouteProgress";
import NavPrefetch from "@/components/NavPrefetch";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef6ff" },
    { media: "(prefers-color-scheme: dark)", color: "#eef6ff" },
  ],
};

export const metadata: Metadata = {
  title: "TasmaFive Solutions | Smart IT Solutions for Digital Growth",
  description:
    "Professional IT company providing website development, software solutions, digital marketing, cloud solutions, and government project services.",
  keywords: [
    "TasmaFive Solutions",
    "web development",
    "software development",
    "IT company Kanpur",
    "digital marketing",
    "cloud solutions",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`} data-tf-scroll="native">
      <body
        className="textured-bg text-foreground"
        data-tf-loading="true"
        data-tf-scroll="native"
      >
        <PageLoader />
        <RouteProgress />
        <NavPrefetch />
        <ScrollLock />
        <RouteMark />
        <Header />
        {/* Native document scroll — browser scrollbar + trackpad. #tf-page-scroll is a marker only. */}
        <div id="tf-page-scroll" className="tf-page-scroll">
          <div id="app-root" className="block w-full">
            <MotionProvider>
              <SmoothScroll>
                <HashScroll />
                <AuditFormProviderGate>
                  <main className="block w-full">{children}</main>
                  <Footer />
                </AuditFormProviderGate>
              </SmoothScroll>
            </MotionProvider>
          </div>
        </div>
        <DeferredFloatingWidgets />
        <DeferredAiChatbot />
      </body>
    </html>
  );
}
