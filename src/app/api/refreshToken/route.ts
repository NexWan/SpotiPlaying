import {cookies} from 'next/headers';
import {sql} from '@vercel/postgres';

export const POST = async (req: Request) => {
    const cookieStore = cookies()
    const userId = cookieStore.get("userId")?.value.toString() || ""
    if(!cookieStore.get("userId")) {
        return Response.json({ error: 'User not found' });
    }
    const refreshToken = cookieStore.get("refreshToken")?.value.toString() ?? '';
    const url = `https://accounts.spotify.com/api/token`
    console.log(refreshToken)
    const client = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    console.log("Client id: ", client)
    var authOptions = {
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(client + ":" + process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET),
        },
        form: { 
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        },
        json: true,
    };
    const response = await fetch(authOptions.url, {
        method: "POST",
        headers: authOptions.headers,
        body: new URLSearchParams(authOptions.form),
    });
    const data = await response.json();
    console.log(data)
    cookieStore.set("authToken", data.access_token, {path: "/"})
    cookieStore.set("refreshToken", data.refresh_token, {path: "/"})
    const { rows } = await sql`UPDATE "spotiuser" SET access_token = ${data.access_token}, refresh_token = ${data.refresh_token} WHERE user_id = ${userId} RETURNING *`;
    return Response.json({ auth: data.access_token });
}