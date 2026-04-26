"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mapProfileRow } from "@/lib/supabaseData";

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function createProfile(user) {
  const nextName =
    typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : user.email?.split("@")[0] || "City Roll Member";

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: user.id,
      name: nextName,
      email: user.email || null,
      approved_purchases: 0,
      total_uploads: 0,
      reward_unlocked: false,
      reward_redeemed: false,
    })
    .select("*")
    .maybeSingle();

  if (!error) {
    return mapProfileRow(data);
  }

  const { data: retry, error: retryError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (retryError) return null;
  return mapProfileRow(retry);
}

async function fetchProfile(user) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  if (data) return mapProfileRow(data);
  return createProfile(user);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (userId = user?.id) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    const sourceUser = user?.id === userId ? user : { id: userId };
    const nextProfile = await fetchProfile(sourceUser);
    setProfile(nextProfile);
    return nextProfile;
  };

  useEffect(() => {
    let mounted = true;

    const syncSession = async (nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const nextProfile = await fetchProfile(nextUser);
      if (!mounted) return;
      setProfile(nextProfile);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      syncSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
