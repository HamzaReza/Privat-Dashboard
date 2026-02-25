import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { invalidateUsersCache } from "@/app/api/users/route";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await _request.json();
    const validStatuses = ["active", "blocked", "inactive"];
    const status: string = validStatuses.includes(body?.status) ? body.status : "active";

    const supabase = createAdminClient();
    const { data: userData, error: fetchError } = await supabase.auth.admin.getUserById(userId);
    if (fetchError || !userData?.user) {
      throw fetchError ?? new Error("User not found");
    }

    const existingMeta = (userData.user.user_metadata ?? {}) as Record<string, unknown>;
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { ...existingMeta, status },
    });

    if (error) throw error;
    invalidateUsersCache();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
