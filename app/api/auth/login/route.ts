import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Check for the backdoor admin login
    if (cleanEmail === "gdc@gmail.com" && (password === "gmaes" || password === "games")) {
      return NextResponse.json({ success: true, role: "admin", name: "Admin", email: "gdc@gmail.com" }, { status: 200 });
    }

    // 2. Connect to DB and verify against real users
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Since this is a simple club site without bcrypt hashing, we check plain text
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
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
