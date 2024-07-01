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
    cookieStore.set("authToken", data.access_token, {path: "/"})
    const { rows } = await sql`UPDATE "spotiuser" SET access_token = ${data.access_token} WHERE user_id = ${userId} RETURNING *`;
    return Response.json({ auth: data.access_token });
}