import {sql} from "@vercel/postgres"
import { get } from "http";
import { cookies } from "next/headers";

interface SpotiUser {
    user: string;
    auth: string;
}


export async function GET() {
    const {rows} = await sql`SELECT * FROM spotiuser`
    return rows
}

export async function POST(request: Request) {
    const cookieStore = cookies()
    const requestBody = await request.json();
    const parsedBody = requestBody as SpotiUser;
    if (!parsedBody.user || !parsedBody.auth) {
        return Response.json({ error: 'Bad Request' });
    }

    try {
        const { rows } = await sql`INSERT INTO "spotiuser" (user_id, acess_token) VALUES (${parsedBody.user}, ${parsedBody.auth}) RETURNING *`;
        cookieStore.set("userId", parsedBody.user, {path: "/"})
        cookieStore.set("authToken", parsedBody.auth, {path: "/"})
        cookieStore.set("refreshToken", parsedBody.auth, {path: "/"})
        return Response.json(rows[0]);
    } catch (error:any) {
        console.error(error);
        if (error.message.includes("duplicate key value violates unique constraint")) {
            getRefreshToken(parsedBody.user)
            return Response.json({ error: 'User already exists' });
        }
        return Response.json({ error: 'Internal Server Error' });
    }
}

export const getRefreshToken = async (userId: string) => {
    const cookieStore = cookies()
    if(!cookieStore.get("userId")) {
        return Response.json({ error: 'User not found' });
    }
    const refreshToken = cookieStore.get("refreshToken") ?? '';
    const url = `https://accounts.spotify.com/api/token`

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken.toString() || '',
            client_id: process.env.SPOTIFY_CLIENT_ID || ''
        }),
    }
    const response = await fetch(url, payload);
    const data = await response.json();
    cookieStore.set("authToken", data.access_token, {path: "/"})
    cookieStore.set("refreshToken", data.refresh_token, {path: "/"})
    const { rows } = await sql`UPDATE "spotiuser SET acess_token = ${data.access_token} WHERE user_id = ${userId} RETURNING *`;
}
