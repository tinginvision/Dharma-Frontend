import { NextResponse } from "next/server";
import { fetchAllMovieName } from "@/lib/server/movies/list";

/** Movie name list for header / combobox search (same pool as legacy `allMovieName10`). */
export async function GET() {
  try {
    const data = await fetchAllMovieName();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("[api/movies/names]", err);
    return NextResponse.json([], { status: 200 });
  }
}
