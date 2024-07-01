import {sql} from "@vercel/postgres"

export async function POST(req: Request) {
    const request = await req.json();
    const userId = request.user;
    console.log(userId)
    const {rows} = await sql`SELECT access_token FROM spotiuser WHERE user_id = ${userId}`
    return Response.json({message: rows[0].access_token});
}