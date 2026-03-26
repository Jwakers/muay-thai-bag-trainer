import { useEffect, useRef } from "react";
import { COUNTDOWN_MAX_SECONDS } from "../data/countdownAudio";

/**
 * Plays bundled countdown WAVs for the last `lastSeconds` of a timer (capped at
 * {@link COUNTDOWN_MAX_SECONDS}). `lastSeconds === 0` or `volume <= 0` disables audio.
 */
export function useAudibleCountdownWav(
  secondsLeft: number,
  lastSeconds: number,
  volume: number,
): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (lastSeconds <= 0 || volume <= 0) return;
    const cap = Math.min(lastSeconds, COUNTDOWN_MAX_SECONDS);
    if (secondsLeft < 1 || secondsLeft > cap) return;

    const prev = audioRef.current;
    if (prev) {
      prev.pause();
      prev.src = "";
      audioRef.current = null;
    }

    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
    const url = `${base}audio/countdown-${secondsLeft}.wav`;
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;
    audio.preload = "auto";
    audio.src = url;
    void audio.play().catch(() => {});

    return () => {
      if (audioRef.current === audio) {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, [secondsLeft, lastSeconds, volume]);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.src = "";
        audioRef.current = null;
      }
    };
  }, []);
}
