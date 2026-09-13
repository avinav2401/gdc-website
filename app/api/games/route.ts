import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Game from "@/models/Game";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectToDatabase();
    
    const query = email ? { userEmail: email } : {};
    const games = await Game.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const game = await Game.create(body);
    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
