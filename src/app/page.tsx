"use client";
import React, { useEffect, useState, useRef } from "react";
import ExpandableCard from './components/Listing';
import AudioPlayer from './components/AudioPlayer';
import WaveSurfer from 'wavesurfer.js'

const tracks: any = [
  {
    id: 1,
    title: "Radio 1's Drag Queen's Den",
    artist: "",
    audioSrc: './audio/Radio1sDragQueensDen.mp3',
    image: 'https://ichef.bbci.co.uk/images/ic/640x360/p06xt8x3.jpg',
    color: "#00aeb0"
  },
  {
    id: 2,
    title: "The Untold",
    artist: "",
    audioSrc: './audio/TheUntold.mp3',
    image: 'https://ichef.bbci.co.uk/images/ic/640x360/p06w4g8c.jpg',
    color: "#ffb77a"
  },
  {
    id: 3,
    title: "How To Invent A Country",
    artist: "",
    audioSrc: './audio/HowToInventACountry.mp3',
    image: 'https://ichef.bbci.co.uk/images/ic/640x360/p0683mt5.jpg',
    color: "#5f9fff"
  },
  {
    id: 4,
    title: "Live Lounge Uncovered",
    artist: "",
    audioSrc: './audio/LiveLoungeUncovered.mp3',
    image: 'https://ichef.bbci.co.uk/images/ic/640x360/p06rvmm2.jpg',
    color: "#5f9fff"
  },
  {
    id: 5,
    title: "The Case Of Charles Dexter Ward",
    artist: "",
    audioSrc: './audio/TheCaseOfCharlesDexterWard.mp3',
    image: 'https://ichef.bbci.co.uk/images/ic/640x360/p06tm8tb.jpg',
    color: "#5f9fff"
  }
]

export default function Home() {

  const [currentTrack, setCurrentTrackCallBack] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<number>(0);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: document.getElementById('waveform') as HTMLElement,
      waveColor: 'grey',
      progressColor: 'rgb(100, 0, 100)',
      interact: false,
      url: tracks[currentTrack].audioSrc,

      // Set a bar width
      barWidth: 5,
      // Optionally, specify the spacing between bars
      barGap: 2,
      // And the bar radius
      barRadius: 2,
    })
  }, [])

  return <>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: 100, zIndex: 10, height: '85vh' }}>
      <div className="w-3/5" style={{ zIndex: 1 }}>
        <h1>Top 5 Podcasts of the Week!</h1>
        <ExpandableCard currentTrackCallback={(id: number) => setCurrentTrackCallBack(id)} activeTrack={activeTrack} />
      </div>
      <div className="w-2/5" >
        <AudioPlayer tracks={tracks} currentTrack={currentTrack} whatsPlayingCallback={(trackIndex) => setActiveTrack(trackIndex)} />
      </div>
    </div>
    <div id="waveform" style={{ width: '100%', height: 128 }}></div>
  </>
}

