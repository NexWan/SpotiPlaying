'use client';

import Image from "next/image";
import {useRouter} from "next/navigation";

export default function LandingPage() {
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

  fetch('https://spoti-playing.vercel.app/api/db/userLoggedIn', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }).then((data) => {
    console.log(data);
    if(data.confirmed) {
      router.push('/home');
    }
  })


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-900" style={{backgroundImage: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)'}}>
      <div className="flex flex-col items-center justify-between space-y-20 max-w-4xl">
        <h1 className="text-4xl font-bold text-white">SpotiPlaying</h1>
        <p className="text-xl text-white">
          SpotiPlaying is a tool that allows you to create a Now Playing SVG image from your Spotify activity. Allowing you to embed it on your website or share it with your friends.
        </p>
        <h1 className=' text-2xl text-red-600'>
          THIS VERSION IS STILL IN TESTING PHASE, SO IT MAY NOT WORK PROPERLY
        </h1>
        <div className="flex flex-row justify-center items-center bg-black rounded-full p-4 hover:scale-105 transition-all">
          <Image src="/assets/spotify.png" width={50} height={50} alt="Spotify Logo" />
          <p onClick={handleLogin} className=" p-2 text-white hover:cursor-pointer hover:text-green-500">
            Login with Spotify
          </p>
        </div>
        <p className="text-white text-sm">
          If you find out any bug, please create an issue on the <a href="https://github.com/NexWan/SpotiPlaying/issues" className="underline">GitHub repo</a>
        </p>
      </div>
    </main>
  );
}
