"use client";

import type { MouseEvent, PointerEvent } from "react";
import { useState } from "react";
import { useMediaRemote, useMediaStore } from "@vidstack/react";

const FALLBACK_DURATION = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatMediaTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const totalSeconds = Math.floor(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type VideoPlayerController = {
  media: ReturnType<typeof useMediaStore>;
  seekMin: number;
  seekMax: number;
  seekValue: number;
  bufferedPercent: number;
  togglePlayback: (event: MouseEvent<HTMLButtonElement>) => void;
  seekBy: (seconds: number, event: MouseEvent<HTMLButtonElement>) => void;
  previewSeek: (values: number[]) => void;
  commitSeek: (values: number[]) => void;
  startPointerSeek: (event: PointerEvent<HTMLElement>) => void;
  movePointerSeek: (event: PointerEvent<HTMLElement>) => void;
  finishPointerSeek: (event: PointerEvent<HTMLElement>) => void;
  changeVolume: (values: number[]) => void;
  toggleMuted: (event: MouseEvent<HTMLButtonElement>) => void;
  toggleFullscreen: (event: MouseEvent<HTMLButtonElement>) => void;
  togglePictureInPicture: (event: MouseEvent<HTMLButtonElement>) => void;
  changePlaybackRate: (rate: number) => void;
  changeQuality: (index: number) => void;
  changeAudioTrack: (index: number) => void;
  changeTextTrack: (trackId: string | null) => void;
  toggleCaptions: (event: MouseEvent<HTMLButtonElement>) => void;
  toggleLoop: () => void;
  seekToLiveEdge: () => void;
  requestAirPlay: () => void;
  requestGoogleCast: () => void;
  handleMenuOpenChange: (open: boolean) => void;
};

export function useVideoPlayer(): VideoPlayerController {
  const remote = useMediaRemote();
  const media = useMediaStore();
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const [preferredCaptionId, setPreferredCaptionId] = useState<string | null>(null);

  const seekMin = media.live && media.isLiveDVR ? media.seekableStart : 0;
  const seekMax = Number.isFinite(media.duration)
    ? media.duration
    : Number.isFinite(media.seekableEnd)
      ? media.seekableEnd
      : FALLBACK_DURATION;
  const seekValue = clamp(pendingSeek ?? media.currentTime, seekMin, Math.max(seekMin, seekMax));
  const seekWindow = Math.max(seekMax - seekMin, 0);
  const bufferedPercent =
    seekWindow > 0 ? clamp(((media.bufferedEnd - seekMin) / seekWindow) * 100, 0, 100) : 0;

  function togglePlayback(event: MouseEvent<HTMLButtonElement>): void {
    remote.togglePaused(event.nativeEvent);
  }

  function seekBy(seconds: number, event: MouseEvent<HTMLButtonElement>): void {
    remote.seek(clamp(media.currentTime + seconds, seekMin, seekMax), event.nativeEvent);
  }

  function previewSeek(values: number[]): void {
    const nextTime = values[0] ?? seekMin;
    setPendingSeek(nextTime);
    remote.seeking(nextTime);
  }

  function commitSeek(values: number[]): void {
    remote.seek(values[0] ?? seekMin);
    setPendingSeek(null);
  }

  function seekFromPointerPosition(event: PointerEvent<HTMLElement>): void {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0 || seekMax <= seekMin) return;

    const progress = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    remote.seek(seekMin + progress * (seekMax - seekMin), event.nativeEvent);
  }

  function startPointerSeek(event: PointerEvent<HTMLElement>): void {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointerPosition(event);
  }

  function movePointerSeek(event: PointerEvent<HTMLElement>): void {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seekFromPointerPosition(event);
  }

  function finishPointerSeek(event: PointerEvent<HTMLElement>): void {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    seekFromPointerPosition(event);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function changeVolume(values: number[]): void {
    const nextVolume = clamp((values[0] ?? 0) / 100, 0, 1);
    if (nextVolume > 0 && media.muted) remote.unmute();
    remote.changeVolume(nextVolume);
  }

  function toggleMuted(event: MouseEvent<HTMLButtonElement>): void {
    remote.toggleMuted(event.nativeEvent);
  }

  function toggleFullscreen(event: MouseEvent<HTMLButtonElement>): void {
    remote.toggleFullscreen("prefer-media", event.nativeEvent);
  }

  function togglePictureInPicture(event: MouseEvent<HTMLButtonElement>): void {
    remote.togglePictureInPicture(event.nativeEvent);
  }

  function changePlaybackRate(rate: number): void {
    remote.changePlaybackRate(rate);
  }

  function changeQuality(index: number): void {
    if (index < 0) {
      remote.requestAutoQuality();
      return;
    }

    remote.changeQuality(index);
  }

  function changeAudioTrack(index: number): void {
    remote.changeAudioTrack(index);
  }

  function changeTextTrack(trackId: string | null): void {
    if (trackId === null) {
      if (media.textTrack) setPreferredCaptionId(media.textTrack.id);
      remote.disableCaptions();
      return;
    }

    const trackIndex = media.textTracks.findIndex((track) => track.id === trackId);
    if (trackIndex >= 0) {
      setPreferredCaptionId(trackId);
      remote.changeTextTrackMode(trackIndex, "showing");
    }
  }

  function toggleCaptions(event: MouseEvent<HTMLButtonElement>): void {
    if (media.textTrack) {
      setPreferredCaptionId(media.textTrack.id);
      remote.disableCaptions(event.nativeEvent);
      return;
    }

    const preferredTrackIndex = media.textTracks.findIndex(
      (track) => track.id === preferredCaptionId,
    );
    const fallbackTrackIndex = media.textTracks.findIndex(
      (track) => track.kind === "captions" || track.kind === "subtitles",
    );
    const trackIndex = preferredTrackIndex >= 0 ? preferredTrackIndex : fallbackTrackIndex;

    if (trackIndex >= 0) {
      setPreferredCaptionId(media.textTracks[trackIndex]?.id ?? null);
      remote.changeTextTrackMode(trackIndex, "showing", event.nativeEvent);
    }
  }

  function toggleLoop(): void {
    remote.userPrefersLoopChange(!media.loop);
  }

  function seekToLiveEdge(): void {
    remote.seekToLiveEdge();
  }

  function requestAirPlay(): void {
    remote.requestAirPlay();
  }

  function requestGoogleCast(): void {
    remote.requestGoogleCast();
  }

  function handleMenuOpenChange(open: boolean): void {
    if (open) remote.pauseControls();
    else remote.resumeControls();
  }

  return {
    media,
    seekMin,
    seekMax,
    seekValue,
    bufferedPercent,
    togglePlayback,
    seekBy,
    previewSeek,
    commitSeek,
    startPointerSeek,
    movePointerSeek,
    finishPointerSeek,
    changeVolume,
    toggleMuted,
    toggleFullscreen,
    togglePictureInPicture,
    changePlaybackRate,
    changeQuality,
    changeAudioTrack,
    changeTextTrack,
    toggleCaptions,
    toggleLoop,
    seekToLiveEdge,
    requestAirPlay,
    requestGoogleCast,
    handleMenuOpenChange,
  };
}
