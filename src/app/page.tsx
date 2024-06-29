'use client';

import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  var client_id:string = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  var redirect_uri = "http://spoti-playing.vercel.app/callback";
  var state = Math.random().toString(36).substring(7);
  var scope = "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing";

  var url = "https://accounts.spotify.com/authorize";

  url += "?response_type=code";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);

  const handleLogin = () => {
    router.push(url);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Spotify API</h1>
      <p className="text-xl">
        This is a simple example of how to use the Spotify API with Next.js
      </p>
      <p onClick={handleLogin} className="">
          Login with Spotify
      </p>
      <Image
        src="/spotify.png"
        alt="Spotify logo"
        width={200}
        height={200}
        className="mt-24"
      />
    </main>
  );
}
