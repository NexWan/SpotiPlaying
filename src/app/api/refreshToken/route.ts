import {cookies} from 'next/headers';
import {sql} from '@vercel/postgres';

export const POST = async (req: Request) => {
    const body = await req.json();
    const userId = body.user;
    const cookieStore = cookies()
    if(!cookieStore.get("userId")) {
        return Response.json({ error: 'User not found' });
    }
    const refreshToken = cookieStore.get("refreshToken") ?? '';
    const url = `https://accounts.spotify.com/api/token`
    console.log(refreshToken)

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
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
    const { rows } = await sql`UPDATE "spotiuser" SET acess_token = ${data.access_token} WHERE user_id = ${userId} RETURNING *`;
    return Response.json({ auth: data.access_token });
}