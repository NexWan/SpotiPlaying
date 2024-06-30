"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Player {
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
  };
  repeat_state: string;
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: { spotify: string };
    uri: string;
  };
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: {
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: string[];
      external_urls: { spotify: string };
      href: string;
      id: string;
      images: [
        {
          url: string;
          height: number;
          width: number;
        }
      ];
      name: string;
      release_date: string;
      release_date_precision: string;
      restrictions: { reason: string };
      type: string;
      uri: string;
      artists: [
        {
          external_urls: { spotify: string };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }
      ];
    };
    artists: [
      {
        external_urls: { spotify: string };
        followers: { href: string; total: number };
        genres: string[];
        href: string;
        id: string;
        images: [
          {
            url: string;
            height: number;
            width: number;
          }
        ];
        name: string;
        popularity: number;
        type: string;
        uri: string;
      }
    ];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: { isrc: string; ean: string; upc: string };
    external_urls: { spotify: string };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: object;
    restrictions: { reason: string };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  };
  currently_playing_type: string;
  actions: {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  };
}

function View() {
  const [userToken, setUserToken] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [currentAlbum, setCurrentAlbum] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [bars, setBars] = useState<React.ReactElement[]>([]);

  const validateToken = (errors:number) => {
    fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (!response.ok) {
        fetch("http://localhost:3000/api/refreshToken", {
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
            fetch("http://localhost:3000/api/getToken", {
              method: "GET",
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`API error: ${response.statusText}`);
                }
                if(errors > 1) {
                  throw new Error(`API error: ${response.statusText}`);
                }
                validateToken(2);
                return response.json();
              })
              .then((data) => {
                token = data.auth;
                console.log(data.auth);
              });
          });
      }
      return response.json();
    });
  };

  const fetchSong = async () => {
    //await validateToken(0);
    const token = await fetch("http://localhost:3000/api/getToken", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.auth);
        return data.auth;
      });
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    setCurrentSong(data.item.name);
    setCurrentAlbum(data.item.album.name);
    setCurrentArtist(data.item.artists[0].name);
    setCurrentImage(data.item.album.images[0].url);
  };

  useEffect(() => {
    fetchSong();
  }, []); // Dependency array is empty, so this effect runs only once

  return (
    <div className=" text-center w-72 flex flex-col bg-slate-950 p-10 items-center justify-center rounded-2xl shadow-2xl space-y-3">
      <p
        className={`h1 ${styles.montserrat} font-montesrrat text-white font-bold text-4xl}`}
      >
        {currentSong}
      </p>
      <img src={currentImage} alt="Album cover" />
      <div className="flex items-end space-x-1 rounded-xl bg-slate-900 p-2">
        <div className={`${styles.boxContainer}`}>
          <div className={`${styles.box} ${styles.box1}`}></div>
          <div className={`${styles.box} ${styles.box2}`}></div>
          <div className={`${styles.box} ${styles.box3}`}></div>
          <div className={`${styles.box} ${styles.box4}`}></div>
          <div className={`${styles.box} ${styles.box5}`}></div>
          <div className={`${styles.box} ${styles.box6}`}></div>
          <div className={`${styles.box} ${styles.box7}`}></div>
          <div className={`${styles.box} ${styles.box8}`}></div>
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
