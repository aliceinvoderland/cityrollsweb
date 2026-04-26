// app/dashboard/page.js — Premium dashboard
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, LogOut, Gift, Receipt, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { formatTimestamp, mapUploadRow } from "@/lib/supabaseData";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import BrandLogo from "@/components/BrandLogo";

const GOAL = 3;

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    let active = true;

    (async () => {
      setUploadsLoading(true);
      const { data, error } = await supabase
        .from("uploads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        setUploads([]);
      } else {
        setUploads((data || []).map(mapUploadRow));
      }
      setUploadsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  const approved = profile.approvedPurchases || 0;
  const totalUploads = Math.max(profile.totalUploads || 0, uploads.length);
  const progress = Math.min(approved / GOAL, 1) * 100;
  const rewardUnlocked = Boolean(profile.rewardUnlocked);
  const displayName = typeof profile.name === "string" ? profile.name.trim() : "";
  const firstName = displayName ? displayName.split(/\s+/)[0] : "there";

  return (
    <main className="min-h-screen px-5 py-6 pb-24 max-w-2xl mx-auto relative z-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" aria-label="City Roll home" className="flex items-center shrink-0">
          <BrandLogo variant="panel" />
        </Link>
        <button onClick={logout} className="text-bone/50 hover:text-bone p-2 transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      <Reveal>
        <div className="tag mb-3"><span className="tag-dot" /> Member · active</div>
      </Reveal>
      <Reveal>
        <h1 className="display text-5xl sm:text-6xl mb-10">
          Welcome back,<br />
          <span className="display-italic text-amber">{firstName}.</span>
        </h1>
      </Reveal>

      {/* Reward card */}
      <Reveal delay={0.1}>
        <TiltCard className={`relative overflow-hidden rounded-3xl p-7 ${rewardUnlocked ? "glass" : "glass"}`}>
          {rewardUnlocked && (
            <>
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: "radial-gradient(circle, rgba(196,226,110,0.3), transparent 60%)" }} />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,199,44,0.25), transparent 60%)" }} />
            </>
          )}

          <div className="relative">
            <div className="tilt-pop flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-bone/40 uppercase tracking-widest">Your Reward</p>
                <h2 className="display text-3xl mt-1">Free Mojito 🍹</h2>
              </div>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${rewardUnlocked ? "bg-lime text-ink" : "bg-bone/10 text-bone/60"}`}>
                {rewardUnlocked ? "🎉 UNLOCKED" : "🔒 LOCKED"}
              </div>
            </div>

            <div className="tilt-pop mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-bone/70">{approved}/{GOAL} bills verified</span>
                <span className="text-amber font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-bone/10 rounded-full overflow-hidden">
                <div
                  className="h-full progress-fill rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="tilt-pop flex gap-2 mt-4">
              {Array.from({ length: GOAL }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${i < approved ? "bg-amber" : "bg-bone/10"}`}
                />
              ))}
            </div>

            {rewardUnlocked && !profile.rewardRedeemed && (
              <Link href="/reward" className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-ink text-lime font-semibold py-3.5 rounded-full border border-lime/30 hover:bg-lime/10 transition-all">
                <Gift size={18} /> Claim your Mojito
              </Link>
            )}
            {profile.rewardRedeemed && (
              <div className="mt-6 text-center text-bone/60 text-sm">
                ✅ Reward already redeemed · See you soon
              </div>
            )}
          </div>
        </TiltCard>
      </Reveal>

      {/* Upload CTA */}
      {!rewardUnlocked && (
        <Reveal delay={0.15}>
          <MagneticButton className="w-full mt-6">
            <Link href="/upload" className="btn-primary w-full justify-center text-lg">
              <Upload size={20} />
              <span>Upload a bill</span>
            </Link>
          </MagneticButton>
        </Reveal>
      )}

      {/* Stats */}
      <Reveal delay={0.2}>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-bone/40 uppercase tracking-widest">Total uploads</p>
            <p className="stat-num text-4xl mt-1">{totalUploads}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-bone/40 uppercase tracking-widest">Verified</p>
            <p className="stat-num text-4xl mt-1 text-amber">{approved}</p>
          </div>
        </div>
      </Reveal>

      {/* Recent uploads */}
      <Reveal delay={0.25}>
        <section className="mt-10">
          <h3 className="text-bone/50 uppercase text-xs tracking-[0.2em] mb-4">Recent activity</h3>
          {uploadsLoading ? (
            <div className="glass rounded-2xl text-center py-10 text-bone/40">
              <Loader2 className="mx-auto mb-2 animate-spin" size={28} />
              <p className="text-sm">Loading uploads…</p>
            </div>
          ) : uploads.length === 0 ? (
            <div className="glass rounded-2xl text-center py-10 text-bone/40">
              <Receipt className="mx-auto mb-2" size={28} />
              <p className="text-sm">No uploads yet.</p>
              <p className="text-xs mt-1">Tap "Upload a bill" above to start earning.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uploads.map((u) => <UploadItem key={u.id} upload={u} />)}
            </div>
          )}
        </section>
      </Reveal>
    </main>
  );
}

function UploadItem({ upload }) {
  const statusMap = {
    pending: { icon: Clock, color: "text-amber", label: "Pending review" },
    approved: { icon: CheckCircle2, color: "text-lime", label: "Approved" },
    rejected: { icon: XCircle, color: "text-crimson", label: "Rejected" },
  };
  const { icon: Icon, color, label } = statusMap[upload.status] || statusMap.pending;
  const date = formatTimestamp(upload.createdAt, "date");

  return (
    <div className="glass rounded-2xl flex items-center gap-3 py-3.5 px-4">
      <Icon className={color} size={22} />
      <div className="flex-1">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-bone/40 text-xs">{date}{upload.amount ? ` · ₹${upload.amount}` : ""}</p>
      </div>
    </div>
  );
}
