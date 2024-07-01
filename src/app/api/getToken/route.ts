import {cookies} from "next/headers";

export function GET() {
    const cookieStore = cookies()
    const userId = cookieStore.get("userId")?.value.toString() || ""
    const authToken = cookieStore.get("authToken")?.value.toString() || ""
    const refreshToken = cookieStore.get("refreshToken")?.value.toString() || ""
    return Response.json({ user: userId, auth: authToken, refresh: refreshToken });
}