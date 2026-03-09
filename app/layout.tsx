import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "../context/StoreContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Daphné",
  description: "Tienda textil premium",
  icons: {
    icon: "/daphne-logo.png",
    shortcut: "/daphne-logo.png",
    apple: "/daphne-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}