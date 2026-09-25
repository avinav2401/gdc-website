import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mappedData = (data || []).map((e: any) => ({
      ...e,
      dateSort: e.date_sort,
      imageUrl: e.image_url,
      registerUrl: e.register_url,
      isGameJam: e.is_game_jam,
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}