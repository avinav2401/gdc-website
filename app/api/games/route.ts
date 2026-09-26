import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const developer = searchParams.get("developer");

    let query = supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (developer) {
      query = query.eq("team", developer);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET games error:", error);

      return NextResponse.json(
        { error: "Failed to fetch games" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET games error:", error);

    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Map frontend fields to Supabase 'games' table columns
    const slug = (body.title || "game")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();

    const row = {
      title: body.title,
      slug: slug,
      team: body.developer || "Anonymous",
      engine: body.engine || "Other",
      description: body.description || body.tagline || "",
      image_url: body.coverUrl || body.imageUrl || "",
      play_url: body.itchUrl || body.playUrl || "",
      video_url: body.videoUrl || "",
      status: "pending",
      featured: false,
      tags: typeof body.tags === "string" ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : (body.tags || []),
    };

    const { data, error } = await supabase
      .from("games")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST game error:", error);

      return NextResponse.json(
        { error: "Failed to create game" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST game error:", error);

    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}