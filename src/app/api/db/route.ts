import {sql} from "@vercel/postgres"
import { log } from "console";
import { cookies } from "next/headers";
import { SpotiUser } from "@/app/utils/interfaces";

export async function GET() {
    const {rows} = await sql`SELECT * FROM spotiuser`
    return Response.json({message: rows});
}

export async function POST(request: Request) {
    const cookieStore = cookies()
    const requestBody = await request.json();
    log(requestBody)
    const parsedBody = requestBody as SpotiUser;
    if (!parsedBody.user || !parsedBody.auth) {
        return Response.json({ error: 'Bad Request' });
    }
    log('paso de aqui')
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    cookieStore.set({name: "userId", value: parsedBody.user, expires: fiveYearsFromNow})
    cookieStore.set({name: "authToken", value: parsedBody.auth, expires: fiveYearsFromNow})
    cookieStore.set({name: "refreshToken", value: parsedBody.refresh, expires: fiveYearsFromNow})
    log(cookieStore.get("userId"))
    try {
        const { rows } = await sql`INSERT INTO "spotiuser" (user_id, access_token, refresh_token) VALUES (${requestBody.user}, ${requestBody.auth}, ${requestBody.refresh}) RETURNING *`;
        log(rows)
        cookieStore.set({name: "userId", value: parsedBody.user})
        cookieStore.set({name: "authToken", value: parsedBody.auth})
        cookieStore.set({name: "refreshToken", value: parsedBody.refresh})
        return Response.json(rows[0]);
    } catch (error) {
        log(error)
        if (error instanceof Error && error.message.includes("duplicate key value violates unique constraint")) {
            await fetch ("https://spoti-playing.vercel.app/api/refreshToken", {
                method: "POST",
                body: JSON.stringify({ user: parsedBody.user })
            })
            return Response.json({ error: 'User already exists' });
        }
        return Response.json({ error: 'Internal Server Error' });
    }
}