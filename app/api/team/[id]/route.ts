import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  const updateData: any = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.role !== undefined) updateData.role = body.role;
  if (body.bio !== undefined) updateData.bio = body.bio;
  if (body.github !== undefined) updateData.github = body.github;
  if (body.portfolio !== undefined) updateData.portfolio = body.portfolio;
  if (body.isAlumni !== undefined) updateData.is_alumni = body.isAlumni;
  if (body.team !== undefined) updateData.team = body.team;
  if (body.level !== undefined) updateData.level = body.level;
  if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
  if (body.instagram !== undefined) updateData.instagram = body.instagram;
  if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;

  const { data: member, error } = await supabase.from('team_members').update(updateData).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(member);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
