import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAdminProviderNotification, ProviderPendingEmailData } from "@/lib/email";

export async function POST(request: Request) {
  try {
    // Verify the caller is an authenticated user
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

    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as Partial<ProviderPendingEmailData>;

    if (!body.userId || !body.providerEmail || !body.event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Make sure the token belongs to the provider being notified
    if (user.id !== body.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sendAdminProviderNotification({
      providerName: body.providerName ?? "Unknown",
      providerEmail: body.providerEmail,
      businessName: body.businessName ?? "—",
      phone: body.phone ?? "—",
      serviceArea: body.serviceArea ?? "—",
      userId: body.userId,
      event: body.event,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notify-admin] Failed to send notification:", e);
    // Non-fatal — don't block the registration flow
    return NextResponse.json({ ok: true });
  }
}
