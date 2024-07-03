import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = cookies()
    const userId = cookieStore.get("userId")
    if(!userId) {
        return Response.json({error: 'No user logged in'})
    }
    return Response.json({confirmed: true, userId: userId})
}