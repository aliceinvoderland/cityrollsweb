// app/layout.js — Root layout with global atmosphere
import Script from "next/script";
import "./globals.css";
import Loader from "@/components/Loader";
import AmbientOrbs from "@/components/AmbientOrbs";

const extensionErrorGuard = `
(() => {
  if (window.__CITY_ROLL_EXTENSION_GUARD__) return;
  window.__CITY_ROLL_EXTENSION_GUARD__ = true;

  const hasExtensionOrigin = (value) =>
    typeof value === "string" &&
    (value.includes("chrome-extension://") || value.includes("moz-extension://"));

  const shouldIgnore = (event) => {
    const error = event && "error" in event ? event.error : null;
    const reason = event && "reason" in event ? event.reason : null;
    const filename = typeof event?.filename === "string" ? event.filename : "";
    const stack = error?.stack || reason?.stack || "";

    return hasExtensionOrigin(filename) || hasExtensionOrigin(stack);
  };

  const swallow = (event) => {
    if (!shouldIgnore(event)) return;
    event.preventDefault?.();
    event.stopImmediatePropagation?.();
  };

  window.addEventListener("error", swallow, true);
  window.addEventListener("unhandledrejection", swallow, true);
})();
`;

export const metadata = {
  title: "City Roll — Taste will bring you again",
  description: "Hand-rolled. Fresh-pressed. Unforgettable. Upload 3 bills, get a free Mojito.",
  icons: {
    icon: "/city-roll-logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0706",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="extension-error-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: extensionErrorGuard }}
        />
        <Loader />
        <AmbientOrbs />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
