import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get the global settings
    let { data: settings, error } = await supabase
      .from("settings")
      .select("*")
      .eq("singleton_id", "global")
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205') {
        // Table doesn't exist yet, return defaults
        return NextResponse.json({
          theme: { primary: "#38bdf8", secondary: "#f472b6", bg: "#0d0d12", bgDark: "#050508", yellow: "#fbbf24" }
        });
      }
      console.error("Supabase GET settings error:", error);

      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    // If settings don't exist, return defaults
    if (!settings) {
      return NextResponse.json({
        theme: { primary: "#38bdf8", secondary: "#f472b6", bg: "#0d0d12", bgDark: "#050508", yellow: "#fbbf24" }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET settings error:", error);

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { data: settings, error } = await supabase
      .from("settings")
      .upsert(
        {
          singleton_id: "global",
          ...body,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "singleton_id",
        }
      )
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST205') {
        // Table doesn't exist yet, just return what they tried to save
        return NextResponse.json({ ...body, singleton_id: "global" });
      }
      console.error("Supabase PUT settings error:", error);

      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT settings error:", error);

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}