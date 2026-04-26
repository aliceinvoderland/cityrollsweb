import { NextResponse } from "next/server";

export async function POST(req) {
  void req;
  return NextResponse.json(
    { error: "Deprecated endpoint. Use Supabase email OTP verification from the client login flow." },
    { status: 410 }
  );
}
