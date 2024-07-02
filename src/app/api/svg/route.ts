import { getTokenByUserId, getUserProfile, validateTokenView } from "@/app/utils/spotify";
import type { NextRequest } from "next/server";

export async function GET(req:Request, res:Response) {
    // Set Content-Type for SVG
    var url = new URL(req.url);
    const userId = url.searchParams.get("userId") || '';
    console.log(userId);
    const storedTokens = await getTokenByUserId(userId);
    const token = await validateTokenView(storedTokens.auth, storedTokens.refresh);
    console.log(token);
    const userData = await getUserProfile(token);
    const name = userData.name;
    const artist = userData.artist;
    const image = userData.image;
    const playing = userData.playing;
    const album = userData.album;

    const svgContent = genSvg(name, artist, image, playing, album);
  
    // Send SVG content
    return new Response(
      svgContent,
      {
        headers: {
          "Content-Type": "image/svg+xml",
        },
      }
    )
  }

  const genSvg = (songName:String, artistName:String, albumArt:string, playing:Boolean, albumName:String) => {
    return `
    <svg viewBox="0 0 400 800" width="400px" height="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <foreignObject x="0" y="0" width="400px" height="800px">
        <style>
          .mainContainer {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            border-radius: 20px;
            --tw-bg-opacity: 1;
            background-color: #121212;
            width: 400px;
            height: 600px;
          }

          .flex {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: fit-content;
            left: 100%;
            align-items: center;
            justify-content: center;
            row-gap: 10px;
          }

          .spotifyLogo {
            width: 50px;
            height: 50px;
            padding-right: 10px;
            font-weight: bold;
          }

          p,h1 {
            color: white;
            font-family: 'Montserrat', sans-serif;
            line-height: 0.5;
          }

          .title {
            font-size: 32px;
          }

          @keyframes quiet {
            25%{
              transform: scaleY(.6);
            }
            50%{
              transform: scaleY(.4);
            }
            75%{
              transform: scaleY(.8);
            }
          }
        
          @keyframes normal {
            25%{
              transform: scaleY(1);
            }
            50%{
              transform: scaleY(.4);
            }
            75%{
              transform: scaleY(.6);
            }
          }
          @keyframes loud {
            25%{
              transform: scaleY(1);
            }
            50%{
              transform: scaleY(.4);
            }
            75%{
              transform: scaleY(1.2);
            }
          }
          
          .boxContainer{
            display: flex;
            justify-content: space-between;
            height: 64px;
            --boxSize: 16px;
            --gutter: 8px;
            width: calc((var(--boxSize) + var(--gutter)) * 5);
          }
          
          .box{
            transform: scaleY(.4);
            height: 100%;
            width: calc(var(--boxSize) * 0.5);
            background: #1ED760;
            animation-duration: 1.2s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            border-radius: 8px;
          }
          
          .box1{
            animation-name: quiet;
          }
          
          .box2{
            animation-name: normal;
          }
          
          .box3{
            animation-name: quiet;
          }
          
          .box4{
            animation-name: loud;
          }
          
          .box5{
            animation-name: quiet;
          }

          .box6 {
            animation-name: normal;
          }
          
          .box7 {
            animation-name: loud;
          }
          
          .box8 {
            animation-name: quiet;
          }
          
          .box9 {
            animation-name: normal;
          }

          .albumArt {
            width: 200px;
            height: 200px;
            border-radius: 20px;
          }

        </style>
        <div class="mainContainer" xmlns="http://www.w3.org/1999/xhtml">
          <p class="title">${playing ? "Playing" : "Last Played"}</p>
          <p> ${songName} </p>
          <img src='${albumArt}' class='albumArt' alt="Album cover" />
          <div class="flex" style='padding:20px;'>
            <img class='spotifyLogo' src='http://localhost:3000/assets/spotify.png' alt="Album cover" />
            <div class="boxContainer">
              ${Array.from({ length: 8 }, (_, i) => (
                `<div class="box box${i + 1}"></div>`
              ))}
            </div>
          </div>
          <p>Album</p>
          <p>${albumName}</p>
          <p>Artist</p>
          <p>${artistName}</p>
        </div>
      </foreignObject>
    </svg>
    `
  }