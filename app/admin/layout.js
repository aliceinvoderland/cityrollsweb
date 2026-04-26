"use client";
import { AuthProvider } from "@/lib/authContext";
export default function AdminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
