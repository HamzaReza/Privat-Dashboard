/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";

async function handleRouting(
  user: any,
  role: string,
  router: ReturnType<typeof useRouter>,
) {
  const supabase = createClient();
  const meta = user.user_metadata || {};

  const signOutSafe = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  if (role === "customer") {
    // Wrong role → reject
    if (meta.role === "service_provider" || meta.role === "admin") {
      await signOutSafe();
      router.replace("/login?error=role_mismatch");
      return;
    }
    // New user → assign customer role + Google profile data
    if (!meta.role) {
      await supabase.auth.updateUser({
        data: {
          role: "customer",
          name: meta.full_name || meta.name || "",
          avatar_url: meta.picture || meta.avatar_url || undefined,
        },
      });
    }
    router.replace(`/profile/${user.id}?role=customer`);
  } else if (role === "provider") {
    // Wrong role → reject (check BEFORE incomplete profile check)
    if (meta.role === "customer" || meta.role === "admin") {
      await signOutSafe();
      router.replace("/login?error=role_mismatch");
      return;
    }
    // New user (no role) or incomplete provider profile → complete details
    if (!meta.role || !meta.businessName) {
      const googleName = encodeURIComponent(meta.full_name || meta.name || "");
      const googleAvatar = encodeURIComponent(
        meta.picture || meta.avatar_url || "",
      );
      router.replace(
        `/register/provider/google-complete?googleName=${googleName}&googleAvatar=${googleAvatar}`,
      );
      return;
    }
    // Existing provider — check approval status
    if (meta.status === "pending") {
      await signOutSafe();
      router.replace("/login?error=account_pending");
      return;
    }
    if (meta.status === "blocked") {
      await signOutSafe();
      router.replace("/login?error=account_blocked");
      return;
    }
    router.replace(`/profile/${user.id}?role=provider`);
  } else {
    router.replace("/login");
  }
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const role =
        searchParams.get("role") ??
        localStorage.getItem("oauth_role") ??
        "customer";
      localStorage.removeItem("oauth_role");
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/login?error=oauth_failed");
        return;
      }
      await handleRouting(session.user, role, router);
    };
    run().catch(() => router.replace("/login?error=oauth_failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-3">
        <RiLoader4Line
          className="animate-spin text-[var(--primary)]"
          size={28}
        />
        <p className="text-[13px] text-[var(--text-tertiary)]">
          Signing you in…
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
