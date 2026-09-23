import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Authenticate using Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (authError || !authData.user) {
      console.error("Supabase login error:", authError);

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const authUser = authData.user;

    // Get the user's GDC profile
    const { data: user, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      console.error("User profile error:", profileError);

      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // If Auth user exists but GDC profile doesn't
    if (!user) {
      const name =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        cleanEmail.split("@")[0];

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: authUser.id,
          name,
          email: cleanEmail,
          role: "member",
        })
        .select()
        .single();

      if (createError) {
        console.error("Create user profile error:", createError);

        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          role: newUser.role,
          name: newUser.name,
          email: newUser.email,
          userId: newUser.id,
          session: authData.session,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        role: user.role,
        name: user.name,
        email: user.email,
        userId: user.id,
        session: authData.session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}