import { Player } from "./interfaces";

export const getUserProfile = async (token: string) => {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((response) => {
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }
      return response.json();
    }).then((data:Player) => {
      console.log(data);
      return {
        name: data.item.name,
        album: data.item.album.name,
        artist: data.item.artists[0].name,
        song: data.item.name,
        image: data.item.album.images[0].url,
      };
    });
  return response;
};

export const validateToken = async () => {
  var token = ""
  var tokenIsValid = false;
   await fetch("https://spoti-playing-git-dev-nexwans-projects.vercel.app/api/getToken", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(async (data) => {
      console.log("Response in spoti util data" + data.auth);
      token = data.auth;
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        await fetch("https://spoti-playing-git-dev-nexwans-projects.vercel.app/api/refreshToken", {
          method: "POST",
          body: JSON.stringify({ user: token }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            token = data.auth;
            console.log(data.auth);
          });
      }
      return data.auth;
    });
  return token;
};
