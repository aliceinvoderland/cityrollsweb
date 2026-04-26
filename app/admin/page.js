"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Check,
  X,
  Users,
  Receipt,
  Gift,
  LogOut,
  ExternalLink,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { formatTimestamp } from "@/lib/supabaseData";
import Reveal from "@/components/Reveal";
import BrandLogo from "@/components/BrandLogo";

async function fetchAuthedJson(url, token, init = {}) {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, session, loading, logout } = useAuth();
  const [tab, setTab] = useState("pending");
  const [isAdmin, setIsAdmin] = useState(null);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [busy, setBusy] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const accessToken = session?.access_token || "";

  const loadAdminData = useCallback(async (options = {}) => {
    if (!accessToken) return;

    const silent = Boolean(options.silent);

    if (silent) {
      setRefreshing(true);
    } else {
      setDataLoading(true);
    }
    setDataError("");

    try {
      const data = await fetchAuthedJson("/api/admin/data", accessToken);
      setPendingUploads(data.pendingUploads || []);
      setUsers(data.users || []);
      setRewards(data.rewards || []);
    } catch (err) {
      setDataError(err.message || "Failed to load admin data");
      setPendingUploads([]);
      setUsers([]);
      setRewards([]);
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setDataLoading(false);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!accessToken) return;

    let active = true;

    (async () => {
      try {
        await fetchAuthedJson("/api/admin/check", accessToken);
        if (active) setIsAdmin(true);
      } catch {
        if (active) setIsAdmin(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, accessToken, loading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminData();
  }, [isAdmin, loadAdminData]);

  useEffect(() => {
    if (!isAdmin) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadAdminData({ silent: true });
      }
    }, 15000);

    const handleFocus = () => {
      loadAdminData({ silent: true });
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [isAdmin, loadAdminData]);

  const handleAction = async (uploadId, action) => {
    if (!accessToken) return;

    setBusy(uploadId);
    try {
      await fetchAuthedJson("/api/admin/review", accessToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploadId, action }),
      });
      await loadAdminData();
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setBusy(null);
    }
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative z-10">
        <ShieldAlert className="text-crimson mb-4" size={48} />
        <h1 className="display text-4xl mb-2">
          Access <span className="display-italic">denied.</span>
        </h1>
        <p className="text-bone/60 mb-6">This page is for admins only.</p>
        <Link href="/dashboard" className="btn-ghost">
          Go to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-6 max-w-4xl mx-auto pb-24 relative z-10">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" aria-label="City Roll home" className="flex items-center shrink-0">
          <BrandLogo variant="panel" />
        </Link>
        <button onClick={logout} className="text-bone/50 hover:text-bone p-2 transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      <Reveal>
        <div className="tag mb-3">
          <span className="tag-dot" /> Admin · HQ
        </div>
      </Reveal>
      <Reveal>
        <h1 className="display text-5xl sm:text-6xl mb-10">
          Control <span className="display-italic text-amber">center.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 items-center">
          <TabBtn active={tab === "pending"} onClick={() => setTab("pending")} icon={<Receipt size={16} />}>
            Pending
          </TabBtn>
          <TabBtn active={tab === "users"} onClick={() => setTab("users")} icon={<Users size={16} />}>
            Users
          </TabBtn>
          <TabBtn active={tab === "rewards"} onClick={() => setTab("rewards")} icon={<Gift size={16} />}>
            Rewards
          </TabBtn>
          <button
            onClick={() => loadAdminData({ silent: true })}
            disabled={refreshing}
            className="glass text-bone/70 hover:text-bone inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </Reveal>

      {dataError && (
        <div className="glass rounded-2xl px-4 py-3 text-sm text-crimson mb-5">
          {dataError}
        </div>
      )}

      <Reveal delay={0.15}>
        {tab === "pending" && (
          <PendingUploads
            uploads={pendingUploads}
            loading={dataLoading}
            busy={busy}
            onAction={handleAction}
          />
        )}
        {tab === "users" && <UsersList users={users} loading={dataLoading} />}
        {tab === "rewards" && <RewardsList rewards={rewards} loading={dataLoading} />}
      </Reveal>
    </main>
  );
}

function TabBtn({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
        active ? "bg-amber text-ink" : "glass text-bone/70 hover:text-bone"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function PendingUploads({ uploads, loading, busy, onAction }) {
  if (loading) {
    return (
      <div className="glass rounded-3xl text-center py-14 text-bone/50">
        <Loader2 className="mx-auto mb-3 animate-spin" size={36} />
        <p className="text-lg">Loading pending uploads…</p>
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="glass rounded-3xl text-center py-14 text-bone/50">
        <Receipt className="mx-auto mb-3" size={36} />
        <p className="text-lg">No pending uploads</p>
        <p className="text-xs text-bone/30 mt-1">You're all caught up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {uploads.map((upload) => (
        <div key={upload.id} className="glass rounded-3xl p-5">
          <div className="flex justify-between items-start mb-3 gap-4">
            <div>
              <p className="font-semibold">{upload.userName}</p>
              <p className="text-bone/40 text-xs">{upload.userEmail}</p>
            </div>
            <p className="text-bone/40 text-xs shrink-0">{formatTimestamp(upload.createdAt)}</p>
          </div>

          {upload.fileUrl && (
            <a href={upload.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
              {/\.pdf/i.test(upload.fileUrl) ? (
                <div className="bg-bone/5 rounded-2xl py-8 text-center text-bone/70 text-sm inline-flex items-center gap-2 justify-center w-full">
                  <ExternalLink size={16} /> Open PDF
                </div>
              ) : (
                <img src={upload.fileUrl} alt="Bill" className="w-full max-h-80 object-contain rounded-2xl bg-bone/5" />
              )}
            </a>
          )}

          {upload.amount && (
            <p className="text-bone/60 text-sm mt-3">
              Amount claimed: <span className="text-bone font-semibold">₹{upload.amount}</span>
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAction(upload.id, "approve")}
              disabled={busy === upload.id}
              className="flex-1 bg-lime/20 border border-lime/40 text-lime font-semibold py-3 rounded-xl hover:bg-lime/30 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy === upload.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Approve
            </button>
            <button
              onClick={() => onAction(upload.id, "reject")}
              disabled={busy === upload.id}
              className="flex-1 bg-crimson/20 border border-crimson/40 text-crimson font-semibold py-3 rounded-xl hover:bg-crimson/30 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X size={16} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersList({ users, loading }) {
  if (loading) {
    return (
      <div className="glass rounded-3xl text-center py-14 text-bone/50">
        <Loader2 className="mx-auto mb-3 animate-spin" size={36} />
        <p className="text-lg">Loading users…</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-bone/40 text-xs mb-3">
        {users.length} user{users.length === 1 ? "" : "s"}
      </p>
      {users.map((entry) => (
        <div key={entry.id} className="glass rounded-2xl py-3.5 px-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm">{entry.name}</p>
            <p className="text-bone/40 text-xs">{entry.email}</p>
          </div>
          <div className="text-right">
            <p className="text-amber font-bold stat-num text-xl">{entry.approvedPurchases || 0}/3</p>
            <p className="text-bone/40 text-xs">
              {entry.rewardRedeemed ? "Redeemed" : entry.rewardUnlocked ? "Unlocked" : "In progress"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RewardsList({ rewards, loading }) {
  if (loading) {
    return (
      <div className="glass rounded-3xl text-center py-14 text-bone/50">
        <Loader2 className="mx-auto mb-3 animate-spin" size={36} />
        <p className="text-lg">Loading rewards…</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-bone/40 text-xs mb-3">
        {rewards.length} reward{rewards.length === 1 ? "" : "s"} issued
      </p>
      {rewards.map((reward) => (
        <div key={reward.id} className="glass rounded-2xl py-3.5 px-4 flex justify-between items-center">
          <div>
            <p className="font-mono font-bold text-amber">{reward.code}</p>
            <p className="text-bone/50 text-xs">
              {reward.userName} · {reward.userEmail}
            </p>
          </div>
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              reward.redeemed ? "bg-bone/10 text-bone/50" : "bg-lime/20 text-lime"
            }`}
          >
            {reward.redeemed ? "Redeemed" : "Active"}
          </div>
        </div>
      ))}
    </div>
  );
}
