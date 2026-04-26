const VARIANTS = {
  nav: {
    width: 96,
    height: 96,
    className: "h-14 w-14 sm:h-16 sm:w-16",
  },
  panel: {
    width: 84,
    height: 84,
    className: "h-12 w-12 sm:h-14 sm:w-14",
  },
  footer: {
    width: 160,
    height: 160,
    className: "h-24 w-24 sm:h-28 sm:w-28",
  },
  loader: {
    width: 224,
    height: 224,
    className: "h-36 w-36 sm:h-44 sm:w-44",
  },
};

export default function BrandLogo({
  alt = "City Roll",
  className = "",
  variant = "nav",
}) {
  const config = VARIANTS[variant] || VARIANTS.nav;

  return (
    <img
      src="/city-roll-logo.png"
      alt={alt}
      width={config.width}
      height={config.height}
      decoding="async"
      className={`${config.className} object-contain ${className}`.trim()}
    />
  );
}
