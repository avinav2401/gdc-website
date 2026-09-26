import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const path = pathArray.join("/");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return new NextResponse("Supabase URL not configured", { status: 500 });
    }

    const targetUrl = `${supabaseUrl}/storage/v1/object/public/games/${path}`;
    const response = await fetch(targetUrl, {
      headers: {
        'Accept-Encoding': 'identity' // Prevent Supabase from auto-compressing which breaks Node fetch
      }
    });

    if (!response.ok) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Determine correct content type
    let contentType =
      response.headers.get("content-type") || "application/octet-stream";
    if (path.endsWith(".html")) contentType = "text/html";
    else if (path.endsWith(".wasm")) contentType = "application/wasm";
    else if (path.endsWith(".js")) contentType = "application/javascript";
    else if (path.endsWith(".css")) contentType = "text/css";

    const headers = new Headers();
    headers.set("Content-Type", contentType);

    // Allow iframe embedding
    headers.set("X-Frame-Options", "ALLOWALL");

    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
