import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 400 }
      );
    }

    // Sign in the Google user through Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithIdToken({
        provider: "google",
        token,
      });

    if (authError) {
      console.error("Supabase Google Auth Error:", authError);

      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Unable to authenticate Google user" },
        { status: 401 }
      );
    }

    const authUser = authData.user;

    const email = authUser.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Google account does not have an email" },
        { status: 400 }
      );
    }

    const name =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      "Google User";

    // Check if the GDC profile already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (findError) {
      console.error("Find user error:", findError);

      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    let user = existingUser;

    // Create the GDC profile if this is the user's first login
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          id: authUser.id,
          name,
          email,
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

      user = newUser;
    }

    return NextResponse.json(
      {
        success: true,
        role: user.role,
        name: user.name,
        email: user.email,
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Auth Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}