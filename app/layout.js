import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthSessionProvider from "./components/SessionProvider";
import MetaPixel from "./components/MetaPixel";
import { CartProvider } from "./context/CartContext";
import { MetaPixelProvider } from "./context/MetaPixelContext";
import { getSiteSettings } from "../lib/siteSettings";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "EmpireBD - Go Timeless With Comfort",
  description:
    "Discover the latest in luxury fashion, bags, accessories, and more at EmpireBD. Shop exclusive collections for men and women. Enjoy a premium shopping experience.",
  icons: {
    icon: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756027845/1.ai_2_r40d5m.svg",
  },
};

export default async function RootLayout({ children }) {
  const siteSettings = await getSiteSettings();
  const { metaPixel } = siteSettings;

  return (
    <html lang="en">
      <head>
        {metaPixel?.enabled && metaPixel?.pixelId && (
          <MetaPixel 
            pixelId={metaPixel.pixelId} 
            testMode={metaPixel.testMode || false}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <MetaPixelProvider pixelConfig={metaPixel}>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </CartProvider>
          </MetaPixelProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
