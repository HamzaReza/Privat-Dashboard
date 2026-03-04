import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { invalidateUsersCache } from "@/app/api/users/route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify the caller is the same user
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user: authUser },
      error: authError,
    } = await anonClient.auth.getUser(token);

    if (authError || !authUser || authUser.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      phone,
      avatar_url,
      businessName,
      businessPhone,
      serviceArea,
      latitude,
      longitude,
      categories,
    } = body as Record<string, unknown>;

    const adminClient = createAdminClient();
    const { data: userData, error: fetchError } =
      await adminClient.auth.admin.getUserById(id);
    if (fetchError || !userData?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingMeta = (userData.user.user_metadata ?? {}) as Record<
      string,
      unknown
    >;

    // Detect if any business-sensitive fields changed → reset to pending
    const businessFieldsChanged =
      (businessName !== undefined &&
        businessName !== existingMeta.businessName) ||
      (businessPhone !== undefined &&
        businessPhone !== existingMeta.businessPhone) ||
      (serviceArea !== undefined &&
        serviceArea !== existingMeta.serviceArea) ||
      (categories !== undefined &&
        JSON.stringify(categories) !== JSON.stringify(existingMeta.categories));

    const updatedMeta: Record<string, unknown> = { ...existingMeta };

    if (full_name !== undefined) updatedMeta.full_name = full_name;
    if (phone !== undefined) updatedMeta.phone = phone;
    if (avatar_url !== undefined) updatedMeta.avatar_url = avatar_url;
    if (businessName !== undefined) updatedMeta.businessName = businessName;
    if (businessPhone !== undefined) updatedMeta.businessPhone = businessPhone;
    if (serviceArea !== undefined) updatedMeta.serviceArea = serviceArea;
    if (latitude !== undefined) updatedMeta.latitude = latitude;
    if (longitude !== undefined) updatedMeta.longitude = longitude;
    if (categories !== undefined) updatedMeta.categories = categories;
    if (businessFieldsChanged) updatedMeta.status = "pending";

    const { error: updateError } =
      await adminClient.auth.admin.updateUserById(id, {
        user_metadata: updatedMeta,
      });

    if (updateError) throw updateError;

    invalidateUsersCache();
    return NextResponse.json({ ok: true, statusChanged: businessFieldsChanged });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
