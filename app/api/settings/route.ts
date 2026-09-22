import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    let { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .eq('singleton_id', 'global')
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found, create one
      const { data: newSettings, error: insertError } = await supabase
        .from('settings')
        .insert([{ singleton_id: 'global' }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      settings = newSettings;
    } else if (error) {
      throw error;
    }

    // Map to camelCase for the frontend
    const mapped = {
      _id: settings.id,
      heroVideoUrl: settings.hero_video_url,
      ...settings,
    };

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // Map from camelCase to snake_case
    const updateData: any = {};
    if (body.heroVideoUrl !== undefined) updateData.hero_video_url = body.heroVideoUrl;

    const { data: settings, error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('singleton_id', 'global')
      .select()
      .single();

    if (error) throw error;

    const mapped = {
      _id: settings.id,
      heroVideoUrl: settings.hero_video_url,
      ...settings,
    };

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
