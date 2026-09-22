import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  const updateData: any = {};
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.title !== undefined) updateData.title = body.title;
  if (body.date !== undefined) updateData.date = body.date;
  if (body.dateSort !== undefined) updateData.date_sort = body.dateSort;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
  if (body.shape !== undefined) updateData.shape = body.shape;
  if (body.tags !== undefined) updateData.tags = body.tags;
  if (body.registerUrl !== undefined) updateData.register_url = body.registerUrl;
  if (body.floatingAssets !== undefined) updateData.floating_assets = body.floatingAssets;
  if (body.version !== undefined) updateData.version = body.version;

  const { data: event, error } = await supabase.from('events').update(updateData).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(event);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
