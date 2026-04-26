// components/Loader.js — Premium page loader with breathing logo
"use client";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="loader" className={hidden ? "done" : ""}>
      <div className="loader-logo">
        <BrandLogo variant="loader" alt="City Roll logo" />
      </div>
      <div className="loader-bar" />
    </div>
  );
}
