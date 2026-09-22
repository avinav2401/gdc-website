import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const cleanEmail = email?.trim().toLowerCase();

    const { data: existingUser } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const { data: newUser, error } = await supabase.from('users').insert([{
      name,
      email: cleanEmail,
      password,
      role: 'member'
    }]).select().single();

    if (error) return NextResponse.json({ error: "Failed to create user" }, { status: 500 });

    return NextResponse.json({
      success: true,
      role: newUser.role,
      name: newUser.name,
      email: newUser.email,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
