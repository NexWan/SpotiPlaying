"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getUserProfile, validateToken } from "../utils/spotify";
import Image from "next/image";

function View({ pasedToken }: { pasedToken?: string }) {
  const [currentSong, setCurrentSong] = useState("");
  const [currentAlbum, setCurrentAlbum] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchSong = async () => {
    console.log("Token in View:", pasedToken); // Log the token for debugging
    const token = pasedToken !== undefined ? pasedToken : await validateToken();
    const userData = await getUserProfile(token);
    setCurrentSong(userData.name);
    setCurrentAlbum(userData.album);
    setCurrentArtist(userData.artist);
    setCurrentImage(userData.image);
    setIsPlaying(userData.playing);
  };

  useEffect(() => {
    fetchSong();
  }, []); // Dependency array is empty, so this effect runs only once

  return (
    <div className=" text-center w-72 flex flex-col bg-slate-950 p-10 items-center justify-center rounded-2xl shadow-2xl space-y-3 min-h-96">
      <div className="flex flex-row justify-evenly items-center w-full left-100">
        <p className="font-monesrrat text-white font-bold ">
          {isPlaying ? "Playing" : "Last Played"}
        </p>
      </div>
      <p
        className={`h1 ${styles.montserrat} font-montesrrat text-white font-bold text-4xl}`}
      >
        {currentSong}
      </p>
      <img src={currentImage} alt="Album cover" />
      <div className="flex  space-x-1 rounded-xl p-2 justify-center items-center">
      <Image
            src="/assets/spotify.png"
            alt="Spotify logo"
            width={50}
            height={50}
          />
        <div className={styles.boxContainer}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`${styles.box} ${styles[`box${i + 1}`]}`}
            ></div>
          ))}
        </div>
      </div>
      <h1 className="text-white font-bold">Album</h1>
      <p className="text-white">{currentAlbum}</p>
      <h1 className="text-white font-bold">Artist</h1>
      <p className="text-white">{currentArtist}</p>
    </div>
  );
}

export default View;
