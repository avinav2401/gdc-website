import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
    }

    const { email, name } = payload;
    const cleanEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Create a new user with default password since they are logging in via Google
      user = await User.create({
        name: name || "Google User",
        email: cleanEmail,
        password: Math.random().toString(36).slice(-10), // Random password
        role: "member"
      });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      email: user.email,
    }, { status: 200 });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
