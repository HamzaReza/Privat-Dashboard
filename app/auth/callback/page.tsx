"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRouting(
  user: any,
  role: string,
  router: ReturnType<typeof useRouter>,
) {
  console.log("🚀 ~ page.tsx:10 ~ handleRouting ~ role:", role);
  console.log("🚀 ~ page.tsx:10 ~ handleRouting ~ user:", user);
  const supabase = createClient();
  const meta = user.user_metadata || {};

  if (role === "customer") {
    // Wrong role → reject
    if (meta.role === "service_provider" || meta.role === "admin") {
      await supabase.auth.signOut();
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
      await supabase.auth.signOut();
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
      await supabase.auth.signOut();
      router.replace("/login?error=account_pending");
      return;
    }
    if (meta.status === "blocked") {
      await supabase.auth.signOut();
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
    const role =
      searchParams.get("role") ??
      localStorage.getItem("oauth_role") ??
      "customer";
    localStorage.removeItem("oauth_role");
    const supabase = createClient();
    let handled = false;

    const handle = async (user: NonNullable<unknown>) => {
      if (handled) return;
      handled = true;
      await handleRouting(user, role, router);
    };

    // detectSessionInUrl:true (Supabase default) auto-exchanges the code and fires SIGNED_IN.
    // We listen for that event instead of calling exchangeCodeForSession manually.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await handle(session.user);
      }
    });

    // Also check immediately in case SIGNED_IN already fired before subscription was set up
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handle(session.user);
    });

    // Timeout fallback — if no session after 10 seconds, something went wrong
    const timeout = setTimeout(() => {
      if (!handled) {
        handled = true;
        router.replace("/login?error=oauth_failed");
      }
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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
