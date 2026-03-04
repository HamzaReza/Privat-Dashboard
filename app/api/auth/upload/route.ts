import { NextRequest, NextResponse } from "next/server";

// Proxies file uploads to Supabase Edge Functions server-side,
// avoiding CORS restrictions on the apikey header.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const endpoint = formData.get("endpoint") as string | null;
    const accessToken = formData.get("access_token") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!endpoint || !["upload-avatar", "upload-document"].includes(endpoint)) {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
    if (!accessToken) return NextResponse.json({ error: "Missing access token" }, { status: 401 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: "Missing Supabase config" }, { status: 500 });
    }

    const upstream = new FormData();
    upstream.append("file", file);

    const res = await fetch(`${supabaseUrl}/functions/v1/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
      },
      body: upstream,
    });

    const data = await res.json() as { publicUrl?: string; error?: string };

    if (!res.ok) {
      return NextResponse.json({ error: data.error ?? `Upload failed: ${res.status}` }, { status: res.status });
    }

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
