// components/AmbientOrbs.js — floating warm gradient orbs (pure CSS, GPU-accelerated)
export default function AmbientOrbs() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute rounded-full blur-[100px] animate-float-1"
        style={{
          width: 600, height: 600, top: -200, left: -150,
          background: "radial-gradient(circle, rgba(255,107,26,0.35), transparent 65%)",
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] animate-float-2"
        style={{
          width: 500, height: 500, top: "30%", right: -200,
          background: "radial-gradient(circle, rgba(230,57,70,0.25), transparent 65%)",
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] animate-float-1"
        style={{
          width: 400, height: 400, bottom: -100, left: "30%",
          animationDirection: "reverse",
          background: "radial-gradient(circle, rgba(255,199,44,0.22), transparent 65%)",
        }}
      />
    </div>
  );
}
