import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import { getCategories, getProducts } from "@/lib/api";

const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"] });
export const metadata = { title: "বাজার দর", description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।" };

export default async function RootLayout({ children }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <html lang="bn" data-theme="light">
      <body className={`${font.className} min-h-screen flex flex-col`}>
        <Navbar categories={categories} />
        <Ticker products={products} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
