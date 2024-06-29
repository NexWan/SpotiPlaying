'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Callback = () => {
    const router = useRouter();
    useEffect(() => {
        var url = new URL(window.location.href);
        var code = url.searchParams.get("code");
        var state = url.searchParams.get("state");
        var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
        var client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";
        console.log(code);
        console.log(state);
        var authToken = "";

        if (code == null || state == null) {
            router.push("/");
        } else {
            var authOptions = {
                url: "https://accounts.spotify.com/api/token",
                form: {
                    code: code,
                    redirect_uri: "http://localhost:3000/callback",
                    grant_type: "authorization_code",
                },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        btoa(
                            encodeURIComponent(client_id) +
                            ":" +
                            encodeURIComponent(client_secret)
                        ),
                },
                json: true,
            };
            console.log(authOptions);
            fetch(authOptions.url, {
                method: "POST",
                headers: authOptions.headers,
                body: new URLSearchParams(authOptions.form),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Spotify API error: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.error) {
                        throw new Error(`Spotify API error: ${data.error}: ${data.error_description}`);
                    }
                    authToken = data.access_token;
                    router.push("/home?authToken=" + authToken);
                    console.log("Access Token:", authToken);
                    // Redirect with authToken here...
                })
                .catch((error) => {
                    console.error("Error fetching access token:", error);
                });
        }

    }, [router]);
    return (
        <div>
            {
                // This page will be used to handle the callback from Spotify
                // The code and state will be in the URL
                // We will use the code to get the access token
                // And the state to validate
                <p>Redirecting to main page...</p>
            }
        </div>
    );
};

export default Callback;
