import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MIMUNYA | 澳門國際模擬聯合國青年協會",
  description: "透過模擬聯合國活動培養青年的國際視野與領導能力",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='%231a2744' stroke-width='3'/><circle cx='50' cy='50' r='20' fill='none' stroke='%231a2744' stroke-width='2'/><line x1='5' y1='50' x2='95' y2='50' stroke='%231a2744' stroke-width='2'/><line x1='50' y1='5' x2='50' y2='95' stroke='%231a2744' stroke-width='2'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
