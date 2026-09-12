import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Check for the backdoor admin login
    if (email === "admin@college.edu" && password === "admin") {
      return NextResponse.json({ success: true, role: "admin", name: "Backdoor Admin" }, { status: 200 });
    }

    // 2. Connect to DB and verify against real users
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
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
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
