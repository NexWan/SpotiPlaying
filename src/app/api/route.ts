import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/*
    * This is an example of an API route that requires a user to be logged in.
    * It uses a cookie to store the user's ID, and checks if the user is logged in
    * before returning a response.
    *
    * The GET method checks if the user is logged in, and returns a 401 status code
    * if they are not. The POST method logs the user in by setting a cookie with
    * the user's ID.
    * This will be useful for routes that require authentication.
*/


export async function GET() {
    const cookieStore = cookies()
    if(!cookieStore.get("userId")) {
        return NextResponse.json({message: "You are not logged in!", status: 401})
    }
    return NextResponse.json({message: "You are logged in!", status: 200})
}

export async function POST(req:NextRequest, res:NextRequest) {
    const cookieStore = cookies()
    if(cookieStore.get("userId")) {
        const auth = cookieStore.get("authToken")
        if(auth) {
            const userId = cookieStore.get("userId");
            if (userId) {
                await fetch("http://localhost:3000/api/db", {
                    method: "POST",
                    body: JSON.stringify({user: userId, auth: auth})
                }).then((response) => {
                    if (!response.ok) {
                        throw new Error(`API error: ${response.statusText}`);
                    }
                    return response.json();
                })
            }

            return NextResponse.json({message: "You are already logged in!", status: 200})
        }
        return NextResponse.json({message: "You are already logged in!", status: 400})
    }else{
        const requestBody = await req.json();
        const parsedBody = requestBody as {user: string, auth: string};
        const user = parsedBody.user;
        const auth = parsedBody.auth;
        await fetch("http://localhost:3000/api/db", {
            method: "POST",
            body: JSON.stringify({user: user, auth: auth})
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
        })
    }
    return NextResponse.json({message: "You are not logged in! z", status: 401})
}