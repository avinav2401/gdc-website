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

    if (path.endsWith(".html")) {
      let html = await response.text();
      // Inject CSS for dynamic resizing
      const injection = `
        <style>
          body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background-color: transparent !important; }
          #unity-container, .unity-desktop, .unity-mobile { background: transparent !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; margin: 0 !important; padding: 0 !important; left: 0 !important; top: 0 !important; transform: none !important; position: absolute !important; display: flex; align-items: center; justify-content: center; }
          canvas { border: 4px solid #00F2FE !important; box-shadow: 0 0 40px rgba(0,242,254,0.15) !important; max-width: 100%; max-height: 100%; object-fit: contain; background-color: #000; }
        </style>
      `;
      html = html.replace('</head>', injection + '</head>');
      
      const headers = new Headers();
      headers.set("Content-Type", "text/html");
      headers.set("X-Frame-Options", "ALLOWALL");
      return new NextResponse(html, { headers });
    }

    // Determine correct content type
    let contentType =
      response.headers.get("content-type") || "application/octet-stream";
    if (path.endsWith(".wasm")) contentType = "application/wasm";
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
