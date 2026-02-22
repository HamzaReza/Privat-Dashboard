import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { User } from "@/types/user";

// Cache for 2 min (export so status updates can invalidate)
export let usersCache: { data: User[]; ts: number } | null = null;
export function invalidateUsersCache() {
  usersCache = null;
}
const CACHE_TTL = 2 * 60 * 1000;

export async function GET() {
  try {
    if (usersCache && Date.now() - usersCache.ts < CACHE_TTL) {
      return NextResponse.json(usersCache.data);
    }

    const supabase = createAdminClient();
    const users: User[] = [];
    let page = 1;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

      if (error) throw error;
      if (!data.users.length) break;

      for (const u of data.users) {
        const role =
          u.user_metadata?.role ?? u.app_metadata?.role ?? "user";
        if (role === "admin") continue; // exclude admins

        const meta = u.user_metadata as Record<string, unknown>;

        users.push({
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? undefined,
          phone: u.phone ?? undefined,
          full_name: (meta?.full_name ?? meta?.name) as string | undefined,
          avatar_url: meta?.avatar_url as string | undefined,
          role,
          status: meta?.status as string | undefined,
          credits: meta?.credits as number | undefined,
          latitude: meta?.latitude as number | undefined,
          longitude: meta?.longitude as number | undefined,
          categories: meta?.categories as string[] | undefined,
          jobsQuoted: meta?.jobsQuoted as { jobId: string }[] | undefined,
          serviceArea: meta?.serviceArea as string | undefined,
          businessName: meta?.businessName as string | undefined,
          document_url: meta?.document_url as string | undefined,
          jobLeadsPaid: meta?.jobLeadsPaid as { jobId: string }[] | undefined,
          businessPhone: meta?.businessPhone as string | undefined,
          creditHistory: meta?.creditHistory as
            | { type: string; amount: number; createdAt: string; description: string }[]
            | undefined,
          email_verified: meta?.email_verified as boolean | undefined,
          phone_verified: meta?.phone_verified as boolean | undefined,
          consent_background_check: meta?.consent_background_check as
            | boolean
            | undefined,
          confirmed_at: u.confirmed_at ?? undefined,
          banned_until: u.banned_until ?? undefined,
        });
      }

      if (data.users.length < 1000) break;
      page++;
    }

    usersCache = { data: users, ts: Date.now() };
    return NextResponse.json(users);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
