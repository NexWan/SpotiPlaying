"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Callback = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      redirect();
      hasRedirected.current = true;
    }
  }, []);
  const redirect = async () => {
    var url = new URL(window.location.href);
    var code = url.searchParams.get("code");
    var state = url.searchParams.get("state");
    var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
    var client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";
    var authToken = "";
    var existingUser = false;
    var refreshToken = "";

    await fetch("https://spoti-playing-git-dev-nexwans-projects.vercel.app/api", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        console.log(response);
        return response.json();
      })
      .then(async (data) => {
        console.log(data);
        if (data.status == 200) {
          existingUser = true;
        } else {
          existingUser = false;
        }
        if (!existingUser) {
          var authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(client_id + ":" + client_secret),
            },
            form: {
              grant_type: "authorization_code",
              code: code || "",
              redirect_uri: "https://spoti-playing-git-deploy-testing-nexwans-projects.vercel.app/callback",
            },
          };
          await fetch(authOptions.url, {
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
            .then(async (data) => {
              if (data.error) {
                throw new Error(
                  `Spotify API error: ${data.error}: ${data.error_description}`
                );
              }
              authToken = data.access_token;
              refreshToken = data.refresh_token;
              console.log("Access Token:", authToken);
              // Redirect with authToken here...
              // fetch the user id
              await fetch("https://api.spotify.com/v1/me", {
                headers: { Authorization: "Bearer " + authToken },
              })
                .then((response) => {
                  console.log(authToken + "entro aca");
                  if (!response.ok) {
                    throw new Error(
                      `Spotify API error: ${response.statusText}`
                    );
                  }
                  return response.json();
                })
                .then(async (data) => {
                  console.log(data + "entro aca");
                  await fetch("https://spoti-playing-git-deploy-testing-nexwans-projects.vercel.app/api/db", {
                    method: "POST",
                    body: JSON.stringify({ user: data.id, auth: authToken, refresh: refreshToken}),
                  });
                  router.push("/home");
                })
                .catch((error) => {
                  console.error("Error fetching user id:", error);
                });
            })
            .catch((error) => {
              console.error("Error fetching access token:", error);
            });
        } else {
          router.push("/home");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };
  return (
    <div>
      {/* This page will be used to handle the callback from Spotify
          The code and state will be in the URL
          We will use the code to get the access token
          And the state to validate */}
      <p>Redirecting to main page...</p>
    </div>
  );
};

export default Callback;
