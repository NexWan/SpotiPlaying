
export const getUserProfile = async (token: string) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  return data;
}