import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { adminComment, ...cleanBody } = body;

    const { data, error } = await supabase
      .from("games")
      .update(cleanBody)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT game error:", error);

      return NextResponse.json(
        { error: "Failed to update game" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT game error:", error);

    return NextResponse.json(
      { error: "Failed to update game" },
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
      .from("games")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE game error:", error);

      return NextResponse.json(
        { error: "Failed to delete game" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE game error:", error);

    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}