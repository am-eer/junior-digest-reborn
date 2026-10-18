import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

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

  console.log("Cache revalidation webhook succeeded");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}