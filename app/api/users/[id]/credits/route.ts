import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { invalidateUsersCache } from "@/app/api/users/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { credits, packageName } = body as {
      credits: number;
      packageName: string;
    };

    if (!credits || typeof credits !== "number" || credits <= 0) {
      return NextResponse.json(
        { error: "Invalid credits amount" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { data: userData, error: fetchError } =
      await supabase.auth.admin.getUserById(userId);

    if (fetchError || !userData?.user) {
      throw fetchError ?? new Error("User not found");
    }

    const existingMeta = (userData.user.user_metadata ?? {}) as Record<
      string,
      unknown
    >;
    const currentCredits = (existingMeta.credits as number) ?? 0;
    const currentHistory = (existingMeta.creditHistory as unknown[]) ?? [];

    const newEntry = {
      type: "add",
      amount: credits,
      createdAt: new Date().toISOString(),
      description: `Added (${packageName})`,
    };

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...existingMeta,
        credits: currentCredits + credits,
        creditHistory: [...currentHistory, newEntry],
      },
    });

    if (error) throw error;
    invalidateUsersCache();
    return NextResponse.json({ ok: true, credits: currentCredits + credits });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
