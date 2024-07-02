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
    var image = userData.image;
    const playing = userData.playing;
    const album = userData.album;
    image = `data:image/jpeg;base64,${await imgToBase64(image)}`
    const spotiImage = `data:image/jpeg;base64,${await imgToBase64('https://spoti-playing.vercel.app/assets/spotify.png')}`
    const svgContent = genSvg(name, artist, image, playing, album, spotiImage);
  
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

  const imgToBase64 = async (url:string) => {
    const response = await fetch(url);
    const imageBuffer = await response.arrayBuffer();
    return Buffer.from(imageBuffer).toString('base64');
  }

  const genSvg = (songName:String, artistName:String, albumArt:string, playing:Boolean, albumName:String, spotiImage:String) => {
    return `
    <svg viewBox="0 0 400 600" width="400px" height="600px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <foreignObject x="0" y="0" width="400px" height="800px">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap');
          .mainContainer {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            border-radius: 20px;
            --tw-bg-opacity: 1;
            background-image: radial-gradient( circle 815px at 23.4% -21.8%,  rgba(9,29,85,1) 0.2%, rgba(0,0,0,1) 100.2% );
            width: 400px;
            height: 600px;
            col-gap: 1px;
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
            line-height: 1;
            margin:10px;
          }

          .title {
            font-size: 24px;
            font-weight: bold;
            color: #1ED760;
            margin-top: 20px;
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
          <p class="title">${playing ? "Now Playing" : "Last Played"}</p>
          <p> ${songName} </p>
          <img src='${albumArt}' class='albumArt' style='margin:10px;' alt="Album cover" />
          <div class="flex" style='padding:20px;'>
            <img class='spotifyLogo' src='${spotiImage}' alt="Album cover"></img>
            <div class="boxContainer">
              ${Array.from({ length: 8 }, (_, i) => (
                `<div class="box box${i + 1}"></div>`
              ))}
            </div>
          </div>
          <p style='font-weight: bold;'>Album</p>
          <p>${albumName}</p>
          <p style='font-weight: bold;'>Artist</p>
          <p>${artistName}</p>
        </div>
      </foreignObject>
    </svg>
    `
  }