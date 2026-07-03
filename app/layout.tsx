import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--bricolage",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gulshan Modest | Modest Fashion, Quietly Elevated",
  description:
    "Gulshan Modest crafts abayas, hijabs and modest essentials with botanical detailing, premium fabric and timeless silhouettes. Shop the new collection online, across Delhi NCR and pan-India.",
  keywords: [
    "Gulshan Modest",
    "modest fashion",
    "abaya",
    "hijab",
    "modest wear India",
  ],
  icons: {
    icon: '/logo-dark.webp',
    apple: '/logo-dark.webp',
  },
  openGraph: {
    title: "Gulshan Modest | Modest Fashion, Quietly Elevated",
    description:
      "Abayas, hijabs and modest essentials crafted with botanical detailing and premium fabric.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body className="font-body bg-cream text-ink antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
