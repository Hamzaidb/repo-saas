import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import RootClient from "@/components/RootClient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Votre Application",
  description: "Description de votre application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <RootClient>{children}</RootClient>
        </AuthProvider>
      </body>
    </html>
  );
}
