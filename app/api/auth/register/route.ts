import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Create the user using Supabase Auth
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
        },
      },
    });

    if (authError) {
      console.error("Supabase registration error:", authError);

      if (authError.message.toLowerCase().includes("already")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create the GDC user profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        name: cleanName,
        email: cleanEmail,
        role: "member",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Create user profile error:", profileError);

      return NextResponse.json(
        { error: "Account created but failed to create user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        role: profile.role,
        name: profile.name,
        email: profile.email,
        userId: profile.id,
        session: authData.session,
        message: authData.session
          ? "Registration successful"
          : "Registration successful. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}