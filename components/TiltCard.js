// components/TiltCard.js — 3D tilt on hover (perspective rotation)
"use client";
import { useRef } from "react";

export default function TiltCard({ children, className = "", max = 8 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -max;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * (max * 1.2);
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}
