import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.developer !== undefined) updateData.developer = body.developer;
  if (body.tagline !== undefined) updateData.tagline = body.tagline;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.engine !== undefined) updateData.engine = body.engine;
  if (body.genre !== undefined) updateData.genre = body.genre;
  if (body.platform !== undefined) updateData.platform = body.platform;
  if (body.itchUrl !== undefined) updateData.itch_url = body.itchUrl;
  if (body.coverUrl !== undefined) updateData.cover_url = body.coverUrl;
  if (body.videoUrl !== undefined) updateData.video_url = body.videoUrl;
  if (body.tags !== undefined) updateData.tags = body.tags;
  if (body.userEmail !== undefined) updateData.user_email = body.userEmail;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.featured !== undefined) updateData.featured = body.featured;
  if (body.adminComment !== undefined) updateData.admin_comment = body.adminComment;

  const { data: game, error } = await supabase.from('games').update(updateData).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(game);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
