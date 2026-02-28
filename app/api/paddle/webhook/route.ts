import { NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createAdminClient } from "@/lib/supabase/server";
import { invalidateUsersCache } from "@/app/api/users/route";
import { PACKAGES } from "@/constants/packages";

function getPaddle() {
  return new Paddle(process.env.PADDLE_API_KEY!, {
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
        ? Environment.production
        : Environment.sandbox,
  });
}

// Paddle requires a plain 200 response to stop retrying the webhook
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("paddle-signature") ?? "";
    const rawBody = await request.text();
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET!;

    const paddle = getPaddle();
    const event = await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature,
    );

    if (event.eventType === "transaction.completed") {
      const data = event.data as {
        customData?: Record<string, string> | null;
      };
      const customData = data.customData;

      // Only process checkout sessions created by our app
      if (!customData?.userId || !customData?.packageId) {
        return NextResponse.json({ ok: true });
      }

      const { userId, packageId } = customData;
      const pkg = PACKAGES.find((p) => p.id === packageId);
      if (!pkg) {
        console.error("Paddle webhook: unknown packageId", packageId);
        return NextResponse.json({ ok: true });
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
        amount: pkg.credits,
        createdAt: new Date().toISOString(),
        description: `Purchased (${pkg.name})`,
      };

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingMeta,
          credits: currentCredits + pkg.credits,
          creditHistory: [...currentHistory, newEntry],
        },
      });

      if (error) throw error;
      invalidateUsersCache();
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Paddle webhook error:", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
