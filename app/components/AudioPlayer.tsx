"use client";
import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControls";
import Backdrop from "./Backdrop";

interface Track {
    title: string;
    artist: string;
    color: string;
    image: string;
    audioSrc: string;
}

interface AudioPlayerProps {
    tracks: Track[];
    currentTrack: number;
    whatsPlayingCallback?: (trackIndex: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, currentTrack, whatsPlayingCallback }) => {

    useEffect(() => {
        if (currentTrack) {
            setTrackIndex(currentTrack - 1);
        }
    }, [currentTrack]);



    const [trackIndex, setTrackIndex] = useState<number>(0);
    const [trackProgress, setTrackProgress] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { title, artist, color, image, audioSrc } = tracks[trackIndex];

    useEffect(() => {
        if (whatsPlayingCallback) {
            whatsPlayingCallback(trackIndex + 1);
        }
    }, [trackIndex]);

    const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc));
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isReady = useRef<boolean>(false);

    const { duration } = audioRef.current;

    const currentPercentage = duration
        ? `${(trackProgress / duration) * 100}%`
        : "0%";
    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

    const startTimer = (): void => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, 1000);
    };

    const onScrub = (value: string): void => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        audioRef.current.currentTime = parseFloat(value);
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = (): void => {
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
    };

    const toPrevTrack = (): void => {
        if (trackIndex - 1 < 0) {
            setTrackIndex(tracks.length - 1);
        } else {
            setTrackIndex(trackIndex - 1);
        }
    };

    const toNextTrack = (): void => {
        if (trackIndex < tracks.length - 1) {
            setTrackIndex(trackIndex + 1);
        } else {
            setTrackIndex(0);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            startTimer();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(audioSrc);
        setTrackProgress(audioRef.current.currentTime);

        if (isReady.current) {
            audioRef.current.play();
            setIsPlaying(true);
            startTimer();
        } else {
            isReady.current = true;
        }
    }, [trackIndex, audioSrc]);

    useEffect(() => {
        return () => {
            audioRef.current.pause();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="audio-player">
            <div className="track-info">
                <img
                    className="artwork"
                    src={image}
                    alt={`track artwork for ${title} by ${artist}`}
                />
                <h2 className="title">{title}</h2>
                <AudioControls
                    isPlaying={isPlaying}
                    onPrevClick={toPrevTrack}
                    onNextClick={toNextTrack}
                    onPlayPauseClick={setIsPlaying}
                />
                <input
                    type="range"
                    value={trackProgress}
                    step="1"
                    min="0"
                    max={duration ? duration : 0}
                    className="progress"
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    style={{ background: trackStyling }}
                />
            </div>
            <Backdrop
                trackIndex={trackIndex}
                activeColor={color}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default AudioPlayer;