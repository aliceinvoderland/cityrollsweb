"use client";
import { AuthProvider } from "@/lib/authContext";
export default function DashboardLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
