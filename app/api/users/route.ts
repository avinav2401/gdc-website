import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = users.map(u => ({
      ...u,
      _id: u.id,
      createdAt: u.created_at,
      updatedAt: u.updated_at
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email: body.email,
        name: body.name,
        password: body.password,
        role: body.role || 'member'
      }])
      .select()
      .single();

    if (error) throw error;

    const mapped = {
      ...user,
      _id: user.id,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    return NextResponse.json(mapped, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
