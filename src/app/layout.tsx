import type { Metadata } from "next";
import { Poppins, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth/auth-context";

// Poppins font - used by Tower Garage Doors and Arturos websites
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Dancing Script - for elegant script typography
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malipula Suits | Royal. Rooted. Refined. | Custom Tailoring Dar es Salaam",
  description: "Malipula Suits - Award-winning custom tailoring in Dar es Salaam, Tanzania. Premium bespoke suits, shirts, trousers, and kaftans. Experience exceptional craftsmanship where tradition meets modern style.",
  keywords: ["Malipula Suits", "custom tailoring", "bespoke suits", "Dar es Salaam", "Tanzania", "men's fashion", "African tailoring", "luxury suits", "wedding suits", "kaftan"],
  authors: [{ name: "Malipula Suits" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Malipula Suits | Royal. Rooted. Refined.",
    description: "Award-winning custom tailoring in Dar es Salaam, Tanzania. Premium bespoke suits, shirts, and traditional wear.",
    url: "https://malipula.co.tz",
    siteName: "Malipula Suits",
    type: "website",
    locale: "en_TZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Malipula Suits | Royal. Rooted. Refined.",
    description: "Award-winning custom tailoring in Dar es Salaam, Tanzania",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${dancingScript.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
