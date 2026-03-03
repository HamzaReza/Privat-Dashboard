"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthWatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        const isAdminRoute = pathname.startsWith("/admin");
        router.replace(isAdminRoute ? "/admin-login" : "/login");
      }
    });
    return () => subscription.unsubscribe();
  }, [router, pathname]);

  return null;
}
