// app/reward/page.js — Premium reward redemption screen
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/lib/authContext";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

function fallbackCopyText(value) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);
  return copied;
}

export default function RewardPage() {
  const router = useRouter();
  const { user, session, profile, loading } = useAuth();
  const [rewardCode, setRewardCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !profile || !session?.access_token) return;
    if (!profile.rewardUnlocked || profile.rewardRedeemed) {
      router.push("/dashboard");
      return;
    }

    let active = true;

    (async () => {
      try {
        setError("");

        const res = await fetch("/api/reward", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(payload.error || "Failed to load reward");
        }

        if (active) {
          setRewardCode(payload.code || null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load reward");
        }
      } finally {
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, session, profile, router]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(rewardCode);
      } else if (!fallbackCopyText(rewardCode)) {
        return;
      }
    } catch {
      if (!fallbackCopyText(rewardCode)) return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  if (!rewardCode) {
    return (
      <main className="min-h-screen px-5 py-6 max-w-2xl mx-auto pb-10 relative z-10">
        <Link href="/dashboard" className="text-bone/60 inline-flex items-center gap-2 text-sm mb-6 hover:text-bone transition-colors w-fit">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-crimson text-sm">{error || "Reward code unavailable right now."}</p>
        </div>
      </main>
    );
  }

  const qrPayload = JSON.stringify({ code: rewardCode, userId: user.id, reward: "Free Mojito" });

  return (
    <main className="min-h-screen px-5 py-6 max-w-2xl mx-auto pb-10 relative z-10">
      <Link href="/dashboard" className="text-bone/60 inline-flex items-center gap-2 text-sm mb-6 hover:text-bone transition-colors w-fit">
        <ArrowLeft size={16} /> Back
      </Link>

      <Reveal>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-lime/20 border border-lime/40 rounded-full px-4 py-1.5 text-lime text-xs font-semibold tracking-widest uppercase mb-6">
            <Sparkles size={14} /> Reward Unlocked
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h1 className="display text-center text-[clamp(3rem,10vw,5.5rem)] leading-[0.95]">
          Free<br />
          <span className="display-italic text-amber">Mojito 🍹</span>
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="text-bone/60 text-center mt-4 text-lg max-w-md mx-auto">
          Show this code to the staff at City Roll to redeem your free drink.
        </p>
      </Reveal>

      {/* QR card */}
      <Reveal delay={0.2}>
        <TiltCard className="mt-10 bg-bone rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(255,199,44,0.3)]" max={5}>
          <div className="tilt-pop flex justify-center">
            <QRCodeSVG value={qrPayload} size={220} level="H" fgColor="#0a0706" bgColor="#f5ede0" />
          </div>

          <div className="tilt-pop mt-5 border-t border-ink/10 pt-5 text-center">
            <p className="text-ink/50 text-xs uppercase tracking-widest">Redemption Code</p>
            <button
              onClick={handleCopy}
              className="mt-2 inline-flex items-center gap-2 text-3xl font-mono font-bold text-ink tracking-wider hover:opacity-70 transition"
            >
              {rewardCode}
              {copied ? <Check size={20} className="text-lime" /> : <Copy size={20} className="text-ink/40" />}
            </button>
            <p className="text-ink/40 text-xs mt-1">{copied ? "Copied!" : "Tap to copy"}</p>
          </div>
        </TiltCard>
      </Reveal>

      {/* How to redeem */}
      <Reveal delay={0.3}>
        <div className="glass rounded-3xl p-6 mt-8">
          <p className="text-bone/50 uppercase text-xs tracking-[0.2em] mb-4">How to redeem</p>
          <ol className="space-y-3 text-sm">
            {[
              "Visit City Roll on your next order",
              "Show this QR or the code to the staff",
              "Enjoy your free Mojito",
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-amber text-ink font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-bone/90">{text}</span>
              </li>
            ))}
          </ol>
          <p className="text-bone/40 text-xs mt-5">⚠️ One-time use. Can't be combined with other offers.</p>
        </div>
      </Reveal>
    </main>
  );
}
