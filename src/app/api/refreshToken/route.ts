import {cookies} from 'next/headers';
import {sql} from '@vercel/postgres';

export const GET = async () => {
    console.log("Estamos en refresh")
    const cookieStore = cookies()
    const userId = cookieStore.get("userId")?.value.toString() || ""
    console.log("Estamos en refresh", userId)
    if(!cookieStore.get("userId")) {
        return Response.json({ error: 'User not found' });
    }
    const refreshToken = cookieStore.get("refreshToken")?.value.toString() ?? '';
    console.log("Refresh token en refresh", refreshToken)
    const url = `https://accounts.spotify.com/api/token`
    const client = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
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
    cookieStore.set("authToken", data.access_token, {path: "/", expires: (Date.now() + ((10 * 365 * 24 * 60 * 60)))})
    const { rows } = await sql`UPDATE "spotiuser" SET access_token = ${data.access_token} WHERE user_id = ${userId} RETURNING *`;
    return Response.json({ auth: data.access_token });
}

export const POST = async (req: Request) => {
    const request = await req.json();
    const authToken = request.auth;
    console.log(authToken)
    const refreshToken = request.refresh;
    console.log(refreshToken)
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ":" + process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });
    const data = await response.json();
    console.log(data)
    const { rows } = await sql`UPDATE "spotiuser" SET access_token = ${data.access_token} WHERE user_id = ${request.user} RETURNING *`;
    return Response.json({ auth: data.access_token });
}