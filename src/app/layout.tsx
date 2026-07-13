import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import HashScroll from "@/components/HashScroll";
import MotionProvider from "@/components/MotionProvider";
import PageLoader from "@/components/PageLoader";
import ScrollLock from "@/components/ScrollLock";
import {
  DeferredAiChatbot,
  DeferredCursorGlow,
  DeferredFloatingWidgets,
} from "@/components/DeferredClient";
import AuditFormProviderGate from "@/components/AuditFormProviderGate";
import RouteMark from "@/components/RouteMark";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://translate.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://translate.google.com" />
      </head>
      <body className="textured-bg min-h-screen flex flex-col text-foreground">
        <PageLoader />
        <ScrollLock />
        <RouteMark />
        <Header />
        <div id="app-root" className="flex min-h-0 flex-1 flex-col max-lg:block max-lg:min-h-0 max-lg:flex-none">
          <MotionProvider>
            <SmoothScroll>
              <HashScroll />
              <DeferredCursorGlow />
              <AuditFormProviderGate>
                <main className="max-lg:block lg:flex-1">{children}</main>
                <Footer />
              </AuditFormProviderGate>
            </SmoothScroll>
          </MotionProvider>
        </div>
        <DeferredFloatingWidgets />
        <DeferredAiChatbot />
      </body>
    </html>
  );
}
