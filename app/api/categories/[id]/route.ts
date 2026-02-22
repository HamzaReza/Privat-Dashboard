import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ServiceCategory } from "@/types/category";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const body: Partial<ServiceCategory> = await req.json();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("service_categories")
      .update({
        name_en: body.name_en,
        name_it: body.name_it,
        icon: body.icon,
        image_uri: body.image_uri,
        credits: body.credits,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("service_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
