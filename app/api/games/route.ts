import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: games, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  
  const mapped = games.map(g => ({
    ...g,
    _id: g.id,
    itchUrl: g.itch_url,
    coverUrl: g.cover_url,
    videoUrl: g.video_url,
    userEmail: g.user_email,
    adminComment: g.admin_comment
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data: game, error } = await supabase.from('games').insert([{
    title: body.title,
    developer: body.developer,
    tagline: body.tagline,
    description: body.description,
    engine: body.engine,
    genre: body.genre,
    platform: body.platform,
    itch_url: body.itchUrl,
    cover_url: body.coverUrl,
    video_url: body.videoUrl,
    tags: body.tags,
    user_email: body.userEmail,
    status: body.status || 'pending',
    featured: body.featured || false,
    admin_comment: body.adminComment || ''
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(game, { status: 201 });
}
