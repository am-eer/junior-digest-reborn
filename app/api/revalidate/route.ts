import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("X-Webhook-Secret");

  if (
    !process.env.WEBHOOK_SECRET ||
    secret !== process.env.WEBHOOK_SECRET
  ) {
    console.log("Cache revalidation webhook failed");
    
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  revalidateTag("all", { expire: 0 });

  const body = await request.json();
  const { post_id, post_type, status, reason } = body;
  console.log(`Cache revalidation webhook succeeded, post_id: ${post_id}, post_type: ${post_type}, status: ${status}, reason: ${reason}`);

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}