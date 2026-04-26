// app/login/page.js — Premium OTP login
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getClientEnvMessage } from "@/lib/supabaseEnv";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

const clientEnvMessage = getClientEnvMessage();
const OTP_LENGTH = 8;

function normalizeAuthError(message, fallback) {
  if (!message) return fallback;

  if (message.includes("Could not find the table 'public.users' in the schema cache")) {
    return "Supabase setup is incomplete. Run supabase/schema.sql in the SQL Editor, then reload the schema cache and try again.";
  }

  if (message.includes("schema cache")) {
    return "Supabase schema is stale. Reload the schema cache in Supabase and try again.";
  }

  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ name: "", email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (clientEnvMessage) {
      setError(clientEnvMessage);
      return;
    }

    setLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: form.email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
          data: {
            name: form.name.trim(),
          },
        },
      });

      if (otpError) throw otpError;
      setStep("otp");
    } catch (err) {
      setError(normalizeAuthError(err.message, "Failed to send OTP"));
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (clientEnvMessage) {
      setError(clientEnvMessage);
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = form.email.toLowerCase().trim();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: form.otp,
        type: "email",
      });

      if (verifyError) throw verifyError;
      if (!data.user) throw new Error("Verification failed");

      const { data: existingProfile, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          name: form.name.trim(),
          email: cleanEmail,
          approved_purchases: 0,
          total_uploads: 0,
          reward_unlocked: false,
          reward_redeemed: false,
        });

        if (insertError && insertError.code !== "23505") throw insertError;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(normalizeAuthError(err.message, "Invalid OTP"));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-8 flex flex-col relative z-10">
      <Link href="/" className="text-bone/60 inline-flex items-center gap-2 text-sm hover:text-bone transition-colors w-fit">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        {step === "email" ? (
          <>
            <Reveal>
              <div className="tag mb-6"><span className="tag-dot" /> Step 1 of 2</div>
            </Reveal>
            <Reveal>
              <h1 className="display text-5xl sm:text-6xl mb-3">
                Let's <span className="display-italic text-amber">get you in.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-bone/60 mb-10 text-lg">We'll email you an 8-digit code to verify.</p>
            </Reveal>

            <Reveal delay={0.2}>
              <form onSubmit={handleSendOtp} className="space-y-4">
                {clientEnvMessage && (
                  <div className="bg-amber/10 border border-amber/30 rounded-xl px-4 py-3 text-sm text-amber leading-relaxed">
                    {clientEnvMessage}
                  </div>
                )}

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40" size={18} />
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40" size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>

                {error && (
                  <div className="bg-crimson/10 border border-crimson/30 rounded-xl px-4 py-3 text-sm text-crimson">
                    {error}
                  </div>
                )}

                <MagneticButton className="w-full">
                  <button type="submit" disabled={loading || !!clientEnvMessage} className="btn-primary w-full justify-center">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <span>Send OTP</span>
                        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </MagneticButton>
              </form>
            </Reveal>

            <p className="text-bone/40 text-xs mt-8 text-center">
              By continuing, you agree to our terms and privacy policy.
            </p>
          </>
        ) : (
          <>
            <Reveal>
              <div className="tag mb-6"><span className="tag-dot" /> Step 2 of 2</div>
            </Reveal>
            <Reveal>
              <h1 className="display text-5xl sm:text-6xl mb-3">
                Check your <span className="display-italic text-amber">inbox.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-bone/60 mb-10 text-lg">
                Code sent to <span className="text-amber">{form.email}</span>
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  placeholder="00000000"
                  required
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                  className="input-field text-center text-3xl tracking-[0.5em] font-mono py-5"
                />

                {error && (
                  <div className="bg-crimson/10 border border-crimson/30 rounded-xl px-4 py-3 text-sm text-crimson">
                    {error}
                  </div>
                )}

                <MagneticButton className="w-full">
                  <button type="submit" disabled={loading || !!clientEnvMessage} className="btn-primary w-full justify-center">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <span>Verify & enter</span>
                        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </MagneticButton>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-bone/50 text-sm hover:text-bone transition-colors py-2"
                >
                  ← Change email
                </button>
              </form>
            </Reveal>
          </>
        )}
      </div>
    </main>
  );
}
