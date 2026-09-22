import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    const cleanEmail = email?.trim().toLowerCase();

    const { data: user, error } = await supabase.from('users').select('*').eq('email', cleanEmail).single();

    if (!user || error) {
      // Create user if not exists
      const { data: newUser, error: createError } = await supabase.from('users').insert([{
        email: cleanEmail,
        name: name,
        role: 'member',
        password: 'google_oauth'
      }]).select().single();
      
      if (createError) return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      
      return NextResponse.json({
        success: true,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      email: user.email,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
