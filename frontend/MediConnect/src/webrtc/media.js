// src/webrtc/media.js
export const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};
