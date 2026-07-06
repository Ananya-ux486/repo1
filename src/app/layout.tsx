import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import ScrollLock from "@/components/ScrollLock";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="textured-bg min-h-screen flex flex-col text-foreground">
        <ScrollLock />
        <PageLoader />
        <Header />
        <div id="app-root" className="flex flex-1 flex-col">
          <SmoothScroll>
            <CursorGlow />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
        </div>
        <FloatingWidgets />
      </body>
    </html>
  );
}
