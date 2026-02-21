import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ServiceCategory } from "@/types/category";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .order("name_en", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: ServiceCategory = await req.json();

    if (!body.id || !body.name_en || !body.name_it || !body.icon || !body.image_uri) {
      return NextResponse.json(
        { error: "Missing required fields: id, name_en, name_it, icon, image_uri" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("service_categories")
      .insert({
        id: body.id,
        name_en: body.name_en,
        name_it: body.name_it,
        icon: body.icon,
        image_uri: body.image_uri,
        credits: body.credits ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
