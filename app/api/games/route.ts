import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let query = supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (email) {
      query = query.eq("user_email", email);
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

    // Map camelCase (from dashboard) to snake_case (Supabase columns)
    const row = {
      title: body.title,
      tagline: body.tagline,
      description: body.description,
      engine: body.engine,
      genre: body.genre,
      platform: body.platform,
      tags: body.tags,
      developer: body.developer,
      itch_url: body.itchUrl,
      cover_url: body.coverUrl,
      video_url: body.videoUrl,
      user_email: body.userEmail,
      status: "pending",
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