'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  var client_id:string = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  var redirect_uri = "https://spoti-playing.vercel.app/callback";
  var state = Math.random().toString(36).substring(7);
  var scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played user-top-read user-read-playback-position";

  var url = "https://accounts.spotify.com/authorize";

  url += "?response_type=code";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);
  url += "&show_dialog=true";

  const handleLogin = () => {
    router.push(url);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">SpotiPlaying</h1>
      <p className="text-xl">
        Welcome to SpotiPlaying! Here you can see the preview of your Spotify card!
      </p>
      <h1 className=' text-2xl text-red-600'>
        THIS VERSION IS STILL IN TESTING PHASE, SO IT MAY NOT WORK PROPERLY
      </h1>
      <p onClick={handleLogin} className=" bg-black p-5 rounded-2xl text-white hover:cursor-pointer">
          Login with Spotify
      </p>
      <Image
        src="/assets/spotify.png"
        alt="Spotify logo"
        width={200}
        height={200}
        className="mt-24"
      />
    </main>
  );
}
