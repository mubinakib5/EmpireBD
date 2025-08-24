import localFont from "next/font/local";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
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
  title: "EmpireBD - Luxury Fashion & Lifestyle Store",
  description:
    "Discover the latest in luxury fashion, bags, accessories, and more at EmpireBD. Shop exclusive collections for men and women. Enjoy a premium shopping experience.",
  icons: {
    icon: "https://res.cloudinary.com/dfajluzjy/image/upload/v1756027845/1.ai_2_r40d5m.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
