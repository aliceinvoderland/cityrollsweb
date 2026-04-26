// app/upload/page.js — Premium bill upload
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload as UploadIcon, Loader2, CheckCircle2, Camera } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

export default function UploadPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [amount, setAmount] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    if (!ALLOWED_TYPES.includes(f.type)) return setError("Only JPG, PNG, or PDF files allowed.");
    if (f.size > MAX_FILE_SIZE) return setError("File must be under 5 MB.");

    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setError("");

    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const { count, error: countError } = await supabase
        .from("uploads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfToday.toISOString());

      if (countError) throw countError;
      if ((count || 0) >= 1) throw new Error("You already uploaded a bill today. Come back tomorrow!");

      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("bills").upload(path, file, {
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("bills").getPublicUrl(path);

      const { error: insertError } = await supabase.from("uploads").insert({
        user_id: user.id,
        user_email: profile?.email || user.email || null,
        user_name: profile?.name || user.user_metadata?.name || "City Roll Member",
        file_url: publicUrl,
        file_path: path,
        amount: amount ? parseFloat(amount) : null,
        status: "pending",
      });
      if (insertError) throw insertError;

      await refreshProfile(user.id);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Upload failed");
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="w-20 h-20 rounded-full bg-lime/20 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 className="text-lime" size={48} />
        </div>
        <h1 className="display text-5xl mb-3">
          Bill uploaded <span className="display-italic text-amber">✨</span>
        </h1>
        <p className="text-bone/60 text-lg">We'll verify it shortly. Redirecting…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-6 max-w-2xl mx-auto pb-24 relative z-10">
      <Link href="/dashboard" className="text-bone/60 inline-flex items-center gap-2 text-sm mb-8 hover:text-bone transition-colors w-fit">
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <Reveal><div className="tag mb-4"><span className="tag-dot" /> New upload</div></Reveal>
      <Reveal>
        <h1 className="display text-5xl sm:text-6xl mb-3">
          Upload <span className="display-italic text-amber">bill.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-bone/60 mb-10 text-lg">Snap a photo of your City Roll receipt.</p>
      </Reveal>

      <Reveal delay={0.15}>
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className={`glass rounded-3xl border-2 border-dashed ${file ? "border-lime/40" : "border-bone/15"} py-12 px-6 text-center transition-colors hover:border-amber/40`}>
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-72 mx-auto rounded-2xl mb-3" />
            ) : (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-4">
                <Camera className="text-amber" size={28} />
              </div>
            )}
            <p className="font-semibold text-lg">{file ? file.name : "Tap to select receipt"}</p>
            <p className="text-bone/40 text-xs mt-1 uppercase tracking-widest">JPG · PNG · PDF · max 5 MB</p>
          </div>
        </label>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-6">
          <label className="text-bone/60 text-sm block mb-2">Bill amount (optional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/50 text-lg">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>
      </Reveal>

      {error && (
        <div className="mt-4 bg-crimson/10 border border-crimson/30 rounded-xl px-4 py-3 text-sm text-crimson">
          {error}
        </div>
      )}

      <Reveal delay={0.25}>
        <MagneticButton className="w-full mt-8">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary w-full justify-center"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <UploadIcon size={20} />
                <span>Submit bill</span>
              </>
            )}
          </button>
        </MagneticButton>
      </Reveal>

      <p className="text-bone/40 text-xs text-center mt-5">
        Our team manually verifies each bill within 24h.
      </p>
    </main>
  );
}
