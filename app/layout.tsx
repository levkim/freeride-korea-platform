import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "FREERIDE KOREA",
    template: "%s | FREERIDE KOREA",
  },
  description:
    "선수 육성, 안전 교육, 대회 정보, 프리라이드 투어와 산악 문화를 연결하는 한국 프리라이드 플랫폼입니다.",
  openGraph: {
    title: "FREERIDE KOREA",
    description:
      "선수 육성, 안전 교육, 대회 정보, 프리라이드 투어와 산악 문화를 연결하는 한국 프리라이드 플랫폼입니다.",
    url: getSiteUrl(),
    siteName: "FREERIDE KOREA",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-fk-snow)] text-[var(--color-fk-black)]">
        {children}
      </body>
    </html>
  );
}
