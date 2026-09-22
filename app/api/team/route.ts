import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: team, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  
  const mapped = team.map(t => ({
    ...t,
    _id: t.id,
    isAlumni: t.is_alumni,
    imageUrl: t.image_url
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data: member, error } = await supabase.from('team_members').insert([{
    name: body.name,
    role: body.role,
    bio: body.bio,
    github: body.github,
    portfolio: body.portfolio,
    is_alumni: body.isAlumni,
    team: body.team,
    level: body.level,
    image_url: body.imageUrl,
    instagram: body.instagram,
    linkedin: body.linkedin
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(member, { status: 201 });
}
