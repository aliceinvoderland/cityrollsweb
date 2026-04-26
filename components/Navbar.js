// components/Navbar.js — sticky glassmorphic nav
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar({ showLinks = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 200 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "scrolled" : ""
      } ${hidden ? "hidden-nav" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" aria-label="City Roll home" className="flex items-center shrink-0">
          <BrandLogo variant="nav" />
        </Link>

        {showLinks && (
          <div className="hidden md:flex items-center gap-8 text-sm text-bone/70">
            <Link href="/menu" className="link-underline">Menu</Link>
            <a href="/#how" className="link-underline">How it works</a>
            <a href="/#rewards" className="link-underline">Rewards</a>
            <a href="/#visit" className="link-underline">Visit</a>
          </div>
        )}

        <Link href="/login" className="btn-ghost text-sm">
          <span>Get started</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H8M17 7V16" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
