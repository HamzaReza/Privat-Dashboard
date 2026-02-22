import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { UserDetailsResponse } from "@/types/user";
import { invalidateUsersCache } from "@/app/api/users/route";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error || !data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch referral codes
    const { data: refCodes } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    // Fetch subscription history
    const { data: subHistory } = await supabase
      .from("subscription_history")
      .select("*")
      .eq("user_id", id)
      .order("started_at", { ascending: false });

    const response: UserDetailsResponse = {
      user: data.user as UserDetailsResponse["user"],
      referral_codes: refCodes ?? [],
      subscription_history: subHistory ?? [],
    };

    return NextResponse.json(response);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    invalidateUsersCache();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
