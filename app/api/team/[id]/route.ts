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
      name: body.name,
      role: body.role,
      team: body.team,
      level: body.level !== undefined ? parseInt(body.level.toString(), 10) : undefined,
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
      .update(dbPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT team member error:", error);

      return NextResponse.json(
        { error: "Failed to update team member" },
        { status: 500 }
      );
    }

    const mappedData = data ? {
      ...data,
      imageUrl: data.image_url,
      isAlumni: data.is_alumni,
    } : null;

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("PUT team member error:", error);

    return NextResponse.json(
      { error: "Failed to update team member" },
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
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE team member error:", error);

      return NextResponse.json(
        { error: "Failed to delete team member" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE team member error:", error);

    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}