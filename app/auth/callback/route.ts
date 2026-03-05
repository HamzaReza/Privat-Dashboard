import { NextResponse } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const supabase = await createSSRClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  // Read intended role from cookie (set by login page before OAuth redirect)
  const cookieHeader = request.headers.get("cookie") ?? "";
  const roleMatch = cookieHeader.match(/(?:^|;\s*)oauth_role=([^;]+)/);
  const role = roleMatch?.[1] ?? "customer";

  const meta = user.user_metadata ?? {};

  if (role === "customer") {
    // Wrong role → reject
    if (meta.role === "service_provider" || meta.role === "admin") {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=role_mismatch`);
    }
    // New user → will be assigned customer role on profile page
    return NextResponse.redirect(`${origin}/profile/${user.id}?role=customer`);

  } else if (role === "provider") {
    // Wrong role → reject
    if (meta.role === "customer" || meta.role === "admin") {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=role_mismatch`);
    }
    // New user or incomplete provider profile → complete details
    if (!meta.role || !meta.businessName) {
      const googleName = encodeURIComponent(meta.full_name || meta.name || "");
      const googleAvatar = encodeURIComponent(meta.picture || meta.avatar_url || "");
      return NextResponse.redirect(
        `${origin}/register/provider/google-complete?googleName=${googleName}&googleAvatar=${googleAvatar}`
      );
    }
    // Existing provider — check approval status
    if (meta.status === "pending") {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=account_pending`);
    }
    if (meta.status === "blocked") {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/login?error=account_blocked`);
    }
    return NextResponse.redirect(`${origin}/profile/${user.id}?role=provider`);

  } else {
    return NextResponse.redirect(`${origin}/login`);
  }
}
