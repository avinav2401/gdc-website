import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET team members error:", error);

      return NextResponse.json(
        { error: "Failed to fetch team members" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET team members error:", error);

    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("team_members")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST team member error:", error);

      return NextResponse.json(
        { error: "Failed to create team member" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST team member error:", error);

    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}