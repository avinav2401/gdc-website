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

    const mappedData = (data || []).map((m: any) => ({
      ...m,
      imageUrl: m.image_url,
      isAlumni: m.is_alumni,
    }));

    return NextResponse.json(mappedData);
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

    const dbPayload = {
      name: body.name,
      role: body.role,
      team: body.team,
      level: parseInt(body.level || "4", 10),
      bio: body.bio,
      image_url: body.imageUrl,
      is_alumni: body.isAlumni,
      portfolio: body.portfolio,
      github: body.github,
      instagram: body.instagram,
      linkedin: body.linkedin,
    };

    const { data, error } = await supabase
      .from("team_members")
      .insert(dbPayload)
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