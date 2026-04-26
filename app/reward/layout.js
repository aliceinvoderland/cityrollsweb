"use client";
import { AuthProvider } from "@/lib/authContext";
export default function RewardLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
