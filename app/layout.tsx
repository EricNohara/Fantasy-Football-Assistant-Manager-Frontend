import type { Metadata } from "next";
import { baseFont } from "./localFont";
import { AuthProvider } from "./context/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FFOracle",
  description: "AI insights into weekly start and sit decisions for fantasy football",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={baseFont.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html >
  );
}
