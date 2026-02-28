import { NextResponse } from "next/server";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { PACKAGES } from "@/constants/packages";

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.PADDLE_PRICE_ID_STARTER,
  small: process.env.PADDLE_PRICE_ID_SMALL,
  medium: process.env.PADDLE_PRICE_ID_MEDIUM,
  pro: process.env.PADDLE_PRICE_ID_PRO,
  business: process.env.PADDLE_PRICE_ID_BUSINESS,
};

function getPaddle() {
  return new Paddle(process.env.PADDLE_API_KEY!, {
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
        ? Environment.production
        : Environment.sandbox,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { userId?: string; packageId?: string };
    const { userId, packageId } = body;

    if (!userId || !packageId) {
      return NextResponse.json(
        { error: "Missing userId or packageId" },
        { status: 400 },
      );
    }

    const pkg = PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const priceId = PRICE_IDS[packageId];
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured for this package" },
        { status: 500 },
      );
    }

    const paddle = getPaddle();
    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customData: { userId, packageId },
    });

    return NextResponse.json({ transactionId: transaction.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
