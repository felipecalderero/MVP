import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "MyMentalWellbeing",
//   description: "You've reached MyMentalWellbeing learning.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`overflow-x-hidden ${inter.className}`}>
        <Header/>

        <ClientProvider>
          {children}
        </ClientProvider>
        <Toaster theme="light" position="bottom-right" richColors/>

        {/* <Footer/> */}
      </body>
    </html>
  );
}
