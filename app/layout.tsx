import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import SplashScreen from "@/components/SplashScreen";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripNexa | Premium Intercity & Self Drive Cars",
  description: "Book comfortable, safe, and reliable intercity taxi rides or rent a self-drive car with TripNexa. Quick booking, transparent pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <SplashScreen />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
