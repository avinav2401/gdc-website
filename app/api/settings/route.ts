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
      console.error("Supabase GET settings error:", error);

      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    // If settings don't exist, create the global settings row
    if (!settings) {
      const { data: newSettings, error: createError } = await supabase
        .from("settings")
        .insert({
          singleton_id: "global",
        })
        .select()
        .single();

      if (createError) {
        console.error(
          "Supabase CREATE settings error:",
          createError
        );

        return NextResponse.json(
          { error: "Failed to create settings" },
          { status: 500 }
        );
      }

      settings = newSettings;
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