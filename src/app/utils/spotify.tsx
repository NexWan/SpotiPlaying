import { Player, LastPlayed } from "./interfaces";
import { sql } from "@vercel/postgres";

export const getUserProfile = async (token: string) => {
  var isPlaying = false;
  console.log("Fetching user profile with token:", token); // Log the token for debugging
  var res = { name: "", album: "", artist: "", image: "", playing: false, uri: "" };
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      // Changed endpoint to /me
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    var data: Player;
    try {
      data = await response.json();
      console.log("Data in getUserProfile:", data); // Log the raw data for debugging
      if (data.is_playing) {
        isPlaying = true;
      }
      res = {
        name: data.item.name,
        album: data.item.album.name,
        artist: data.item.artists[0].name,
        image: data.item.album.images[0].url,
        playing: isPlaying,
        uri: data.item.uri,
      };
    } catch (e) {
      res = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Error in getUserProfile: wowow2", response.statusText);
          }
          return response.json();
        })
        .then((data: LastPlayed) => {
          const ret = data.items[0].track;
          return {
            name: ret.name,
            album: ret.album.name,
            artist: ret.artists[0].name,
            image: ret.album.images[0].url,
            playing: isPlaying,
            uri: ret.uri,
          };
        });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
  console.log(res);
  return res;
};

export const validateToken = async () => {
  var token = "";
  await fetch("https://spoti-playing.vercel.app/api/getToken", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(async (data) => {
      token = data.auth;
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        console.log("entro a !response.ok");
        await fetch("https://spoti-playing.vercel.app/api/refreshToken", {
          method: "GET",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            token = data.auth;
            console.log("ola!" + data.auth);
          });
      }
      return data.auth;
    });
  return token;
};

export const getTokenByUserId = async (userId: string) => {
  const token = await fetch("https://spoti-playing.vercel.app/api/db/getTokenById", {
    method: "POST",
    body: JSON.stringify({ user: userId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
  return token;
};

export const validateTokenView = async (auth: string, refresh: string) => {
  var token = "";
  await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + auth,
    },
  }).then(async (response) => {
    if (!response.ok) {
      await fetch("https://spoti-playing.vercel.app/api/refreshToken", {
        method: "POST",
        body: JSON.stringify({ auth: auth, refresh: refresh }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          token = data.auth;
        });
    } else {
      token = auth;
    }
  });
  return token;
};
