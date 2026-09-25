import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const dbPayload = {
      title: body.title,
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      date: body.date,
      date_sort: body.dateSort,
      location: body.location,
      description: body.description,
      image_url: body.imageUrl,
      status: body.status,
      version: body.version,
      shape: body.shape,
      register_url: body.registerUrl,
      is_game_jam: body.isGameJam,
      tags: typeof body.tags === "string" ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : body.tags,
    };

    const { data, error } = await supabase
      .from("events")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT event error:", error);

      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }

    const mappedData = data ? {
      ...data,
      dateSort: data.date_sort,
      imageUrl: data.image_url,
      registerUrl: data.register_url,
      isGameJam: data.is_game_jam,
    } : null;

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("PUT event error:", error);

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE event error:", error);

      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE event error:", error);

    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}