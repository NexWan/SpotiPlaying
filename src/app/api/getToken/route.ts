import {cookies} from "next/headers";

export function GET() {
    const cookieStore = cookies()
    const userId = cookieStore.get("userId")?.toString() || ""
    const authToken = cookieStore.get("authToken")?.toString() || ""
    return {user: userId, auth: authToken}
}