"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function RootClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
    </>
  );
}
