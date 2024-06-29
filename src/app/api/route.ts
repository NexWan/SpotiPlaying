import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
    cookies().set("name", "value");
    return NextResponse.redirect("/home");
}