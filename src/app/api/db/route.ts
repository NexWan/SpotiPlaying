import {sql} from "@vercel/postgres"
import { log } from "console";
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
    log(requestBody)
    const parsedBody = requestBody as SpotiUser;
    if (!parsedBody.user || !parsedBody.auth) {
        return Response.json({ error: 'Bad Request' });
    }
    log('paso de aqui')

    cookieStore.set({name: "userId", value: parsedBody.user})
    cookieStore.set({name: "authToken", value: parsedBody.auth})
    cookieStore.set({name: "refreshToken", value: ""})
    log(cookieStore.get("userId"))

    try {
        const { rows } = await sql`INSERT INTO "spotiuser" (user_id, acess_token) VALUES (${requestBody.user}, ${requestBody.auth}) RETURNING *`;
        log(rows)
        cookieStore.set({name: "userId", value: parsedBody.user})
        cookieStore.set({name: "authToken", value: parsedBody.auth})
        cookieStore.set({name: "refreshToken", value: ""})
        return Response.json(rows[0]);
    } catch (error) {
        log(error)
        if (error instanceof Error && error.message.includes("duplicate key value violates unique constraint")) {
            await fetch ("http://localhost:3000/api/refreshToken", {
                method: "POST",
                body: JSON.stringify({ user: parsedBody.user })
            })
            return Response.json({ error: 'User already exists' });
        }
        return Response.json({ error: 'Internal Server Error' });
    }
}