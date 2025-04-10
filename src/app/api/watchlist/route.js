import { addToWatchlist, removeFromWatchlist, getUserWatchlist, validateSession } from "@/lib/authService";
import { NextResponse } from "next/server";

async function getSessionUser(request) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  if (!sessionToken) {
    throw new Error("No session token provided");
  }
  return await validateSession(sessionToken);
}

export async function GET(request) {
  try {
    const { id: userId } = await getSessionUser(request);
    const watchlist = await getUserWatchlist(userId);

    return NextResponse.json({ watchlist }, { status: 200 });
  } catch (error) {
    const status = error.message.includes("session") ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const { id: userId } = await getSessionUser(request);
    const { coinUuid } = await request.json();

    if (!coinUuid) {
      return NextResponse.json({ error: "Coin UUID is required" }, { status: 400 });
    }

    const result = await addToWatchlist(userId, coinUuid);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const status = error.message.includes("session") ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request) {
  try {
    const { id: userId } = await getSessionUser(request);
    const { coinUuid } = await request.json();

    if (!coinUuid) {
      return NextResponse.json({ error: "Coin UUID is required" }, { status: 400 });
    }

    const result = await removeFromWatchlist(userId, coinUuid);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const status = error.message.includes("session") ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}