import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: events, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  
  const mapped = events.map(e => ({
    ...e,
    _id: e.id,
    dateSort: e.date_sort,
    imageUrl: e.image_url,
    registerUrl: e.register_url,
    floatingAssets: e.floating_assets
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data: event, error } = await supabase.from('events').insert([{
    slug: body.slug,
    title: body.title,
    date: body.date,
    date_sort: body.dateSort || body.date,
    location: body.location,
    status: body.status,
    description: body.description,
    image_url: body.imageUrl,
    shape: body.shape,
    tags: body.tags,
    register_url: body.registerUrl,
    floating_assets: body.floatingAssets,
    version: body.version
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(event, { status: 201 });
}
