"use client";
import { AuthProvider } from "@/lib/authContext";
export default function UploadLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
